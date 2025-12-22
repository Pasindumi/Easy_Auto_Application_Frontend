import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuccessfulPayment() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Success icon */}
      <View style={styles.iconWrap}>
        <View style={styles.hex} />
        <Ionicons name="checkmark-circle" size={64} color="#22c55e" style={styles.checkIcon} />
      </View>

      {/* Texts */}
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subtitle}>Your payment has been processed successfully.</Text>

      {/* CTA */}
      <TouchableOpacity style={styles.cta} onPress={() => router.push('/payments/invoice' as any)}>
        <Text style={styles.ctaText}>View Invoice</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F3F5' },
  header: { backgroundColor: '#235CF8', paddingTop: 50, paddingBottom: 24, paddingHorizontal: 16 },
  // Move success icon further down
  iconWrap: { alignItems: 'center', marginTop: 50 },
  hex: { width: 80, height: 80, backgroundColor: '#fff', borderRadius: 16, transform: [{ rotate: '20deg' }], shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 },
  checkIcon: { position: 'absolute', top: 8 },
  title: { textAlign: 'center', fontWeight: '700', fontSize: 16, marginTop: 24 },
  subtitle: { textAlign: 'center', color: '#6B7280', fontSize: 12, marginTop: 6 },
  cta: { backgroundColor: '#235CF8', paddingVertical: 12, borderRadius: 10, marginHorizontal: 20, marginTop: 16, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '700' },
});
