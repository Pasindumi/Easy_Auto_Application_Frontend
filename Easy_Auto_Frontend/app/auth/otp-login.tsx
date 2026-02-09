import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  TextInput,
} from "react-native";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import InputField from "../../components/InputField";
import Button from "../../components/ui/button/Button";

export default function OTPLoginScreen() {
  const router = useRouter();
  const { sendOTP, verifyOTP, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const otpInputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  // Timer for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);

    if (result.success) {
      setStep('otp');
      setTimer(60); // 60 seconds cooldown
      setCanResend(false);
      Alert.alert("Success", result.message || "OTP sent to your phone");
    } else {
      Alert.alert("Error", result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the complete OTP");
      return;
    }

    setLoading(true);
    const result = await verifyOTP(phone, otpCode);
    setLoading(false);

    if (result.success) {
      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    } else {
      Alert.alert("Error", result.error || "Invalid OTP");
      // Clear OTP fields on error
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOTPKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setLoading(true);
    const result = await sendOTP(phone);
    setLoading(false);

    if (result.success) {
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      Alert.alert("Success", "OTP resent to your phone");
    } else {
      Alert.alert("Error", result.error || "Failed to resend OTP");
    }
  };

  const handleChangeNumber = () => {
    setStep('phone');
    setOtp(["", "", "", "", "", ""]);
    setTimer(0);
    setCanResend(true);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="OTP Login" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            {step === 'phone' ? (
              <>
                <Text style={styles.title}>Enter Your Phone Number</Text>
                <Text style={styles.subtitle}>
                  We'll send you a verification code
                </Text>

                <InputField
                  icon="call-outline"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={setPhone}
                  keyboardType="phone-pad"
                />

                <Button
                  title={loading ? "Sending..." : "Send OTP"}
                  onPress={handleSendOTP}
                />

                <View style={styles.bottomRow}>
                  <Text style={styles.smallText}>Want to use email?</Text>
                  <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text style={styles.loginLink}> Login with Email</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.title}>Enter Verification Code</Text>
                <Text style={styles.subtitle}>
                  Code sent to {phone}
                </Text>

                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) otpInputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        digit && styles.otpInputFilled
                      ]}
                      value={digit}
                      onChangeText={(value) => handleOTPChange(value, index)}
                      onKeyPress={({ nativeEvent }) => 
                        handleOTPKeyPress(nativeEvent.key, index)
                      }
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <Button
                  title={loading ? "Verifying..." : "Verify OTP"}
                  onPress={handleVerifyOTP}
                />

                <View style={styles.resendContainer}>
                  {canResend ? (
                    <TouchableOpacity onPress={handleResendOTP} disabled={loading}>
                      <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.timerText}>
                      Resend in {timer}s
                    </Text>
                  )}
                </View>

                <TouchableOpacity 
                  onPress={handleChangeNumber}
                  style={styles.changeNumberBtn}
                >
                  <Text style={styles.changeNumberText}>Change Phone Number</Text>
                </TouchableOpacity>
              </>
            )}
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
    padding: 16, 
    flexGrow: 1,
    justifyContent: 'center',
  },
  form: { 
    marginTop: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 32,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  timerText: {
    color: COLORS.text.muted,
    fontSize: 14,
  },
  changeNumberBtn: {
    alignItems: 'center',
    marginTop: 24,
  },
  changeNumberText: {
    color: COLORS.text.muted,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  bottomRow: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginTop: 24,
  },
  smallText: { 
    color: COLORS.text.muted 
  },
  loginLink: { 
    color: COLORS.primary, 
    fontWeight: "700" 
  },
});
