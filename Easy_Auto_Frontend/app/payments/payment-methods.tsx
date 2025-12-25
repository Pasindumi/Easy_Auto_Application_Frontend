import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from "../../components/Header";
import CreditCardItem from '../../components/payments/methods/CreditCardItem';
import OtherMethodItem from '../../components/payments/methods/OtherMethodItem';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { CreditCard, PaymentMethod } from '../../types/payment.types';

export default function PaymentMethods() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const cards: CreditCard[] = [
    {
      id: '**** 4236',
      type: 'Credit Card',
      number: '**** 4236',
      holderName: 'Dilmin Ekanayaka',
      expiryDate: '08/25',
      icon: require('@/assets/images/mastercard.png'),
      backgroundColor: '#143F8C',
    },
    {
      id: '**** 1357',
      type: 'Credit Card',
      number: '**** 1357',
      holderName: 'Dilmin Ekanayaka',
      expiryDate: '08/25',
      icon: require('@/assets/images/mastercard.png'),
      backgroundColor: '#4B216B',
    },
  ];

  const otherMethods: PaymentMethod[] = [
    {
      id: 'Paypal',
      name: 'Paypal',
      icon: require('@/assets/images/Paypal.png'),
    },
    {
      id: 'Google Pay',
      name: 'Google Pay',
      icon: require('@/assets/images/googlepay.png'),
    },
    {
      id: 'Visa Debit',
      name: 'Visa Debit',
      icon: require('@/assets/images/visa.png'),
    },
    {
      id: 'Mastercard Debit',
      name: 'Mastercard Debit',
      icon: require('@/assets/images/mastercard.png'),
    },
  ];

  const handlePayNow = () => {
    if (!selectedMethod) {
      Alert.alert('Select a method', 'Please choose a payment method to continue.');
      return;
    }
    router.push('/payments/payment');
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="card-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Payment Methods</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- CREDIT CARD SECTION ---------- */}
        <View style={styles.cardContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Credit Card</Text>
            <Text style={styles.countText}>{cards.length} Card Added</Text>
          </View>

          {cards.map((card) => (
            <CreditCardItem
              key={card.id}
              card={card}
              isSelected={selectedMethod === card.id}
              onPress={setSelectedMethod}
            />
          ))}

          {/* Add New Card */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => router.push('./add-card')}
          >
            <Ionicons name="add" size={18} color="#235CF8" />
            <Text style={styles.addText}>Add New Card</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- OTHER PAYMENT METHODS ---------- */}
        <View style={styles.otherContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Others</Text>
            <Text style={styles.countText}>{otherMethods.length} Methods Added</Text>
          </View>

          {otherMethods.map((method) => (
            <OtherMethodItem
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              onPress={setSelectedMethod}
            />
          ))}
        </View>

        {/* Pay Now CTA */}
        <TouchableOpacity style={styles.payNowBtn} onPress={handlePayNow}>
          <Text style={styles.payNowText}>Pay Now</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.payNowBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#235CF8', marginTop: 12 }]}
          onPress={() => router.push('./payment' as any)}
        >
          <Text style={[styles.payNowText, { color: '#235CF8' }]}>View Summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    paddingBottom: 40,
  },
  cardContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  countText: {
    fontSize: 11,
    color: '#999',
  },
  addBtn: {
    backgroundColor: '#F1F4FF',
    paddingVertical: 14,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 6,
  },
  addText: {
    marginLeft: 6,
    color: '#235CF8',
    fontWeight: '600',
    fontSize: 13,
  },
  otherContainer: {
    marginHorizontal: 16,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  payNowBtn: {
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    alignSelf: 'center',
    width: '60%',
  },
  payNowText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});