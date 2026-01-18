import COLORS from "@/constants/Colors";
import { ENDPOINTS } from "@/constants/API";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const identifier = params.identifier as string;
  const userId = params.userId as string;
  const otp = params.otp as string;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if no identifier or otp
  useEffect(() => {
    if (!identifier || !userId || !otp) {
      Alert.alert(
        "Error",
        "Invalid session. Please start from forgot password.",
        [{ text: "OK", onPress: () => router.replace("/auth/forgot-password") }]
      );
    }
  }, [identifier, userId, otp]);

  const handleResetPassword = async () => {
    // Validate inputs
    if (!newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Validation", "Please enter both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    if (!identifier || !otp || !userId) {
      Alert.alert("Error", "Invalid session. Please start again.");
      router.replace("/auth/forgot-password");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending reset password request to:", `${ENDPOINTS.AUTH}/reset-password`);
      console.log("Request body:", { identifier, otp, newPassword: "***" });
      
      const response = await fetch(`${ENDPOINTS.AUTH}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          identifier,
          otp,
          newPassword,
        }),
      });

      console.log("Response status:", response.status);
      
      // Get response text first
      const responseText = await response.text();
      console.log("Response text:", responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", parseError);
        throw new Error(
          `Server returned invalid response. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to reset password");
      }

      Alert.alert(
        "Success",
        "Your password has been reset successfully. You can now login with your new password.",
        [{ text: "OK", onPress: () => router.replace("/auth/login") }]
      );
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!identifier || !otp || !userId) {
    return null;
  }

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
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Create New Password</Text>
            <Text style={styles.instructionsText}>
              Your new password must be different from previously used passwords.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.centeredFormWrapper}>
            <View style={styles.form}>
              <InputField
                icon={showPassword ? "eye-outline" : "eye-off-outline"}
                placeholder="New Password"
                value={newPassword}
                onChange={setNewPassword}
                secure={!showPassword}
                onIconPress={() => setShowPassword(!showPassword)}
              />

              <InputField
                icon={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                secure={!showConfirmPassword}
                onIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              <Button
                title={loading ? "Resetting..." : "Reset Password"}
                onPress={handleResetPassword}
                style={styles.button}
              />

              {loading && (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={styles.loader}
                />
              )}

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
  centeredFormWrapper: {
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
  loginLink: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
