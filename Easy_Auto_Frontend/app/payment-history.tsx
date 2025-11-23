// app/payment-history.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View,
} from 'react-native';

const HEADER_HEIGHT = 140;

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const payments = [
    {
      id: '1',
      date: 'Oct 15, 2025',
      plan: 'Premium Plan',
      type: 'Monthly',
      amount: '$29.99',
      status: 'Successful',
      card: 'Visa ****  **** 4232',
    },
    {
      id: '2',
      date: 'Oct 13, 2025',
      plan: 'Basic Plan',
      type: 'Monthly',
      amount: '$10.00',
      status: 'Successful',
      card: 'Visa ****  **** 4232',
    },
    {
      id: '3',
      date: 'July 17, 2025',
      plan: 'Premium Plan',
      type: 'Yearly',
      amount: '$360.00',
      status: 'Refunded',
      card: 'Visa ****  **** 4232',
    },
     {
      id: '4',
      date: 'Oct 13, 2025',
      plan: 'Basic Plan',
      type: 'Monthly',
      amount: '$10.00',
      status: 'Failed',
      card: 'Visa ****  **** 4232',
    },
    {
      id: '5',
      date: 'July 17, 2025',
      plan: 'Premium Plan',
      type: 'Yearly',
      amount: '$360.00',
      status: 'Refunded',
      card: 'Visa ****  **** 4232',
    },
     {
      id: '6',
      date: 'Oct 15, 2025',
      plan: 'Premium Plan',
      type: 'Monthly',
      amount: '$29.99',
      status: 'Successful',
      card: 'Visa ****  **** 4232',
    },
     {
      id: '7',
      date: 'Oct 15, 2025',
      plan: 'Premium Plan',
      type: 'Monthly',
      amount: '$29.99',
      status: 'Failed',
      card: 'Visa ****  **** 4232',
    },
  ];

  const statusColors: any = {
    Successful: '#34C759',
    Failed: '#FF3B30',
    Refunded: '#FFCC00',
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <View style={styles.headerBackground}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>PAYMENT HISTORY</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* SEARCH BOX */}
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#A0A4A8"
              style={{ marginLeft: 10 }}
            />
            <TextInput
              placeholder="Search transactions by date or plan"
              placeholderTextColor="#A0A4A8"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* PAYMENT LIST */}
          {payments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color="#666"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.date}>{item.date}</Text>
                </View>

                {/* STATUS BADGE */}
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: statusColors[item.status] + '33' },
                  ]}
                >
                  <Ionicons
                    name={
                      item.status === 'Successful'
                        ? 'checkmark-circle'
                        : item.status === 'Failed'
                        ? 'close-circle'
                        : 'refresh-circle'
                    }
                    size={14}
                    color={statusColors[item.status]}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: statusColors[item.status] },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* PLAN */}
              <Text style={styles.plan}>
                {item.plan}{' '}
                <Text style={styles.monthly}>({item.type})</Text>
              </Text>

              {/* AMOUNT */}
              <Text style={styles.amount}>{item.amount}</Text>

              {/* CARD ROW */}
              <View style={styles.cardFooter}>
                <Ionicons name="card-outline" size={16} color="#666" />
                <Text style={styles.cardNumber}>{item.card}</Text>
                <TouchableOpacity>
                  <Ionicons name="download-outline" size={18} color="#111" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* PAYMENT SUMMARY */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>06</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Successful Payments</Text>
              <Text style={styles.summaryValue}>04</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Failed Payments</Text>
              <Text style={styles.summaryValue}>01</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Refunded Payments</Text>
              <Text style={styles.summaryValue}>01</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalSpent}>Total Spent</Text>
              <Text style={styles.totalAmount}>$99.96</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F4F7' },

  // Header (Buy Car style)
  headerBackground: {
    height: HEADER_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#235CF8',
   
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // Search Box
  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    height: 46,
    paddingHorizontal: 12,
    flex: 1,
    color: '#111',
  },

  // Payment Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: { color: '#666', fontSize: 12, marginLeft: 2 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: '600' },

  plan: { fontSize: 16, fontWeight: '700', color: '#111', marginTop: 10 },
  monthly: { fontSize: 12, color: '#666' },

  amount: { fontSize: 18, fontWeight: '700', marginTop: 4, marginBottom: 8 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  cardNumber: { flex: 1, marginLeft: 6, color: '#666' },

  // Summary Box
  summaryCard: {
    backgroundColor: '#DDEAFF',
    margin: 16,
    padding: 18,
    borderRadius: 14,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', marginBottom: 12 },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: { color: '#555', fontSize: 13 },
  summaryValue: { fontWeight: '700', fontSize: 14 },

  divider: {
    height: 1,
    backgroundColor: '#b4c8e8',
    marginVertical: 10,
  },

  totalSpent: { fontWeight: '700', fontSize: 15 },
  totalAmount: { fontWeight: '700', fontSize: 16 },
});
