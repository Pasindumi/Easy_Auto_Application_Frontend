import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { OrderItem } from '../../types/payment.types';
import { api } from '@/utils/api';
import { useAuth } from '../../contexts/AuthContext';

import OrderItemsSection from '../../components/payments/payment/OrderItemsSection';
import PaymentSummaryHeader from '../../components/payments/payment/PaymentSummaryHeader';
import SellerInfoSection from '../../components/payments/payment/SellerInfoSection';

export default function PackageInvoice() {
  useProtectedRoute();

  const router = useRouter();
  const { plan, price, days } = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const planName = Array.isArray(plan) ? plan[0] : plan || 'Unknown Package';
  const planPrice = parseFloat(Array.isArray(price) ? price[0] : price || '0');
  const planDays = parseInt(Array.isArray(days) ? days[0] : days || '0');

  // Hardcode plan IDs or fetch them? Ideally, we need the plan ID.
  // Assuming the previous screen passed relevant IDs or we can find it.
  // For now, let's assume active discounts might match by package name if ID isn't available easily,
  // BUT the backend relies on package_id.
  // We should pass package_id from the previous screen.
  // Let's assume params has packageId.
  const { packageId } = useLocalSearchParams();
  const pkgIdString = Array.isArray(packageId) ? packageId[0] : packageId;

  useEffect(() => {
    const fetchDiscountsAndSetup = async () => {
      try {
        // Initial items
        const items: OrderItem[] = [
          {
            label: `${planName} Package (${planDays} Days)`,
            price: planPrice
          }
        ];

        if (pkgIdString) {
          console.log("Fetching discounts for Package ID:", pkgIdString);
          const res: any = await api.get('/api/discounts/active');
          const activeDiscounts = Array.isArray(res) ? res : (res.data || []);
          console.log("Active Discounts Found:", activeDiscounts.length);

          // Find applicable discount
          const applicableDiscount = activeDiscounts.find((d: any) => {
            // Check if this discount is linked to our package
            const matchesPackage = d.discount_packages?.some((dp: any) => {
              // Ensure both are strings for comparison
              return String(dp.package_id) === String(pkgIdString);
            });

            return matchesPackage;
          });

          if (applicableDiscount) {
            let discountAmount = 0;
            if (applicableDiscount.discount_type === 'PERCENTAGE') {
              discountAmount = (planPrice * applicableDiscount.value) / 100;
            } else {
              discountAmount = applicableDiscount.value;
            }

            // Cap discount at total price
            if (discountAmount > planPrice) discountAmount = planPrice;

            items.push({
              label: `Discount (${applicableDiscount.name})`,
              price: -discountAmount
            });
          }
        }

        setOrderItems(items);
      } catch (error) {
        console.error("Error setting up invoice:", error);
        // Fallback to just showing package
        setOrderItems([
          {
            label: `${planName} Package (${planDays} Days)`,
            price: planPrice
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountsAndSetup();
  }, [plan, price, days, pkgIdString]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getSettleDate = (date: Date) => {
    const settleDate = new Date(date);
    settleDate.setDate(settleDate.getDate() + 7);
    return settleDate.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const today = new Date();
  const invoiceNum = `PKG-${Date.now().toString().slice(-8)}`;

  const displaySummary = {
    title: `${planName} Subscription`,
    price: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(planPrice),
    date: formatDate(today),
    payout: getSettleDate(today),
    invoice: invoiceNum,
    coverImage: 'https://img.freepik.com/free-vector/subscription-model-abstract-concept-vector-illustration_107173-25642.jpg' // Generic placeholder or use a package icon
  };

  const displaySeller = user ? {
    name: user.name || 'User',
    email: user.email || 'user@example.com',
    contact: user.phone || 'N/A',
    address: 'N/A' // Provide N/A since address is required by type but we don't need it
  } : {
    name: 'Loading...',
    email: '',
    contact: '',
    address: ''
  };

  const total = orderItems.reduce((acc, i) => acc + i.price, 0);

  const handlePayHere = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const amountFormatted = total.toFixed(2);
      const orderId = displaySummary.invoice;
      // const items = `Package: ${planName}`;

      const paymentObj = {
        orderId: orderId,
        amount: amountFormatted,
        userId: user.id,
        packageId: pkgIdString,
        planName: planName
      };

      console.log("Initiating Mock Payment:", JSON.stringify(paymentObj));

      // Call Mock API
      const response = await api.post<{ success: boolean; message: string }>(
        '/api/payment/mock-success',
        paymentObj
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to process payment.");
      }

      // Success Redirect
      router.push('/payments/successful-payment');

    } catch (error: any) {
      console.error("Payment failed:", error);
      Alert.alert("Error", error.message || "Failed to settle payment.");
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
        <ActivityIndicator size="large" color="#235CF8" />
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="receipt-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Package Invoice</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <PaymentSummaryHeader summary={displaySummary} />

          {/* Seller Info (User Info) */}
          <SellerInfoSection seller={displaySeller} />

          <OrderItemsSection items={orderItems} total={total} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.payHereBtn} onPress={handlePayHere}>
              <Text style={styles.payHereText}>Settle Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={handleMorePackages}>
              <Text style={styles.secondaryBtnText}>More Packages</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  contentContainer: {
    paddingBottom: 32
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  actionButtons: {
    marginTop: 20,
    gap: 12
  },
  payHereBtn: {
    backgroundColor: '#235CF8',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  payHereText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#235CF8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  secondaryBtnText: {
    color: '#235CF8',
    fontWeight: '600',
    fontSize: 14
  }
});
