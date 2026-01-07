import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BasicInformationSection from '../../components/cars/sell/BasicInformationSection';
import CarDetailsSection from '../../components/cars/sell/CarDetailsSection';
import ContactDetailsSection from '../../components/cars/sell/ContactDetailsSection';
import PhotoUploadSection from '../../components/cars/sell/PhotoUploadSection';
import SubmitSection from '../../components/cars/sell/SubmitSection';
import { ENDPOINTS } from '../../constants/API';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { CarFormState } from '../../types/sell-car.types';
import { useAuth } from '../../context/AuthContext';

export default function SellCarScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleType = params.vehicleType as string || 'Car';
  const vehicleTypeId = params.vehicleTypeId as string || '';
  const { user, token, isAuthenticated } = useAuth();

  // Fetched Config
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<any[]>([]);

  // Form state
  // Initialize with passed vehicle type params
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
    vehicle_type: vehicleType,
    vehicle_type_id: vehicleTypeId,
    dynamicAttributes: []
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      if (!vehicleTypeId) return;
      try {
        const [brandsRes, attrsRes, modelsRes, conditionsRes] = await Promise.all([
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.BRANDS}/${vehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.ATTRIBUTES}/${vehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.MODELS}/${vehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.CONDITIONS}/${vehicleTypeId}`)
        ]);

        if (!brandsRes.ok || !attrsRes.ok || !modelsRes.ok || !conditionsRes.ok) {
          throw new Error("One or more requests failed");
        }

        const brandsData = await brandsRes.json();
        const attrsData = await attrsRes.json();
        const modelsData = await modelsRes.json();
        const conditionsData = await conditionsRes.json();

        if (Array.isArray(brandsData)) setBrands(brandsData);
        if (Array.isArray(attrsData)) setAttributes(attrsData);
        if (Array.isArray(modelsData)) setModels(modelsData);
        if (Array.isArray(conditionsData)) setConditions(conditionsData);

      } catch (error) {
        console.error("Error fetching vehicle config:", error);
        Alert.alert("Error", "Failed to fetch vehicle configuration. Please check your connection.");
      }
    };
    fetchData();
  }, [vehicleTypeId]);

  const handleInputChange = (field: string, value: any) => {
    setCarDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDynamicAttributeChange = (attrId: string, value: any) => {
    setCarDetails(prev => {
      const currentAttrs = prev.dynamicAttributes || [];
      const existingIndex = currentAttrs.findIndex(a => a.attribute_id === attrId);

      let newAttrs;
      if (existingIndex >= 0) {
        newAttrs = [...currentAttrs];
        newAttrs[existingIndex] = { attribute_id: attrId, value };
      } else {
        newAttrs = [...currentAttrs, { attribute_id: attrId, value }];
      }

      return { ...prev, dynamicAttributes: newAttrs };
    });
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
        Alert.alert("Missing Fields", "Please fill in all required fields (Title, Brand, Price).");
        setLoading(false);
        return;
      }

      // Check required dynamic attributes
      const missingRequired = attributes.filter(attr => attr.is_required).find(attr => {
        const val = carDetails.dynamicAttributes?.find(a => a.attribute_id === attr.id)?.value;
        return val === undefined || val === '' || val === null;
      });

      if (missingRequired) {
        Alert.alert("Missing Fields", `Please fill in ${missingRequired.attribute_name}`);
        setLoading(false);
        return;
      }

      const payload = {
        ...carDetails,
        vehicle_type: vehicleType,
        vehicle_type_id: vehicleTypeId,
        images: selectedImages,
        seller_id: user?.id || 'guest', // Fallback or handle auth check
        status: 'DRAFT'
      };

      const response = await fetch(ENDPOINTS.CARS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Your ad has been submitted for review!");
        const adId = data.data.id;
        router.replace({
          pathname: '/cars/review',
          params: { id: adId }
        });
      } else {
        Alert.alert("Error", data.message || "Failed to submit ad");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header showBack={true} />
        <View style={styles.authGuardContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.authGuardTitle}>Login Required</Text>
          <Text style={styles.authGuardMessage}>Please login or create an account to sell your vehicles on Easy Auto.</Text>

          <View style={styles.authButtonGroup}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: COLORS.primary }]}
                onPress={() => router.push('/auth/login')}
              >
                <Text style={[styles.authButtonText, { color: COLORS.white }]}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary }]}
                onPress={() => router.push('/auth/signup')}
              >
                <Text style={[styles.authButtonText, { color: COLORS.primary }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="pricetag-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Sell Your {vehicleType}</Text>
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
          <BasicInformationSection
            carDetails={carDetails}
            handleInputChange={handleInputChange}
          />

          <CarDetailsSection
            carDetails={carDetails}
            handleInputChange={handleInputChange}
            vehicleType={vehicleType}
            brands={brands}
            models={models}
            conditions={conditions}
            attributes={attributes}
            handleDynamicAttributeChange={handleDynamicAttributeChange}
          />

          <PhotoUploadSection
            selectedImages={selectedImages}
            removeImage={handleRemovePhoto}
            addImage={pickImage}
          />

          <ContactDetailsSection
            userName={user?.name}
            email={carDetails.email}
            contactNumber={carDetails.contactNumber}
            hidePhoneNumber={hidePhoneNumber}
            handleInputChange={handleInputChange}
            setHidePhoneNumber={setHidePhoneNumber}
          />

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
  authGuardContainer: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + '10', // Light primary background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  authGuardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  authGuardMessage: {
    fontSize: 16,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  authButtonGroup: {
    flexDirection: 'row',
    width: '100%',
  },
  authButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
