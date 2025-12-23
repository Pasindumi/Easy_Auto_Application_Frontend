import Header from '@/components/Header';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import BasicInformationSection from '../../components/cars/sell/BasicInformationSection';
import CarDetailsSection from '../../components/cars/sell/CarDetailsSection';
import ContactDetailsSection from '../../components/cars/sell/ContactDetailsSection';
import PhotoUploadSection from '../../components/cars/sell/PhotoUploadSection';
import SubmitSection from '../../components/cars/sell/SubmitSection';

// Types
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
    <SafeAreaView style={styles.container}>
      <Header showBack={true} title="Sell Your Car" />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
