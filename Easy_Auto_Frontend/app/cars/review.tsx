import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    StatusBar
} from 'react-native';
import { ENDPOINTS } from '../../constants/API';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/utils/api';
import ReviewList from '@/components/reviews/ReviewList';
import StarRating from '@/components/reviews/StarRating';

const { width } = Dimensions.get('window');

export default function ReviewAdScreen() {
    const router = useRouter();
    const { isAuthenticated, accessToken } = useAuth();
    const { id } = useLocalSearchParams();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [reviewsLoading, setReviewsLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchAdDetails();
        fetchReviews();
        fetchReviewStats();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

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
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: any[] }>(`/api/reviews/${id}`);
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const fetchReviewStats = async () => {
        try {
            const response = await api.get<{ success: boolean; data: { averageRating: number; totalReviews: number } }>(`/api/reviews/stats/${id}`);
            if (response.success) {
                setReviewStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching review stats:", error);
        }
    };



    if (!isAuthenticated) return null; // Auth guard should be handled by layout or similar

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!ad) return null;

    const images = ad.AdImage || [];
    const details = Array.isArray(ad.CarDetails) ? ad.CarDetails[0] : (ad.CarDetails || {});
    const formattedPrice = new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(ad.price);

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Preview Ad" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* PREVIEW BANNER */}
                <View style={styles.previewBadge}>
                    <Ionicons name="eye-outline" size={16} color={COLORS.white} />
                    <Text style={styles.previewBadgeText}>AD PREVIEW MODE</Text>
                </View>

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
                        <View style={styles.dotSeparator} />
                        <Text style={styles.timeText}>Just now</Text>
                    </View>

                    {ad.active_boosts && ad.active_boosts.length > 0 && (
                        <View style={[styles.section, { padding: 15, borderRadius: 12, backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#F59E0B', marginTop: 15 }]}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                                <Ionicons name="rocket" size={20} color="#D97706" />
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#92400E', marginLeft: 8 }}>Active Boost Package</Text>
                            </View>
                            {ad.active_boosts.map((boost: any, index: number) => (
                                <View key={index} style={{ marginTop: 4 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#92400E' }}>
                                        {boost.package?.name || 'Boost Active'}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                        <Ionicons name="time-outline" size={14} color="#B45309" />
                                        <Text style={{ fontSize: 13, color: '#B45309', marginLeft: 4 }}>
                                            Boost Expires On: {formatDate(boost.end_date)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </View>


                {/* KEY SPECS GRID */}
                {(() => {
                    const specs = [
                        { label: "Year", value: details.year, icon: <MaterialCommunityIcons name="calendar-range" size={24} color={COLORS.primary} /> },
                        { label: "Mileage", value: (details.mileage !== null && details.mileage !== undefined && details.mileage !== '') ? `${details.mileage} km` : null, icon: <MaterialCommunityIcons name="speedometer" size={24} color={COLORS.primary} /> },
                        { label: "Brand", value: details.brand, icon: <Ionicons name="car-sport-outline" size={24} color={COLORS.primary} /> },
                        { label: "Model", value: details.model, icon: <MaterialCommunityIcons name="truck-outline" size={24} color={COLORS.primary} /> },
                        { label: "Condition", value: details.condition, icon: <MaterialCommunityIcons name="tag-outline" size={24} color={COLORS.primary} /> },
                        { label: "Fuel Type", value: details.fuel_type, icon: <MaterialCommunityIcons name="gas-station" size={24} color={COLORS.primary} /> },
                        { label: "Transmission", value: details.transmission, icon: <MaterialCommunityIcons name="cog-outline" size={24} color={COLORS.primary} /> },
                        { label: "Engine", value: details.engine_capacity, icon: <MaterialCommunityIcons name="engine-outline" size={24} color={COLORS.primary} /> },
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
                                    value={spec.value}
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
                            <Text style={styles.sectionHeader}>Other Features</Text>
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

                {/* REVIEWS SECTION */}
                <View style={styles.section}>
                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionHeader}>Reviews & Ratings</Text>
                        <View style={styles.ratingBadge}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>
                                {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)
                            </Text>
                        </View>
                    </View>

                    <ReviewList reviews={reviews} loading={reviewsLoading} />
                </View>

                {/* SELLER CARD */}
                <View style={styles.sellerCard}>
                    <View style={styles.sellerHeader}>
                        <View style={styles.sellerAvatar}>
                            <Text style={styles.avatarText}>{ad.users?.name?.charAt(0) || 'O'}</Text>
                        </View>
                        <View style={styles.sellerInfo}>
                            <Text style={styles.sellerName}>{ad.users?.name || "Private Seller"}</Text>
                            <Text style={styles.sellerRole}>Individual Member</Text>
                        </View>
                    </View>
                    <View style={styles.contactDetails}>
                        <View style={styles.contactItem}>
                            <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.contactText}>{ad.users?.phone || "Phone hidden"}</Text>
                        </View>
                        <View style={styles.contactItem}>
                            <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.contactText}>{ad.users?.email || "Email hidden"}</Text>
                        </View>
                    </View>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.stickyFooter}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => router.push({
                            pathname: '/cars/sell-car',
                            params: { id: id, edit: 'true' }
                        })}
                    >
                        <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.editButtonText}>Edit Ad</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.publishButton}
                        onPress={() => router.push({
                            pathname: '/payments/payment',
                            params: { adId: id }
                        })}
                    >
                        <Ionicons name="card-outline" size={22} color="white" />
                        <Text style={styles.publishButtonText}>Proceed & Payment</Text>
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
    previewBadge: {
        backgroundColor: COLORS.accent,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6
    },
    previewBadgeText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
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
    dotSeparator: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
    timeText: { color: COLORS.text.muted, fontSize: 14 },
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
    sellerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
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
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    contactText: { fontSize: 15, color: COLORS.text.primary, fontWeight: '500' },
    stickyFooter: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        gap: 12
    },
    editButton: {
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
    editButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    publishButton: {
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
    publishButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
    disabledButton: { opacity: 0.6 },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingText: {
        fontWeight: 'bold',
        color: '#F59E0B',
        fontSize: 14,
    },
});
