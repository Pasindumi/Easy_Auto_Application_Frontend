import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '@/utils/api';

const { width } = Dimensions.get('window');

export default function AdDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const response = await api.get<{ success: boolean; data: any }>(`/api/cars/${id}`);
            if (response.success) {
                setAd(response.data);
                if (response.data.AdImage && response.data.AdImage.length > 0) {
                    setMainImage(response.data.AdImage[0].image_url);
                }
            } else {
                Alert.alert("Error", "Failed to load ad details.");
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
        }
    };

    const handleCallSeller = () => {
        const phone = ad?.users?.phone;
        if (phone) {
            Linking.openURL(`tel:${phone}`);
        } else {
            Alert.alert("Info", "Seller phone number not available.");
        }
    };

    const handleEmailSeller = () => {
        const email = ad?.users?.email;
        if (email) {
            Linking.openURL(`mailto:${email}`);
        } else {
            Alert.alert("Info", "Seller email not available.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!ad) return null;

    const images = ad.AdImage || [];
    const details = Array.isArray(ad.CarDetails) ? ad.CarDetails[0] : (ad.CarDetails || {});
    // Format price properly
    const amount = Number(ad.price) || 0;
    const formattedPrice = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 0
    }).format(amount);

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* HERO IMAGE SECTION */}
                <View style={styles.heroSection}>
                    <Image
                        source={mainImage ? { uri: mainImage } : require('@/assets/images/car.jpg')}
                        style={styles.heroImage}
                    />
                    <View style={styles.imageOverlay}>
                        <View style={styles.imageCountBadge}>
                            <Ionicons name="camera" size={14} color="white" />
                            <Text style={styles.imageCountText}>{images.length} Photos</Text>
                        </View>
                    </View>
                </View>

                {/* THUMBNAILS SCROLL */}
                {images.length > 1 && (
                    <View style={styles.thumbnailWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
                            {images.map((img: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setMainImage(img.image_url)}
                                    style={[
                                        styles.thumbnailContainer,
                                        mainImage === img.image_url && styles.activeThumbnail
                                    ]}
                                >
                                    <Image source={{ uri: img.image_url }} style={styles.thumbnailImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* MAIN INFO CARD */}
                <View style={styles.mainInfoContainer}>
                    <Text style={styles.adTitle}>{ad.title}</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>{formattedPrice}</Text>
                        {ad.negotiable && (
                            <View style={styles.negotiableBadge}>
                                <Text style={styles.negotiableText}>Negotiable</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-sharp" size={16} color={COLORS.text.muted} />
                        <Text style={styles.locationText}>{ad.location}</Text>

                    </View>
                </View>

                {/* KEY SPECS GRID */}
                {(() => {
                    const specs = [
                        { label: "Year", value: details.year, icon: <MaterialCommunityIcons name="calendar-range" size={24} color={COLORS.primary} /> },
                        { label: "Mileage", value: (details.mileage !== null && details.mileage !== undefined && details.mileage !== '') ? `${Number(details.mileage).toLocaleString()} km` : null, icon: <MaterialCommunityIcons name="speedometer" size={24} color={COLORS.primary} /> },
                        { label: "Brand", value: details.brand, icon: <Ionicons name="car-sport-outline" size={24} color={COLORS.primary} /> },
                        { label: "Model", value: details.model, icon: <MaterialCommunityIcons name="truck-outline" size={24} color={COLORS.primary} /> },
                        { label: "Condition", value: details.condition, icon: <MaterialCommunityIcons name="tag-outline" size={24} color={COLORS.primary} /> },
                        { label: "Fuel Type", value: details.fuel_type, icon: <MaterialCommunityIcons name="gas-station" size={24} color={COLORS.primary} /> },
                        { label: "Transmission", value: details.transmission, icon: <MaterialCommunityIcons name="cog-outline" size={24} color={COLORS.primary} /> },
                        { label: "Engine", value: details.engine_capacity ? `${details.engine_capacity} CC` : null, icon: <MaterialCommunityIcons name="engine-outline" size={24} color={COLORS.primary} /> },
                        { label: "Body", value: details.body_type, icon: <MaterialCommunityIcons name="car-back" size={24} color={COLORS.primary} /> },
                    ].filter(s => {
                        const val = s.value;
                        return val !== null && val !== undefined && val !== '' && val !== '-' && val !== 'undefined' && val !== 'null';
                    });

                    if (specs.length === 0) return null;

                    return (
                        <View style={styles.specsGrid}>
                            {specs.map((spec, index) => (
                                <SpecCard
                                    key={index}
                                    icon={spec.icon}
                                    label={spec.label}
                                    value={String(spec.value)}
                                />
                            ))}
                        </View>
                    );
                })()}

                {/* DYNAMIC SPECS SECTION */}
                {(() => {
                    const activeAttrs = (ad.attributes || []).filter((attr: any) =>
                        attr.value && attr.value !== 'undefined' && attr.value !== 'null' && attr.value !== ''
                    );

                    if (activeAttrs.length === 0) return null;

                    return (
                        <View style={styles.section}>
                            <Text style={styles.sectionHeader}>Features</Text>
                            <View style={styles.attributesList}>
                                {activeAttrs.map((attr: any, index: number) => (
                                    <View key={index} style={styles.attributeItem}>
                                        <Text style={styles.attributeLabel}>{attr.attribute?.attribute_name}</Text>
                                        <Text style={styles.attributeValue}>
                                            {attr.value === 'true' ? 'Included' : attr.value === 'false' ? 'Not Available' : `${attr.value}${attr.attribute?.unit && attr.attribute.unit !== 'none' ? ' ' + attr.attribute.unit : ''}`}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    );
                })()}

                {/* DESCRIPTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Description</Text>
                    <Text style={styles.descriptionText}>{ad.description || "No description provided for this vehicle."}</Text>
                </View>

                {/* SELLER CARD */}
                <View style={styles.sellerCard}>
                    <View style={styles.sellerHeader}>
                        <View style={styles.sellerAvatar}>
                            <Text style={styles.avatarText}>{ad.users?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <View style={styles.sellerInfo}>
                            <Text style={styles.sellerName}>{ad.users?.name || "Private Seller"}</Text>
                            <Text style={styles.sellerRole}>Easy Auto Member</Text>
                        </View>
                    </View>
                    <View style={styles.contactDetails}>
                        {/* We hide actual contact info here and use buttons below, or show them if preferred. 
                             Let's show masked or public info if available. 
                             For safety, usually we just show buttons. But the original review page showed them.
                             Let's just show buttons for ACTION in the footer, but nice to see info here too if public.
                             For now I'll just keep the card simple.*/}
                    </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.stickyFooter}>
                    <TouchableOpacity
                        style={styles.actionButtonSecondary}
                        onPress={handleEmailSeller}
                    >
                        <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.actionButtonSecondaryText}>Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButtonPrimary}
                        onPress={handleCallSeller}
                    >
                        <Ionicons name="call" size={22} color="white" />
                        <Text style={styles.actionButtonPrimaryText}>Call Seller</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const SpecCard = ({ icon, label, value }: { icon: any, label: string, value: string }) => (
    <View style={styles.specCard}>
        {icon}
        <Text style={styles.specLabel}>{label}</Text>
        <Text style={styles.specValue} numberOfLines={1}>{value || '-'}</Text>
    </View>
);

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 100 },
    heroSection: { height: 280, width: '100%', position: 'relative' },
    heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.1)' },
    imageCountBadge: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    imageCountText: { color: 'white', fontSize: 12, fontWeight: '600' },
    thumbnailWrapper: { backgroundColor: 'white', paddingVertical: 12 },
    thumbnailList: { paddingHorizontal: 16, gap: 10 },
    thumbnailContainer: {
        width: 80,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'transparent'
    },
    activeThumbnail: { borderColor: COLORS.primary },
    thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    mainInfoContainer: { padding: 20, backgroundColor: 'white', marginBottom: 12 },
    adTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text.primary, marginBottom: 8 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
    priceText: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    negotiableBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    negotiableText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
    locationContainer: { flexDirection: 'row', alignItems: 'center' },
    locationText: { color: COLORS.text.muted, fontSize: 14, marginLeft: 4 },
    specsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        gap: 10,
        marginBottom: 12
    },
    specCard: {
        backgroundColor: 'white',
        width: (width - 30) / 2,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8
    },
    specLabel: { fontSize: 12, color: COLORS.text.muted, marginTop: 8 },
    specValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.text.primary, marginTop: 2 },
    section: { backgroundColor: 'white', padding: 20, marginBottom: 12 },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary, marginBottom: 16 },
    attributesList: { gap: 12 },
    attributeItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider
    },
    attributeLabel: { fontSize: 14, color: COLORS.text.secondary },
    attributeValue: { fontSize: 14, fontWeight: '600', color: COLORS.text.primary },
    descriptionText: { fontSize: 15, color: COLORS.text.secondary, lineHeight: 24 },
    sellerCard: {
        backgroundColor: 'white',
        margin: 16,
        borderRadius: 20,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12
    },
    sellerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
    sellerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    sellerInfo: { marginLeft: 15 },
    sellerName: { fontSize: 18, fontWeight: 'bold', color: COLORS.text.primary },
    sellerRole: { fontSize: 13, color: COLORS.text.muted, marginTop: 2 },
    contactDetails: { gap: 12 },
    stickyFooter: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        gap: 12
    },
    actionButtonSecondary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        backgroundColor: 'white'
    },
    actionButtonSecondaryText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    actionButtonPrimary: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8
    },
    actionButtonPrimaryText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
});
