import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from "../../components/Header";

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
      card: 'Visa **** **** 4232',
    },
    {
      id: '2',
      date: 'Oct 13, 2025',
      plan: 'Basic Plan',
      type: 'Monthly',
      amount: '$10.00',
      status: 'Successful',
      card: 'Visa **** **** 4232',
    },
    {
      id: '3',
      date: 'July 17, 2025',
      plan: 'Premium Plan',
      type: 'Yearly',
      amount: '$360.00',
      status: 'Refunded',
      card: 'Visa **** **** 4232',
    },
    {
      id: '4',
      date: 'Oct 13, 2025',
      plan: 'Basic Plan',
      type: 'Monthly',
      amount: '$10.00',
      status: 'Failed',
      card: 'Visa **** **** 4232',
    },
    {
      id: '5',
      date: 'July 17, 2025',
      plan: 'Premium Plan',
      type: 'Yearly',
      amount: '$360.00',
      status: 'Refunded',
      card: 'Visa **** **** 4232',
    },
    {
      id: '6',
      date: 'Oct 15, 2025',
      plan: 'Premium Plan',
      type: 'Monthly',
      amount: '$29.99',
      status: 'Successful',
      card: 'Visa **** **** 4232',
    },
    {
      id: '7',
      date: 'Oct 15, 2025',
      plan: 'Premium Plan',
      type: 'Monthly',
      amount: '$29.99',
      status: 'Failed',
      card: 'Visa **** **** 4232',
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
        <Header />
        <View style={localStyles.headerWrap}>
          <View style={localStyles.header}>
            <View style={localStyles.headerLeft}>
              <Ionicons name="time-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
              <Text style={localStyles.headerTitle}>Payment History</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* SEARCH */}
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#A0A4A8" style={{ marginLeft: 10 }} />
            <TextInput
              placeholder="Search transactions"
              placeholderTextColor="#A0A4A8"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* PAYMENT LIST */}
          {payments.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              onPress={() =>
                router.push({
                  pathname: './payments/preview-payment',
                  params: { ...item },
                })
              }
            >
              <View style={styles.card}>
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

                <Text style={styles.plan}>
                  {item.plan} <Text style={styles.monthly}>({item.type})</Text>
                </Text>

                <Text style={styles.amount}>{item.amount}</Text>

                <View style={styles.cardFooter}>
                  <Ionicons name="card-outline" size={16} color="#666" />
                  <Text style={styles.cardNumber}>{item.card}</Text>

                  <TouchableOpacity>
                    <Ionicons name="download-outline" size={18} color="#111" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          {/* SUMMARY */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>07</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Successful</Text>
              <Text style={styles.summaryValue}>04</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Failed</Text>
              <Text style={styles.summaryValue}>02</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Refunded</Text>
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
  safe: { flex: 1, backgroundColor: '#F9FAFB' },

  headerBackground: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#235CF8',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 16 },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    paddingRight: 10,
  },

  searchInput: { flex: 1, paddingHorizontal: 10 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 18,
    borderRadius: 14,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  date: { fontSize: 12, color: '#666' },

  statusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  statusText: { fontSize: 12, fontWeight: '600' },

  plan: { fontSize: 16, fontWeight: '700', marginTop: 10 },
  monthly: { fontSize: 12, color: '#666' },

  amount: { fontSize: 18, fontWeight: '700', marginTop: 6 },

  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  cardNumber: {
    flex: 1,
    marginLeft: 8,
    color: '#666',
  },

  summaryCard: {
    backgroundColor: '#DDEAFF',
    margin: 16,
    padding: 18,
    borderRadius: 14,
  },

  summaryTitle: { fontWeight: '700', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  summaryLabel: { color: '#555' },
  summaryValue: { fontWeight: '700' },

  divider: {
    height: 1,
    backgroundColor: '#AAC3EA',
    marginVertical: 10,
  },

  totalSpent: { fontWeight: '700' },
  totalAmount: { fontWeight: '800' },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D0D5DD' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
