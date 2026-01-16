import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface TokenCache {
  getToken: (key: string) => Promise<string | null>;
  saveToken: (key: string, token: string) => Promise<void>;
}

// Platform-specific storage: SecureStore for native, localStorage for web
const createTokenCache = (): TokenCache => {
  const isWeb = Platform.OS === 'web';

  return {
    getToken: async (key: string) => {
      try {
        if (isWeb) {
          // Use localStorage on web
          return localStorage.getItem(key);
        } else {
          // Use SecureStore on native platforms
          const item = await SecureStore.getItemAsync(key);
          return item;
        }
      } catch (error) {
        console.error('Token cache get error:', error);
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        if (isWeb) {
          // Use localStorage on web
          localStorage.setItem(key, token);
        } else {
          // Use SecureStore on native platforms
          await SecureStore.setItemAsync(key, token);
        }
      } catch (error) {
        console.error('Token cache save error:', error);
      }
    },
  };
};

export const tokenCache = createTokenCache();
