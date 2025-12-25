import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { paymentData } from "../../constants/dummydata/payment";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

// Section Components
import ImportantNoteSection from '../../components/payments/payment/ImportantNoteSection';
import OrderItemsSection from '../../components/payments/payment/OrderItemsSection';
import PaymentMethodsSelector from '../../components/payments/payment/PaymentMethodsSelector';
import PaymentSummaryHeader from '../../components/payments/payment/PaymentSummaryHeader';
import PromoCodeSection from '../../components/payments/payment/PromoCodeSection';
import SellerInfoSection from '../../components/payments/payment/SellerInfoSection';

export default function Payment() {
  const router = useRouter();
  const { summary, seller, orderItems, note } = paymentData;
  const total = orderItems.reduce((acc, i) => acc + i.price, 0);

  const navigateToMethods = () => {
    router.push('/payments/payment-methods');
  };

  const handleContinue = () => {
    router.push('/payments/successful-payment');
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="receipt-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Payment Summary</Text>
        </View>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>

          <PaymentSummaryHeader summary={summary} />

          <SellerInfoSection seller={seller} />

          <OrderItemsSection items={orderItems} total={total} />

          <ImportantNoteSection note={note} />

          <PromoCodeSection />

          <PaymentMethodsSelector onSelectMethod={navigateToMethods} />

          {/* Continue Button */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>

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
  continueBtn: {
    marginTop: 16,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  continueText: {
    color: '#fff',
    fontWeight: '700'
  },
});
