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
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function PrivacyPolicy() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const PolicySection = ({ title, content }: { title: string; content: string }) => (
    <View style={styles.section}>
      <Text style={styles.subTitle}>{title}</Text>
      <Text style={styles.text}>{content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Privacy Policy" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.focalContainer}>
            <View style={styles.focalGlow} />
            <LinearGradient
              colors={['#EFF6FF', '#FFF']}
              style={styles.iconCircle}
            >
              <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Data Protection Commitment</Text>
          <Text style={styles.heroText}>
            At Easy Auto, your trust is our most valuable asset. We use bank-grade security and transparent policies to safeguard your information.
          </Text>
        </View>

        <PolicySection
          title="1. Information We Collect"
          content={`• Academic personal info (Name, Email, Mobile)\n• Behavioral usage insights for performance\n• Precise geolocation for nearby listings`}
        />

        <View style={styles.divider} />

        <PolicySection
          title="2. Strategic Usage"
          content={`• Refining the marketplace algorithm\n• Direct support and security protocols\n• Optimizing purchase-intent analytics`}
        />

        <View style={styles.divider} />

        <PolicySection
          title="3. Security Architecture"
          content="We employ RSA multi-layer encryption and regular audits to ensure your data resides in a fortress-like environment."
        />

        <View style={styles.divider} />

        <PolicySection
          title="4. Data Autonomy"
          content="You retain absolute sovereignty over your data. You may export, modify, or terminate your data records at any moment."
        />

        <Animated.View style={[styles.actionWrapper, buttonStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, '#1e3a8a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Acknowledge & Sync</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerNote}>Last updated: March 2024</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    paddingBottom: 40,
  },
  heroSection: {
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginBottom: 20,
  },
  focalContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  focalGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    opacity: 0.8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 16,
    color: '#111827',
    letterSpacing: -0.5,
  },
  heroText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    paddingHorizontal: 20,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  subTitle: {
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  text: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 26,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 24,
  },
  actionWrapper: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  button: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 32,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
