import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Privacy Policy" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Your Privacy Matters</Text>

          <Text style={styles.text}>
            We value your privacy and are committed to protecting your personal
            data. This Privacy Policy describes how your information is
            collected, used, and shared when you use our application.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.subTitle}>1. Information We Collect</Text>
          <Text style={styles.text}>
            • Personal information (name, email, phone){"\n"}
            • Usage data (pages, clicks, device info){"\n"}
            • Location data (if permitted by you)
          </Text>

          <Text style={styles.subTitle}>2. How We Use Your Information</Text>
          <Text style={styles.text}>
            • To improve user experience{"\n"}
            • To communicate updates and support{"\n"}
            • To enhance app security and performance
          </Text>

          <Text style={styles.subTitle}>3. Data Protection</Text>
          <Text style={styles.text}>
            We use advanced security technologies to protect your information
            and ensure it is not accessed without permission.
          </Text>

          <Text style={styles.subTitle}>4. Third-Party Services</Text>
          <Text style={styles.text}>
            Some features may use third-party services. They will only receive
            necessary data to perform their function.
          </Text>

          <Text style={styles.subTitle}>5. Your Rights</Text>
          <Text style={styles.text}>
            You have the right to access, modify, or delete your personal
            information at any time.
          </Text>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>I Agree & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  iconCircle: {
    backgroundColor: COLORS.primaryLight,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: COLORS.text.primary,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 6,
    color: COLORS.text.primary,
  },
  text: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 15,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
