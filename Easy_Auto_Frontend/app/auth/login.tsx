import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useClerkOAuth } from "@/hooks/useClerkOAuth";
import { ENDPOINTS } from "@/constants/API";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";
import SocialButton from "../../components/ui/button/SocialButton";

import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isLoading: authLoading, isAuthenticated, loginWithBackend } = useAuth();
  const { signInWithGoogle, signInWithApple, signInWithFacebook } = useClerkOAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleEmailLogin = async () => {
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Update AuthContext state and store tokens
      await loginWithBackend(data.accessToken, data.refreshToken, data.user);

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

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
      <Header showBack={router.canGoBack()} title={t('login')} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.contentContainer}>
          {/* Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, styles.toggleInactive]}
              onPress={() => router.push("/auth/signup")}
            >
              <Text style={[styles.toggleText, styles.blueText]}>{t('signup')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]} >
              <Text style={[styles.toggleText, styles.whiteText]}>{t('login')}</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.welcome}>{t('auth.welcome_back')}</Text>
            <Text style={styles.subtitle}>
              {t('auth.sign_in_subtitle')}
            </Text>

            {/* Social login */}
            <SocialButton
              icon="logo-apple"
              text="Sign in With Apple"
              onPress={() => handleSocialSignIn('apple')}
              loading={socialLoading === 'apple'}
              disabled={socialLoading !== null && socialLoading !== 'apple'}
            />
            <SocialButton
              icon="logo-google"
              text="Sign in With Google"
              iconColor="#DB4437"
              onPress={() => handleSocialSignIn('google')}
              loading={socialLoading === 'google'}
              disabled={socialLoading !== null && socialLoading !== 'google'}
            />
            <SocialButton
              icon="logo-facebook"
              text="Sign in With Facebook"
              iconColor="#1877F2"
              onPress={() => handleSocialSignIn('facebook')}
              loading={socialLoading === 'facebook'}
              disabled={socialLoading !== null && socialLoading !== 'facebook'}
            />

            {/* OR separator */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>{t('auth.or')}</Text>
              <View style={styles.orLine} />
            </View>

            {/* Email/Password login */}
            <InputField
              icon="mail-outline"
              placeholder={t('auth.email')}
              value={email}
              onChange={setEmail}
              keyboardType="email-address"
            />
            <InputField
              icon="lock-closed-outline"
              placeholder={t('auth.password')}
              value={password}
              onChange={setPassword}
              secure
            />

            {/* Forgot password link */}
            <TouchableOpacity
              onPress={() => router.push("/auth/forgot-password")}
              style={styles.forgotPasswordContainer}
            >
              <Text style={styles.forgot}>{t('auth.forgot_password')}</Text>
            </TouchableOpacity>


            {/* Login button */}
            <Button
              title={t('login')}
              onPress={handleEmailLogin}
              loading={loading}
              disabled={socialLoading !== null}
            />

            {/* Signup link */}
            <View style={styles.bottomRow}>
              <Text style={styles.smallText}>{t('auth.dont_have_account')}</Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text style={styles.loginLink}> {t('signup')}</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: 20, // Added to ensure toggle is visible below header curves
    justifyContent: 'flex-start' // Changed from space-between to avoid pushing top elements too high
  },

  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 10, // Reduced from 16 to ensure visibility
    borderRadius: 20,
    overflow: "hidden",
    width: '85%',
    backgroundColor: COLORS.backgroundMuted,
    padding: 6,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10, // Reduced from 12
    alignItems: "center",
    borderRadius: 16,
  },
  toggleActive: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleInactive: { backgroundColor: 'transparent' },
  toggleText: { fontWeight: "800", fontSize: 15 },
  whiteText: { color: COLORS.primary },
  blueText: { color: COLORS.text.secondary },

  form: { flex: 1, marginTop: 12 },

  welcome: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 12,
    textAlign: 'center',
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: COLORS.divider, marginRight: 8, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white },
  checkboxChecked: { borderColor: COLORS.primary },

  smallText: { color: COLORS.text.muted },
  forgot: { color: COLORS.primary, fontWeight: "700" },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 12
  },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 12 },
  orLine: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  orText: { marginHorizontal: 12, color: COLORS.text.muted, fontWeight: "700" },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 12, marginBottom: 10 },
  loginLink: { color: COLORS.primary, fontWeight: "700" },
});
