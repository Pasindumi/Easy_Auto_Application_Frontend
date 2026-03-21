import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function SignupScreen() {
  const router = useRouter();
  const { loginWithBackend } = useAuth();
  const { signInWithGoogle, signInWithApple, signInWithFacebook } = useClerkOAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSignup = async () => {
    // Validate inputs
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    if (!password || password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!agree) {
      Alert.alert('Error', 'Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Update AuthContext state and store tokens
      await loginWithBackend(data.accessToken, data.refreshToken, data.user);

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Signup Error:', error);
      Alert.alert('Signup Failed', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Sign Up" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.contentContainer}>
          {/* Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={[styles.toggleBtn, styles.activeTab]}>
              <Text style={[styles.toggleText, styles.whiteText]}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleBtn} onPress={() => router.push("/auth/login")}>
              <Text style={[styles.toggleText, styles.blueText]}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <InputField icon="person-outline" placeholder="Full Name" value={fullName} onChange={setFullName} />
            <InputField icon="mail-outline" placeholder="Email" value={email} onChange={setEmail} keyboardType="email-address" />
            <InputField icon="call-outline" placeholder="Phone Number" value={phone} onChange={setPhone} keyboardType="phone-pad" />
            <InputField icon="lock-closed-outline" placeholder="Password" value={password} onChange={setPassword} secure />
            <InputField icon="lock-closed-outline" placeholder="Confirm Password" value={confirm} onChange={setConfirm} secure />

            <TouchableOpacity style={styles.termRow} onPress={() => setAgree((s) => !s)}>
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Ionicons name="checkmark" size={14} color={COLORS.primary} />}
              </View>
              <Text style={styles.termText}>I agree to the Terms & Conditions</Text>
            </TouchableOpacity>

            <Button
              title="Sign Up"
              onPress={handleSignup}
              loading={loading}
              disabled={socialLoading !== null}
            />

            <View style={styles.orRow}>
              <View style={styles.line} />
              <Text style={styles.or}>OR</Text>
              <View style={styles.line} />
            </View>

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

            <View style={styles.bottomRow}>
              <Text style={styles.small}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginLink}> Login</Text>
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
    justifyContent: 'flex-start' // Changed from space-between
  },

  toggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 8, // Reduced from 10
    width: '85%',
    backgroundColor: COLORS.backgroundMuted,
    padding: 6,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8, // Reduced from 10
    alignItems: "center",
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: { fontWeight: "800", fontSize: 15 },
  whiteText: { color: COLORS.primary },
  blueText: { color: COLORS.text.secondary },

  form: { flex: 1, marginTop: 5 }, // Reduced from 10

  termRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 }, // Reduced from 8
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: COLORS.divider, marginRight: 8, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white },
  checkboxChecked: { borderColor: COLORS.primary },
  termText: { color: COLORS.text.muted, fontSize: 12 },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 6 }, // Reduced from 8
  line: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  or: { marginHorizontal: 12, fontWeight: "700", color: COLORS.text.muted },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 8, marginBottom: 5 },
  small: { color: COLORS.text.muted, fontSize: 12 },
  loginLink: { color: COLORS.primary, fontWeight: "700", fontSize: 12 },
});
