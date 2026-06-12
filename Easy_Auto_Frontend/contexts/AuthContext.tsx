import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { ENDPOINTS } from '../constants/API';
import { api } from '../utils/api';


interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  is_premium?: boolean;
  bio?: string;
  location?: string;
  gender?: string;
  birthday?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  two_fa_enabled?: boolean;
  two_fa_method?: string | null;
}

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // Clerk Social Auth Methods
  handleClerkAuth: (getTokenFunc?: any) => Promise<{ success: boolean; error?: string }>;

  // Backend Auth Methods
  loginWithBackend: (access: string, refresh: string, user: User) => Promise<void>;

  // Token Management
  refreshAccessToken: () => Promise<{ success: boolean; accessToken?: string; error?: string }>;
  getValidToken: () => Promise<string | null>;

  // Common Methods
  logout: () => Promise<void>;
  requireAuth: () => boolean;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  handleClerkAuth: async () => ({ success: false, error: 'Not implemented' }),
  loginWithBackend: async () => { },
  refreshAccessToken: async () => ({ success: false, error: 'Not implemented' }),
  getValidToken: async () => null,
  logout: async () => { },
  requireAuth: () => false,
  updateUser: async () => { },
});

export const useAuth = () => useContext(AuthContext);

const ACCESS_TOKEN_KEY = 'backend_access_token';
const REFRESH_TOKEN_KEY = 'backend_refresh_token';
const USER_KEY = 'user_data';

// Platform-specific secure storage helpers
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { getToken: getClerkToken, isSignedIn, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Load stored auth on mount
  useEffect(() => {
    loadStoredAuth();

    // Setup API interceptor callback for unauthenticated responses
    api.onAuthError = () => {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    };
  }, []);

  // Use a faster isTokenExpired check with safer padding logic if needed
  const isTokenExpired = (token: string): boolean => {
    try {
      if (!token || !token.includes('.')) return true;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      const expirationTime = payload.exp * 1000;
      // Add a 30s buffer
      return Date.now() + 30000 >= expirationTime;
    } catch (error) {
      console.error('[Auth] Error checking token expiration:', error);
      return true;
    }
  };

  const loadStoredAuth = async () => {
    try {
      console.log('[Auth] Loading stored auth tokens...');
      const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
        secureStorage.getItem(ACCESS_TOKEN_KEY),
        secureStorage.getItem(REFRESH_TOKEN_KEY),
        secureStorage.getItem(USER_KEY),
      ]);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        console.log('[Auth] Tokens found, checking expiration...');

        // Handle expiration on load
        if (isTokenExpired(storedAccessToken)) {
          console.log('[Auth] Access token expired on app load, attempting prompt refresh...');
          // We set it temporarily if refresh is possible, otherwise clear
          // For now, let's restore and let ApiClient try refresh on first call
          // but if refresh fails it will clear.
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
        } else {
          console.log('[Auth] Token is valid, restoring session');
          setAccessToken(storedAccessToken);
          setRefreshToken(storedRefreshToken);
          setUser(JSON.parse(storedUser));
        }
      } else {
        console.log('[Auth] No stored tokens found');
      }
    } catch (error) {
      console.error('[Auth] Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuth = async (access: string, refresh: string, userData: User) => {
    try {
      console.log('[Auth] Saving tokens to secure storage...');
      await Promise.all([
        secureStorage.setItem(ACCESS_TOKEN_KEY, access),
        secureStorage.setItem(REFRESH_TOKEN_KEY, refresh),
        secureStorage.setItem(USER_KEY, JSON.stringify(userData)),
      ]);
      setAccessToken(access);
      setRefreshToken(refresh);
      setUser(userData);
      console.log('[Auth] Tokens saved successfully');
    } catch (error) {
      console.error('[Auth] Error saving auth:', error);
      throw error;
    }
  };

  const clearAuth = async () => {
    try {
      console.log('[Auth] Clearing auth tokens...');
      await Promise.all([
        secureStorage.deleteItem(ACCESS_TOKEN_KEY),
        secureStorage.deleteItem(REFRESH_TOKEN_KEY),
        secureStorage.deleteItem(USER_KEY),
      ]);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      console.log('[Auth] Tokens cleared successfully');
    } catch (error) {
      console.error('[Auth] Error clearing auth:', error);
    }
  };

  // Login with backend tokens (for normal email/password login)
  const loginWithBackend = async (access: string, refresh: string, userData: User) => {
    await saveAuth(access, refresh, userData);
  };

  // Clerk: Exchange Clerk token for backend JWT
  const handleClerkAuth = async (getTokenFunc?: any) => {
    try {
      console.log('[Auth] handleClerkAuth: Starting backend sync...');
      let clerkToken;

      if (typeof getTokenFunc === 'function') {
        try {
          clerkToken = await getTokenFunc();
        } catch (err: any) {
          console.error('[Auth] Failed to get token from function:', err.message);
        }
      }

      if (!clerkToken) {
        if (!isSignedIn || !clerkUser) {
          throw new Error('Not signed in with Clerk');
        }

        try {
          clerkToken = await getClerkToken({ template: 'mobile' });
        } catch (err) {
          clerkToken = await getClerkToken();
        }
      }

      if (!clerkToken) {
        throw new Error('Failed to get Clerk token');
      }

      const response = await fetch(`${ENDPOINTS.AUTH}/clerk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Auth Sync Error: Expected JSON but got ${contentType}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Authentication failed');
      }

      const access = data.accessToken || data.token;
      const refresh = data.refreshToken || data.refresh_token;

      if (!access || !refresh) {
        throw new Error('Invalid token response from server');
      }

      await loginWithBackend(access, refresh, data.user);
      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Clerk auth error:', error.message);
      return {
        success: false,
        error: error.message || 'Authentication failed'
      };
    }
  };

  const refreshAccessToken = async (): Promise<{ success: boolean; accessToken?: string; error?: string }> => {
    try {
      const currentRefreshToken = refreshToken || await secureStorage.getItem(REFRESH_TOKEN_KEY);

      if (!currentRefreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${ENDPOINTS.AUTH}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ refreshToken: currentRefreshToken }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        await clearAuth();
        throw new Error(data.error || 'Failed to refresh token');
      }

      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken || data.refresh_token || currentRefreshToken;

      await secureStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      if (newRefreshToken !== currentRefreshToken) {
        await secureStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        setRefreshToken(newRefreshToken);
      }
      setAccessToken(newAccessToken);

      return { success: true, accessToken: newAccessToken };
    } catch (error: any) {
      console.error('Token refresh error:', error);
      return { success: false, error: error.message || 'Failed to refresh token' };
    }
  };

  const getValidToken = async (): Promise<string | null> => {
    if (!accessToken) return null;

    // If expired, try to refresh immediately
    if (isTokenExpired(accessToken)) {
      const result = await refreshAccessToken();
      return result.success ? result.accessToken! : null;
    }

    return accessToken;
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      if (!user) return;
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await secureStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error('[Auth] Error updating user data:', error);
    }
  };

  const logout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('[Auth] Error signing out from Clerk:', error);
    }
    await clearAuth();
  };

  const requireAuth = () => {
    return !!accessToken && !!user;
  };

  const value: AuthContextType = {
    isAuthenticated: !!accessToken && !!user,
    user,
    accessToken,
    refreshToken,
    isLoading,
    handleClerkAuth,
    loginWithBackend,
    refreshAccessToken,
    getValidToken,
    logout,
    requireAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
