import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const POLICY_SECTIONS = [
  {
    id: '1',
    title: 'Data Protection Commitment',
    content: 'At Easy Auto, your trust is our most valuable asset. We use bank-grade security and transparent policies to safeguard your information.',
    icon: 'shield-checkmark-outline',
    color: '#3B82F6',
  },
  {
    id: '2',
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us (Name, Email, Mobile), behavioral usage insights for performance, and geolocation for nearby listings.',
    icon: 'document-text-outline',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Strategic Usage',
    content: 'Your data helps us refine the marketplace algorithm, provide direct support, and optimize our security protocols.',
    icon: 'analytics-outline',
    color: '#F59E0B',
  },
  {
    id: '4',
    title: 'Security Architecture',
    content: 'We employ multi-layer encryption and regular audits to ensure your data resides in a fortress-like environment.',
    icon: 'lock-closed-outline',
    color: '#EF4444',
  },
  {
    id: '5',
    title: 'Data Autonomy',
    content: 'You retain absolute sovereignty over your data. You may export, modify, or terminate your data records at any moment.',
    icon: 'finger-print-outline',
    color: '#8B5CF6',
  }
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Privacy Policy" showBack={true} />

      <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconCircle}>
                <Ionicons name="shield-half-sharp" size={36} color={COLORS.primary} />
            </View>
            <Text style={styles.heroTitle}>Your Privacy Matters</Text>
            <Text style={styles.heroDescription}>
                We are committed to protecting your personal data and your right to privacy. 
                Our policy is designed to be clear, transparent, and user-first.
            </Text>
            <View style={styles.lastUpdated}>
                <Text style={styles.lastUpdatedText}>Updated March 2024</Text>
            </View>
          </View>

          {/* Quick Summary Grid */}
          <View style={styles.summaryGrid}>
             <View style={styles.summaryItem}>
                <Ionicons name="lock-closed" size={18} color={COLORS.primary} />
                <Text style={styles.summaryText}>Secure</Text>
             </View>
             <View style={styles.summaryDivider} />
             <View style={styles.summaryItem}>
                <Ionicons name="eye-off" size={18} color={COLORS.primary} />
                <Text style={styles.summaryText}>Private</Text>
             </View>
             <View style={styles.summaryDivider} />
             <View style={styles.summaryItem}>
                <Ionicons name="flash" size={18} color={COLORS.primary} />
                <Text style={styles.summaryText}>Control</Text>
             </View>
          </View>

          {/* Policy Sections */}
          <View style={styles.sectionsList}>
            {POLICY_SECTIONS.map((section) => (
                <View key={section.id} style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.sectionIconBg, { backgroundColor: section.color + '15' }]}>
                            <Ionicons name={section.icon as any} size={22} color={section.color} />
                        </View>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Text style={styles.sectionBody}>{section.content}</Text>
                </View>
            ))}
          </View>

          {/* Legal Footer */}
          <View style={styles.footerSection}>
             <Ionicons name="information-circle" size={20} color="#94A3B8" />
             <Text style={styles.footerText}>
                By using Easy Auto, you agree to our terms of service and this privacy policy. 
                If you have questions, please contact our Data Protection Officer.
             </Text>
             <TouchableOpacity 
                style={styles.contactLink}
                onPress={() => {
                   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   router.push('/support/contact-us');
                }}
             >
                <Text style={styles.contactLinkText}>Contact Privacy Team</Text>
                <Ionicons name="chevron-forward" size={12} color={COLORS.primary} />
             </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 20,
  },
  heroIconCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  lastUpdated: {
      backgroundColor: '#F1F5F9',
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 12,
  },
  lastUpdatedText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#64748B',
      textTransform: 'uppercase',
  },
  summaryGrid: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      marginHorizontal: 24,
      borderRadius: 20,
      paddingVertical: 20,
      marginBottom: 24,
      marginTop: -20, // overlapping hero
      borderWidth: 1,
      borderColor: '#F1F5F9',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.03,
      shadowRadius: 8,
      elevation: 2,
  },
  summaryItem: {
      flex: 1,
      alignItems: 'center',
      gap: 6,
  },
  summaryText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#334155',
  },
  summaryDivider: {
      width: 1,
      height: 24,
      backgroundColor: '#F1F5F9',
  },
  sectionsList: {
      paddingHorizontal: 24,
      gap: 16,
      marginBottom: 32,
  },
  sectionCard: {
      backgroundColor: '#fff',
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#F1F5F9',
  },
  sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
      gap: 14,
  },
  sectionIconBg: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#1E293B',
  },
  sectionBody: {
      fontSize: 14,
      color: '#64748B',
      lineHeight: 22,
      fontWeight: '500',
  },
  footerSection: {
      marginHorizontal: 24,
      padding: 24,
      backgroundColor: '#F1F5F9',
      borderRadius: 24,
      alignItems: 'center',
      gap: 12,
  },
  footerText: {
      fontSize: 12,
      color: '#94A3B8',
      textAlign: 'center',
      lineHeight: 18,
      fontWeight: '500',
  },
  contactLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
  },
  contactLinkText: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.primary,
  }
});
