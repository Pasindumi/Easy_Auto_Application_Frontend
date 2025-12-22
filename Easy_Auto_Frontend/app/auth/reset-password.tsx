// app/reset-password.tsx
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
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import { colors } from "../../components/theme";
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <Header />

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Scrollable form */}
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Toggle inline */}
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

                <Button title="Continue" onPress={() => router.push("/auth/login")}  // <-- navigation
                />

                <View style={styles.loginRow}>
                  <Text style={styles.smallText}>Remember your password?</Text>
                  <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text style={styles.loginLink}> Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer fixed at bottom */}
          <View style={styles.footerWrapper}>
            <Footer fixed />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: FOOTER_HEIGHT + 24,
    backgroundColor: "#F5F5F5",
  },

  // Toggle
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

  centeredFormWrapper: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 24 },
  form: { width: "100%", maxWidth: 400 },

  label: { fontSize: 12, color: colors.textGray, marginBottom: 6 },

  continueBtn: { borderRadius: 8, paddingVertical: 14, alignItems: "center", marginTop: 10 },
  continueText: { color: colors.white, fontWeight: "700", fontSize: 16 },

  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  smallText: { color: colors.textGray },
  loginLink: { color: colors.primary, fontWeight: "700" },

  // Footer wrapper fixed at bottom
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: FOOTER_HEIGHT,
  },
});
