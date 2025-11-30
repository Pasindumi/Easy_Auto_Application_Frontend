// app/sell-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ProfileHeader from '@/components/ProfileHeader';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const SELLING_STEPS = [
  {
    id: '1',
    title: 'Enter Car Details',
    description: 'Add your car information',
    icon: 'car-outline',
  },
  {
    id: '2',
    title: 'Get Instant Quote',
    description: 'Receive valuation in minutes',
    icon: 'calculator-outline',
  },
  {
    id: '3',
    title: 'Schedule Inspection',
    description: 'Book a convenient time',
    icon: 'calendar-outline',
  },
  {
    id: '4',
    title: 'Complete Sale',
    description: 'Finalize the transaction',
    icon: 'checkmark-circle-outline',
  },
];

const DEALER_QUOTES = [
  {
    id: '1',
    dealerName: 'AutoMax Dealers',
    quote: 'Rs. 4.8Mn',
    rating: 4.8,
    distance: '2.5 km',
  },
  {
    id: '2',
    dealerName: 'Premium Motors',
    quote: 'Rs. 5.2Mn',
    rating: 4.9,
    distance: '5.1 km',
  },
  {
    id: '3',
    dealerName: 'City Auto Center',
    quote: 'Rs. 4.6Mn',
    rating: 4.7,
    distance: '3.8 km',
  },
];

export default function SellCarScreen() {
  const router = useRouter();
  const [carDetails, setCarDetails] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Sell Your Car" showProfileCard={false} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="car-sport" size={64} color="#235CF8" />
            </View>
            <Text style={styles.heroTitle}>Sell Your Car Fast</Text>
            <Text style={styles.heroSubtitle}>
              Get instant quotes from verified dealers
            </Text>
          </View>

          {/* Car Details Form */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Car Details</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Make</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Toyota"
                value={carDetails.make}
                onChangeText={(text) =>
                  setCarDetails({ ...carDetails, make: text })
                }
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Model</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Camry"
                value={carDetails.model}
                onChangeText={(text) =>
                  setCarDetails({ ...carDetails, model: text })
                }
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  placeholder="2020"
                  value={carDetails.year}
                  onChangeText={(text) =>
                    setCarDetails({ ...carDetails, year: text })
                  }
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Mileage</Text>
                <TextInput
                  style={styles.input}
                  placeholder="50,000 km"
                  value={carDetails.mileage}
                  onChangeText={(text) =>
                    setCarDetails({ ...carDetails, mileage: text })
                  }
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                // Handle form submission
              }}
            >
              <Text style={styles.submitButtonText}>Get Instant Quote</Text>
            </TouchableOpacity>
          </View>

          {/* How It Works */}
          <View style={styles.stepsSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            {SELLING_STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepCard}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Ionicons name={step.icon as any} size={24} color="#235CF8" />
                  <View style={styles.stepText}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>
                      {step.description}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Dealer Quotes */}
          <View style={styles.quotesSection}>
            <Text style={styles.sectionTitle}>Top Dealer Quotes</Text>
            {DEALER_QUOTES.map((quote) => (
              <View key={quote.id} style={styles.quoteCard}>
                <View style={styles.quoteHeader}>
                  <View>
                    <Text style={styles.dealerName}>{quote.dealerName}</Text>
                    <View style={styles.quoteMeta}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.rating}>{quote.rating}</Text>
                      <Text style={styles.distance}>• {quote.distance}</Text>
                    </View>
                  </View>
                  <Text style={styles.quotePrice}>{quote.quote}</Text>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact Dealer</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Account for header
    paddingBottom: 100, // Account for tab bar (68px) + safe area + extra spacing
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  heroIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  submitButton: {
    backgroundColor: '#235CF8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  stepsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#235CF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    marginLeft: 12,
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  quotesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dealerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  quoteMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  quotePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#235CF8',
  },
  contactButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#235CF8',
    fontSize: 14,
    fontWeight: '600',
  },
});

