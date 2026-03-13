import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform
} from 'react-native';
import Header from "../../components/Header";
import CreditCardItem from '../../components/payments/methods/CreditCardItem';
import OtherMethodItem from '../../components/payments/methods/OtherMethodItem';
import { CreditCard, PaymentMethod } from '../../types/payment.types';
import { COLORS } from '@/constants/Colors';

export default function PaymentMethods() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const cards: CreditCard[] = [
    {
      id: '**** 4236',
      type: 'Credit Card',
      number: '**** 4236',
      holderName: 'User Name',
      expiryDate: '08/25',
      icon: require('@/assets/images/mastercard.png'),
      backgroundColor: '#1E293B',
    },
  ];

  const otherMethods: PaymentMethod[] = [
    {
      id: 'PayHere',
      name: 'PayHere Gateway',
      icon: require('@/assets/images/mastercard.png'), // Placeholder or representative icon
    }
  ];

  const handlePayNow = () => {
    router.push('/payments/payment');
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Payment Methods" />

      <SafeAreaView style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
        >
          {/* ---------- CREDIT CARD SECTION ---------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Cards</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cards.length}</Text>
              </View>
            </View>

            <View style={styles.listCard}>
                {cards.map((card) => (
                <CreditCardItem
                    key={card.id}
                    card={card}
                    isSelected={selectedMethod === card.id}
                    onPress={setSelectedMethod}
                />
                ))}

                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => Alert.alert("Coming Soon", "Manual card entry is being implemented.")}
                >
                    <View style={styles.addBtnIcon}>
                        <Ionicons name="add" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.addText}>Add New Payment Method</Text>
                </TouchableOpacity>
            </View>
          </View>

          {/* ---------- OTHER PAYMENT METHODS ---------- */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Other Options</Text>
            </View>

            <View style={styles.listCard}>
                {otherMethods.map((method) => (
                <OtherMethodItem
                    key={method.id}
                    method={method}
                    isSelected={selectedMethod === method.id}
                    onPress={setSelectedMethod}
                />
                ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handlePayNow}>
                <Text style={styles.primaryBtnText}>Review & Checkout</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  badge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 16,
  },
  addBtnIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});