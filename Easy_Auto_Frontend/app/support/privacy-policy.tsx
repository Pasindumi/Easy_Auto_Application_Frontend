import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import Header from "../../components/Header";
import { COLORS } from "@/constants/Colors";
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const POLICY_SECTIONS = [
  {
    id: '1',
    title: 'Data Collection',
    icon: 'document-text-outline',
    content: "We collect information you provide directly to us, such as when you create or modify your account, list a vehicle for sale, or communicate with us. This includes name, email, phone number, and vehicle details."
  },
  {
    id: '2',
    title: 'How We Use Data',
    icon: 'analytics-outline',
    content: "The information we collect is used to provide, maintain, and improve our services, facilitate transactions between buyers and sellers, and send you technical notices, updates, and support messages."
  },
  {
    id: '3',
    title: 'Information Sharing',
    icon: 'share-social-outline',
    content: "We do not sell your personal data. We share information only with your consent, to comply with laws, or to protect our rights. Your contact details are shared with potential buyers when you list an ad."
  },
  {
    id: '4',
    title: 'Data Security',
    icon: 'shield-checkmark-outline',
    content: "We use bank-level encryption (SSL) and follow industry best practices to protect the personal information submitted to us. However, no method of transmission over the Internet is 100% secure."
  },
  {
    id: '5',
    title: 'Cookies & Tracking',
    icon: 'browsers-outline',
    content: "We use cookies and similar technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
  },
  {
    id: '6',
    title: 'Your Rights',
    icon: 'finger-print-outline',
    content: "You have the right to access, update, or delete the personal information we have on you. You can manage most of this directly within your account settings."
  }
];

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Privacy Policy" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          {/* Header Card */}
          <View style={styles.heroCard}>
            <View style={styles.iconCircle}>
                <Ionicons name="shield-half-sharp" size={32} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>Your Privacy Matters</Text>
            <Text style={styles.heroSub}>
                We are committed to protecting your personal data and your right to privacy. 
                Learn how we handle your information below.
            </Text>
            <View style={styles.lastUpdatedBadge}>
                <Text style={styles.lastUpdatedText}>Last Updated: June 15, 2024</Text>
            </View>
          </View>

          {/* Quick Stats/Summary */}
          <View style={styles.summaryGrid}>
             <View style={styles.summaryItem}>
                <Text style={styles.summaryVal}>100%</Text>
                <Text style={styles.summaryLbl}>Secure</Text>
             </View>
             <View style={styles.summaryLine} />
             <View style={styles.summaryItem}>
                <Text style={styles.summaryVal}>No</Text>
                <Text style={styles.summaryLbl}>Selling</Text>
             </View>
             <View style={styles.summaryLine} />
             <View style={styles.summaryItem}>
                <Text style={styles.summaryVal}>Full</Text>
                <Text style={styles.summaryLbl}>Control</Text>
             </View>
          </View>

          {/* Policy Sections */}
          <View style={styles.sectionsList}>
            {POLICY_SECTIONS.map((section) => (
                <View key={section.id} style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIconBg}>
                            <Ionicons name={section.icon as any} size={22} color={COLORS.primary} />
                        </View>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                    </View>
                    <Text style={styles.sectionBody}>{section.content}</Text>
                </View>
            ))}
          </View>

          {/* Agreement Section */}
          <View style={styles.agreementBox}>
             <Ionicons name="information-circle" size={20} color="#64748b" style={{ marginBottom: 8 }} />
             <Text style={styles.agreementText}>
                By using the EasyAuto application, you agree to the collection and use of 
                information in accordance with this policy.
             </Text>
          </View>

          {/* Footer Contact */}
          <TouchableOpacity 
            style={styles.contactBtn}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
          >
            <Text style={styles.contactBtnText}>Questions? Contact DPO</Text>
            <Ionicons name="mail" size={16} color={COLORS.primary} />
          </TouchableOpacity>

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
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 24,
  },
  lastUpdatedBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  lastUpdatedText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  summaryLbl: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  summaryLine: {
    width: 1,
    height: 30,
    backgroundColor: '#f1f5f9',
  },
  sectionsList: {
    gap: 20,
    marginBottom: 32,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  sectionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionBody: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 24,
    fontWeight: '500',
  },
  agreementBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
  },
  agreementText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#eff6ff',
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  }
});
