import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from "../../components/Header";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function SuccessfulPayment() {
  const router = useRouter();

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="checkmark-circle-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Payment Successful</Text>
        </View>
      </View>

      <View style={styles.container}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <View style={styles.hex} />
          <Ionicons name="checkmark-circle" size={64} color="#22c55e" style={styles.checkIcon} />
        </View>

        {/* Texts */}
        <Text style={styles.title}>Payment Done!</Text>
        <Text style={styles.subtitle}>You can now enjoy your package benefits.</Text>

        {/* CTA */}
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/payments/invoice' as any)}
        >
          <Text style={styles.ctaText}>View Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5'
  },
  iconWrap: {
    alignItems: 'center',
    marginTop: 50
  },
  hex: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 16,
    transform: [{ rotate: '20deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8
  },
  checkIcon: {
    position: 'absolute',
    top: 8
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginTop: 24
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 12,
    marginTop: 6
  },
  cta: {
    backgroundColor: '#235CF8',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center'
  },
  ctaText: {
    color: '#fff',
    fontWeight: '700'
  },
});
