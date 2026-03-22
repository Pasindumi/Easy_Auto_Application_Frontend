import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    Platform,
    StatusBar,
    ImageBackground,
    SafeAreaView
} from 'react-native';
import Loading from '@/components/ui/Loading';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RentalAdDetailsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { id } = useLocalSearchParams();

    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [showContactModal, setShowContactModal] = useState(false);
    const [sendingChat, setSendingChat] = useState(false);

    useEffect(() => {
        if (id) fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: any }>(`/api/rentals/${id}`);
            if (response.success) {
                setAd(response.data);
                if (response.data.rental_ad_images && response.data.rental_ad_images.length > 0) {
                    setMainImage(response.data.rental_ad_images[0].image_url);
                }
            } else {
                Alert.alert("Error", "Failed to load rental details.");
                router.back();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Check your connection.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading fullScreen message="Fetching rental details..." />;
    }

    if (!ad) return null;

    const images = ad.rental_ad_images || [];
    const details = ad.rental_ad_details || {};
    const isVerified = ad.verification_status === 'VERIFIED';

    const handleChatWithSeller = async () => {
        if (!ad?.users?.id) return Alert.alert("Error", "Seller info missing.");
        if (user?.id === ad.users.id) return Alert.alert("Info", "Your own ad.");

        setSendingChat(true);
        try {
            const response = await api.post<{ success: boolean; data: { id: string } }>(
                '/api/chat/conversations',
                { participantId: ad.users.id }
            );

            if (response.success) {
                router.push({
                    pathname: `/chat/${response.data.id}` as any,
                    params: {
                        adId: id as string,
                        adTitle: ad.title,
                        adImage: images[0]?.image_url
                    }
                });
            }
        } catch (error: any) {
            Alert.alert("Error", "Could not start chat.");
        } finally {
            setSendingChat(false);
        }
    };

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* HERO IMAGE */}
                <View style={styles.heroSection}>
                    <ImageBackground
                        source={mainImage ? { uri: mainImage } : require('@/assets/images/car.jpg')}
                        style={styles.heroImage}
                    >
                        <LinearGradient colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']} style={styles.imageOverlay}>
                            <SafeAreaView style={styles.topActions}>
                                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                                    <Ionicons name="arrow-back" size={24} color="white" />
                                </TouchableOpacity>
                            </SafeAreaView>
                            <View style={styles.heroBottomRow}>
                                <View style={styles.imageCountBadge}>
                                    <Ionicons name="images-outline" size={14} color="white" />
                                    <Text style={styles.imageCountText}>{images.length} Photos</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>
                </View>

                {/* THUMBNAILS */}
                {images.length > 1 && (
                    <View style={styles.thumbnailWrapper}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailList}>
                            {images.map((img: any, idx: number) => (
                                <TouchableOpacity key={idx} onPress={() => setMainImage(img.image_url)} style={[styles.thumbnailContainer, mainImage === img.image_url && styles.activeThumbnail]}>
                                    <Image source={{ uri: img.image_url }} style={styles.thumbnailImage} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* HEADER INFO */}
                <View style={styles.mainContent}>
                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.nameRow}>
                                <Text style={styles.adTitle}>{ad.title}</Text>
                                {isVerified && (
                                    <View style={styles.verifiedPill}>
                                        <MaterialIcons name="verified" size={16} color="#059669" />
                                        <Text style={styles.verifiedText}>Verified</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.locationContainer}>
                                <Ionicons name="location-outline" size={14} color="#666" />
                                <Text style={styles.locationText}>{ad.location}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <View style={styles.priceCard}>
                            <Text style={styles.priceLabel}>Daily</Text>
                            <Text style={styles.priceValue}>Rs. {ad.price_per_day?.toLocaleString()}</Text>
                        </View>
                        {ad.price_per_week && (
                            <View style={styles.priceCard}>
                                <Text style={styles.priceLabel}>Weekly</Text>
                                <Text style={styles.priceValue}>Rs. {ad.price_per_week?.toLocaleString()}</Text>
                            </View>
                        )}
                        {ad.price_per_month && (
                            <View style={styles.priceCard}>
                                <Text style={styles.priceLabel}>Monthly</Text>
                                <Text style={styles.priceValue}>Rs. {ad.price_per_month?.toLocaleString()}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* SPECS */}
                    <Text style={styles.sectionHeader}>Vehicle Specifications</Text>
                    <View style={styles.specsContainer}>
                        {[
                            { label: "Year", value: details.year, icon: "calendar-outline" },
                            { label: "Brand", value: details.brand, icon: "car-sport-outline" },
                            { label: "Model", value: details.model, icon: "car" },
                            { label: "Mileage", value: details.mileage ? `${details.mileage} km` : null, icon: "speedometer-outline" },
                            { label: "Fuel", value: details.fuel_type, icon: "gas-pump", lib: FontAwesome5 },
                            { label: "Gearbox", value: details.transmission, icon: "cog-outline" },
                        ].map((spec: any, i) => {
                            const Icon = spec.lib || Ionicons;
                            if (!spec.value) return null;
                            return (
                                <View key={i} style={styles.specItem}>
                                    <Icon name={spec.icon} size={20} color={COLORS.primary} />
                                    <View style={styles.specTextWrap}>
                                        <Text style={styles.specLabel_t}>{spec.label}</Text>
                                        <Text style={styles.specValue_t}>{spec.value}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* RENTAL CONDITIONS */}
                    <View style={styles.divider} />
                    <Text style={styles.sectionHeader}>Rental Conditions</Text>
                    <View style={styles.conditionsGrid}>
                        <View style={styles.conditionItem}>
                            <Ionicons name="person-outline" size={18} color="#666" />
                            <Text style={styles.conditionText}>Min Age: {ad.min_age || '21'}+</Text>
                        </View>
                        <View style={styles.conditionItem}>
                            <Ionicons name="speedometer-outline" size={18} color="#666" />
                            <Text style={styles.conditionText}>Limit: {ad.daily_mileage_limit || '100'} km/day</Text>
                        </View>
                        <View style={styles.conditionItem}>
                            <MaterialCommunityIcons name={ad.allow_smoking ? "smoking" : "smoking-off"} size={18} color="#666" />
                            <Text style={styles.conditionText}>{ad.allow_smoking ? "Smoking Allowed" : "No Smoking"}</Text>
                        </View>
                        <View style={styles.conditionItem}>
                            <Ionicons name="paw-outline" size={18} color="#666" />
                            <Text style={styles.conditionText}>{ad.allow_pets ? "Pets Allowed" : "No Pets"}</Text>
                        </View>
                    </View>

                    {ad.security_deposit > 0 && (
                        <View style={styles.depositAlert}>
                            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                            <Text style={styles.depositText}>Security Deposit: Rs. {ad.security_deposit.toLocaleString()}</Text>
                        </View>
                    )}

                    {/* DESCRIPTION */}
                    <View style={styles.divider} />
                    <Text style={styles.sectionHeader}>Description & Rules</Text>
                    <Text style={styles.descriptionText}>{ad.description || "No specific rules provided."}</Text>
                    {ad.other_conditions && (
                        <Text style={[styles.descriptionText, { marginTop: 10, color: '#666' }]}>{ad.other_conditions}</Text>
                    )}

                    {/* SELLER */}
                    <View style={styles.divider} />
                    <View style={styles.sellerBox}>
                        <View style={styles.sellerAvatar}>
                            <Text style={styles.sellerInitial}>{ad.users?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <View style={styles.sellerInfo}>
                            <Text style={styles.sellerName}>{ad.users?.name || "Verified Owner"}</Text>
                            <Text style={styles.sellerSub}>Joined {new Date(ad.users?.created_at).getFullYear()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FOOTER ACTIONS */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.callBtn} onPress={() => setShowContactModal(true)}>
                    <Ionicons name="call" size={20} color={COLORS.primary} />
                    <Text style={styles.callText}>Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bookBtn} onPress={handleChatWithSeller} disabled={sendingChat}>
                    {sendingChat ? <Loading size="small" /> : (
                        <>
                            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                            <Text style={styles.bookText}>Chat to Rent</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            {/* CONTACT MODAL */}
            <Modal visible={showContactModal} transparent animationType="slide">
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowContactModal(false)}>
                    <View style={styles.modalContent}>
                        <View style={styles.dragBar} />
                        <Text style={styles.modalTitle}>Contact Owner</Text>
                        <TouchableOpacity style={styles.contactLink} onPress={() => Linking.openURL(`tel:${ad.users?.phone}`)}>
                            <Ionicons name="call" size={24} color={COLORS.primary} />
                            <Text style={styles.contactVal}>{ad.users?.phone || 'Not Available'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactLink} onPress={() => Linking.openURL(`mailto:${ad.users?.email}`)}>
                            <Ionicons name="mail" size={24} color={COLORS.primary} />
                            <Text style={styles.contactVal}>{ad.users?.email}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeModal} onPress={() => setShowContactModal(false)}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollContent: { paddingBottom: 20 },
    heroSection: { height: 280, backgroundColor: '#eee' },
    heroImage: { width: '100%', height: '100%' },
    imageOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', padding: 20 },
    topActions: { marginTop: Platform.OS === 'android' ? 30 : 0 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    heroBottomRow: { alignItems: 'flex-end' },
    imageCountBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 20, gap: 5 },
    imageCountText: { color: 'white', fontSize: 11, fontWeight: '600' },
    thumbnailWrapper: { marginTop: -25, paddingHorizontal: 20 },
    thumbnailList: { gap: 10 },
    thumbnailContainer: { width: 60, height: 45, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: '#fff' },
    activeThumbnail: { borderColor: COLORS.primary },
    thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    mainContent: { padding: 20 },
    titleRow: { marginBottom: 15 },
    nameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 10 },
    adTitle: { fontSize: 24, fontWeight: 'bold', color: '#111' },
    verifiedPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ecfdf5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
    verifiedText: { color: '#059669', fontSize: 12, fontWeight: 'bold' },
    locationContainer: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
    locationText: { color: '#666', fontSize: 13 },
    priceContainer: { flexDirection: 'row', gap: 10, marginVertical: 10 },
    priceCard: { flex: 1, backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
    priceLabel: { fontSize: 11, color: '#666', marginBottom: 4 },
    priceValue: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
    divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    sectionHeader: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 12 },
    specsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    specItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10 },
    specTextWrap: { flex: 1 },
    specLabel_t: { fontSize: 11, color: '#999' },
    specValue_t: { fontSize: 14, fontWeight: '600', color: '#333' },
    conditionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
    conditionItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8 },
    conditionText: { fontSize: 13, color: '#444' },
    depositAlert: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f7ff', padding: 12, borderRadius: 10, marginTop: 15, gap: 10 },
    depositText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
    descriptionText: { fontSize: 14, color: '#555', lineHeight: 22 },
    sellerBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
    sellerInitial: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    sellerInfo: { flex: 1 },
    sellerName: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    sellerSub: { fontSize: 12, color: '#999' },
    footer: { position: 'absolute', bottom: 0, width: '100%', flexDirection: 'row', padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#eee', gap: 15 },
    callBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.primary, height: 50, borderRadius: 12, gap: 10 },
    callText: { color: COLORS.primary, fontWeight: 'bold' },
    bookBtn: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, height: 50, borderRadius: 12, gap: 10 },
    bookText: { color: 'white', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
    dragBar: { width: 40, height: 5, backgroundColor: '#ddd', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 20 },
    contactLink: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    contactVal: { fontSize: 16, color: '#333', fontWeight: '500' },
    closeModal: { marginTop: 20, height: 50, alignItems: 'center', justifyContent: 'center' },
    closeText: { color: COLORS.primary, fontWeight: 'bold' }
});
