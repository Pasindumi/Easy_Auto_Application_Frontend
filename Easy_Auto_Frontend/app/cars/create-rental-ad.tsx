import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Text,
    ActivityIndicator,
    Image as RNImage,
    TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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
    const insets = useSafeAreaInsets();
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
        hidePhoneNumber: false,
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

    const [currentStep, setCurrentStep] = useState(1);
    const steps = [
        { id: 1, title: 'Intro', icon: 'information-circle' },
        { id: 2, title: 'Vehicle', icon: 'car' },
        { id: 3, title: 'Pricing', icon: 'cash' },
        { id: 4, title: 'Media', icon: 'camera' },
        { id: 5, title: 'Finish', icon: 'calendar' }
    ];

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

    // 3. Fetch Existing Ad Data (if editing)
    useEffect(() => {
        if (!params.id || !isAuthenticated) return;

        const fetchAdData = async () => {
            setLoading(true);
            try {
                const response = await api.get<{ success: boolean; data: any }>(`/api/rentals/${params.id}`);
                if (response.success) {
                    const ad = response.data;
                    const details = ad.details?.[0] || ad.details || {};

                    setCarDetails({
                        title: ad.title || '',
                        description: ad.description || '',
                        brand: details.brand || '',
                        model: details.model || '',
                        year: String(details.year || ''),
                        condition: details.condition || '',
                        mileage: String(details.mileage || ''),
                        fuelType: details.fuel_type || '',
                        transmission: details.transmission || '',
                        engineCapacity: String(details.engine_capacity || ''),
                        bodyType: details.body_type || '',
                        location: ad.location || '',
                        price: String(ad.price_per_day || '0'),
                        contactNumber: ad.users?.phone || '',
                        email: ad.users?.email || '',
                        negotiable: ad.negotiable || false,
                        hidePhoneNumber: ad.hide_phone_number || false,
                        dynamicAttributes: ad.attributes || []
                    });

                    setRentalPricing({
                        pricePerDay: String(ad.price_per_day || ''),
                        pricePerWeek: String(ad.price_per_week || ''),
                        pricePerMonth: String(ad.price_per_month || ''),
                        extraMileageFee: String(ad.extra_mileage_fee || ''),
                        securityDeposit: String(ad.security_deposit || '')
                    });

                    setRentalConditions({
                        minAge: String(ad.min_age || '21'),
                        mileageLimit: String(ad.daily_mileage_limit || '100'),
                        allowSmoking: ad.allow_smoking || false,
                        allowPets: ad.allow_pets || false,
                        reqDeposit: ad.req_deposit || true,
                        other_conditions: ad.other_conditions || ''
                    });

                    setRentalDocuments({
                        idType: ad.documents?.[0]?.document_type || 'NIC',
                        idFrontUrl: ad.documents?.find((d: any) => d.document_type === 'ID Front')?.document_url || '',
                        idBackUrl: ad.documents?.find((d: any) => d.document_type === 'ID Back')?.document_url || '',
                        ownershipUrl: ad.documents?.find((d: any) => d.document_type === 'Ownership Document')?.document_url || ''
                    });

                    setSelectedImages(ad.images?.map((img: any) => img.image_url) || []);

                    if (ad.vehicle_type_id) {
                        setVehicleTypeId(ad.vehicle_type_id);
                        setVehicleType(ad.vehicle_type?.type_name || '');
                    }
                }
            } catch (error) {
                console.error("Error fetching ad for edit:", error);
                Alert.alert("Error", "Could not load ad data for editing.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdData();
    }, [params.id, isAuthenticated]);

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
            const newImages = selectedImages.filter(uri => uri.startsWith('file://') || uri.startsWith('content://'));
            const existingImages = selectedImages.filter(uri => uri.startsWith('http'));

            newImages.forEach((uri, index) => {
                const filename = uri.split('/').pop() || `photo_${index}.jpg`;
                const type = `image/${filename.split('.').pop() || 'jpeg'}`;
                // @ts-ignore
                formData.append('images', { uri, name: filename, type });
            });

            formData.append('existing_images', JSON.stringify(existingImages));

            // 5. Documents (only append if they are new local URIs)
            if (rentalDocuments.idFrontUrl && !rentalDocuments.idFrontUrl.startsWith('http')) {
                // @ts-ignore
                formData.append('doc_id_front', { uri: rentalDocuments.idFrontUrl, name: 'id_front.jpg', type: 'image/jpeg' });
            }
            if (rentalDocuments.idBackUrl && !rentalDocuments.idBackUrl.startsWith('http')) {
                // @ts-ignore
                formData.append('doc_id_back', { uri: rentalDocuments.idBackUrl, name: 'id_back.jpg', type: 'image/jpeg' });
            }
            if (rentalDocuments.ownershipUrl && !rentalDocuments.ownershipUrl.startsWith('http')) {
                // @ts-ignore
                formData.append('doc_ownership', { uri: rentalDocuments.ownershipUrl, name: 'ownership.jpg', type: 'image/jpeg' });
            }

            let response;
            if (params.id) {
                response = await api.put<{ success: boolean; data: any; message?: string }>(`/api/rentals/${params.id}`, formData);
            } else {
                response = await api.post<{ success: boolean; data: any; message?: string }>('/api/rentals', formData);
            }

            if (response.success) {
                Alert.alert("Success", params.id ? "Rental ad updated." : "Rental ad created. Please proceed to payment to publish.");
                // Route to a payment screen or review screen
                router.replace({
                    pathname: '/payments/payment' as any,
                    params: { rentalAdId: params.id || response.data.id }
                });
            } else {
                Alert.alert("Error", response.message || "Failed to save rental ad.");
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

            {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={[styles.header, { paddingTop: insets.top + 8 }]}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </TouchableOpacity>

                    <View pointerEvents="none" style={styles.logoCentre}>
                        <RNImage
                            source={require("@/assets/logoHome.png")}
                            resizeMode="contain"
                            style={styles.logoImg}
                        />
                    </View>

                    <View style={styles.headerRightSpacer} />
                </View>

                <View style={styles.headerTitleArea}>
                    <Text style={styles.headerTitleText}>Create Rental Ad</Text>
                </View>
            </LinearGradient>

            <View style={styles.stepperContainer}>
                {steps.map((step, index) => (
                    <View key={step.id} style={styles.stepWrapper}>
                        <TouchableOpacity
                            style={[styles.stepCircle, currentStep >= step.id ? styles.stepCircleActive : null]}
                            onPress={() => setCurrentStep(step.id)}
                        >
                            <Ionicons name={step.icon as any} size={16} color={currentStep >= step.id ? '#FFF' : '#94A3B8'} />
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
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {currentStep === 1 && (
                        <BasicInformationSection
                            carDetails={carDetails}
                            handleInputChange={handleCarInputChange}
                            descriptionLimit={1000}
                            hidePrice={true}
                        />
                    )}

                    {currentStep === 2 && (
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
                    )}

                    {currentStep === 3 && (
                        <>
                            <RentalPricingSection
                                pricing={rentalPricing}
                                handleInputChange={handlePricingChange}
                            />
                            <RentalConditionsSection
                                conditions={rentalConditions}
                                handleInputChange={handleConditionsChange}
                            />
                        </>
                    )}

                    {currentStep === 4 && (
                        <>
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
                        </>
                    )}

                    {currentStep === 5 && (
                        <>
                            <RentalCalendarSection
                                availability={availability}
                                handleAvailabilityUpdate={setAvailability}
                            />
                            <ContactDetailsSection
                                userName={user?.name || ''}
                                email={user?.email || ''}
                                contactNumber={carDetails.contactNumber}
                                hidePhoneNumber={carDetails.hidePhoneNumber || false}
                                handleInputChange={handleCarInputChange as any}
                                setHidePhoneNumber={(val) => handleCarInputChange('hidePhoneNumber', val)}
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
                        {currentStep < 5 ? (
                            <TouchableOpacity style={styles.stepNextBtn} onPress={() => setCurrentStep(currentStep + 1)}>
                                <Text style={styles.stepNextText}>Next Step</Text>
                                <Ionicons name="arrow-forward" size={16} color="white" />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    {loading && (
                        <View style={styles.overlay}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.overlayText}>Creating your Ad...</Text>
                        </View>
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
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        zIndex: 100,
    },
    headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44, marginBottom: 8 },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'flex-start', justifyContent: 'center' },
    logoCentre: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    logoImg: { width: 100, height: 24 },
    headerRightSpacer: { width: 40 },
    headerTitleArea: { alignItems: 'center', justifyContent: 'center' },
    headerTitleText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
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
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
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
});
