import { useOAuth, useAuth as useClerkAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import * as Linking from 'expo-linking';

// Required for Expo OAuth flow
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = 'oauth_google' | 'oauth_apple' | 'oauth_facebook';

export function useClerkOAuth() {
  const router = useRouter();
  const { isSignedIn, signOut, getToken } = useClerkAuth();
  const { signIn, setActive } = useSignIn();
  const { handleClerkAuth } = useAuth();
  const isWeb = Platform.OS === 'web';

  // For native platforms
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const signInWithOAuth = async (strategy: OAuthStrategy) => {
    try {
      console.log(`[OAuth] Step 1: Starting ${strategy} OAuth flow on ${Platform.OS}...`);
      console.log('[OAuth] Current Clerk session state:', { isSignedIn, isLoaded: true });

      // If already signed in to Clerk, sync with backend instead of re-authenticating
      if (isSignedIn) {
        console.log('[OAuth] Already signed in to Clerk, syncing with backend...');
        const authResult = await handleClerkAuth();

        if (authResult.success) {
          router.replace('/(tabs)');
          return { success: true };
        }

        // If backend sync fails, sign out and try again
        console.log('[OAuth] Backend sync failed, signing out and retrying...');
        await signOut();
        // Wait a bit for sign out to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      let result;

      if (isWeb) {
        // Web: Use Clerk's web-specific OAuth with redirects
        if (!signIn) {
          throw new Error('SignIn not available');
        }

        console.log('[OAuth Web] Using authenticateWithRedirect...');
        const provider = strategy.replace('oauth_', '') as 'google' | 'apple' | 'facebook';

        // This will redirect the page
        await signIn.authenticateWithRedirect({
          strategy,
          redirectUrl: `${window.location.origin}/auth/oauth-callback`,
          redirectUrlComplete: `${window.location.origin}/auth/oauth-callback`,
        });

        // Code after this won't execute because of redirect
        return { success: true };
      } else {
        // Native: Use standard OAuth flow with WebBrowser
        let startOAuthFlow;

        switch (strategy) {
          case 'oauth_google':
            startOAuthFlow = startGoogleOAuthFlow;
            break;
          case 'oauth_apple':
            startOAuthFlow = startAppleOAuthFlow;
            break;
          case 'oauth_facebook':
            startOAuthFlow = startFacebookOAuthFlow;
            break;
          default:
            throw new Error('Invalid OAuth strategy');
        }

        // Create redirect URL for native platforms
        const redirectUrl = Linking.createURL('/auth/oauth-callback');
        console.log('[OAuth Native] Using redirectUrl:', redirectUrl);

        result = await startOAuthFlow({ redirectUrl });
      }

      if (!result) {
        console.log('[OAuth] Error: OAuth flow returned no result');
        throw new Error('OAuth flow returned no result');
      }

      const { createdSessionId } = result;

      if (!createdSessionId) {
        console.log('[OAuth] User cancelled the sign-in flow');
        return { success: false, error: 'Sign in was cancelled' };
      }

      console.log('[OAuth] Step 2: Clerk session ID obtained:', createdSessionId);

      // Set the active session in Clerk (REQUIRED)
      console.log('[OAuth] Step 3: Activating Clerk session...');
      await setActive!({ session: createdSessionId });
      console.log('[OAuth] Step 3: Clerk session activated successfully');

      // IMPORTANT: Get token IMMEDIATELY after setActive to avoid race conditions with hook state
      console.log('[OAuth] Step 4: Fetching session token directly from hook...');
      const token = await getToken();

      if (!token) {
        console.warn('[OAuth] Could not get token immediately, waiting briefly...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('[OAuth] Step 5: Exchanging Clerk token for backend JWT...');

      // Exchange Clerk token for backend JWT (pass token directly)
      const authResult = await handleClerkAuth(token || undefined);

      if (!authResult.success) {
        console.error('[OAuth] Step 6 FAILED: Backend authentication failed:', authResult.error);
        // If backend exchange fails, sign out from Clerk to keep state consistent
        console.log('[OAuth] Signing out from Clerk due to backend auth failure');
        await signOut();
        throw new Error(authResult.error || 'Failed to authenticate with backend');
      }

      console.log('[OAuth] Step 6 SUCCESS: Backend JWT obtained and stored');
      console.log('[OAuth] Step 7: Navigating to home screen');

      // Navigate to home
      router.replace('/(tabs)');

      return { success: true };
    } catch (error: any) {
      console.error('[OAuth] FATAL ERROR:', {
        message: error.message,
        stack: error.stack,
        strategy,
        platform: Platform.OS
      });

      // Provide user-friendly error messages
      let userMessage = error.message || 'Authentication failed';

      if (error.message?.includes('popup') || error.message?.includes('blocked')) {
        userMessage = 'Popup blocked. Please enable popups for this site and try again.';
      } else if (error.message?.includes('CORS') || error.message?.includes('Cross-Origin')) {
        userMessage = 'Authentication error. Please try refreshing the page.';
      }

      return {
        success: false,
        error: userMessage
      };
    }
  };

  const signInWithGoogle = () => signInWithOAuth('oauth_google');
  const signInWithApple = () => signInWithOAuth('oauth_apple');
  const signInWithFacebook = () => signInWithOAuth('oauth_facebook');

  return {
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
  };
}
