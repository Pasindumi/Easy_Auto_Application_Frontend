import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClerkOAuth } from "@/hooks/useClerkOAuth";
import {
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";
import SocialButton from "../../components/ui/button/SocialButton";

export default function LoginScreen() {
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { signInWithGoogle, signInWithApple, signInWithFacebook } = useClerkOAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    // Prevent rapid clicks (debounce)
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      Alert.alert('Please Wait', 'Please wait a moment before trying again');
      return;
    }
    setLastClickTime(now);
    
    setSocialLoading(provider);
    try {
      let result;
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else if (provider === 'apple') {
        result = await signInWithApple();
      } else {
        result = await signInWithFacebook();
      }
      
      if (!result.success && result.error) {
        Alert.alert('Sign In Failed', result.error);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || `Failed to sign in with ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Login" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, styles.toggleInactive]}
              onPress={() => router.push("/auth/signup")}
            >
              <Text style={[styles.toggleText, styles.blueText]}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]} >
              <Text style={[styles.toggleText, styles.whiteText]}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.welcome}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Choose your preferred login method
            </Text>

            {/* OTP Login Button */}
            <Button
              title="Login with Phone (OTP)"
              onPress={() => router.push("/auth/otp-login" as any)}
            />

            {/* OR separator */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Social login */}
            <SocialButton
              icon="logo-apple"
              text={socialLoading === 'apple' ? "Signing in..." : "Sign in With Apple"}
              onPress={() => handleSocialSignIn('apple')}
              disabled={socialLoading !== null}
            />
            <SocialButton
              icon="logo-google"
              text={socialLoading === 'google' ? "Signing in..." : "Sign in With Google"}
              iconColor="#DB4437"
              onPress={() => handleSocialSignIn('google')}
              disabled={socialLoading !== null}
            />
            <SocialButton
              icon="logo-facebook"
              text={socialLoading === 'facebook' ? "Signing in..." : "Sign in With Facebook"}
              iconColor="#1877F2"
              onPress={() => handleSocialSignIn('facebook')}
              disabled={socialLoading !== null}
            />

            {/* Signup link */}
            <View style={styles.bottomRow}>
              <Text style={styles.smallText}>Don’t have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text style={styles.loginLink}> Sign Up</Text>
              </TouchableOpacity>
            </View>
            {/* OTP Login link */}
            <View style={styles.bottomRow}>
              <Text style={styles.smallText}>Or</Text>
              <TouchableOpacity onPress={() => router.push("/auth/otp-login" as any)}>
                <Text style={styles.loginLink}> Login with OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Footer fixed />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: { padding: 16, flexGrow: 1 },

  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 28,
    overflow: "hidden",
    width: '60%',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleInactive: { backgroundColor: COLORS.white },
  toggleText: { fontWeight: "700", fontSize: 14 },
  whiteText: { color: COLORS.white },
  blueText: { color: COLORS.primary },

  form: { marginTop: 18 },

  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 24,
    textAlign: 'center',
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: COLORS.divider, marginRight: 8, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white },
  checkboxChecked: { borderColor: COLORS.primary },

  smallText: { color: COLORS.text.muted },
  forgot: { color: COLORS.primary, fontWeight: "700" },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  orText: { marginHorizontal: 12, color: COLORS.text.muted, fontWeight: "700" },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, marginBottom: 40 },
  loginLink: { color: COLORS.primary, fontWeight: "700" },
});
