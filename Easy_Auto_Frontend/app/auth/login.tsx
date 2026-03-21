import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
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
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../../components/Footer";

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";
import SocialButton from "../../components/ui/button/SocialButton";
import { useTranslation } from "react-i18next";

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
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
      showToast({ title: 'Invalid Email', message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    if (!password || password.length < 6) {
      showToast({ title: 'Short Password', message: 'Password must be at least 6 characters', type: 'error' });
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
      showToast({ title: 'Welcome Back', message: 'Login successful! Good to see you again.', type: 'success' });
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login Error:', error);
      showToast({ title: 'Login Failed', message: error.message || 'Failed to login', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'apple' | 'facebook') => {
    const now = Date.now();
    if (now - lastClickTime < 2000) {
      showToast({ message: 'Please wait a moment before trying again', type: 'info' });
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
        showToast({ message: result.error, type: 'error' });
      } else if (result.success) {
        showToast({ message: 'Social sign-in successful!', type: 'success' });
      }
    } catch (error: any) {
      showToast({ message: error.message || `Failed to sign in with ${provider}`, type: 'error' });
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Compressed Header Image */}
          <View style={[styles.headerImageContainer, { height: 160 + insets.top }]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop" }}
              style={StyleSheet.absoluteFillObject}
              contentFit="cover"
            />
            <LinearGradient
              colors={['rgba(15,23,42,0.8)', 'transparent', '#fff']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <TouchableOpacity 
              style={[styles.backButton, { top: insets.top + 10 }]} 
              onPress={() => router.replace('/(tabs)')}
        <View style={styles.contentContainer}>
          {/* Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, styles.toggleInactive]}
              onPress={() => router.push("/auth/signup")}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.logoContainer, { marginTop: insets.top + 15 }]}
              onPress={() => router.replace('/(tabs)')}
              activeOpacity={0.7}
            >
              <Image
                source={require("@/assets/logoHome.png")}
                style={styles.logoImg}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Custom Auth Form Area */}
          <View style={styles.authContainer}>

            <View style={styles.formHeader}>
              <Text style={styles.welcomeText}>{t('auth.welcome_back')}</Text>
              <Text style={styles.subtitleText}>
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

            {/* Email/Password Fields */}
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
              <Text style={styles.forgotText}>{t('auth.forgot_password')}</Text>
            </TouchableOpacity>

            {/* Login button */}
            <Button
              title={t('login')}
              onPress={handleEmailLogin}
              loading={loading}
              disabled={socialLoading !== null}
            />

            {/* OR separator */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>{t('auth.or')} Continue With</Text>
              <View style={styles.orLine} />
            </View>

            {/* Social login grid */}
            <View style={styles.socialRow}>
              <SocialButton
                icon="logo-google"
                iconColor="#DB4437"
                onPress={() => handleSocialSignIn('google')}
                disabled={socialLoading !== null}
              />
              <SocialButton
                icon="logo-apple"
                iconColor="#000"
                onPress={() => handleSocialSignIn('apple')}
                disabled={socialLoading !== null}
              />
              <SocialButton
                icon="logo-facebook"
                iconColor="#1877F2"
                onPress={() => handleSocialSignIn('facebook')}
                disabled={socialLoading !== null}
              />
            </View>

            {/* Bottom link */}
            <View style={styles.bottomLinkRow}>
              <Text style={styles.bottomLinkText}>{t('auth.dont_have_account')}</Text>
              <TouchableOpacity onPress={() => router.replace("/auth/signup")}>
                <Text style={styles.bottomLinkAction}> {t('signup')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Footer />
        </ScrollView>

        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  headerImageContainer: {
    width: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    zIndex: 5,
  },
  logoImg: {
    width: 130,
    height: 38,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "900",
    color: '#0F172A',
    letterSpacing: -0.8,
    marginBottom: 4,
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
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    color: COLORS.text.muted,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 20,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 4,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  orText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontWeight: "600",
    fontSize: 13,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  bottomLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  bottomLinkText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomLinkAction: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
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
