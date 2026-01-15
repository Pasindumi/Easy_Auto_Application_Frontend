import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import { ENDPOINTS } from '../constants/API';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  // State
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;

  // OTP Auth Methods
  sendOTP: (phone: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; message?: string; error?: string }>;

  // Clerk Social Auth Methods
  handleClerkAuth: (sessionResult?: any) => Promise<{ success: boolean; error?: string }>;

  // Token Management
  refreshAccessToken: () => Promise<{ success: boolean; accessToken?: string; error?: string }>;
  getValidToken: () => Promise<string | null>;

  // Common Methods
  logout: () => Promise<void>;
  requireAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,
  sendOTP: async () => ({ success: false, error: 'Not implemented' }),
  verifyOTP: async () => ({ success: false, error: 'Not implemented' }),
  handleClerkAuth: async () => ({ success: false, error: 'Not implemented' }),
  refreshAccessToken: async () => ({ success: false, error: 'Not implemented' }),
  getValidToken: async () => null,
  logout: async () => {},
  requireAuth: () => false,
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

  const { getToken: getClerkToken, isSignedIn } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Load stored auth on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      console.log('[Auth] Loading stored auth tokens...');
      const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
        secureStorage.getItem(ACCESS_TOKEN_KEY),
        secureStorage.getItem(REFRESH_TOKEN_KEY),
        secureStorage.getItem(USER_KEY),
      ]);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        console.log('[Auth] Tokens found, restoring session');
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
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

  // OTP: Send OTP to phone number
  const sendOTP = async (phone: string) => {
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ phone }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      return { success: true, message: data.message };
    } catch (error: any) {
      console.error('Send OTP error:', error);
      return { success: false, error: error.message || 'Network error' };
    }
  };

  // OTP: Verify OTP and get backend JWT
  const verifyOTP = async (phone: string, otp: string) => {
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ phone, otp }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP');
      }

      // Save backend JWT tokens and user data
      const access = data.accessToken || data.token;
      const refresh = data.refreshToken || data.refresh_token;
      
      if (!access || !refresh) {
        throw new Error('Invalid token response from server');
      }

      await saveAuth(access, refresh, data.user);

      return { success: true, message: data.message };
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message || 'Verification failed' };
    }
  };

  // Clerk: Exchange Clerk token for backend JWT
  const handleClerkAuth = async (getTokenFunc?: any) => {
    try {
      console.log('[Auth] handleClerkAuth: Starting backend sync...');
      console.log('[Auth] getTokenFunc provided:', typeof getTokenFunc);

      let clerkToken;

      // If we have a getToken function passed from OAuth flow, use it
      if (typeof getTokenFunc === 'function') {
        console.log('[Auth] Attempting to get token from provided function...');
        try {
          clerkToken = await getTokenFunc();
          console.log('[Auth] ✅ Token obtained from provided function (length:', clerkToken?.length, ')');
        } catch (err: any) {
          console.error('[Auth] ❌ Failed to get token from function:', err.message);
        }
      }

      // Fallback to context hooks if function didn't work
      if (!clerkToken) {
        console.log('[Auth] Falling back to context getClerkToken...');
        console.log('[Auth] isSignedIn:', isSignedIn);
        console.log('[Auth] clerkUser:', clerkUser ? { id: clerkUser.id, email: clerkUser.primaryEmailAddress?.emailAddress } : 'null');

        if (!isSignedIn || !clerkUser) {
          throw new Error('Not signed in with Clerk');
        }

        // Get Clerk session token with mobile template
        console.log('[Auth] Fetching Clerk session token with mobile template...');
        
        try {
          // Use mobile template for better compatibility
          clerkToken = await getClerkToken({ template: 'mobile' });
          console.log('[Auth] Token obtained with mobile template');
        } catch (err) {
          console.log('[Auth] Mobile template not available, trying default...');
          try {
            clerkToken = await getClerkToken({ template: 'default' });
            console.log('[Auth] Token obtained with default template');
          } catch (err2) {
            console.log('[Auth] Template methods failed, trying without template...');
            clerkToken = await getClerkToken();
            console.log('[Auth] Token obtained without template');
          }
        }
      }
      
      if (!clerkToken) {
        throw new Error('Failed to get Clerk token');
      }
      
      console.log('[Auth] Clerk token obtained (length:', clerkToken.length, ')');
      console.log('[Auth] Clerk token (first 50 chars):', clerkToken.substring(0, 50) + '...');
      console.log('[Auth] Sending request to:', `${ENDPOINTS.AUTH}/clerk`);

      // Send Clerk token to backend in Authorization header
      // Backend will verify token with Clerk and extract user info
      const response = await fetch(`${ENDPOINTS.AUTH}/clerk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clerkToken}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      });

      console.log('[Auth] Backend response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('[Auth] Invalid response type. Content-Type:', contentType);
        console.error('[Auth] Response body:', text.substring(0, 200));
        throw new Error('Server returned an invalid response. Expected JSON.');
      }

      const data = await response.json();
      
      if (!response.ok) {
        console.error('[Auth] Backend returned error status:', response.status);
        console.error('[Auth] Backend error message:', data.error || data.message);
        console.error('[Auth] Full error response:', JSON.stringify(data));
        
        // Provide specific error messages
        if (response.status === 401) {
          throw new Error('Authentication failed. The backend could not verify your Clerk session. Please contact support.');
        } else if (response.status === 400) {
          throw new Error(data.error || 'Invalid request. Please try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.error || data.message || 'Authentication failed. Please try again.');
        }
      }
      
      console.log('[Auth] Backend response data:', { 
        hasAccessToken: !!(data.accessToken || data.token),
        hasRefreshToken: !!(data.refreshToken || data.refresh_token),
        hasUser: !!data.user,
        userData: data.user ? { id: data.user.id, email: data.user.email, name: data.user.name } : null
      });

      // Save backend JWT tokens and user data
      const access = data.accessToken || data.token;
      const refresh = data.refreshToken || data.refresh_token;
      
      if (!access || !refresh) {
        console.error('[Auth] Missing tokens in response:', { 
          hasAccess: !!access, 
          hasRefresh: !!refresh,
          responseKeys: Object.keys(data)
        });
        throw new Error('Invalid token response from server');
      }

      console.log('[Auth] Saving tokens to secure store...');
      await saveAuth(access, refresh, data.user);
      console.log('[Auth] Backend sync completed successfully');

      return { success: true };
    } catch (error: any) {
      console.error('[Auth] Clerk auth error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        response: error.response,
      });
      
      // Return user-friendly error message
      return { 
        success: false, 
        error: error.message || 'Authentication failed. Please try again.' 
      };
    }
  };

  // Token Refresh: Get new access token using refresh token
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
        // If refresh fails, logout
        await clearAuth();
        throw new Error(data.error || 'Failed to refresh token');
      }

      const newAccessToken = data.accessToken || data.token;
      const newRefreshToken = data.refreshToken || data.refresh_token || currentRefreshToken;

      // Update tokens
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

  // Get valid token (refresh if needed)
  const getValidToken = async (): Promise<string | null> => {
    if (!accessToken) {
      return null;
    }

    // In a production app, you should decode the JWT and check expiry
    // For now, assume the token is valid and let the API client handle refresh on 401
    return accessToken;
  };

  // Logout
  const logout = async () => {
    await clearAuth();
  };

  // Check if user is authenticated (for guards)
  const requireAuth = () => {
    return !!accessToken && !!user;
  };

  const value: AuthContextType = {
    isAuthenticated: !!accessToken && !!user,
    user,
    accessToken,
    refreshToken,
    isLoading,
    sendOTP,
    verifyOTP,
    handleClerkAuth,
    refreshAccessToken,
    getValidToken,
    logout,
    requireAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
