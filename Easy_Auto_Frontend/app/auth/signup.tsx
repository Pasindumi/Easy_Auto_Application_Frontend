import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SocialButton from "../../components/ui/button/SocialButton";

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert("Validation", "Please fill in all fields.");
      return;
    }
    if (password !== confirm) return Alert.alert("Validation", "Passwords do not match");
    if (!agree) return Alert.alert("Validation", "Please agree to Terms & Conditions");

    const result = await register(fullName, email, phone, password);
    if (result.success) {
      Alert.alert("Success", "Account created successfully", [
        { text: "OK", onPress: () => router.push("/(tabs)") }
      ]);
    } else {
      Alert.alert("Registration Failed", result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Sign Up" />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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

            <TouchableOpacity style={styles.actionBtn} onPress={handleSignup} activeOpacity={0.9}>
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

  toggleContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderRadius: 28,
    overflow: "hidden",
    marginTop: 10,
    width: '60%',
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: COLORS.white },
  activeTab: { backgroundColor: COLORS.primary },
  toggleText: { fontWeight: "700", fontSize: 14 },
  whiteText: { color: COLORS.white },
  blueText: { color: COLORS.primary },

  form: { marginTop: 18 },

  termRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: COLORS.divider, marginRight: 8, justifyContent: "center", alignItems: "center", backgroundColor: COLORS.white },
  checkboxChecked: { borderColor: COLORS.primary },
  termText: { color: COLORS.text.muted },

  actionBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  actionText: { color: COLORS.white, fontWeight: "700", fontSize: 16 },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  line: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  or: { marginHorizontal: 12, fontWeight: "700", color: COLORS.text.muted },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, marginBottom: 40 },
  small: { color: COLORS.text.muted },
  loginLink: { color: COLORS.primary, fontWeight: "700" },
});
