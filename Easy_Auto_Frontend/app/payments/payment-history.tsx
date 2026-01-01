import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from "../../components/Header";
import PaymentCard from '../../components/payments/history/PaymentCard';
import PaymentSearch from '../../components/payments/history/PaymentSearch';
import PaymentSummary from '../../components/payments/history/PaymentSummary';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { Payment, PaymentSummaryData } from '../../types/payment.types';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const payments: Payment[] = [
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

  const summaryData: PaymentSummaryData = {
    totalPayments: 7,
    successful: 4,
    failed: 2,
    refunded: 1,
    totalSpent: '$99.96',
  };

  const filteredPayments = payments.filter(p =>
    p.plan.toLowerCase().includes(searchText.toLowerCase()) ||
    p.status.toLowerCase().includes(searchText.toLowerCase()) ||
    p.date.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCardPress = (item: Payment) => {
    router.push({
      pathname: './payments/preview-payment',
      params: { ...item },
    } as any);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        {/* HEADER */}
        <Header />
        <View style={headerSectionStyles.headerWrap}>
          <View style={headerSectionStyles.header}>
            <View style={headerSectionStyles.headerLeft}>
              <Ionicons name="time-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
              <Text style={headerSectionStyles.headerTitle}>Payment History</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          {/* SEARCH */}
          <PaymentSearch value={searchText} onChangeText={setSearchText} />

          {/* PAYMENT LIST */}
          {filteredPayments.map((item) => (
            <PaymentCard key={item.id} item={item} onPress={handleCardPress} />
          ))}

          {/* SUMMARY */}
          <PaymentSummary data={summaryData} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
});