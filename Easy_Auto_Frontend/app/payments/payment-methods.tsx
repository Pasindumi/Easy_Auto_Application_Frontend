// app/payment-methods.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function PaymentMethods() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handlePayNow = () => {
    if (!selectedMethod) {
      Alert.alert('Select a method', 'Please choose a payment method to continue.');
      return;
    }
    Alert.alert('Confirm Payment', `Proceed with ${selectedMethod}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Pay', style: 'default', onPress: () => router.push('/successful-payment' as any) },
    ]);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* ---------- HEADER ---------- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>PAYMENT METHODS</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* ---------- CREDIT CARD SECTION ---------- */}
          <View style={styles.cardContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Credit Card</Text>
              <Text style={styles.countText}>2 Card Added</Text>
            </View>

            {/* Card 01 */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('**** 4236')}
              style={[
                styles.creditCard,
                { backgroundColor: '#143F8C' },
                selectedMethod === '**** 4236' && styles.methodItemActive,
              ]}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Credit Card</Text>
                <Text style={styles.cardNumber}>**** 4236</Text>
              </View>

              <View style={styles.cardRowBottom}>
                <Text style={styles.cardName}>Dilmin Ekanayaka</Text>

                <View style={styles.cardRight}>
                  <Image
                    source={require('@/assets/images/mastercard.png')}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardDate}>08/25</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Card 02 */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('**** 1357')}
              style={[
                styles.creditCard,
                { backgroundColor: '#4B216B' },
                selectedMethod === '**** 1357' && styles.methodItemActive,
              ]}
            >
              <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>Credit Card</Text>
                <Text style={styles.cardNumber}>**** 1357</Text>
              </View>

              <View style={styles.cardRowBottom}>
                <Text style={styles.cardName}>Dilmin Ekanayaka</Text>

                <View style={styles.cardRight}>
                  <Image
                    source={require('@/assets/images/mastercard.png')}
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardDate}>08/25</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Add New Card */}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => router.push('./payments/add-card')}
            >
              <Ionicons name="add" size={18} color="#235CF8" />
              <Text style={styles.addText}>Add New Card</Text>
            </TouchableOpacity>
          </View>

          {/* ---------- OTHER PAYMENT METHODS ---------- */}
          <View style={styles.otherContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Others</Text>
              <Text style={styles.countText}>5 Methods Added</Text>
            </View>

            {/* PayPal */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('Paypal')}
              style={[
                styles.otherItem,
                selectedMethod === 'Paypal' && styles.methodItemActive,
              ]}
            >
              <Image
                source={require('@/assets/images/Paypal.png')}
                style={styles.otherIcon}
              />
              <Text style={styles.otherText}>Paypal</Text>
            </TouchableOpacity>

            {/* Google Pay */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('Google Pay')}
              style={[
                styles.otherItem,
                selectedMethod === 'Google Pay' && styles.methodItemActive,
              ]}
            >
              <Image
                source={require('@/assets/images/googlepay.png')}
                style={styles.otherIcon}
              />
              <Text style={styles.otherText}>Google Pay</Text>
            </TouchableOpacity>

            {/* Visa Debit */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('Visa Debit')}
              style={[
                styles.otherItem,
                selectedMethod === 'Visa Debit' && styles.methodItemActive,
              ]}
            >
              <Image
                source={require('@/assets/images/visa.png')}
                style={styles.otherIcon}
              />
              <Text style={styles.otherText}>Visa Debit</Text>
            </TouchableOpacity>

            {/* Mastercard Debit */}
            <TouchableOpacity
              onPress={() => setSelectedMethod('Mastercard Debit')}
              style={[
                styles.otherItem,
                selectedMethod === 'Mastercard Debit' && styles.methodItemActive,
              ]}
            >
              <Image
                source={require('@/assets/images/mastercard.png')}
                style={styles.otherIcon}
              />
              <Text style={styles.otherText}>Mastercard Debit</Text>
            </TouchableOpacity>
          </View>

          {/* Pay Now CTA */}
          <TouchableOpacity style={styles.payNowBtn} onPress={handlePayNow}>
            <Text style={styles.payNowText}>Pay Now</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  

  /* CREDIT CARD SECTION */
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

  creditCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  cardNumber: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },

  cardRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },

  cardName: {
    color: '#fff',
    fontSize: 12,
  },

  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardIcon: {
    width: 30,
    height: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },

  cardDate: {
    color: '#fff',
    fontSize: 12,
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

  /* OTHER METHODS */
  otherContainer: {
    marginHorizontal: 16,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  otherItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  otherIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginRight: 12,
  },

  otherText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
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

  methodItemActive: {
    borderWidth: 2,
    borderColor: '#235CF8',
  },
});
