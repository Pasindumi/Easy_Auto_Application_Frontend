import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
} from 'react-native';
import Loading from '@/components/ui/Loading';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Header from "@/components/Header";
import COLORS from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { ENDPOINTS } from '@/constants/API';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

// Sections
import BasicInformationSection from '../../components/cars/sell/BasicInformationSection';
import CarDetailsSection from '../../components/cars/sell/CarDetailsSection';
import PhotoUploadSection from '../../components/cars/sell/PhotoUploadSection';
import ContactDetailsSection from '../../components/cars/sell/ContactDetailsSection';
import SubmitSection from '../../components/cars/sell/SubmitSection';

// Rental Sections
import RentalPricingSection from '../../components/cars/rental/RentalPricingSection';
import RentalConditionsSection from '../../components/cars/rental/RentalConditionsSection';
import RentalDocumentSection from '../../components/cars/rental/RentalDocumentSection';
import RentalCalendarSection from '../../components/cars/rental/RentalCalendarSection';

export default function CreateRentalAdScreen() {
    useProtectedRoute();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { user, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);
    const [configLoading, setConfigLoading] = useState(false);

    // Initial vehicle type
    const [vehicleType, setVehicleType] = useState((params.vehicleType as string) || '');
    const [vehicleTypeId, setVehicleTypeId] = useState((params.vehicleTypeId as string) || '');

    // Form State
    const [carDetails, setCarDetails] = useState({
        title: '',
        description: '',
        brand: '',
        model: '',
        year: '',
        condition: '', // Used/New/etc
        mileage: '',
        fuelType: '',
        transmission: '',
        engineCapacity: '',
        bodyType: '',
        location: '',
        price: '0', // Base price placeholder
        contactNumber: '',
        email: '',
        negotiable: false,
        dynamicAttributes: [] as any[]
    });

    const [rentalPricing, setRentalPricing] = useState({
        pricePerDay: '',
        pricePerWeek: '',
        pricePerMonth: '',
        extraMileageFee: '',
        securityDeposit: ''
    });

    const [rentalConditions, setRentalConditions] = useState({
        minAge: '21',
        mileageLimit: '100',
        allowSmoking: false,
        allowPets: false,
        reqDeposit: true,
        otherConditions: ''
    });

    const [rentalDocuments, setRentalDocuments] = useState({
        idType: 'NIC',
        idFrontUrl: '',
        idBackUrl: '',
        ownershipUrl: ''
    });

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [availability, setAvailability] = useState([]);

    // Config Data
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [attributes, setAttributes] = useState([]);

    // 1. Fetch Vehicle Configuration (same as sell-car)
    useEffect(() => {
        const fetchInitialConfig = async () => {
            // If already passed from select-type, don't fetch default
            if (params.vehicleTypeId) return;

            try {
                // Get all types and pick first/Car if none passed
                const typesRes = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES);
                const types = await typesRes.json();
                const carType = types.find((t: any) => t.type_name === 'Car') || types[0];

                if (carType) {
                    setVehicleType(carType.type_name);
                    setVehicleTypeId(carType.id);
                }
            } catch (error) {
                console.error("Error fetching vehicle types:", error);
            }
        };

        if (isAuthenticated) {
            fetchInitialConfig();
        }
    }, [isAuthenticated, params.vehicleTypeId]);

    useEffect(() => {
        if (!vehicleTypeId) return;

        const fetchConfig = async () => {
            setConfigLoading(true);
            try {
                const [brandsRes, attrsRes, modelsRes, conditionsRes] = await Promise.all([
                    fetch(`${ENDPOINTS.VEHICLE_CONFIG.BRANDS}/${vehicleTypeId}`),
                    fetch(`${ENDPOINTS.VEHICLE_CONFIG.ATTRIBUTES}/${vehicleTypeId}`),
                    fetch(`${ENDPOINTS.VEHICLE_CONFIG.MODELS}/${vehicleTypeId}`),
                    fetch(`${ENDPOINTS.VEHICLE_CONFIG.CONDITIONS}/${vehicleTypeId}`)
                ]);

                setBrands(await brandsRes.json());
                setAttributes(await attrsRes.json());
                setModels(await modelsRes.json());
                setConditions(await conditionsRes.json());
            } catch (error) {
                console.error("Error fetching config:", error);
            } finally {
                setConfigLoading(false);
            }
        };

        fetchConfig();
    }, [vehicleTypeId]);

    // Handlers
    const handleCarInputChange = (field: string, value: any) => {
        setCarDetails(prev => ({ ...prev, [field]: value }));
    };

    const handlePricingChange = (field: string, value: string) => {
        setRentalPricing(prev => ({ ...prev, [field]: value }));
        if (field === 'pricePerDay') {
            handleCarInputChange('price', value); // Map main price to daily price for generic components
        }
    };

    const handleConditionsChange = (field: string, value: any) => {
        setRentalConditions(prev => ({ ...prev, [field]: value }));
    };

    const handleDynamicAttributeChange = (attrId: string, value: any) => {
        setCarDetails(prev => {
            const currentAttrs = prev.dynamicAttributes || [];
            const existingIndex = currentAttrs.findIndex((a: any) => a.attribute_id === attrId);
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
        if (selectedImages.length >= 10) {
            Alert.alert("Limit Reached", "You can upload up to 10 photos.");
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

    const pickDocument = async (type: 'idFront' | 'idBack' | 'ownership') => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.7,
        });
        if (!result.canceled) {
            setRentalDocuments(prev => ({ ...prev, [`${type}Url`]: result.assets[0].uri }));
        }
    };

    const removeDocument = (type: 'idFront' | 'idBack' | 'ownership') => {
        setRentalDocuments(prev => ({ ...prev, [`${type}Url`]: '' }));
    };

    const handleSubmit = async () => {
        if (!carDetails.title || !rentalPricing.pricePerDay || !carDetails.brand) {
            Alert.alert("Missing Fields", "Please enter Ad Title, Brand, and Daily Price.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            // 1. Basic Car Data
            formData.append('title', carDetails.title);
            formData.append('description', carDetails.description);
            formData.append('location', carDetails.location);
            formData.append('seller_id', user?.id || '');
            formData.append('vehicle_type_id', vehicleTypeId);
            formData.append('status', 'PENDING_PAYMENT');

            // 2. Car Details (Static)
            formData.append('brand', carDetails.brand);
            formData.append('model', carDetails.model);
            formData.append('year', carDetails.year);
            formData.append('condition', carDetails.condition);
            formData.append('mileage', carDetails.mileage);
            formData.append('fuel_type', carDetails.fuelType);
            formData.append('transmission', carDetails.transmission);
            formData.append('engine_capacity', carDetails.engineCapacity);
            formData.append('body_type', carDetails.bodyType);
            formData.append('dynamicAttributes', JSON.stringify(carDetails.dynamicAttributes));

            // 3. Rental Specific Data
            formData.append('price_per_day', rentalPricing.pricePerDay);
            formData.append('price_per_week', rentalPricing.pricePerWeek || '');
            formData.append('price_per_month', rentalPricing.pricePerMonth || '');
            formData.append('extra_mileage_fee', rentalPricing.extraMileageFee || '');
            formData.append('security_deposit', rentalPricing.securityDeposit || '');

            formData.append('min_age', rentalConditions.minAge);
            formData.append('daily_mileage_limit', rentalConditions.mileageLimit);
            formData.append('allow_smoking', String(rentalConditions.allowSmoking));
            formData.append('allow_pets', String(rentalConditions.allowPets));
            formData.append('req_deposit', String(rentalConditions.reqDeposit));
            formData.append('other_conditions', rentalConditions.otherConditions);

            // 4. Photos
            selectedImages.forEach((uri, index) => {
                const filename = uri.split('/').pop() || `photo_${index}.jpg`;
                const type = `image/${filename.split('.').pop() || 'jpeg'}`;
                // @ts-ignore
                formData.append('images', { uri, name: filename, type });
            });

            // 5. Documents
            if (rentalDocuments.idFrontUrl) {
                // @ts-ignore
                formData.append('doc_id_front', { uri: rentalDocuments.idFrontUrl, name: 'id_front.jpg', type: 'image/jpeg' });
            }
            if (rentalDocuments.idBackUrl) {
                // @ts-ignore
                formData.append('doc_id_back', { uri: rentalDocuments.idBackUrl, name: 'id_back.jpg', type: 'image/jpeg' });
            }
            if (rentalDocuments.ownershipUrl) {
                // @ts-ignore
                formData.append('doc_ownership', { uri: rentalDocuments.ownershipUrl, name: 'ownership.jpg', type: 'image/jpeg' });
            }

            const response = await api.post<{ success: boolean; data: any; message?: string }>('/api/rentals', formData);

            if (response.success) {
                Alert.alert("Success", "Rental ad created. Please proceed to payment to publish.");
                // Route to a payment screen or review screen
                router.replace({
                    pathname: '/payments/payment-methods', // Sample route
                    params: { rentalAdId: response.data.id, amount: rentalPricing.pricePerDay } // Placeholder price logic
                });
            } else {
                Alert.alert("Error", response.message || "Failed to create rental ad.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            Alert.alert("Error", "Something went wrong. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Create Rental Ad" />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerBox}>
                        <Text style={styles.headerTitle}>Vehicle Details</Text>
                        <Text style={styles.headerSubtitle}>Tell us about your {vehicleType}</Text>
                    </View>

                    <BasicInformationSection
                        carDetails={carDetails}
                        handleInputChange={handleCarInputChange}
                        descriptionLimit={1000}
                    />

                    <CarDetailsSection
                        carDetails={carDetails}
                        handleInputChange={handleCarInputChange}
                        vehicleType={vehicleType}
                        brands={brands}
                        models={models}
                        conditions={conditions}
                        attributes={attributes}
                        handleDynamicAttributeChange={handleDynamicAttributeChange}
                    />

                    <RentalPricingSection
                        pricing={rentalPricing}
                        handleInputChange={handlePricingChange}
                    />

                    <RentalConditionsSection
                        conditions={rentalConditions}
                        handleInputChange={handleConditionsChange}
                    />

                    <PhotoUploadSection
                        selectedImages={selectedImages}
                        removeImage={(index) => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                        addImage={pickImage}
                        freeImageCount={10}
                        onViewPackages={() => { }}
                    />

                    <RentalDocumentSection
                        documents={rentalDocuments}
                        pickDocument={pickDocument}
                        removeDocument={removeDocument}
                    />

                    <RentalCalendarSection
                        availability={availability}
                        handleAvailabilityUpdate={setAvailability}
                    />

                    <ContactDetailsSection
                        userName={user?.name}
                        email={user?.email || ''}
                        contactNumber={carDetails.location} // Use location or add state for contact if needed
                        hidePhoneNumber={false}
                        handleInputChange={handleCarInputChange}
                        setHidePhoneNumber={() => { }}
                    />

                    <SubmitSection
                        onSubmit={handleSubmit}
                    />

                    {loading && (
                        <Loading fullScreen message="Creating your Ad..." />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    headerBox: {
        padding: 20,
        backgroundColor: COLORS.white,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text?.primary || '#333',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    overlayText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    }
});
