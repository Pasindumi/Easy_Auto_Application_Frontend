import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
  const { login, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

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
                  {remember && <Ionicons name="checkmark" size={12} color={COLORS.primary} />}
                </View>
                <Text style={styles.smallText}>Remember Me</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/auth/reset-password")}>
                <Text style={styles.forgot}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title={isLoading ? "Logging in..." : "Login"}
              onPress={async () => {
                if (!email || !password) {
                  Alert.alert("Error", "Please enter both email and password");
                  return;
                }

                const result = await login(email, password);
                if (result.success) {
                  Alert.alert("Success", result.message || "Login successful", [
                    { text: "OK", onPress: () => router.replace("/(tabs)") }
                  ]);
                } else {
                  Alert.alert("Login Failed", result.error);
                }
              }}
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
