// Example: How to integrate social sign-in into your existing login screen

import { useClerkOAuth } from '@/hooks/useClerkOAuth';
import { useState } from 'react';
import { Button } from 'react-native';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithApple, signInWithFacebook } = useClerkOAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    const result = await signInWithApple();
    setLoading(false);
    
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    const result = await signInWithFacebook();
    setLoading(false);
    
    if (!result.success) {
      alert(result.error);
    }
  };

  return (
    // Your existing UI - just connect these handlers to your buttons
    <>
      <Button 
        title={loading ? "Signing in..." : "Continue with Google"}
        onPress={handleGoogleSignIn}
        disabled={loading}
      />
      
      <Button 
        title={loading ? "Signing in..." : "Continue with Apple"}
        onPress={handleAppleSignIn}
        disabled={loading}
      />
      
      <Button 
        title={loading ? "Signing in..." : "Continue with Facebook"}
        onPress={handleFacebookSignIn}
        disabled={loading}
      />
    </>
  );
}
