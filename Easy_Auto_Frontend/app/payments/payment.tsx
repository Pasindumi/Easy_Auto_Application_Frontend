// VERIFICATION_TAG: REF_PV_FIX_V2
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, SafeAreaView, Platform } from 'react-native';
import Loading from '@/components/ui/Loading';
import { ENDPOINTS } from '../../constants/API';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { paymentData } from "../../constants/dummydata/payment";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { OrderItem } from '../../types/payment.types';
import { api } from '@/utils/api';
import { COLORS } from '@/constants/Colors';

import ImportantNoteSection from '../../components/payments/payment/ImportantNoteSection';
import OrderItemsSection from '../../components/payments/payment/OrderItemsSection';
import PaymentSummaryHeader from '../../components/payments/payment/PaymentSummaryHeader';
import PromoCodeSection from '../../components/payments/payment/PromoCodeSection';
import SellerInfoSection from '../../components/payments/payment/SellerInfoSection';

export default function Payment() {
  useProtectedRoute();

  const router = useRouter();
  const { adId, rentalAdId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [adDetails, setAdDetails] = useState<any>(null);

  const [orderItems, setOrderItems] = useState<OrderItem[]>(paymentData.orderItems);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isFreeAd, setIsFreeAd] = useState(false);
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  useEffect(() => {
    const initData = async () => {
      const targetId = adId || rentalAdId;
      if (targetId) {
        setLoading(true);
        try {
          const adEndpoint = rentalAdId ? `/api/rentals/${rentalAdId}` : `/api/cars/${adId}`;
          const myAdsEndpoint = rentalAdId ? '/api/rentals/my-ads' : '/api/cars/my-ads';

          const [adRes, rulesRes, discountsRes, myAdsRes, myPkgRes] = await Promise.all([
            api.get<{ success: boolean; data: any }>(adEndpoint),
            fetch(`${ENDPOINTS.PRICING}/rules`),
            api.get<{ success: boolean; data: any }>('/api/discounts/active'),
            api.get<{ success: boolean; data: any[] }>(myAdsEndpoint),
            api.get<{ success: boolean; data: any }>('/api/pricing/active-package')
          ]);

          if (adRes.success && rulesRes.ok) {
            const adData = adRes.data;
            const rulesData = await rulesRes.json();
            const discountsData = discountsRes.success ? (discountsRes.data || []) : (Array.isArray(discountsRes) ? discountsRes : []);
            const userAds = myAdsRes.data || (Array.isArray(myAdsRes) ? myAdsRes : []);
            const pkgData = myPkgRes.success ? myPkgRes.data : null;

            setAdDetails(adData);

            const newOrderItems: OrderItem[] = [];
            const vehicleTypeId = adData.vehicle_type_id;
            const uploadedImagesCount = rentalAdId ? (adData.images?.length || 0) : (adData.AdImage?.length || 0);

            // 1. Find the Standard (Global) Advertisement Price for this vehicle type
            const standardAdRule = rulesData.find((r: any) =>
              r.vehicle_type_id === vehicleTypeId &&
              r.unit === 'PER_AD' &&
              (r.price_items?.code === 'STD_AD' || r.price_items?.code === 'AD') &&
              parseFloat(r.price) > 0
            );

            const globalAdRule = rulesData.find((r: any) =>
              !r.vehicle_type_id &&
              r.unit === 'PER_AD' &&
              (r.price_items?.code === 'STD_AD' || r.price_items?.code === 'AD') &&
              parseFloat(r.price) > 0
            );

            const finalAdRule = standardAdRule || globalAdRule;
            const adPrice = finalAdRule ? parseFloat(finalAdRule.price) : 0;
            const freeImageLimit = finalAdRule?.free_image_count || 5;

            // CHECK PACKAGE LIMITS FOR FREE AD
            let isFreeAdLocal = false;
            let packageLimitId = null;

            if (pkgData && pkgData.global_limit) {
              const gLimit = pkgData.global_limit;
              if (gLimit.is_unlimited || gLimit.total_remaining > 0) {
                isFreeAdLocal = true;
              }
            }

            if (!isFreeAdLocal && pkgData && pkgData.limits) {
              const limit = pkgData.limits.find((l: any) =>
                String(l.vehicle_type_id || '').toLowerCase() === String(vehicleTypeId || '').toLowerCase()
              );
              if (limit) {
                if (limit.is_unlimited || limit.remaining_count > 0) {
                  isFreeAdLocal = true;
                  packageLimitId = limit.id;
                }
              }
            }

            setIsFreeAd(isFreeAdLocal);
            setActivePackageId(pkgData?.packageId || null);

            if (isFreeAdLocal) {
              newOrderItems.push({
                label: `Advertisement Price`,
                price: adPrice
              });
              newOrderItems.push({
                label: `Package Benefit`,
                price: -adPrice
              });
            } else {
              newOrderItems.push({
                label: `Advertisement Fee (${adData.vehicle_type?.type_name || 'Vehicle'})`,
                price: adPrice
              });
            }

            let extraImageFee = 0;
            let effectiveImageLimit = freeImageLimit;
            if (pkgData && pkgData.config?.IMAGE_LIMIT) {
              effectiveImageLimit = Math.max(effectiveImageLimit, parseInt(pkgData.config.IMAGE_LIMIT));
            }

            if (uploadedImagesCount > effectiveImageLimit) {
              const extraImages = uploadedImagesCount - effectiveImageLimit;
              const exImgRule = rulesData.find((r: any) =>
                (r.vehicle_type_id === vehicleTypeId || !r.vehicle_type_id) &&
                r.price_items?.code === 'EX_IMG'
              );

              if (exImgRule) {
                const exImgPrice = parseFloat(exImgRule.price);
                extraImageFee = extraImages * exImgPrice;
                newOrderItems.push({
                  label: `Extra Images (${extraImages} images)`,
                  price: extraImageFee
                });
              }
            }

            const ruleDescLimit = finalAdRule?.description_limit || 500;
            let effectiveDescLimit = ruleDescLimit;

            if (pkgData && pkgData.config?.DESCRIPTION_LIMIT) {
              effectiveDescLimit = Math.max(effectiveDescLimit, parseInt(pkgData.config.DESCRIPTION_LIMIT));
            }

            const userDesc = adData.description || "";
            const descLength = userDesc.length;
            let extraDescFee = 0;

            if (descLength > effectiveDescLimit) {
              const extLtrRule = rulesData.find((r: any) =>
                (r.vehicle_type_id === vehicleTypeId || !r.vehicle_type_id) &&
                r.price_items?.code === 'EXT_LTR'
              );

              if (extLtrRule) {
                const extraLetterPrice = parseFloat(extLtrRule.price);
                if (extraLetterPrice > 0) {
                  const extraChars = descLength - effectiveDescLimit;
                  extraDescFee = extraChars * extraLetterPrice;
                  newOrderItems.push({
                    label: `Extra Description (${extraChars} chars)`,
                    price: extraDescFee
                  });
                }
              }
            }

            const subtotalBeforeDiscount = adPrice + extraImageFee + extraDescFee;
            const userAdsCount = userAds.length;
            const isFirstTimeUser = userAdsCount <= 1;

            if (!isFreeAdLocal) {
              discountsData.forEach((discount: any) => {
                const hasCategory = !discount.discount_vehicle_types ||
                  discount.discount_vehicle_types.length === 0 ||
                  discount.discount_vehicle_types.some((v: any) => v.vehicle_type_id === vehicleTypeId);

                if (!hasCategory) return;
                if (discount.is_first_time_user && !isFirstTimeUser) return;
                if (discount.min_bulk_ads > 0 && userAdsCount < discount.min_bulk_ads) return;

                let discountAmount = 0;
                const discountValue = parseFloat(discount.value);

                if (discount.discount_type === 'PERCENTAGE') {
                  discountAmount = subtotalBeforeDiscount * (discountValue / 100);
                } else {
                  discountAmount = discountValue;
                }

                if (discountAmount > 0) {
                  newOrderItems.push({
                    label: `Discount: ${discount.name}`,
                    price: -discountAmount
                  });
                }
              });
            }

            setOrderItems(newOrderItems);
          } else {
            Alert.alert("Error", "Failed to load booking details.");
          }
        } catch (error) {
          console.error("Error initializing payment page:", error);
          Alert.alert("Error", "Network error.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initData();
  }, [adId, rentalAdId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getSettleDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const displaySummary = adDetails ? {
    ...paymentData.summary,
    title: adDetails.title,
    price: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(adDetails.price || adDetails.price_per_day || 0),
    date: formatDate(adDetails.createdAt || adDetails.created_at || new Date().toISOString()),
    payout: getSettleDate(adDetails.createdAt || adDetails.created_at || new Date().toISOString()),
    expiryDate: adDetails.expiry_date ? formatDate(adDetails.expiry_date) : undefined,
    invoice: `INV-${String(adId || rentalAdId).substring(0, 10)}`,
    coverImage: (rentalAdId ? adDetails.images?.[0]?.image_url : adDetails.AdImage?.[0]?.image_url) || 'blueLogo.png'
  } : paymentData.summary;

  const displaySeller = adDetails?.users ? {
    name: adDetails.users.name,
    email: adDetails.users.email,
    contact: adDetails.users.phone,
    address: adDetails.location
  } : paymentData.seller;

  const total = orderItems.reduce((acc, i) => acc + i.price, 0);

  const handleApplyPromo = (code: string) => {
    if (!code) return;
    if (code.toUpperCase() === 'SAVE10' && !discountApplied) {
      const discountAmount = total * 0.10;
      const discountItem: OrderItem = {
        label: `Promo Code (${code.toUpperCase()})`,
        price: -discountAmount
      };
      setOrderItems([...orderItems, discountItem]);
      setDiscountApplied(true);
      Alert.alert('Success', 'Promo code applied successfully!');
    } else if (discountApplied) {
      Alert.alert('Info', 'A promo code is already applied.');
    } else {
      Alert.alert('Error', 'Invalid promo code.');
    }
  };

  const handlePayHere = async () => {
    if (!adDetails && !adId) return;

    try {
      setLoading(true);

      if (total === 0 && isFreeAd) {
        const activationResponse = await api.post<{ success: boolean; message: string }>(
          '/api/payment/activate-free-ad',
          {
            adId: adId,
            packageId: activePackageId,
            amount: 0,
            orderId: displaySummary.invoice
          }
        );

        if (activationResponse.success) {
          Alert.alert("Success", activationResponse.message);
          router.push('/payments/successful-payment' as any);
          return;
        } else {
          Alert.alert("Error", activationResponse.message || "Failed to activate ad.");
          return;
        }
      }

      const amountFormatted = total.toFixed(2);
      const orderId = displaySummary.invoice;
      const items = (displaySummary.title || "Advertisement").substring(0, 100).replace(/[^a-zA-Z0-9 ]/g, "");

      const paymentObj = {
        order_id: orderId,
        items: items,
        amount: amountFormatted,
        currency: "LKR",
        first_name: displaySeller.name ? displaySeller.name.split(' ')[0] : "User",
        last_name: displaySeller.name
          ? displaySeller.name.split(' ')[1] || "User"
          : "User",
        email: displaySeller.email || "customer@example.com",
        phone: displaySeller.contact || "0771234567",
        address: displaySeller.address || "No 1, Galle Road",
        city: "Colombo",
        country: "Sri Lanka",
        packageId: activePackageId,
        rentalAdId: rentalAdId, // Pass rentalAdId to backend
        sandbox: true
      };

      const response = await api.post<{ success: boolean; html: string }>(
        '/api/payment/initiate',
        paymentObj
      );

      if (!response.success || !response.html) {
        throw new Error("Failed to initiate payment. Server returned invalid response.");
      }

      router.push({
        pathname: '/payments/payhere-gateway',
        params: { html: response.html },
      });

    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      Alert.alert("Error", error.message || "Failed to initiate payment.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Preparing your checkout..." />;
  }

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Secure Checkout" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.headerIndicator}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.status.success} />
          <Text style={styles.headerIndicatorText}>Secure Checkout</Text>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainContent}>
            <PaymentSummaryHeader summary={displaySummary} />
            <SellerInfoSection seller={displaySeller} />
            <OrderItemsSection items={orderItems} total={total} />
            <PromoCodeSection onApply={handleApplyPromo} />
            <ImportantNoteSection note={total === 0 ? "Enjoy your package benefits! This ad is fully covered." : paymentData.note} />
          </View>
        </ScrollView>

        <View style={styles.bottomActions}>
          <View style={styles.totalSummary}>
            <View>
              <Text style={styles.totalLabel}>Total to Pay</Text>
              <Text style={styles.totalValue}>LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
            <TouchableOpacity style={styles.payBtn} onPress={handlePayHere}>
              <Text style={styles.payBtnText}>Confirm & Pay</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.secondaryActions}>
            <TouchableOpacity style={styles.outlineBtn} onPress={() => router.push('/packages/packages')}>
              <Ionicons name="cube-outline" size={18} color={COLORS.primary} />
              <Text style={styles.outlineBtnText}>View Packages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.outlineBtn, styles.modifyBtn]} onPress={() => router.back()}>
              <Ionicons name="create-outline" size={18} color={COLORS.text.secondary} />
              <Text style={[styles.outlineBtnText, styles.modifyBtnText]}>Modify Ad</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  headerIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 6,
  },
  headerIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.status.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  mainContent: {
    padding: 16,
  },
  bottomActions: {
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 10,
  },
  totalSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '500',
    marginBottom: 2,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  payBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  modifyBtn: {
    borderColor: '#e2e8f0',
  },
  modifyBtnText: {
    color: COLORS.text.secondary,
  },
});
