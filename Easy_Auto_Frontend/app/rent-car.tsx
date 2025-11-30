// app/rent-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
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

const RENTAL_CARS = [
  {
    id: '1',
    name: 'Toyota Camry 2023',
    price: 'Rs. 5,000/day',
    features: ['Automatic', 'AC', 'GPS'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '2',
    name: 'Honda Civic 2022',
    price: 'Rs. 4,500/day',
    features: ['Automatic', 'AC'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '3',
    name: 'BMW 3 Series 2023',
    price: 'Rs. 12,000/day',
    features: ['Automatic', 'AC', 'GPS', 'Premium'],
    image: require('@/assets/images/car.jpg'),
  },
  {
    id: '4',
    name: 'Nissan Altima 2022',
    price: 'Rs. 4,000/day',
    features: ['Automatic', 'AC'],
    image: require('@/assets/images/car.jpg'),
  },
];

const RENTAL_PACKAGES = [
  {
    id: '1',
    duration: 'Daily',
    price: 'From Rs. 4,000/day',
    description: 'Perfect for short trips',
  },
  {
    id: '2',
    duration: 'Weekly',
    price: 'From Rs. 24,000/week',
    description: 'Save 15% on weekly rentals',
  },
  {
    id: '3',
    duration: 'Monthly',
    price: 'From Rs. 80,000/month',
    description: 'Best value for long term',
  },
];

export default function RentCarScreen() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState('1');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const renderRentalCard = ({ item }: { item: typeof RENTAL_CARS[0] }) => (
    <View style={[styles.rentalCard, { width: CARD_WIDTH }]}>
      <Image source={item.image} style={styles.rentalImage} resizeMode="cover" />
      <View style={styles.rentalCardBody}>
        <Text style={styles.rentalName}>{item.name}</Text>
        <View style={styles.featuresContainer}>
          {item.features.map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.rentalPrice}>{item.price}</Text>
        <TouchableOpacity style={styles.rentButton}>
          <Text style={styles.rentButtonText}>Rent Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Rent a Car" showProfileCard={false} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.heroIconContainer}>
              <Ionicons name="car-outline" size={64} color="#235CF8" />
            </View>
            <Text style={styles.heroTitle}>Rent a Car</Text>
            <Text style={styles.heroSubtitle}>
              Flexible daily, weekly & monthly rates
            </Text>
          </View>

          {/* Date Selection */}
          <View style={styles.dateSection}>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={20} color="#235CF8" />
                <TextInput
                  style={styles.dateText}
                  placeholder="Pickup Date"
                  value={pickupDate}
                  onChangeText={setPickupDate}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={styles.dateInput}>
                <Ionicons name="calendar-outline" size={20} color="#235CF8" />
                <TextInput
                  style={styles.dateText}
                  placeholder="Return Date"
                  value={returnDate}
                  onChangeText={setReturnDate}
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Rental Packages */}
          <View style={styles.packagesSection}>
            <Text style={styles.sectionTitle}>Rental Packages</Text>
            <View style={styles.packagesContainer}>
              {RENTAL_PACKAGES.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    selectedPackage === pkg.id && styles.packageCardActive,
                  ]}
                  onPress={() => setSelectedPackage(pkg.id)}
                >
                  <Text
                    style={[
                      styles.packageDuration,
                      selectedPackage === pkg.id && styles.packageDurationActive,
                    ]}
                  >
                    {pkg.duration}
                  </Text>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  <Text style={styles.packageDescription}>
                    {pkg.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Available Cars */}
          <View style={styles.carsSection}>
            <Text style={styles.sectionTitle}>Available Cars</Text>
            <View style={styles.carsGrid}>
              {RENTAL_CARS.map((item, index) => {
                if (index % 2 === 0) {
                  const nextItem = RENTAL_CARS[index + 1];
                  return (
                    <View key={`row-${index}`} style={styles.carsRow}>
                      <View key={item.id} style={{ width: CARD_WIDTH }}>
                        {renderRentalCard({ item })}
                      </View>
                      {nextItem && (
                        <View key={nextItem.id} style={{ width: CARD_WIDTH }}>
                          {renderRentalCard({ item: nextItem })}
                        </View>
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </View>
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
    backgroundColor: '#E8F5E9',
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
  dateSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  packagesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  packagesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  packageCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  packageCardActive: {
    borderColor: '#235CF8',
    backgroundColor: '#F0F4FF',
  },
  packageDuration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  packageDurationActive: {
    color: '#235CF8',
  },
  packagePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#235CF8',
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  carsSection: {
    marginBottom: 24,
  },
  carsGrid: {
    paddingHorizontal: 16,
  },
  carsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
  },
  rentalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  rentalImage: {
    width: '100%',
    height: 120,
  },
  rentalCardBody: {
    padding: 12,
  },
  rentalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  featureText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  rentalPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#235CF8',
    marginBottom: 12,
  },
  rentButton: {
    backgroundColor: '#235CF8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rentButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

