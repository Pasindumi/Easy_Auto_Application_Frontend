import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Linking, ActivityIndicator } from 'react-native';
import { ENDPOINTS } from '../../constants/API';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { paymentData } from "../../constants/dummydata/payment"; // Fallback/Structure
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { OrderItem } from '../../types/payment.types';
import { getPayHereCheckoutUrl, MOCK_PAYHERE_MERCHANT_ID } from '../../utils/payhere';
import { api } from '@/utils/api';

// Section Components
import ImportantNoteSection from '../../components/payments/payment/ImportantNoteSection';
import OrderItemsSection from '../../components/payments/payment/OrderItemsSection';
import PaymentMethodsSelector from '../../components/payments/payment/PaymentMethodsSelector';
import PaymentSummaryHeader from '../../components/payments/payment/PaymentSummaryHeader';
import PromoCodeSection from '../../components/payments/payment/PromoCodeSection';
import SellerInfoSection from '../../components/payments/payment/SellerInfoSection';

export default function Payment() {
  // Protect this route - require authentication
  useProtectedRoute();

  const router = useRouter();
  const { adId } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);
  const [adDetails, setAdDetails] = useState<any>(null);

  // State for dynamic calculation
  const [orderItems, setOrderItems] = useState<OrderItem[]>(paymentData.orderItems); // Initial items could be fetched too, using dummy for now
  const [discountApplied, setDiscountApplied] = useState(false);

  // Fetch Data
  useEffect(() => {
    const initData = async () => {
      if (adId) {
        setLoading(true);
        try {
          // Parallel fetch: Ad Details, Pricing Rules, Active Discounts, and User's Ads (for conditions)
          const [adRes, rulesRes, discountsRes, myAdsRes] = await Promise.all([
            api.get<{ success: boolean; data: any }>(`/api/cars/${adId}`),
            fetch(`${ENDPOINTS.PRICING}/rules`),
            api.get<{ success: boolean; data: any }>('/api/discounts/active'),
            api.get<{ success: boolean; data: any[] }>('/api/cars/my-ads')
          ]);

          if (adRes.success && rulesRes.ok) {
            const adData = adRes.data;
            const rulesData = await rulesRes.json();
            // Resilient check for data structures
            const discountsData = discountsRes.success ? (discountsRes.data || []) : (Array.isArray(discountsRes) ? discountsRes : []);
            const userAds = myAdsRes.data || (Array.isArray(myAdsRes) ? myAdsRes : []);

            setAdDetails(adData);

            // --- DYNAMIC CALCULATION LOGIC ---
            const newOrderItems: OrderItem[] = [];
            const vehicleTypeId = adData.vehicle_type_id;
            const uploadedImagesCount = adData.AdImage?.length || 0;

            // 1. Advertisement Fee
            // Find rule for this vehicle type with item_type 'AD' or code 'AD'
            const adRule = rulesData.find((r: any) =>
              r.vehicle_type_id === vehicleTypeId &&
              (r.price_items?.code === 'AD' || r.price_items?.item_type === 'AD')
            );

            // Fallback to default 'AD' rule if no specific type rule exists
            const defaultAdRule = rulesData.find((r: any) =>
              !r.vehicle_type_id &&
              (r.price_items?.code === 'AD' || r.price_items?.item_type === 'AD')
            );

            const finalAdRule = adRule || defaultAdRule;
            const adPrice = finalAdRule ? parseFloat(finalAdRule.price) : 0;
            const freeImageLimit = finalAdRule?.free_image_count || 5; // Default from rule

            newOrderItems.push({
              label: `Advertisement Fee (${adData.vehicle_type?.type_name || 'Vehicle'})`,
              price: adPrice
            });

            // 2. Extra Image Fee
            // Check if uploaded images exceed free limit
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

            // 3. Automatic Discounts & Offers
            const subtotalBeforeDiscount = adPrice + extraImageFee;
            const userAdsCount = userAds.length;
            const isFirstTimeUser = userAdsCount <= 1; // 1 means only current ad exists

            discountsData.forEach((discount: any) => {
              // Condition Check
              // a. Category Match
              const hasCategory = !discount.discount_vehicle_types ||
                discount.discount_vehicle_types.length === 0 ||
                discount.discount_vehicle_types.some((v: any) => v.vehicle_type_id === vehicleTypeId);

              if (!hasCategory) return;

              // b. First-time User
              if (discount.is_first_time_user && !isFirstTimeUser) return;

              // c. Bulk Ads
              if (discount.min_bulk_ads > 0 && userAdsCount < discount.min_bulk_ads) return;

              // If all conditions pass, apply discount
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

  // Helper to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getSettleDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  // Construct Data or Fallback
  const displaySummary = adDetails ? {
    ...paymentData.summary,
    title: adDetails.title,
    price: new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(adDetails.price),
    date: formatDate(adDetails.createdAt || new Date().toISOString()),
    payout: getSettleDate(adDetails.createdAt || new Date().toISOString()),
    invoice: `#INV-AD-${adId}`, // unique invoice
    coverImage: adDetails.AdImage?.[0]?.image_url || 'blueLogo.png' // Pass URL if component supports it, otherwise fallback
  } : paymentData.summary;

  const displaySeller = adDetails?.users ? {
    name: adDetails.users.name,
    email: adDetails.users.email,
    contact: adDetails.users.phone,
    address: adDetails.location // Using ad location as requested
  } : paymentData.seller;

  // Calculate dynamic total
  const total = orderItems.reduce((acc, i) => acc + i.price, 0);

  const handleApplyPromo = (code: string) => {
    if (!code) return;

    if (code.toUpperCase() === 'SAVE10' && !discountApplied) {
      const discountAmount = total * 0.10; // 10% discount
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

    // Construct Payment Object
    const paymentObj = {
      merchant_id: MOCK_PAYHERE_MERCHANT_ID,
      return_url: "https://example.com/return",
      cancel_url: "https://example.com/cancel",
      notify_url: "https://example.com/notify",
      order_id: displaySummary.invoice,
      items: displaySummary.title,
      amount: total.toFixed(2),
      currency: "LKR",
      first_name: displaySeller.name ? displaySeller.name.split(' ')[0] : "User",
      last_name: displaySeller.name ? (displaySeller.name.split(' ')[1] || "") : "",
      email: displaySeller.email,
      phone: displaySeller.contact,
      address: displaySeller.address,
      city: "Colombo", // Placeholder or extract from address
      country: "Sri Lanka"
    };

    const checkoutUrl = getPayHereCheckoutUrl(paymentObj);

    const supported = await Linking.canOpenURL(checkoutUrl);
    if (supported) {
      await Linking.openURL(checkoutUrl);
    } else {
      Alert.alert("Error", "Cannot open payment URL");
    }
  };

  const navigateToMethods = () => {
    router.push('/payments/payment-methods');
  };

  const handleBuyPackage = () => {
    Alert.alert("Packages", "Navigate to packages page or open modal.");
  };

  const handleModify = () => {
    router.back();
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

      {/* Inline Sub-Header Section */}
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

          {/* Dynamic Order Items & Total */}
          <OrderItemsSection items={orderItems} total={total} />

          <ImportantNoteSection note={paymentData.note} />

          {/* Promo Code with Handler */}
          <PromoCodeSection onApply={handleApplyPromo} />

          {/* Buttons Section */}
          <View style={styles.actionButtons}>

            {/* Pay Now (PayHere) */}
            <TouchableOpacity style={styles.payHereBtn} onPress={handlePayHere}>
              <Text style={styles.payHereText}>Pay Now (PayHere)</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              {/* Buy Package */}
              <TouchableOpacity style={styles.secondaryBtn} onPress={handleBuyPackage}>
                <Text style={styles.secondaryBtnText}>Buy Package</Text>
              </TouchableOpacity>

              {/* Modify Booking */}
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
