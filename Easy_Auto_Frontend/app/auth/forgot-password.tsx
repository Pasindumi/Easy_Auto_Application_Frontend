import COLORS from "@/constants/Colors";
import { ENDPOINTS } from "@/constants/API";
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

import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!identifier.trim()) {
      Alert.alert("Validation", "Please enter your email or phone number.");
      return;
    }

    // Basic validation: check if it's email or phone
    const isEmail = identifier.includes("@");
    if (isEmail && !identifier.includes(".")) {
      Alert.alert("Validation", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to:", `${ENDPOINTS.AUTH}/forgot`);
      console.log("Request body:", { emailOrPhone: identifier.trim() });

      const response = await fetch(`${ENDPOINTS.AUTH}/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ emailOrPhone: identifier.trim() }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      // Get response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(
          `Server returned invalid response. Status: ${response.status}. Please check if the backend endpoint exists.`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to send OTP");
      }
      // Check if user uses social login
      if (data.provider && data.provider !== 'email') {
        const providerName = data.provider.charAt(0).toUpperCase() + data.provider.slice(1);
        Alert.alert(
          "Social Login Account",
          `This account uses ${providerName} login. Please use ${providerName} sign-in instead.`,
          [{ text: "OK", onPress: () => router.replace("/auth/login") }]
        );
        return;
      }
      Alert.alert(
        "OTP Sent",
        `A verification code has been sent to ${identifier}`,
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/auth/verify-otp",
                params: {
                  identifier: identifier.trim(),
                  userId: data.userId
                },
              }),
          },
        ]
      );
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Forgot Password" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Reset Your Password</Text>
            <Text style={styles.instructionsText}>
              Enter your email address or phone number and we'll send you a
              verification code to reset your password.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formWrapper}>
            <View style={styles.form}>
              <InputField
                icon="mail-outline"
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={setIdentifier}
                keyboardType="email-address"
              />

              <Button
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                style={styles.button}
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


      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  instructionsContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: "center",
    lineHeight: 20,
  },
  formWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    marginTop: 8,
  },
  loader: {
    marginTop: 12,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  smallText: {
    color: COLORS.text.muted,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
