import Header from '@/components/Header';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { paymentData } from "../../constants/dummydata/payment";

export default function Payment() {
  const router = useRouter();
  const orderItems = paymentData.orderItems;
  const total = orderItems.reduce((acc, i) => acc + i.price, 0);
  const summary = paymentData.summary;
  const seller = paymentData.seller;
  const note = paymentData.note;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Payment Summary" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Summary Card */}
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Image source={typeof summary.coverImage === 'string' ? { uri: summary.coverImage } : summary.coverImage} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{summary.title}</Text>
              <Text style={styles.price}>{summary.price}</Text>
            </View>
          </View>

          {/* Meta */}
          <View style={styles.sectionBox}>
            <Text style={styles.metaText}>Date: {summary.date}</Text>
            <Text style={styles.metaText}>Settle Pending (expected payout : {summary.payout})</Text>
            <Text style={styles.metaText}>Invoice : {summary.invoice}</Text>
          </View>

          {/* Seller Information */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Seller Information</Text>
            <Text style={styles.metaText}>Seller: {seller.name}</Text>
            <Text style={styles.metaText}>Contact: {seller.contact}</Text>
            <Text style={styles.metaText}>Address: {seller.address}</Text>
            <Text style={styles.metaText}>Email: {seller.email}</Text>
          </View>

          {/* Order Items */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Order Items</Text>
            {orderItems.map((item, idx) => (
              <View key={idx} style={styles.row}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={[styles.itemPrice, item.price < 0 && { color: '#ef4444' }]}>
                  {item.price < 0 ? `- LKR ${Math.abs(item.price).toFixed(2)}` : `LKR ${item.price.toFixed(2)}`}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={[styles.itemLabel, { fontWeight: '700' }]}>Total</Text>
              <Text style={[styles.itemPrice, { fontWeight: '700' }]}>LKR {total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Important Note */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Important Note</Text>
            <Text style={styles.noteText}>{note}</Text>
          </View>

          {/* Promo Code */}
          <View style={styles.sectionBox}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={styles.promoField} />
              <TouchableOpacity style={styles.applyBtn}><Text style={styles.applyText}>Apply</Text></TouchableOpacity>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Payment Method</Text>
            <TouchableOpacity style={styles.methodItem} onPress={() => router.push('/payments/payment-methods' as any)}>
              <Text style={styles.methodText}>Credit/Debit card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodItem}>
              <Text style={styles.methodText}>Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodItem}>
              <Text style={styles.methodText}>Paypal</Text>
            </TouchableOpacity>
          </View>

          {/* Continue */}
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.push('/payments/payment-methods' as any)}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  contentContainer: { paddingBottom: 32 },
  header: { width: '100%', backgroundColor: '#2563eb', paddingVertical: 16, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  headerLeft: { position: 'absolute', left: 16 },
  card: { margin: 16, backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8 },
  thumb: { width: 72, height: 72, borderRadius: 8 },
  title: { fontWeight: '700' },
  price: { color: '#2563eb', fontWeight: '700' },
  sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
  sectionHeader: { fontWeight: '700', color: '#1f2937', marginBottom: 8 },
  metaText: { color: '#374151', fontSize: 12, marginBottom: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  itemLabel: { color: '#111827', fontSize: 12 },
  itemPrice: { color: '#111827', fontSize: 12 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginTop: 8 },
  noteText: { color: '#6b7280', fontSize: 12 },
  promoField: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  applyBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
  applyText: { color: '#fff', fontWeight: '700' },
  methodItem: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 12, paddingHorizontal: 12, marginTop: 8 },
  methodText: { color: '#111827', fontWeight: '600' },
  continueBtn: { marginTop: 16, backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  continueText: { color: '#fff', fontWeight: '700' },
});
