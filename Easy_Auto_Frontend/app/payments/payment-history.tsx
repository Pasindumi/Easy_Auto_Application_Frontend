import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';
import Header from "@/components/Header";
import PaymentCard from '@/components/payments/history/PaymentCard';
import PaymentSearch from '@/components/payments/history/PaymentSearch';
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
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
    return <Loading fullScreen message="Fetching history..." />;
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header
        showBack={true}
        title="Payment History"
      />

      <View style={styles.content}>
        {/* Floating Investment Card */}
        <View style={styles.investmentCardContainer}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark || '#1E4DB7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.investmentCard}
          >
            <View style={styles.investmentInfo}>
              <View style={styles.investmentHeader}>
                <Ionicons name="wallet-outline" size={20} color="rgba(255,255,255,0.8)" />
                <Text style={styles.investmentLabel}>Total Lifetime Investment</Text>
              </View>
              <Text style={styles.investmentValue}>{summaryData.totalSpent}</Text>
            </View>
            <View style={styles.trendContainer}>
              <Ionicons name="trending-up" size={32} color="rgba(255,255,255,0.4)" />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <View style={styles.badgeContainer}>
                <Text style={styles.sectionBadge}>{filteredPayments.length}</Text>
              </View>
            </View>
          </View>

          <PaymentSearch value={searchText} onChangeText={setSearchText} />

          <FlatList
            data={filteredPayments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PaymentCard item={item} onPress={handleCardPress} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EmptyState
                icon="receipt-outline"
                title="No Transactions Found"
                description={searchText 
                  ? `We couldn't find any payments matching "${searchText}".`
                  : "You haven't made any payments yet. Your transaction history will appear here."}
                actionText={searchText ? "Clear Search" : "Explore Packages"}
                onActionPress={() => {
                  if (searchText) setSearchText('');
                  else router.push('/packages/packages' as any);
                }}
              />
            }
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  investmentCardContainer: {
    paddingHorizontal: 16,
    marginTop: -25, // Overlap with header curve
    zIndex: 110,
  },
  investmentCard: {
    borderRadius: 24,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  investmentInfo: {
    flex: 1,
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  investmentLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  investmentValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.5,
  },
  trendContainer: {
    marginLeft: 16,
  },
  mainContent: {
    flex: 1,
    paddingTop: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  badgeContainer: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
});
