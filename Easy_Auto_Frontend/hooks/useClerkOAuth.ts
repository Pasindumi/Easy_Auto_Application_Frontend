import { useOAuth, useAuth as useClerkAuth, useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

// Required for Expo OAuth flow
WebBrowser.maybeCompleteAuthSession();

type OAuthStrategy = 'oauth_google' | 'oauth_apple' | 'oauth_facebook';

export function useClerkOAuth() {
  const router = useRouter();
  const clerkAuth = useClerkAuth();
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
      console.log('[OAuth] Current Clerk session state:', { isSignedIn: clerkAuth.isSignedIn, isLoaded: true });
      
      // If already signed in to Clerk, sync with backend instead of re-authenticating
      if (clerkAuth.isSignedIn) {
        console.log('[OAuth] Already signed in to Clerk, syncing with backend...');
        const authResult = await handleClerkAuth();
        
        if (authResult.success) {
          router.replace('/(tabs)');
          return { success: true };
        }
        
        // If backend sync fails, sign out and try again
        console.log('[OAuth] Backend sync failed, signing out and retrying...');
        await clerkAuth.signOut();
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
        
        result = await startOAuthFlow();
      }
      
      if (!result) {
        console.log('[OAuth] Error: OAuth flow returned no result');
        throw new Error('OAuth flow returned no result');
      }

      const { createdSessionId, setActive: setActiveFromResult } = result;
      
      if (!createdSessionId) {
        console.log('[OAuth] User cancelled the sign-in flow');
        return { success: false, error: 'Sign in was cancelled' };
      }

      console.log('[OAuth] Step 2: Clerk session ID obtained:', createdSessionId);
      console.log('[OAuth] Step 2: Result object keys:', Object.keys(result));

      // Set the active session in Clerk (REQUIRED)
      console.log('[OAuth] Step 3: Activating Clerk session...');
      await setActiveFromResult!({ session: createdSessionId });
      console.log('[OAuth] Step 3: Clerk session activated successfully');

      // Wait longer for Clerk context to fully update (especially on iOS)
      console.log('[OAuth] Step 4: Waiting for Clerk context to update (2000ms)...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('[OAuth] Step 5: Exchanging Clerk token for backend JWT...');
      console.log('[OAuth] Step 5: Using clerkAuth.getToken() from context');

      // Exchange Clerk token for backend JWT
      // Pass the clerkAuth.getToken function so handleClerkAuth can call it
      const authResult = await handleClerkAuth(clerkAuth.getToken);

      if (!authResult.success) {
        console.error('[OAuth] Step 6 FAILED: Backend authentication failed:', authResult.error);
        // If backend exchange fails, sign out from Clerk to keep state consistent
        console.log('[OAuth] Signing out from Clerk due to backend auth failure');
        await clerkAuth.signOut();
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
