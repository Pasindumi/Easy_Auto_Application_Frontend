import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native';


const HEADER_HEIGHT = 140;

const payments = [
  { id: '1', date: 'Oct 15, 2025' },
  { id: '2', date: 'Sep 15, 2025' },
  { id: '3', date: 'Aug 15, 2025' },
];

export default function SubscriptionsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>SUBSCRIPTIONS</Text>
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
              <View style={styles.activeRow}>
                <Ionicons name="star-outline" size={14} color="#000" />
                <Text style={styles.activeLabel}> Active</Text>
              </View>

              <Ionicons name="crown-outline" size={18} color="#FF9800" />
            </View>

            <Text style={styles.planTitle}>Premium Plan</Text>
            <Text style={styles.planSubtitle}>Active Until Nov 30, 2025</Text>

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
            <TouchableOpacity style={styles.manageButton}>
              <Ionicons name="settings-outline" size={18} color="#fff" />
              <Text style={styles.manageText}>  Manage Plan</Text>
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

            {payments.map((item) => (
              <View key={item.id} style={styles.paymentRow}>
                <View>
                  <Text style={styles.paymentTitle}>Premium Plan - Monthly</Text>
                  <Text style={styles.paymentDate}>{item.date}</Text>
                </View>

                <View style={styles.paymentRight}>
                  <View>
                    <Text style={styles.paymentPrice}>$29.99</Text>
                    <Text style={styles.completed}>Completed</Text>
                  </View>
                  <TouchableOpacity>
                    <Ionicons
                      name="download-outline"
                      size={18}
                      color="#235CF8"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Download All */}
            <TouchableOpacity style={styles.downloadAll}>
              <Ionicons name="download-outline" size={18} color="#000" />
              <Text style={styles.downloadText}> Download All Invoices</Text>
            </TouchableOpacity>
          </View>

          {/* Help Card */}
          <View style={styles.card}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              Have questions about billing or subscriptions? Our support team
              is here to help.
            </Text>

            <TouchableOpacity>
              <Text style={styles.supportText}>Contact Support ➜</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#E5E3E3',
  },

  header: {
  height: HEADER_HEIGHT,
  backgroundColor: '#235CF8',
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingBottom: 20,        // space from bottom
         },

   
  

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 16,
  },

  planCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  activeLabel: {
    fontSize: 12,
    marginLeft: 4,
  },

  planTitle: {
    fontWeight: '800',
    fontSize: 20,
    marginTop: 8,
  },

  planSubtitle: {
    color: '#777',
    fontSize: 12,
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
    fontWeight: '700',
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
    marginTop: 14,
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  manageText: {
    color: '#fff',
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
  },

  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  sectionTitle: {
    fontWeight: '700',
    fontSize: 15,
  },

  viewAll: {
    color: '#235CF8',
    fontWeight: '600',
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  paymentTitle: {
    fontWeight: '600',
    fontSize: 13,
  },

  paymentDate: {
    fontSize: 12,
    color: '#777',
  },

  paymentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  paymentPrice: {
    fontWeight: '700',
  },

  completed: {
    fontSize: 11,
    color: '#00A859',
  },

  downloadAll: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },

  downloadText: {
    fontSize: 13,
  },

  helpTitle: {
    fontWeight: '700',
    fontSize: 15,
  },

  helpText: {
    color: '#777',
    fontSize: 13,
    marginVertical: 8,
  },

  supportText: {
    color: '#235CF8',
    fontWeight: '600',
  },
});
