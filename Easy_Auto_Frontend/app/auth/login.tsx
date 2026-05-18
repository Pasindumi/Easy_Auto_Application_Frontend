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
  const [showPassword, setShowPassword] = useState(false);
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
    if (now - lastClickTime < 800) {
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
          {/* Hero Section with Branding */}
          <LinearGradient
            colors={[COLORS.primary, '#1E40AF']}
            style={[styles.heroSection, { paddingTop: insets.top }]}
          >
            <View style={styles.heroContentContainer}>
              <View style={styles.headerTopRow}>
                <TouchableOpacity
                  style={styles.backButtonHero}
                  onPress={() => router.replace('/(tabs)')}
                >
                  <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>

                <View style={styles.logoHeroContainer}>
                  <Image
                    source={require("@/assets/logoHome.png")}
                    style={styles.logoHeroImg}
                    contentFit="contain"
                    tintColor="#fff"
                  />
                </View>

                <View style={{ width: 44 }} />
              </View>

              <View style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Welcome Back!</Text>
              </View>
            </View>
          </LinearGradient>

          {/* Overlapping Auth Form Card */}
          <View style={styles.authWrapper}>
            <View style={styles.authCard}>
              <View style={styles.formHeader}>
                <Text style={styles.welcomeText}>Login</Text>
                <Text style={styles.subtitleText}>
                  {t('auth.sign_in_subtitle')}
                </Text>
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
                secure={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
              />

              {/* Forgot password link */}
              <TouchableOpacity
                onPress={() => router.push("/auth/forgot-password")}
                style={styles.forgotPasswordContainer}
              >
                <Text style={styles.forgotText}>{t('auth.forgot_password')}</Text>
              </TouchableOpacity>

              {/* Login button */}
              <View style={styles.loginBtnContainer}>
                <Button
                  title={loading ? "Logging in..." : t('login')}
                  onPress={handleEmailLogin}
                  disabled={loading || socialLoading !== null}
                />
              </View>

              {/* OR separator */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>Or continue with</Text>
                <View style={styles.orLine} />
              </View>

              {/* Social login grid */}
              <View style={styles.socialRow}>
                <SocialButton
                  imageSource={require("@/assets/images/google_icon.png")}
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
            </View>

            {/* Bottom link */}
            <View style={styles.bottomLinkRow}>
              <Text style={styles.bottomLinkText}>{t('auth.dont_have_account')}</Text>
              <TouchableOpacity onPress={() => router.replace("/auth/signup")}>
                <Text style={styles.bottomLinkAction}> {t('signup')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  heroSection: {
    width: '100%',
    height: 125, // Even more compact for a modern profile
    paddingHorizontal: 20,
  },
  heroContentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButtonHero: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoHeroContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoHeroImg: {
    width: 120,
    height: 38,
  },
  heroTextContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22, // Even more subtle and refined
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1.2, // Tighter for professional feel
    textShadowColor: 'rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    display: 'none',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F8FAFF',
  },
  authWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 15, // Added small gap for breathing room
    paddingBottom: 40,
  },
  authCard: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 28, // More authoritative
    fontWeight: "900",
    color: '#0F172A',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  loginBtnContainer: {
    marginBottom: 10,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  orText: {
    marginHorizontal: 16,
    color: '#94A3B8',
    fontWeight: "700",
    fontSize: 14, // Standard professional small text
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  bottomLinkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  bottomLinkText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  bottomLinkAction: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 15,
  },
});
