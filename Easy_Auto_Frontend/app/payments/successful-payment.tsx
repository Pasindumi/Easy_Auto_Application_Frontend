import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Header from "../../components/Header";
import { COLORS } from '@/constants/Colors';

export default function SuccessfulPayment() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={false} title="Payment Success" />

      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
            <View style={styles.successCard}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconBg}>
                        <Ionicons name="checkmark-circle" size={80} color={COLORS.status.success} />
                    </View>
                </View>

                <Text style={styles.title}>Payment Successful!</Text>
                <Text style={styles.subtitle}>
                    Your transaction has been processed successfully. Your ad or package is now active.
                </Text>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.push('/payments/payment-history')}
                >
                    <Text style={styles.primaryBtnText}>View Payment History</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.outlineBtn}
                    onPress={() => router.replace('/(tabs)')}
                >
                    <Text style={styles.outlineBtnText}>Back to Home</Text>
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
    backgroundColor: '#f8fafc',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 120,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 32,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    width: '100%',
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineBtn: {
    paddingVertical: 16,
    width: '100%',
    alignItems: 'center',
  },
  outlineBtnText: {
    color: COLORS.text.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});
