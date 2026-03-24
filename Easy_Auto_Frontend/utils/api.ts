import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL, ENDPOINTS } from '../constants/API';
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
  private refreshPromise: Promise<string | null> | null = null;
  public onAuthError?: () => void;

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

  private async clearAuthAndRedirect() {
    try {
      console.log('[API] Clearing auth due to token expiry...');
      await Promise.all([
        secureStorage.deleteItem(ACCESS_TOKEN_KEY),
        secureStorage.deleteItem(REFRESH_TOKEN_KEY),
        secureStorage.deleteItem(USER_KEY),
      ]);
      console.log('[API] Auth cleared successfully');

      if (this.onAuthError) {
        this.onAuthError();
      }

      // Navigate to login if not already there
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await this.getRefreshToken();
        if (!refreshToken) {
          console.log('[API] No refresh token available');
          return null;
        }

        console.log('[API] Attempting to refresh token...');
        const response = await fetch(`${ENDPOINTS.AUTH}/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('[API] Refresh token failed:', response.status, errorText);
          return null;
        }

        const data = await response.json();
        const newAccessToken = data.accessToken || data.token;
        const newRefreshToken = data.refreshToken || data.refresh_token;

        if (newAccessToken) {
          await secureStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
          if (newRefreshToken) {
            await secureStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
          }
          console.log('[API] Token refreshed successfully');
          return newAccessToken;
        }

        return null;
      } catch (error) {
        console.error('[API] Error during token refresh:', error);
        return null;
      }
    })();

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipAuth = false, skipRetry = false, headers = {}, body, ...restOptions } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

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
      if (response.status === 401 && !skipRetry) {
        console.log('[API] Access token expired (401), attempting refresh...');

        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry request with new token
          const updatedHeaders = { ...requestHeaders, 'Authorization': `Bearer ${newToken}` };
          console.log('[API] Retrying original request with new token...');
          return this.request<T>(endpoint, {
            ...options,
            headers: updatedHeaders,
            skipRetry: true, // Prevent infinite loops
          });
        }

        console.log('[API] Refresh failed or no token, logging out...');
        await this.clearAuthAndRedirect();
        throw new Error('SESSION_EXPIRED');
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
        // Handle case where session might be invalid but status isn't 401
        if (data.error === 'SESSION_EXPIRED' || data.message === 'SESSION_EXPIRED' || data.code === 'SESSION_EXPIRED') {
          await this.clearAuthAndRedirect();
          throw new Error('SESSION_EXPIRED');
        }
        
        const errorObj: any = new Error(data.error || data.message || 'Request failed');
        errorObj.status = response.status;
        throw errorObj;
      }

      return data as T;
    } catch (error: any) {
      // Don't log recursive calls or SESSION_EXPIRED
      if (error.message !== 'SESSION_EXPIRED') {
        console.error(`[API] Request failed for ${endpoint}:`, error.message);
      }
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
