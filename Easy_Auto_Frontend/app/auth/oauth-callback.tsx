import { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth as useClerkAuth } from '@clerk/clerk-expo';
import { useAuth } from '@/contexts/AuthContext';
import COLORS from '@/constants/Colors';

export default function OAuthCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useClerkAuth();
  const { handleClerkAuth } = useAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        console.log('[OAuth Callback] Handling OAuth redirect...');
        console.log('[OAuth Callback] isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

        if (!isLoaded) {
          console.log('[OAuth Callback] Clerk not loaded yet, waiting...');
          return;
        }

        if (!isSignedIn) {
          console.log('[OAuth Callback] Not signed in after redirect, going to login...');
          router.replace('/auth/login' as any);
          return;
        }

        console.log('[OAuth Callback] Clerk session detected, syncing with backend...');

        // Wait longer for Clerk session to be fully initialized on web
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Exchange Clerk token for backend JWT
        const authResult = await handleClerkAuth();

        if (!authResult.success) {
          console.error('[OAuth Callback] Backend sync failed:', authResult.error);
          console.error('[OAuth Callback] Full error details:', authResult);
          
          // Show detailed error to user
          const errorMessage = authResult.error || 'Authentication failed';
          alert(
            `Authentication Error\n\n` +
            `${errorMessage}\n\n` +
            `Please try logging in again. If the problem persists, contact support.`
          );
          
          router.replace('/auth/login' as any);
          return;
        }

        console.log('[OAuth Callback] Success! Redirecting to home...');
        router.replace('/(tabs)');
      } catch (error: any) {
        console.error('[OAuth Callback] Unexpected error:', error);
        console.error('[OAuth Callback] Error stack:', error.stack);
        
        alert(
          `Unexpected Error\n\n` +
          `${error.message || 'Unknown error'}\n\n` +
          `Please try again.`
        );
        
        router.replace('/auth/login' as any);
      }
    }

    handleCallback();
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text.primary,
  },
});
