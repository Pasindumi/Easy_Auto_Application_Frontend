import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { CarFormState } from '../../types/sell-car.types';
import { useAuth } from '../../context/AuthContext';

export default function SellCarScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

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
    bodyType: '',
    price: '',
    description: '',
    contactNumber: '',
    email: '',
    location: '',
    negotiable: false,
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      Alert.alert("Authentication Required", "Please login to sell your car.", [
        { text: "OK", onPress: () => router.replace('/auth/login') }
      ]);
      return;
    }

    // Auto-fill user details if authenticated
    if (user) {
      setCarDetails(prev => ({
        ...prev,
        email: user.email,
        contactNumber: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setCarDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert("Limit Reached", "You can only upload up to 5 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate Inputs
      if (!carDetails.title || !carDetails.price || !carDetails.brand) {
        Alert.alert("Missing Fields", "Please fill in all required fields.");
        setLoading(false);
        return;
      }

      const payload = {
        ...carDetails,
        images: selectedImages,
        // seller_id from auth context
        seller_id: user?.id,
        status: 'DRAFT'
      };

      // API Call
      // Replace with your actual local IP for Android/Emulator
      // Local IP: 192.168.1.2
      const API_URL = 'http://192.168.1.29:5000/api/cars';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Navigate to review page with the new ad ID
        router.push(`/cars/review?id=${data.data.id}`);
      } else {
        Alert.alert("Error", data.message || "Something went wrong.");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="pricetag-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Sell Your Car</Text>
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
            addImage={pickImage}
          />

          {/* Contact Details Section */}
          <ContactDetailsSection
            userName={user?.name}
            email={carDetails.email}
            contactNumber={carDetails.contactNumber}
            hidePhoneNumber={hidePhoneNumber}
            handleInputChange={handleInputChange}
            setHidePhoneNumber={setHidePhoneNumber}
          // Auto-filled nature is handled by prop values
          />

          {/* Submit Section */}
          <SubmitSection
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
