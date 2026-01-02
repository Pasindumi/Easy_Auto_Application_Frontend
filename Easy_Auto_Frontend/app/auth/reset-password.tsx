import COLORS from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
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
import Button from "../../components/ui/button/Button";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [contact, setContact] = useState("");

  const handleContinue = () => {
    if (!contact.trim())
      return Alert.alert("Validation", "Please enter your email or phone.");
    Alert.alert(
      "Reset link sent",
      `If ${contact} is registered, you will receive instructions to reset your password.`,
      [{ text: "OK", onPress: () => router.push("/auth/login") }]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Reset Password" />

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
              onPress={() => router.push("/auth/login")}
            >
              <Text style={[styles.toggleText, styles.blueText]}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.toggleBtn, styles.toggleActive]}>
              <Text style={[styles.toggleText, styles.whiteText]}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.centeredFormWrapper}>
            <View style={styles.form}>
              <InputField
                icon="mail-outline"
                placeholder="Enter your email or phone"
                value={contact}
                onChange={setContact}
                keyboardType="email-address"
              />

              <Button title="Continue" onPress={handleContinue} />

              <View style={styles.loginRow}>
                <Text style={styles.smallText}>Remember your password?</Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                  <Text style={styles.loginLink}> Sign In</Text>
                </TouchableOpacity>
              </View>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

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
  toggleBtn: { flex: 1, paddingVertical: 10, alignItems: "center", backgroundColor: COLORS.white },
  toggleActive: { backgroundColor: COLORS.primary },
  toggleInactive: { backgroundColor: COLORS.white },
  toggleText: { fontWeight: "700", fontSize: 13 },
  whiteText: { color: COLORS.white },
  blueText: { color: COLORS.primary },

  centeredFormWrapper: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 32 },
  form: { width: "100%", maxWidth: 400 },

  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 24, marginBottom: 40 },
  smallText: { color: COLORS.text.muted },
  loginLink: { color: COLORS.primary, fontWeight: "700" },
});
