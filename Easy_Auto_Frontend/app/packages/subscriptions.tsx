import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from "../../components/Header";

/* ================= STYLES ================= */

import { typography } from "../../components/theme";

const payments = [
  { id: '1', date: 'Oct 15, 2025' },
  { id: '2', date: 'Sep 15, 2025' },
  { id: '3', date: 'Aug 15, 2025' },
];

export default function SubscriptionsScreen() {
  const router = useRouter();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleManagePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add navigation or action here
  };

  const handleDownload = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Add download action here
  };

  const handleDownloadAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add download all action here
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add navigation to support here
  };

  return (
    <View style={styles.safe}>
      {/* Header */}
      <Stack.Screen options={{ headerShown: false }} />
      <Header />
      <View style={localStyles.headerWrap}>
        <View style={localStyles.header}>
          <View style={localStyles.headerLeft}>
            <Ionicons name="people-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={localStyles.headerTitle}>My Subscribers</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
        }}
      >
        {/* Plan Card */}
        <View style={styles.planCard}>
          <View style={styles.topRow}>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeLabel}>Active</Text>
            </View>
            <View style={styles.crownIcon}>
              <Ionicons name="diamond" size={20} color="#FF9800" />
            </View>
          </View>

          <Text style={styles.planTitle}>Premium Plan</Text>
          <View style={styles.expiryContainer}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.planSubtitle}>Active Until Nov 30, 2025</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>$29.99</Text>
            <Text style={styles.perMonth}>/month</Text>
          </View>

          {/* Benefits Box */}
          <View style={styles.benefitsBox}>
            <Text style={styles.benefitsTitle}>Plan Benefits</Text>

            <View style={styles.benefitsRow}>
              <View>
                <BenefitItem text="Unlimited Ads" />
                <BenefitItem text="Featured Listings" />
                <BenefitItem text="Custom Branding" />
              </View>

              <View>
                <BenefitItem text="Priority support" />
                <BenefitItem text="Advance analytics" />
                <BenefitItem text="Customer Service" />
              </View>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.manageButton}
            onPress={handleManagePlan}
            activeOpacity={0.8}
          >
            <Ionicons name="settings-outline" size={18} color="#fff" />
            <Text style={styles.manageText}>Manage Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Payment History */}
        <View style={styles.card}>
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Payment History</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {payments.map((item, index) => (
            <View key={item.id}>
              <View style={styles.paymentRow}>
                <View style={styles.paymentLeft}>
                  <View style={styles.paymentIconContainer}>
                    <Ionicons name="receipt-outline" size={20} color="#235CF8" />
                  </View>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>Premium Plan - Monthly</Text>
                    <View style={styles.paymentDateRow}>
                      <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                      <Text style={styles.paymentDate}>{item.date}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.paymentRight}>
                  <View style={styles.paymentAmountContainer}>
                    <Text style={styles.paymentPrice}>$29.99</Text>
                    <View style={styles.statusBadge}>
                      <View style={styles.statusDot} />
                      <Text style={styles.completed}>Completed</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadIcon}
                    onPress={handleDownload}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="download-outline"
                      size={18}
                      color="#235CF8"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {index < payments.length - 1 && <View style={styles.paymentDivider} />}
            </View>
          ))}

          {/* Download All */}
          <TouchableOpacity
            style={styles.downloadAll}
            onPress={handleDownloadAll}
            activeOpacity={0.7}
          >
            <Ionicons name="download-outline" size={18} color="#235CF8" />
            <Text style={styles.downloadText}>Download All Invoices</Text>
          </TouchableOpacity>
        </View>

        {/* Help Card */}
        <View style={styles.helpCard}>
          <View style={styles.helpIconContainer}>
            <Ionicons name="help-circle" size={32} color="#235CF8" />
          </View>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Have questions about billing or subscriptions? Our support team
            is here to help.
          </Text>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
            activeOpacity={0.8}
          >
            <Text style={styles.supportText}>Contact Support</Text>
            <Ionicons name="arrow-forward" size={18} color="#235CF8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Benefit Item Component */
function BenefitItem({ text }: { text: string }) {
  return (
    <View style={styles.benefitItem}>
      <Ionicons name="checkmark" size={16} color="#235CF8" />
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },

  activeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },

  crownIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  planTitle: {
    ...typography.heading,
    fontSize: 20,
    marginTop: 8,
  },

  planSubtitle: {
    ...typography.caption,
    marginLeft: 6,
    fontWeight: '500',
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },

  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#235CF8',
  },

  perMonth: {
    color: '#235CF8',
    marginLeft: 4,
  },

  benefitsBox: {
    backgroundColor: '#F1F6FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },

  benefitsTitle: {
    ...typography.subheading,
    fontSize: 14,
    color: '#235CF8',
    marginBottom: 8,
  },

  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  benefitText: {
    marginLeft: 6,
    fontSize: 12,
  },

  manageButton: {
    marginTop: 16,
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  manageText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: {
    ...typography.subheading,
    fontSize: 15,
  },

  viewAll: {
    color: '#235CF8',
    fontWeight: '600',
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  paymentInfo: {
    flex: 1,
  },

  paymentTitle: {
    ...typography.subheading,
    fontSize: 14,
    marginBottom: 4,
  },

  paymentDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  paymentDate: {
    ...typography.caption,
    fontWeight: '500',
  },

  paymentDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 52,
  },

  paymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  paymentAmountContainer: {
    alignItems: 'flex-end',
  },

  paymentPrice: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111827',
    marginBottom: 4,
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },

  completed: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },

  downloadIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  downloadAll: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
    backgroundColor: '#F9FAFB',
  },

  downloadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#235CF8',
  },

  helpCard: {
    backgroundColor: '#F0F7FF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },

  helpIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  helpTitle: {
    ...typography.subheading,
    marginBottom: 8,
    textAlign: 'center',
  },

  helpText: {
    ...typography.body,
    marginBottom: 16,
    textAlign: 'center',
  },

  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  supportText: {
    color: '#235CF8',
    fontWeight: '600',
    fontSize: 15,
  },

});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#E5E3E3' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D1D5DB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
