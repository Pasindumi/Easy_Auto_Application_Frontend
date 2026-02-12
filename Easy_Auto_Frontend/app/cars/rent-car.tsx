// app/rent-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import { RENTAL_PACKAGES, RENTAL_CARS } from '../../constants/dummydata/rent';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

export default function RentCarScreen() {
  const [selectedPackage, setSelectedPackage] = useState('1');
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

  const renderRentalCard = ({ item }: { item: typeof RENTAL_CARS[0] }) => (
    <View style={[styles.rentalCard, { width: CARD_WIDTH }]}>
      <Image source={item.image} style={styles.rentalImage} resizeMode="cover" />
      <View style={styles.rentalCardBody}>
        <Text style={styles.rentalName}>{item.name}</Text>
        <View style={styles.featuresContainer}>
          {item.features.map((feature: string, index: number) => (
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
      <Header title="Rent a Car" />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollContent, { paddingTop: 32 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.heroSection, { marginTop: -20 }]}>
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
                {RENTAL_PACKAGES.map((pkg: typeof RENTAL_PACKAGES[0]) => (
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
                {RENTAL_CARS.map((item: typeof RENTAL_CARS[0], index: number) => {
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
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 32,
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
  heroIconContainerEnhanced: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#B6D0F6',
    shadowColor: '#235CF8',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  heroIconShadow: {
    textShadowColor: '#B6D0F6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
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
    paddingHorizontal: 12, // reduced
    paddingVertical: 8, // reduced
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8, // reduced
    height: 38, // set fixed smaller height
  },
  dateText: {
    flex: 1,
    fontSize: 13, // reduced
    color: '#111827',
    paddingVertical: 0, // ensure compact
    paddingHorizontal: 0,
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

