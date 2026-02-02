import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from "../../components/Header";
import PaymentCard from '../../components/payments/history/PaymentCard';
import PaymentSearch from '../../components/payments/history/PaymentSearch';
import PaymentSummary from '../../components/payments/history/PaymentSummary';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { Payment, PaymentSummaryData } from '../../types/payment.types';
import { api } from '@/utils/api';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res: any = await api.get('/api/payment/my-history');
      if (res.success && Array.isArray(res.data)) {
        // Map backend data to frontend type
        const mapped: Payment[] = res.data.map((p: any) => ({
          id: p.id,
          date: p.date,
          plan: p.plan,
          type: 'Package', // Default or derive from logic
          amount: p.amount,
          status: p.status === 'SUCCESS' ? 'Successful' : p.status === 'FAILED' ? 'Failed' : p.status,
          card: 'PayHere' // Default
        }));
        setPayments(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      // Alert.alert("Error", "Could not load payment history.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (): PaymentSummaryData => {
    const successful = payments.filter(p => p.status === 'Successful');
    const failed = payments.filter(p => p.status === 'Failed');
    const refunded = payments.filter(p => p.status === 'Refunded');

    // Parse amount string "$29.99" -> 29.99
    // Backend returns "LKR 1000.00", assume we parse it
    const totalVal = successful.reduce((acc, curr) => {
      const val = parseFloat(curr.amount.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return {
      totalPayments: payments.length,
      successful: successful.length,
      failed: failed.length,
      refunded: refunded.length,
      totalSpent: `LKR ${totalVal.toFixed(2)}`,
    };
  };

  const summaryData = calculateSummary();

  const filteredPayments = payments.filter(p =>
    p.plan.toLowerCase().includes(searchText.toLowerCase()) ||
    p.status.toLowerCase().includes(searchText.toLowerCase()) ||
    p.date.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCardPress = (item: Payment) => {
    // router.push({
    //   pathname: './payments/preview-payment',
    //   params: { ...item },
    // } as any);
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#235CF8" />
      </View>
    );
  }

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
          {filteredPayments.length > 0 ? (
            filteredPayments.map((item) => (
              <PaymentCard key={item.id} item={item} onPress={handleCardPress} />
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No payment history found.</Text>
          )}

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