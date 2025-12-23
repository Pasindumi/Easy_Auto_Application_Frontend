import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();

  const benefits = [
    { id: 1, text: 'Easy Buying & Selling', icon: 'checkmark-circle' },
    { id: 2, text: 'Secure Chat & Payment', icon: 'checkmark-circle' },
    { id: 3, text: 'Best Anytime', icon: 'checkmark-circle' },
    { id: 4, text: 'Free Support Plans', icon: 'checkmark-circle' },
    { id: 5, text: 'Verified Sellers', icon: 'checkmark-circle' },
    { id: 6, text: 'Website & Compare', icon: 'checkmark-circle' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Welcome" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Text Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            WELCOME TO <Text style={styles.easyAutoText}>EASYAUTO</Text>
          </Text>
        </View>

        {/* Car Image Placeholder */}
        <View style={styles.imageContainer}>
          <View style={styles.carImagePlaceholder}>
            <Ionicons name="car-sport" size={120} color={COLORS.white} />
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.mainTitle}>
            FIND YOUR <Text style={styles.dreamCarText}>DREAM CAR</Text>
          </Text>
          <Text style={styles.subtitle}>
            Browse thousands of verified cars from trusted sellers near you.
          </Text>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of Using EasyAuto</Text>

              <div style={styles.benefitsGrid as any}>
                {benefits.map((benefit) => (
                  <View key={benefit.id} style={styles.benefitItem}>
                    <View style={styles.checkmarkContainer}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={COLORS.primary}
                      />
                    </View>
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </View>
                ))}
              </div>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              router.push('/settings/select-language');
            }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.text.primary,
    fontWeight: '500',
    textAlign: 'center',
  },
  easyAutoText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  carImagePlaceholder: {
    width: 300,
    height: 180,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  dreamCarText: {
    color: COLORS.text.primary,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  benefitText: {
    fontSize: 13,
    color: COLORS.text.muted,
    flex: 1,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});