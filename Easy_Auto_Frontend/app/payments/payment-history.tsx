import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import { COLORS } from '@/constants/Colors';

import Header from "../../components/Header";
import PaymentCard from '../../components/payments/history/PaymentCard';
import PaymentSearch from '../../components/payments/history/PaymentSearch';
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
        const mapped: Payment[] = res.data.map((p: any) => ({
          id: p.id,
          date: p.date,
          plan: p.plan,
          type: 'Ad Post',
          amount: p.amount,
          status: p.status === 'SUCCESS' ? 'Successful' : p.status === 'FAILED' ? 'Failed' : p.status,
          card: 'PayHere'
        }));
        setPayments(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your payment history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete('/api/payment/my-history');
              setPayments([]);
              Alert.alert("Success", "Payment history cleared.");
            } catch (error) {
              console.error("Failed to clear history:", error);
              Alert.alert("Error", "Failed to clear payment history.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const calculateSummary = (): PaymentSummaryData => {
    const successful = payments.filter(p => p.status === 'Successful');
    const failed = payments.filter(p => p.status === 'Failed');
    const refunded = payments.filter(p => p.status === 'Refunded');

    const totalVal = successful.reduce((acc, curr) => {
      const val = parseFloat(curr.amount.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    return {
      totalPayments: payments.length,
      successful: successful.length,
      failed: failed.length,
      refunded: refunded.length,
      totalSpent: `LKR ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  };

  const summaryData = calculateSummary();

  const filteredPayments = payments.filter(p =>
    p.plan.toLowerCase().includes(searchText.toLowerCase()) ||
    p.status.toLowerCase().includes(searchText.toLowerCase()) ||
    p.date.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCardPress = (item: Payment) => {
    router.push({
      pathname: '/payments/payment-detail',
      params: {
        id: item.id,
        date: item.date,
        amount: item.amount,
        plan: item.plan,
        status: item.status,
        card: item.card,
        type: item.type
      },
    } as any);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Fetching history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header 
        showBack={true} 
        title="Payment History" 
      />

      <SafeAreaView style={styles.safe}>
        <View style={styles.totalInvestmentBar}>
            <View style={styles.investmentInfo}>
                <Text style={styles.investmentLabel}>Total Lifetime Investment</Text>
                <Text style={styles.investmentValue}>{summaryData.totalSpent}</Text>
            </View>
            <View style={styles.investmentBadge}>
                <Ionicons name="trending-up" size={16} color={COLORS.primary} />
            </View>
        </View>

        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.badgeContainer}>
                <Text style={styles.sectionBadge}>{filteredPayments.length}</Text>
            </View>
          </View>

          <PaymentSearch value={searchText} onChangeText={setSearchText} />

          <View style={styles.listContainer}>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item) => (
                <PaymentCard key={item.id} item={item} onPress={handleCardPress} />
              ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Ionicons name="receipt-outline" size={48} color={COLORS.text.placeholder} />
                    <Text style={styles.emptyText}>No transactions found</Text>
                </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  totalInvestmentBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '600',
    marginBottom: 4,
  },
  investmentValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
  },
  investmentBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  badgeContainer: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontWeight: '600',
  },
});

