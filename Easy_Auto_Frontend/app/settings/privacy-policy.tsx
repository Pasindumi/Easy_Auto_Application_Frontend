// app/privacy-policy.tsx
import Header from "../../components/Header";

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
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      {/* Header */}
      <Header />
      <View style={localStyles.headerWrap}>
        <View style={localStyles.header}>
          <View style={localStyles.headerLeft}>
            <Ionicons name="lock-closed-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={localStyles.headerTitle}>Privacy Policy</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Main Card */}
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#2563EB" />
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

          <TouchableOpacity style={styles.button}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>I Agree & Continue</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    height: 110,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  iconCircle: {
    backgroundColor: "#EFF6FF",
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
    color: "#111827",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 15,
    marginBottom: 6,
    color: "#1F2937",
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 15,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
