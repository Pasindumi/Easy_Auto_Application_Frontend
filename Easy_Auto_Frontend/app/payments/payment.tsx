import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { ENDPOINTS } from '../../constants/API';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { paymentData } from "../../constants/dummydata/payment";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { OrderItem } from '../../types/payment.types';
import { api } from '@/utils/api';

import ImportantNoteSection from '../../components/payments/payment/ImportantNoteSection';
import OrderItemsSection from '../../components/payments/payment/OrderItemsSection';
import PaymentSummaryHeader from '../../components/payments/payment/PaymentSummaryHeader';
import PromoCodeSection from '../../components/payments/payment/PromoCodeSection';
import SellerInfoSection from '../../components/payments/payment/SellerInfoSection';

export default function Payment() {
  useProtectedRoute();

  const router = useRouter();
  const { adId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [adDetails, setAdDetails] = useState<any>(null);

  const [orderItems, setOrderItems] = useState<OrderItem[]>(paymentData.orderItems);
  const [discountApplied, setDiscountApplied] = useState(false);

  useEffect(() => {
    const initData = async () => {
      if (adId) {
        setLoading(true);
        try {
          const [adRes, rulesRes, discountsRes, myAdsRes] = await Promise.all([
            api.get<{ success: boolean; data: any }>(`/api/cars/${adId}`),
            fetch(`${ENDPOINTS.PRICING}/rules`),
            api.get<{ success: boolean; data: any }>('/api/discounts/active'),
            api.get<{ success: boolean; data: any[] }>('/api/cars/my-ads')
          ]);

          if (adRes.success && rulesRes.ok) {
            const adData = adRes.data;
            const rulesData = await rulesRes.json();
            const discountsData = discountsRes.success ? (discountsRes.data || []) : (Array.isArray(discountsRes) ? discountsRes : []);
            const userAds = myAdsRes.data || (Array.isArray(myAdsRes) ? myAdsRes : []);

            setAdDetails(adData);

            const newOrderItems: OrderItem[] = [];
            const vehicleTypeId = adData.vehicle_type_id;
            const uploadedImagesCount = adData.AdImage?.length || 0;

            const adRule = rulesData.find((r: any) =>
              r.vehicle_type_id === vehicleTypeId &&
              (r.price_items?.code === 'AD' || r.price_items?.item_type === 'AD')
            );

            const defaultAdRule = rulesData.find((r: any) =>
              !r.vehicle_type_id &&
              (r.price_items?.code === 'AD' || r.price_items?.item_type === 'AD')
            );

            const finalAdRule = adRule || defaultAdRule;
            const adPrice = finalAdRule ? parseFloat(finalAdRule.price) : 0;
            const freeImageLimit = finalAdRule?.free_image_count || 5;

            newOrderItems.push({
              label: `Advertisement Fee (${adData.vehicle_type?.type_name || 'Vehicle'})`,
              price: adPrice
            });

            let extraImageFee = 0;
            if (uploadedImagesCount > freeImageLimit) {
              const extraImages = uploadedImagesCount - freeImageLimit;
              const exImgRule = rulesData.find((r: any) =>
                (r.vehicle_type_id === vehicleTypeId || !r.vehicle_type_id) &&
                r.price_items?.code === 'EX_IMG'
              );

              if (exImgRule) {
                const exImgPrice = parseFloat(exImgRule.price);
                extraImageFee = extraImages * exImgPrice;
                newOrderItems.push({
                  label: `Extra Images (${extraImages} x ${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(exImgPrice)})`,
                  price: extraImageFee
                });
              }
            }

            // Extra Description Charge
            const descLimit = finalAdRule?.description_limit || 500;
            const userDesc = adData.description || "";
            const descLength = userDesc.length;
            let extraDescFee = 0;

            if (descLength > descLimit) {
              // Find rule for EXT_LTR
              const extLtrRule = rulesData.find((r: any) =>
                (r.vehicle_type_id === vehicleTypeId || !r.vehicle_type_id) &&
                r.price_items?.code === 'EXT_LTR'
              );

              if (extLtrRule) {
                const extraLetterPrice = parseFloat(extLtrRule.price);
                if (extraLetterPrice > 0) {
                  const extraChars = descLength - descLimit;
                  extraDescFee = extraChars * extraLetterPrice;
                  newOrderItems.push({
                    label: `Extra Description (${extraChars} chars x ${new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(extraLetterPrice)})`,
                    price: extraDescFee
                  });
                }
              }
            }

            const subtotalBeforeDiscount = adPrice + extraImageFee + extraDescFee;
            const userAdsCount = userAds.length;
            const isFirstTimeUser = userAdsCount <= 1;

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
  }, [adId]);

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
    price: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(adDetails.price),
    date: formatDate(adDetails.createdAt || new Date().toISOString()),
    payout: getSettleDate(adDetails.createdAt || new Date().toISOString()),
    invoice: `INV-${String(adId).substring(0, 10)}`,
    coverImage: adDetails.AdImage?.[0]?.image_url || 'blueLogo.png'
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

      const amountFormatted = total.toFixed(2);
      const orderId = displaySummary.invoice;
      // Clean description for PayHere
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

        sandbox: true
      };

      console.log("Initiating Payment with Obj:", JSON.stringify(paymentObj));

      // 1. Fetch the Auto-Submit HTML from Backend
      // This ensures backend processes the data via AXIOS (reliable) instead of WebView (flaky body)
      const response = await api.post<{ success: boolean; html: string }>(
        '/api/payment/initiate',
        paymentObj
      );

      console.log("Payment Init Response:", response);

      if (!response.success || !response.html) {
        throw new Error("Failed to initiate payment. Server returned invalid response.");
      }

      // 2. Navigate to Gateway with HTML content
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

  const handleModify = () => {
    router.back();
  };

  const handleBuyPackage = () => {
    router.push('/packages/packages');
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          <Text style={headerSectionStyles.headerTitle}>Booking Summary</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <PaymentSummaryHeader summary={displaySummary} />
          <SellerInfoSection seller={displaySeller} />
          <OrderItemsSection items={orderItems} total={total} />
          <ImportantNoteSection note={paymentData.note} />
          <PromoCodeSection onApply={handleApplyPromo} />

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.payHereBtn} onPress={handlePayHere}>
              <Text style={styles.payHereText}>Pay Now (PayHere)</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleBuyPackage}>
                <Text style={styles.secondaryBtnText}>Buy Package</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, styles.modifyBtn]} onPress={handleModify}>
                <Text style={[styles.secondaryBtnText, styles.modifyText]}>Modify Booking</Text>
              </TouchableOpacity>
            </View>
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
  secondaryButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  secondaryBtn: {
    flex: 1,
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
  },
  modifyBtn: {
    borderColor: '#6b7280'
  },
  modifyText: {
    color: '#6b7280'
  }
});
