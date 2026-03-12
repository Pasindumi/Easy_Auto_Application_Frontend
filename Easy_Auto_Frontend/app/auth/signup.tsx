import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Footer from "../../components/Footer";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";
import SocialButton from "../../components/ui/button/SocialButton";

export default function SignupScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
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

  const handleSignup = async () => {
    if (!fullName.trim()) {
      showToast({ message: 'Please enter your full name', type: 'error' });
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast({ message: 'Please enter a valid email address', type: 'error' });
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      showToast({ message: 'Please enter a valid phone number', type: 'error' });
      return;
    }
    if (!password || password.length < 6) {
      showToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    if (password !== confirm) {
      showToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    if (!agree) {
      showToast({ message: 'Please agree to the Terms & Conditions', type: 'error' });
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

      // Changed to redirect to login after signup

      showToast({ title: 'Success', message: 'Account created! Please login to continue.', type: 'success' });
      router.replace('/auth/login');
    } catch (error: any) {
      console.error('Signup Error:', error);
      showToast({ title: 'Account Creation Failed', message: error.message || 'Failed to create account', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Compressed Header Image */}
          <View style={[styles.headerImageContainer, { height: 160 + insets.top }]}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983&auto=format&fit=crop" }}
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
              <Text style={styles.welcomeText}>Create Account</Text>
              <Text style={styles.subtitleText}>Join EasyAuto today</Text>
            </View>

            {/* Input Fields */}
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
              title={loading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignup}
              disabled={loading || socialLoading !== null}
            />

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR Continue With</Text>
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

            <View style={styles.bottomLinkRow}>
              <Text style={styles.bottomLinkText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                <Text style={styles.bottomLinkAction}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <Footer />
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
  },
  subtitleText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  termRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#F8FAFC',
  },
  checkboxChecked: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  termText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
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
});
