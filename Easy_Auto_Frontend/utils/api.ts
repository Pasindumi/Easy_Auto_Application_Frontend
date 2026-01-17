import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '../constants/API';
import { router } from 'expo-router';

const ACCESS_TOKEN_KEY = 'backend_access_token';
const REFRESH_TOKEN_KEY = 'backend_refresh_token';
const USER_KEY = 'user_data';

// Platform-specific secure storage
const isWeb = Platform.OS === 'web';

const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      }
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw error;
    }
  },

  async deleteItem(key: string): Promise<void> {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Error deleting ${key}:`, error);
    }
  },
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  skipRetry?: boolean;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh token');
      }

      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken || data.refresh_token || refreshToken;

      // Store new tokens
      await secureStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      if (newRefreshToken !== refreshToken) {
        await secureStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Clear auth and redirect to login
      await this.clearAuthAndRedirect();
      return null;
    }
  }

  private async clearAuthAndRedirect() {
    try {
      await Promise.all([
        secureStorage.deleteItem(ACCESS_TOKEN_KEY),
        secureStorage.deleteItem(REFRESH_TOKEN_KEY),
        secureStorage.deleteItem(USER_KEY),
      ]);

      // Redirect to login
      router.replace('/auth/login' as any);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, skipRetry = false, headers = {}, body, ...restOptions } = options;

    const url = `${this.baseURL}${endpoint}`;

    // Robust check for FormData (instanceof can fail in some debugging environments)
    const isFormData = body instanceof FormData || (body && typeof body === 'object' && typeof (body as any).append === 'function');

    // Prepare headers
    const requestHeaders: any = {
      'ngrok-skip-browser-warning': 'true',
      ...headers,
    };

    // If FormData, let the browser/native fetch set the Content-Type (with boundary)
    // We explicitly remove it if it was inadvertently added
    if (isFormData) {
      delete requestHeaders['Content-Type'];
    } else if (!requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    // Attach JWT if not skipping auth
    if (!skipAuth) {
      const token = await this.getToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    try {
      const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        body: body as BodyInit,
      });

      // Handle 401 Unauthorized - Token expired or invalid
      if (response.status === 401 && !skipAuth && !skipRetry) {
        console.log('Token expired, attempting refresh...');

        // If already refreshing, wait for it to complete
        if (this.isRefreshing) {
          return new Promise<T>((resolve, reject) => {
            this.addRefreshSubscriber(async (newToken: string) => {
              try {
                // Retry original request with new token
                requestHeaders['Authorization'] = `Bearer ${newToken}`;
                const retryResponse = await fetch(url, {
                  ...restOptions,
                  headers: requestHeaders,
                  body: body as BodyInit,
                });

                const retryContentType = retryResponse.headers.get('content-type');
                if (!retryContentType || !retryContentType.includes('application/json')) {
                  // Only try to modify retry logic if not FormData, but usually raw response is fine
                  // just pass strictly
                }

                const retryData = await retryResponse.json();

                if (!retryResponse.ok) {
                  throw new Error(retryData.error || retryData.message || 'Request failed');
                }

                resolve(retryData as T);
              } catch (error) {
                reject(error);
              }
            });
          });
        }

        // Start refresh process
        this.isRefreshing = true;
        const newToken = await this.refreshAccessToken();
        this.isRefreshing = false;

        if (!newToken) {
          throw new Error('Failed to refresh token');
        }

        // Notify subscribers
        this.onRefreshed(newToken);

        // Retry original request with new token
        return this.request<T>(endpoint, { ...options, body, skipRetry: true });
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        // If it's empty, and success, maybe okay?
        if (!text && response.ok) return {} as T;

        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data as T;
    } catch (error: any) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const isFormData = body instanceof FormData || (body && typeof body === 'object' && typeof body.append === 'function');
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const isFormData = body instanceof FormData || (body && typeof body === 'object' && typeof body.append === 'function');
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestOptions
  ): Promise<T> {
    const isFormData = body instanceof FormData || (body && typeof body === 'object' && typeof body.append === 'function');
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create and export API client instance
export const api = new ApiClient(API_URL);

// Export for convenience
export default api;
