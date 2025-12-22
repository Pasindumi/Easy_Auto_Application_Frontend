// app/signup.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Footer, { FOOTER_HEIGHT } from "../../components/Footer";
import Header from "../../components/Header"; // keep your Header (unchanged)
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import { colors } from "../../components/theme";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [location, setLocation] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = () => {
    if (!fullName.trim()) return Alert.alert("Validation", "Enter your full name");
    if (!email.trim()) return Alert.alert("Validation", "Enter your email");
    if (!phone.trim()) return Alert.alert("Validation", "Enter your phone number");
    if (!password) return Alert.alert("Validation", "Enter your password");
    if (password !== confirm) return Alert.alert("Validation", "Passwords do not match");
    if (!agree) return Alert.alert("Validation", "Please agree to Terms & Conditions");

    router.push("/cars/buy-car");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <Header />

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: FOOTER_HEIGHT + 24 }]} keyboardShouldPersistTaps="handled">
            {/* Toggle inline */}
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
                  {agree && <Ionicons name="checkmark" size={14} color={colors.primary} />}
                </View>
                <Text style={styles.termText}>I agree to the Terms & Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.primary }]} onPress={handleSignup} activeOpacity={0.9}>
                <Text style={styles.actionText}>Sign Up</Text>
              </TouchableOpacity>

              <View style={styles.orRow}>
                <View style={styles.line} />
                <Text style={styles.or}>OR</Text>
                <View style={styles.line} />
              </View>

              <SocialButton icon="logo-apple" text="Sign in With Apple" onPress={() => Alert.alert("Apple Sign in")} />
              <SocialButton icon="logo-google" text="Sign in With Google" iconColor="#DB4437" onPress={() => Alert.alert("Google Sign in")} />

              <View style={styles.bottomRow}>
                <Text style={styles.small}>Already have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                  <Text style={styles.loginLink}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Footer fixed />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, flexGrow: 1 },

  // Toggle
  toggleContainer: { flexDirection: "row", alignSelf: "center", borderRadius: 28, overflow: "hidden", marginTop: 10 },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: colors.bgLight },
  activeTab: { backgroundColor: colors.primary },
  toggleText: { fontWeight: "700", fontSize: 14 },
  whiteText: { color: colors.white },
  blueText: { color: colors.primary },

  // Form
  form: { marginTop: 18 },

  termRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.bgLight, marginRight: 8, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: colors.white, borderColor: colors.primary },
  termText: { color: colors.textGray },

  actionBtn: { borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  actionText: { color: colors.white, fontWeight: "700", fontSize: 16 },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  or: { marginHorizontal: 12, fontWeight: "700", color: colors.textLight },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  small: { color: "#666" },
  loginLink: { color: colors.primary, fontWeight: "700" },
});
