import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import COLORS from "@/constants/Colors";
import { useToast } from '@/contexts/ToastContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image as RNImage,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useIsFocused } from '@react-navigation/native';
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
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const isFocused = useIsFocused();
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
  const [descriptionLimit, setDescriptionLimit] = useState(500); // Default to 500
  const [unlimitedImages, setUnlimitedImages] = useState(false);
  const [unlimitedDescription, setUnlimitedDescription] = useState(false);
  const [packageLimits, setPackageLimits] = useState<any>(null); // Store full package info
  const [activePackageName, setActivePackageName] = useState<string | null>(null);
  const [extraImagePrice, setExtraImagePrice] = useState(0);
  const [extraLetterPrice, setExtraLetterPrice] = useState(0);

  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, title: 'Basic Info', icon: 'information-circle' },
    { id: 2, title: 'Details', icon: 'car' },
    { id: 3, title: 'Photos', icon: 'camera' },
    { id: 4, title: 'Contact', icon: 'person' }
  ];

  // Fetch Logic
  useEffect(() => {
    const fetchData = async () => {
      let finalImgLimit = 5; // Default Base
      let finalDescLimit = 500; // Default Base
      let extraImg = 0;
      let extraDesc = 0;
      let activePkgId: string | null = null;
      let pkgConfig: any = null;

      // 1. Fetch Active Package
      try {
        const pkgRes = await api.get<{ success: boolean; data: { hasForcedPackage: boolean; limits: any[]; includedItems: any[]; config: any; package?: any } }>('/api/pricing/active-package');

        if (pkgRes.success && pkgRes.data && pkgRes.data.hasForcedPackage) {
          setPackageLimits(pkgRes.data);
          activePkgId = pkgRes.data.package?.id;
          pkgConfig = pkgRes.data.config;

          if (pkgRes.data.package?.name) {
            setActivePackageName(pkgRes.data.package.name);
          }

          // A. Process Included Items (Add-ons)
          if (pkgRes.data.includedItems && Array.isArray(pkgRes.data.includedItems)) {
            pkgRes.data.includedItems.forEach((item: any) => {
              const iCode = item.price_items?.code || '';
              const iName = item.price_items?.name || '';

              const isImageItem = iCode.includes('IMG') || iCode.includes('PHOTO') || iCode === 'IMAGE' || iName.toLowerCase().includes('image') || iName.toLowerCase().includes('photo');
              const isLetterItem = iCode.includes('LTR') || iCode.includes('DESC') || iCode === 'LETTER' || iName.toLowerCase().includes('letter') || iName.toLowerCase().includes('description');

              if (isImageItem) {
                if (item.is_unlimited) extraImg += 100; else extraImg += (item.quantity || 0);
              }
              if (isLetterItem) {
                if (item.is_unlimited) extraDesc += 100000; else extraDesc += (item.quantity || 0);
              }
            });
          }
        }
      } catch (e) {
        console.log("No active package or error fetching package", e);
      }

      // 2. Fetch Config & Rules
      if (!activeVehicleTypeId) return;
      try {
        const [brandsRes, attrsRes, modelsRes, conditionsRes, rulesRes] = await Promise.all([
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.BRANDS}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.ATTRIBUTES}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.MODELS}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.VEHICLE_CONFIG.CONDITIONS}/${activeVehicleTypeId}`),
          fetch(`${ENDPOINTS.PRICING}/rules`)
        ]);

        if (!brandsRes.ok || !attrsRes.ok || !modelsRes.ok || !conditionsRes.ok) throw new Error("Config request failed");

        // B. Determine Base Limits from Rules
        if (rulesRes.ok) {
          const rulesData = await rulesRes.json();
          if (Array.isArray(rulesData)) {
            let activeRule = null;

            // Priority 1: Package Specific Rule (If user has package)
            if (activePkgId) {
              // Try finding rule for this package & this vehicle type
              activeRule = rulesData.find((r: any) => r.price_item_id === activePkgId && r.vehicle_type_id === activeVehicleTypeId);
              // Fallback: Rule for this package (any vehicle type)
              if (!activeRule) activeRule = rulesData.find((r: any) => r.price_item_id === activePkgId && !r.vehicle_type_id);
            }

            // Priority 2: Global Rule (If no package rule found)
            if (!activeRule) {
              // Look for a rule for this vehicle type that is a Standard Advertisement (item_type === 'AD')
              // EXCLUDE special extra items (EX_IMG, EXT_LTR) to prevent conflict if they are mislabeled as AD
              activeRule = rulesData.find((r: any) =>
                r.vehicle_type_id === activeVehicleTypeId &&
                r.unit === 'PER_AD' &&
                r.price_items?.item_type === 'AD' &&
                !['EX_IMG', 'EXT_LTR', 'BOOST'].includes(r.price_items?.code)
              );
            }
            if (!activeRule) {
              // Fallback: Generic Rule for All Types
              activeRule = rulesData.find((r: any) =>
                !r.vehicle_type_id &&
                r.unit === 'PER_AD' &&
                r.price_items?.item_type === 'AD' &&
                !['EX_IMG', 'EXT_LTR', 'BOOST'].includes(r.price_items?.code)
              );
            }

            // Apply Rule Limits
            if (activeRule) {
              if (activeRule.free_image_count !== undefined) finalImgLimit = activeRule.free_image_count;
              if (activeRule.description_limit !== undefined) finalDescLimit = activeRule.description_limit;
            }

            // Find Extra Prices (EX_IMG and EXT_LTR)
            const exImgRule = rulesData.find((r: any) =>
              (r.vehicle_type_id === activeVehicleTypeId || !r.vehicle_type_id) &&
              r.price_items?.code === 'EX_IMG'
            );
            if (exImgRule) setExtraImagePrice(parseFloat(exImgRule.price));

            const extLtrRule = rulesData.find((r: any) =>
              (r.vehicle_type_id === activeVehicleTypeId || !r.vehicle_type_id) &&
              r.price_items?.code === 'EXT_LTR'
            );
            if (extLtrRule) setExtraLetterPrice(parseFloat(extLtrRule.price));
          }
        }

        // C. Apply Config Overrides (Strongest)
        if (pkgConfig) {
          if (pkgConfig.DESCRIPTION_LIMIT) {
            const val = pkgConfig.DESCRIPTION_LIMIT;
            finalDescLimit = (String(val).toLowerCase() === 'unlimited') ? 100000 : (parseInt(val) || finalDescLimit);
          }
          if (pkgConfig.IMAGE_LIMIT) {
            const val = pkgConfig.IMAGE_LIMIT;
            finalImgLimit = (String(val).toLowerCase() === 'unlimited') ? 100 : (parseInt(val) || finalImgLimit);
          }
        }

        // D. Final Calculation (Base + Extras)
        const totalImgLimit = finalImgLimit + extraImg;
        const totalDescLimit = finalDescLimit + extraDesc;

        setFreeImageCount(totalImgLimit);
        setDescriptionLimit(totalDescLimit);

        // Determine unlimited status based on high values (from included items logic above)
        // or explicitly from checking if we added the "unlimited" buffer
        setUnlimitedImages(totalImgLimit >= 100);
        setUnlimitedDescription(totalDescLimit >= 10000);

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
      }
    };
    if (isFocused) {
      fetchData();
    }
  }, [activeVehicleTypeId, isFocused]);

  // Fetch Existing Ad for Edit Mode
  useEffect(() => {
    const fetchExistingAd = async () => {
      const adId = params.id as string;
      if (!adId || !params.edit) return;

      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.CARS}/${adId}`);
        const data = await response.json();

        if (data.success) {
          const ad = data.data;
          const details = ad.CarDetails?.[0] || ad.CarDetails || {};

          if (ad.vehicle_type_id && ad.vehicle_type_id !== activeVehicleTypeId) {
            setActiveVehicleTypeId(ad.vehicle_type_id);
          }
          if (ad.vehicle_type?.type_name) setVehicleType(ad.vehicle_type.type_name);

          let normalizedBrand = details.brand || '';
          if (normalizedBrand && brands.length > 0) {
            const matchedBrand = brands.find(b => String(b.brand_name).toLowerCase().trim() === String(normalizedBrand).toLowerCase().trim());
            if (matchedBrand) normalizedBrand = matchedBrand.brand_name;
          }

          let normalizedModel = details.model || '';
          if (normalizedModel && models.length > 0) {
            const matchedModel = models.find(m => String(m.model_name).toLowerCase().trim() === String(normalizedModel).toLowerCase().trim());
            if (matchedModel) normalizedModel = matchedModel.model_name;
          }

          let normalizedCondition = details.condition || '';
          if (normalizedCondition && conditions.length > 0) {
            const matchedCondition = conditions.find(c => String(c.condition_name).toLowerCase().trim() === String(normalizedCondition).toLowerCase().trim());
            if (matchedCondition) normalizedCondition = matchedCondition.condition_name;
          }

          setCarDetails({
            title: ad.title || '',
            brand: normalizedBrand,
            model: normalizedModel,
            year: String(details.year || ''),
            condition: normalizedCondition,
            mileage: String(details.mileage || ''),
            fuelType: details.fuel_type || '',
            transmission: details.transmission || '',
            engineCapacity: String(details.engine_capacity || ''),
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
              value: String(attr.value)
            })) || [],
            status: ad.status
          });

          if (ad.AdImage) {
            setSelectedImages(ad.AdImage.map((img: any) => img.image_url));
          }
        }
      } catch (error) {
        console.error("Error fetching ad for edit:", error);
        showToast({ message: "Failed to load existing ad details.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchExistingAd();
  }, [params.id, params.edit, brands.length, models.length, conditions.length]);

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
    // Strict limit check
    if (selectedImages.length >= freeImageCount) {
      showToast({ message: `Limit Reached: You can only upload up to ${freeImageCount} images.`, type: "info" });
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

  const handleViewPackages = () => {
    router.push('/packages/packages');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate Inputs
      if (!carDetails.title || !carDetails.price || !carDetails.brand) {
        showToast({ title: "Incomplete Form", message: "Missing Fields: Please fill in Title, Brand, and Price.", type: "error" });
        setLoading(false);
        return;
      }

      // Check required dynamic attributes
      const missingRequired = attributes.filter(attr => attr.is_required).find(attr => {
        const val = carDetails.dynamicAttributes?.find(a => a.attribute_id === attr.id)?.value;
        return val === undefined || val === '' || val === null;
      });

      if (missingRequired) {
        showToast({ title: "Missing Detail", message: `Please fill in ${missingRequired.attribute_name}`, type: "error" });
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
        showToast({
          title: isEdit ? "Update Successful" : "Ad Saved",
          message: isEdit ? "Your ad has been updated successfully!" : "Your ad has been saved as a draft!",
          type: "success"
        });
        const adId = isEdit ? params.id : response.data.id;
        router.replace({
          pathname: '/cars/review',
          params: { id: adId }
        });
      } else {
        showToast({ title: "Submission Failed", message: response.message || "Failed to submit ad", type: "error" });
      }

    } catch (error) {
      console.error(error);
      showToast({ title: "Error", message: "Failed to submit ad. Please try again.", type: "error" });
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
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />
      {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primary]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="white" />
          </TouchableOpacity>

          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitleText}>Post Your Ad</Text>
          </View>

          <View pointerEvents="none" style={styles.headerLogoContainer}>
            <RNImage
              source={require("@/assets/logoHome.png")}
              resizeMode="contain"
              style={styles.logoImg}
            />
          </View>
        </View>
      </LinearGradient>

      {loading && <Loading fullScreen={true} message="Processing..." />}

      <View style={styles.stepperContainer}>
        {steps.map((step, index) => (
          <View key={step.id} style={styles.stepWrapper}>
            <TouchableOpacity
              style={[styles.stepCircle, currentStep >= step.id ? styles.stepCircleActive : null]}
              onPress={() => setCurrentStep(step.id)}
            >
              <Ionicons name={step.icon as any} size={18} color={currentStep >= step.id ? '#FFF' : '#94A3B8'} />
            </TouchableOpacity>
            <Text style={[styles.stepText, currentStep >= step.id ? styles.stepTextActive : null]}>{step.title}</Text>
            {index < steps.length - 1 && (
              <View style={[styles.stepLine, currentStep > step.id ? styles.stepLineActive : null]} />
            )}
          </View>
        ))}
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
          {currentStep === 1 && (
            <BasicInformationSection
              carDetails={carDetails}
              handleInputChange={handleInputChange}
              descriptionLimit={descriptionLimit}
              extraLetterPrice={extraLetterPrice}
              isUnlimited={unlimitedDescription}
            />
          )}

          {currentStep === 2 && (
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
          )}

          {currentStep === 3 && (
            <PhotoUploadSection
              selectedImages={selectedImages}
              removeImage={handleRemovePhoto}
              addImage={pickImage}
              freeImageCount={freeImageCount}
              onViewPackages={handleViewPackages}
              extraImagePrice={extraImagePrice}
              isUnlimited={unlimitedImages}
              activePackageName={activePackageName}
            />
          )}

          {currentStep === 4 && (
            <>
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
            </>
          )}

          <View style={styles.stepNavigation}>
            {currentStep > 1 && (
              <TouchableOpacity style={styles.stepBackBtn} onPress={() => setCurrentStep(currentStep - 1)}>
                <Text style={styles.stepBackText}>Back</Text>
              </TouchableOpacity>
            )}
            <View style={{ flex: 1 }} />
            {currentStep < 4 ? (
              <TouchableOpacity style={styles.stepNextBtn} onPress={() => setCurrentStep(currentStep + 1)}>
                <Text style={styles.stepNextText}>Next Step</Text>
                <Ionicons name="arrow-forward" size={16} color="white" />
              </TouchableOpacity>
            ) : null}
          </View>
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
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 100,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerLogoContainer: {
    width: 100,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  logoImg: {
    width: 100,
    height: 24,
  },
  headerTitleArea: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 8,
  },
  headerTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    zIndex: 50,
  },
  stepWrapper: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  stepCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6, zIndex: 2,
    borderWidth: 2, borderColor: '#FFF',
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  stepText: { fontSize: 10, color: '#94A3B8', fontWeight: '600' },
  stepTextActive: { color: COLORS.primary, fontWeight: '800' },
  stepLine: {
    position: 'absolute', top: 16, left: '60%', right: '-40%', height: 3,
    backgroundColor: '#F1F5F9', zIndex: 1, borderRadius: 2,
  },
  stepLineActive: { backgroundColor: COLORS.primary },
  stepNavigation: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingHorizontal: 16, paddingBottom: 20
  },
  stepBackBtn: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: 'white' },
  stepBackText: { color: '#64748B', fontWeight: '700', fontSize: 14 },
  stepNextBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  stepNextText: { color: 'white', fontWeight: '800', fontSize: 14 },
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
