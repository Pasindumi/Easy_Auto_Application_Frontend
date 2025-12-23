import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BasicInformationSection from '../../components/cars/sell/BasicInformationSection';
import CarDetailsSection from '../../components/cars/sell/CarDetailsSection';
import ContactDetailsSection from '../../components/cars/sell/ContactDetailsSection';
import PhotoUploadSection from '../../components/cars/sell/PhotoUploadSection';
import SubmitSection from '../../components/cars/sell/SubmitSection';
import { CarFormState } from '../../types/sell-car.types';

export default function SellCarScreen() {
  const router = useRouter();

  // Form state
  const [carDetails, setCarDetails] = useState<CarFormState>({
    title: '',
    brand: '',
    model: '',
    year: '',
    condition: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    engineCapacity: '',
    price: '',
    description: '',
    contactNumber: '',
    email: '',
    location: '',
    negotiable: false,
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCarDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleRemoveAdditionalPhoto = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = () => {
    router.push('/payments/payment');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="pricetag-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Sell Your Car</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Basic Information Section */}
          <BasicInformationSection
            carDetails={carDetails}
            handleInputChange={handleInputChange}
          />

          {/* Car Details Section */}
          <CarDetailsSection
            carDetails={carDetails}
            handleInputChange={handleInputChange}
          />

          {/* Car Photos Section */}
          <PhotoUploadSection
            selectedImages={selectedImages}
            removeImage={handleRemovePhoto}
          />

          {/* Additional Images Section */}
          <PhotoUploadSection
            selectedImages={additionalImages}
            removeImage={handleRemoveAdditionalPhoto}
            title="Additional Images"
            subtitle="Add more images for more sales and engagements."
            pricePill="$2.00/image"
          />

          {/* Contact Details Section */}
          <ContactDetailsSection
            email={carDetails.email}
            contactNumber={carDetails.contactNumber}
            hidePhoneNumber={hidePhoneNumber}
            handleInputChange={handleInputChange}
            setHidePhoneNumber={setHidePhoneNumber}
          />

          {/* Submit Section */}
          <SubmitSection
            onReview={() => router.push('/ads/review add')}
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600'
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
