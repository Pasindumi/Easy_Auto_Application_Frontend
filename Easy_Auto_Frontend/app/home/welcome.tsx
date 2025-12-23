import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#235CF8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/(tabs)')}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Text Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            WELCOME TO <Text style={styles.easyAutoText}>EASYAUTO</Text>
          </Text>
        </View>

        {/* Car Image */}
        <View style={styles.imageContainer}>
          <View style={styles.carImagePlaceholder}>
            <Ionicons name="car-sport" size={120} color="#333" />
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
              <Text style={styles.benefitsTitle}>Benefits of Using CarMart</Text>

              <View style={styles.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <View key={benefit.id} style={styles.benefitItem}>
                    <View style={styles.checkmarkContainer}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#235CF8"
                      />
                    </View>
                    <Text style={styles.benefitText}>{benefit.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              // Navigate to language selection screen
              router.push('/settings/select-language');
            }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#235CF8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  easyAutoText: {
    color: '#235CF8',
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
    position: 'relative',
    overflow: 'hidden',
  },
  mainContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#235CF8',
    textAlign: 'center',
    marginBottom: 8,
  },
  dreamCarText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#235CF8',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
  benefitIcon: {
    marginRight: 8,
  },
  checkmarkContainer: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#235CF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  benefitText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  continueButton: {
    backgroundColor: '#235CF8',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 0,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});