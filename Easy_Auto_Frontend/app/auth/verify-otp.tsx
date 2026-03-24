import COLORS from "@/constants/Colors";
import { ENDPOINTS } from "@/constants/API";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const identifier = params.identifier as string;
  const userId = params.userId as string;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier || !userId) {
      Alert.alert(
        "Error",
        "No email or phone provided. Please start from forgot password.",
        [{ text: "OK", onPress: () => router.replace("/auth/forgot-password") }]
      );
    }
  }, [identifier, userId]);

  const handleVerifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      Alert.alert("Validation", "Please enter a valid 6-digit OTP.");
      return;
    }

    if (!identifier || !userId) {
      Alert.alert("Error", "Invalid session. Please start again.");
      router.replace("/auth/forgot-password");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          otp: otp.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Invalid OTP");
      }

      Alert.alert("Success", "OTP verified successfully!", [
        {
          text: "OK",
          onPress: () =>
            router.push({
              pathname: "/auth/reset-password",
              params: {
                identifier,
                userId,
                otp: otp.trim()
              },
            }),
        },
      ]);
    } catch (error: any) {
      console.error("Verify OTP Error:", error);
      Alert.alert(
        "Error",
        error.message || "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!identifier || !userId) {
      Alert.alert("Error", "Invalid session. Please start again.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch(`${ENDPOINTS.AUTH}/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ emailOrPhone: identifier }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to resend OTP");
      }

      Alert.alert("Success", "A new verification code has been sent.");
      setResendDisabled(true);
      setCountdown(30);
      setOtp("");
    } catch (error: any) {
      console.error("Resend OTP Error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!identifier || !userId) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Verify OTP" />

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
            <Text style={styles.instructionsTitle}>Enter Verification Code</Text>
            <Text style={styles.instructionsText}>
              We've sent a 6-digit verification code to
            </Text>
            <Text style={styles.identifierText}>{identifier}</Text>
          </View>

          {/* Form */}
          <View style={styles.formWrapper}>
            <View style={styles.form}>
              <InputField
                icon="lock-closed-outline"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={setOtp}
                keyboardType="numeric"
              />

              <Button
                title="Verify OTP"
                onPress={handleVerifyOTP}
                loading={loading}
                style={styles.button}
              />

              {/* Resend OTP */}
              <View style={styles.resendRow}>
                <Text style={styles.smallText}>Didn't receive the code?</Text>
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={resendDisabled || resendLoading}
                >
                  <Text
                    style={[
                      styles.resendLink,
                      (resendDisabled || resendLoading) && styles.resendDisabled,
                    ]}
                  >
                    {" "}
                    {resendLoading
                      ? "Sending..."
                      : resendDisabled
                        ? `Resend (${countdown}s)`
                        : "Resend"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Back to Login */}
              <View style={styles.loginRow}>
                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                  <Text style={styles.loginLink}>Back to Login</Text>
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
  identifierText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
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
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  smallText: {
    color: COLORS.text.muted,
    fontSize: 14,
  },
  resendLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  resendDisabled: {
    color: COLORS.text.muted,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 40,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
