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

  private async clearAuthAndRedirect() {
    try {
      console.log('[API] Clearing auth due to token expiry...');
      await Promise.all([
        secureStorage.deleteItem(ACCESS_TOKEN_KEY),
        secureStorage.deleteItem(REFRESH_TOKEN_KEY),
        secureStorage.deleteItem(USER_KEY),
      ]);
      console.log('[API] Auth cleared successfully');
    } catch (error) {
      console.error('Error clearing auth:', error);
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
      if (response.status === 401) {
        console.log('[API] Access token expired (401), logging out...');
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
