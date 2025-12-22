// app/login.tsx
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
import Button from "../../components/Button";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import SocialButton from "../../components/SocialButton";
import { colors } from "../../components/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter email and password.");
      return;
    }
    // Navigate to home/tabs page
    router.push("/(tabs)");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <Header />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Toggle */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, styles.toggleInactive]}
                onPress={() => router.push("/auth/signup")}
              >
                <Text style={[styles.toggleText, styles.blueText]}>Signup</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]}>
                <Text style={[styles.toggleText, styles.whiteText]}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <InputField
                icon="mail-outline"
                placeholder="Email"
                value={email}
                onChange={setEmail}
                keyboardType="email-address"
              />
              <InputField
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChange={setPassword}
                secure
              />

              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember((s) => !s)}
                >
                  <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                    {remember && <Ionicons name="checkmark" size={12} color={colors.primary} />}
                  </View>
                  <Text style={styles.smallText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push("/auth/reset-password")}>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <Button title="Login" onPress={() => router.push("/(tabs)")} />



              {/* OR separator */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              {/* Social login */}
              <SocialButton
                icon="logo-apple"
                text="Sign in With Apple"
                onPress={() => Alert.alert("Apple Sign in")}
              />
              <SocialButton
                icon="logo-google"
                text="Sign in With Google"
                iconColor="#DB4437"
                onPress={() => Alert.alert("Google Sign in")}
              />

              {/* Signup link */}
              <View style={styles.bottomRow}>
                <Text style={styles.smallText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                  <Text style={styles.loginLink}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          {/* Footer fixed at bottom */}
          <Footer fixed />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 16, flexGrow: 1 },

  toggleRow: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 12,
    borderRadius: 28,
    overflow: "hidden",
  },
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center" },
  toggleActive: { backgroundColor: colors.primary },
  toggleInactive: { backgroundColor: colors.bgLight },
  toggleText: { fontWeight: "700", fontSize: 14 },
  whiteText: { color: colors.white },
  blueText: { color: colors.primary },

  form: { marginTop: 18 },

  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.bgLight, marginRight: 8, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: colors.white },

  smallText: { color: "#444" },
  forgot: { color: colors.primary, fontWeight: "700" },

  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  orText: { marginHorizontal: 12, color: colors.textGray, fontWeight: "700" },

  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  loginLink: { color: colors.primary, fontWeight: "700" },
});
