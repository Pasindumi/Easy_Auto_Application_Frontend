import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform
} from 'react-native';
import Loading from '@/components/ui/Loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { api } from '@/utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function PackageInvoice() {
  useProtectedRoute();
  const router = useRouter();
  const { plan, price, days, packageId, adId } = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  const planName = Array.isArray(plan) ? plan[0] : plan || 'Premium Package';
  const planPrice = parseFloat(Array.isArray(price) ? price[0] : price || '0');
  const planDays = parseInt(Array.isArray(days) ? days[0] : days || '0');
  const pkgIdString = Array.isArray(packageId) ? packageId[0] : packageId;
  const adIdString = Array.isArray(adId) ? adId[0] : adId;

  useEffect(() => {
    fetchDiscounts();
  }, [pkgIdString]);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const items = [{ label: `${planName} (${planDays} Days)`, price: planPrice }];

      if (pkgIdString) {
        const res: any = await api.get('/api/discounts/active');
        const activeDiscounts = res.success ? (res.data || []) : (Array.isArray(res) ? res : []);

        const discount = activeDiscounts.find((d: any) =>
          d.discount_packages?.some((dp: any) => String(dp.package_id) === String(pkgIdString))
        );

        if (discount) {
          const discountAmt = discount.discount_type === 'PERCENTAGE'
            ? (planPrice * discount.value) / 100
            : discount.value;

          items.push({ label: `Discount: ${discount.name}`, price: -Math.min(discountAmt, planPrice) });
        }
      }
      setOrderItems(items);
    } catch (error) {
      console.error("Checkout setup error", error);
    } finally {
      setLoading(false);
    }
  };

  const total = orderItems.reduce((acc, i) => acc + i.price, 0);

  const handleConfirmPayment = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await api.post<{ success: boolean; message: string }>('/api/payment/mock-success', {
        orderId: `PKG-${Date.now().toString().slice(-6)}`,
        amount: total.toFixed(2),
        userId: user.id,
        packageId: pkgIdString,
        adId: adIdString,
        planName: planName
      });

      if (res.success) {
        router.push('/payments/successful-payment');
      } else {
        throw new Error(res.message);
      }
    } catch (error: any) {
      Alert.alert("Payment Failed", error.message || "Unable to settle payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleMorePackages = () => {
    router.push('/packages/packages');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Secure Checkout" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topBanner}>
          <Ionicons name="shield-checkmark" size={16} color={COLORS.status.success} />
          <Text style={styles.topBannerText}>SSL SECURED TRANSACTION</Text>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Validating your order...</Text>
            </View>
          ) : (
            <>
              <View style={styles.planCard}>
                <LinearGradient
                  colors={[COLORS.primary, '#1e40af']}
                  style={styles.iconBg}
                >
                  <Ionicons name="flash" size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.planInfo}>
                  <Text style={styles.planTitle}>{planName}</Text>
                  <Text style={styles.planMeta}>Valid for {planDays} days from date of purchase</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Order Summary</Text>
                <View style={styles.itemsList}>
                  {orderItems.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                      <Text style={[styles.itemLabel, item.price < 0 && styles.discountLabel]}>{item.label}</Text>
                      <Text style={[styles.itemPrice, item.price < 0 && styles.discountPrice]}>
                        {item.price < 0 ? '-' : ''}Rs. {Math.abs(item.price).toLocaleString()}
                      </Text>
                    </View>
                  ))}
                </View>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Payable</Text>
                  <Text style={styles.totalValue}>Rs. {total.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.userSection}>
                <Text style={styles.sectionTitle}>Billing Account</Text>
                <View style={styles.userCard}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{user?.name || 'Authorized Buyer'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'customer@easyauto.lk'}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.trustBox}>
                <View style={styles.trustItem}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748b" />
                  <Text style={styles.trustText}>Encrypted Payment</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="refresh-outline" size={18} color="#64748b" />
                  <Text style={styles.trustText}>Cancel Anytime</Text>
                </View>
                <View style={styles.trustItem}>
                  <Ionicons name="help-circle-outline" size={18} color="#64748b" />
                  <Text style={styles.trustText}>24/7 Support</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.payBtn}
            onPress={handleConfirmPayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.payBtnText}>Confirm and Pay Rs. {total.toLocaleString()}</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  topBannerText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.status.success,
    letterSpacing: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  loader: {
    paddingVertical: 100,
    alignItems: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconBg: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  planMeta: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  itemsList: {
    gap: 14,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },
  discountLabel: {
    color: COLORS.status.success,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  discountPrice: {
    color: COLORS.status.success,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  userSection: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.primary,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  trustBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  payBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
