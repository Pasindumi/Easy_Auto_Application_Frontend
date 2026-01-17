import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
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
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/utils/api';

export default function SellCarScreen() {
  // Protect this route - require authentication
  useProtectedRoute();

  const router = useRouter();
  const params = useLocalSearchParams();
  const initialVehicleType = params.vehicleType as string || 'Car';
  const initialVehicleTypeId = params.vehicleTypeId as string || '';
  const { user, accessToken, isAuthenticated } = useAuth();

  // State to track active vehicle type ID (can change on edit load)
  const [activeVehicleTypeId, setActiveVehicleTypeId] = useState(initialVehicleTypeId);
  const [vehicleType, setVehicleType] = useState(initialVehicleType);

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
    vehicle_type: initialVehicleType,
    vehicle_type_id: initialVehicleTypeId,
    dynamicAttributes: [],
    status: 'DRAFT'
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [hidePhoneNumber, setHidePhoneNumber] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for pricing logic
  const [freeImageCount, setFreeImageCount] = useState(5); // Default to 5

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      if (!activeVehicleTypeId) return;
      try {
        const [brandsRes, attrsRes, modelsRes, conditionsRes, rulesRes] = await Promise.all([
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.BRANDS}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.ATTRIBUTES}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.MODELS}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.CONDITIONS}/${activeVehicleTypeId}`),
          // Fetch all rules and filter locally (assuming lightweight)
          // Adjust endpoint if you have a specific backend URL for public rules
          fetch(`${ENDPOINTS.PRICING}/rules`)
        ]);

        if (!brandsRes.ok || !attrsRes.ok || !modelsRes.ok || !conditionsRes.ok) {
          throw new Error("One or more requests failed");
        }

        const brandsData = await brandsRes.json();
        const attrsData = await attrsRes.json();
        const modelsData = await modelsRes.json();
        const conditionsData = await conditionsRes.json();

        // Handle Rules
        if (rulesRes.ok) {
          const rulesData = await rulesRes.json();
          if (Array.isArray(rulesData)) {
            // Find rule for this vehicle type (PER_AD)
            const typeRule = rulesData.find((r: any) => r.vehicle_type_id === activeVehicleTypeId && r.unit === 'PER_AD');
            const defaultRule = rulesData.find((r: any) => !r.vehicle_type_id && r.unit === 'PER_AD');

            const activeRule = typeRule || defaultRule;
            if (activeRule && activeRule.free_image_count !== undefined) {
              setFreeImageCount(activeRule.free_image_count);
            }
          }
        }

        if (Array.isArray(brandsData)) setBrands(brandsData);
        if (Array.isArray(attrsData)) setAttributes(attrsData);
        if (Array.isArray(modelsData)) setModels(modelsData);
        if (Array.isArray(conditionsData)) setConditions(conditionsData);

      } catch (error) {
        console.error("Error fetching vehicle config:", error);
      }
    };
    fetchData();
  }, [activeVehicleTypeId]);

  // Fetch Existing Ad for Edit Mode
  useEffect(() => {
    const fetchExistingAd = async () => {
      const adId = params.id as string;
      if (!adId || !params.edit) return;

      // Wait for config to be loaded before populating form
      // We need brands, models etc to be available to strict match values
      if (brands.length === 0 && activeVehicleTypeId) {
        // If config isn't loaded yet but we have an ID, we might need to wait or rely on the next render
        // However, since fetching config depends on ID, let's proceed and try to match if possible
      }

      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.CARS}/${adId}`); // Using fetch directly here for GET is fine, or switch to api.get
        const data = await response.json();

        if (data.success) {
          const ad = data.data;
          const details = ad.CarDetails?.[0] || ad.CarDetails || {};

          // Update active type ID to trigger config fetch
          if (ad.vehicle_type_id && ad.vehicle_type_id !== activeVehicleTypeId) {
            setActiveVehicleTypeId(ad.vehicle_type_id);
          }
          if (ad.vehicle_type?.type_name) setVehicleType(ad.vehicle_type.type_name);

          // NORMALIZE VALUES TO MATCH DROPDOWN OPTIONS EXACTLY

          // 1. Normalize Brand
          let normalizedBrand = details.brand || '';
          if (normalizedBrand && brands.length > 0) {
            const matchedBrand = brands.find(b => String(b.brand_name).toLowerCase().trim() === String(normalizedBrand).toLowerCase().trim());
            if (matchedBrand) normalizedBrand = matchedBrand.brand_name;
          }

          // 2. Normalize Model
          let normalizedModel = details.model || '';
          // Note: models array might not be filtered by brand yet in state, but it contains all models for the type?
          // Actually models fetching depends on vehicleTypeId, so it should have all models for that type.
          if (normalizedModel && models.length > 0) {
            const matchedModel = models.find(m => String(m.model_name).toLowerCase().trim() === String(normalizedModel).toLowerCase().trim());
            if (matchedModel) normalizedModel = matchedModel.model_name;
          }

          // 3. Normalize Condition
          let normalizedCondition = details.condition || '';
          if (normalizedCondition && conditions.length > 0) {
            const matchedCondition = conditions.find(c => String(c.condition_name).toLowerCase().trim() === String(normalizedCondition).toLowerCase().trim());
            if (matchedCondition) normalizedCondition = matchedCondition.condition_name;
          }

          setCarDetails({
            title: ad.title || '',
            brand: normalizedBrand,
            model: normalizedModel,
            year: String(details.year || ''), // Ensure string
            condition: normalizedCondition,
            mileage: String(details.mileage || ''), // Ensure string
            fuelType: details.fuel_type || '',
            transmission: details.transmission || '',
            engineCapacity: String(details.engine_capacity || ''), // Ensure string
            bodyType: details.body_type || '',
            price: ad.price?.toString() || '',
            description: ad.description || '',
            contactNumber: ad.users?.phone || '',
            email: ad.users?.email || '',
            location: ad.location || '',
            negotiable: ad.negotiable || false,
            vehicle_type: ad.vehicle_type?.type_name || initialVehicleType,
            vehicle_type_id: ad.vehicle_type_id || initialVehicleTypeId,
            dynamicAttributes: ad.attributes?.map((attr: any) => ({
              attribute_id: attr.attribute?.id,
              value: String(attr.value) // Ensure value is string
            })) || [],
            status: ad.status
          });

          if (ad.AdImage) {
            setSelectedImages(ad.AdImage.map((img: any) => img.image_url));
          }
        }
      } catch (error) {
        console.error("Error fetching ad for edit:", error);
        Alert.alert("Error", "Failed to load existing ad details.");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingAd();
  }, [params.id, params.edit, brands.length, models.length, conditions.length]); // Add dependencies to re-run when config loads!

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
    // Removed strict limit check to allow extra images
    // if (selectedImages.length >= freeImageCount) { ... }

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

  const handleViewPackages = () => {
    router.push('/packages/packages');
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

      const isEdit = !!(params.id && params.edit);
      const formData = new FormData();

      // Append standard fields - ENSURE EVERYTHING IS A STRING
      formData.append('title', carDetails.title);
      formData.append('price', String(carDetails.price));
      formData.append('location', carDetails.location);
      formData.append('description', carDetails.description || '');
      formData.append('seller_id', user?.id || 'guest');
      formData.append('vehicle_type_id', activeVehicleTypeId);
      formData.append('status', (isEdit ? carDetails.status : 'DRAFT') || 'DRAFT');

      // Static Details - ENSURE STRINGS
      formData.append('condition', carDetails.condition);
      formData.append('brand', carDetails.brand);
      formData.append('model', carDetails.model);
      formData.append('year', String(carDetails.year));
      formData.append('mileage', String(carDetails.mileage));
      formData.append('engineCapacity', String(carDetails.engineCapacity));
      formData.append('fuelType', carDetails.fuelType);
      formData.append('transmission', carDetails.transmission);
      formData.append('bodyType', carDetails.bodyType || '');
      formData.append('negotiable', String(carDetails.negotiable));

      // Dynamic Attributes (Stringified for backend parsing)
      if (carDetails.dynamicAttributes) {
        formData.append('dynamicAttributes', JSON.stringify(carDetails.dynamicAttributes));
      }

      // Images
      selectedImages.forEach((uri, index) => {
        if (uri.startsWith('http')) {
          // Existing image URL - append as string
          formData.append('images', uri);
        } else {
          // New local file
          const filename = uri.split('/').pop() || `image_${index}.jpg`;
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image/jpeg`;

          // @ts-ignore - FormData handles {uri, name, type} in RN
          formData.append('images', {
            uri,
            name: filename,
            type: type,
          });
        }
      });

      const endpoint = isEdit ? `/api/cars/${params.id}` : '/api/cars';
      let response;

      if (isEdit) {
        response = await api.put<{ success: boolean; data: any; message?: string }>(endpoint, formData);
      } else {
        response = await api.post<{ success: boolean; data: any; message?: string }>(endpoint, formData);
      }

      if (response.success) {
        Alert.alert("Success", isEdit ? "Your ad has been updated!" : "Your ad has been saved as a draft!");
        const adId = isEdit ? params.id : response.data.id;
        router.replace({
          pathname: '/cars/review',
          params: { id: adId }
        });
      } else {
        Alert.alert("Error", response.message || "Failed to submit ad");
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to submit ad. Please try again.");
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
            freeImageCount={freeImageCount}
            onViewPackages={handleViewPackages}
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
