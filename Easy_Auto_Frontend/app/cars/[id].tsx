import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState, useRef } from 'react';
import {
    Alert,
    Dimensions,
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
    Animated,
    FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReportModal from '@/components/ui/ReportModal';
import { api } from '@/utils/api';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/Loading';
import Header from '@/components/Header';

const { width, height } = Dimensions.get('window');
const GALLERY_HEIGHT = height * 0.45;

export default function AdDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { id } = useLocalSearchParams();

    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [sendingChat, setSendingChat] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const scrollY = useRef(new Animated.Value(0)).current;
    const galleryRef = useRef<FlatList>(null);

    useEffect(() => {
        if (!id) return;
        fetchAdDetails();
        checkFavoriteStatus();
        fetchReviews();
        fetchReviewStats();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const response = await api.get<{ success: boolean; data: any }>(`/api/cars/${id}`);
            if (response.success) setAd(response.data);
            else { Alert.alert("Error", "Failed to load ad details."); router.back(); }
        } catch { Alert.alert("Error", "Network error."); }
        finally { setLoading(false); }
    };

    const checkFavoriteStatus = async () => {
        try {
            const res = await api.get<{ success: boolean; isFavorite: boolean }>(`/api/favorites/check/${id}`);
            if (res.success) setIsFavorite(res.isFavorite);
        } catch { }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await api.get<{ success: boolean; data: any[] }>(`/api/reviews/${id}`);
            if (res.success) setReviews(res.data);
        } catch { } finally { setReviewsLoading(false); }
    };

    const fetchReviewStats = async () => {
        try {
            const res = await api.get<{ success: boolean; data: any }>(`/api/reviews/stats/${id}`);
            if (res.success) setReviewStats(res.data);
        } catch { }
    };

    const handleToggleFavorite = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFavoriteLoading(true);
        try {
            const res = await api.post<{ success: boolean; isFavorite: boolean }>('/api/favorites/toggle', { ad_id: id });
            if (res.success) setIsFavorite(res.isFavorite);
        } catch (error: any) {
            if (error.status === 401) Alert.alert("Login Required", "Please login to save this ad.");
        } finally { setFavoriteLoading(false); }
    };

    const handleChatWithSeller = async () => {
        if (!ad?.users?.id) { Alert.alert("Error", "Seller information not available."); return; }
        if (user?.id === ad.users.id) { Alert.alert("Info", "This is your own ad."); return; }
        setSendingChat(true);
        try {
            const res = await api.post<{ success: boolean; data: { id: string } }>('/api/chat/conversations', { participantId: ad.users.id });
            if (res.success) {
                router.push({ pathname: `/chat/${res.data.id}` as any, params: { adId: id as string, adTitle: ad.title, adImage: ad.AdImage?.[0]?.image_url } });
            }
        } catch (error: any) {
            if (error.status === 401) Alert.alert("Login Required", "Please login to chat with the seller.");
            else Alert.alert("Error", "Failed to start chat.");
        } finally { setSendingChat(false); }
    };

    const handleReportSubmit = async (reason: string) => {
        try {
            const res = await api.post<{ success: boolean; message: string }>('/api/reports', { ad_id: id, reason });
            if (res.success) Alert.alert("Reported", "Thank you. We'll review this shortly.");
            else Alert.alert("Error", res.message);
        } catch (error: any) {
            if (error.status === 401) Alert.alert("Login Required", "Please login to report.");
            else Alert.alert("Error", "Something went wrong.");
        }
    };

    const shareMessage = ad ? `Check out this ${ad.title} on EasyAuto!\nimport Loading from "@/components/ui/Loading";\n\nhttps://easyauto.lk/cars/${id}` : '';
    const handleNativeShare = async () => {
        try { await Share.share({ message: shareMessage }); } catch { }
    };
    const handleWhatsAppShare = () => {
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareMessage)}`).catch(() =>
            Linking.openURL(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`)
        );
    };

    const headerOpacity = scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 100, GALLERY_HEIGHT - 60], outputRange: [0, 1], extrapolate: 'clamp' });

    if (loading) {
        return <Loading fullScreen message="Loading vehicle details..." />;
    }
    if (!ad) return null;

    const images = ad.AdImage || [];
    const details = Array.isArray(ad.CarDetails) ? ad.CarDetails[0] : (ad.CarDetails || {});
    const price = Number(ad.price) || 0;
    const formattedPrice = price >= 1000000
        ? `Rs. ${(price / 1000000).toFixed(2)}M`
        : price >= 1000 ? `Rs. ${(price / 1000).toFixed(0)}K` : `Rs. ${price.toLocaleString()}`;

    const specs = [
        { label: "Year", value: details.year, icon: "calendar-outline", lib: "ionicons" },
        { label: "Mileage", value: details.mileage ? `${Number(details.mileage).toLocaleString()} km` : null, icon: "speedometer-outline", lib: "ionicons" },
        { label: "Brand", value: details.brand, icon: "car-sport-outline", lib: "ionicons" },
        { label: "Model", value: details.model, icon: "car-sport", lib: "ionicons" },
        { label: "Condition", value: details.condition, icon: "ribbon-outline", lib: "ionicons" },
        { label: "Fuel Type", value: details.fuel_type, icon: "flash-outline", lib: "ionicons" },
        { label: "Transmission", value: details.transmission, icon: "settings-outline", lib: "ionicons" },
        { label: "Engine", value: details.engine_capacity ? `${details.engine_capacity} CC` : null, icon: "hardware-chip-outline", lib: "ionicons" },
        { label: "Body Type", value: details.body_type, icon: "car-outline", lib: "ionicons" },
    ].filter(s => s.value && s.value !== 'undefined' && s.value !== 'null' && s.value !== '');

    const activeAttrs = (ad.attributes || []).filter((attr: any) =>
        attr.value && attr.value !== 'undefined' && attr.value !== 'null' && attr.value !== '' && attr.value !== 'false'
    );

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* standardized FLOATING HEADER (appears on scroll) */}
            <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
                <Header 
                    showBack={true} 
                    title={ad.title}
                    rightElement={
                        <TouchableOpacity style={styles.floatingShareBtn} onPress={() => setShowShareModal(true)}>
                            <Ionicons name="share-outline" size={20} color="white" />
                        </TouchableOpacity>
                    }
                />
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                {/* ΓöÇΓöÇΓöÇ FULL SCREEN IMAGE GALLERY ΓöÇΓöÇΓöÇ */}
                <View style={styles.galleryWrap}>
                    <FlatList
                        ref={galleryRef}
                        data={images.length > 0 ? images : [{ image_url: null }]}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, i) => String(i)}
                        onMomentumScrollEnd={(e) => {
                            setActiveImageIndex(Math.round(e.nativeEvent.contentOffset.x / width));
                        }}
                        renderItem={({ item }) => (
                            <View style={{ width, height: GALLERY_HEIGHT }}>
                                <Image
                                    source={item.image_url ? { uri: item.image_url } : require('@/assets/images/car.jpg')}
                                    style={{ width, height: GALLERY_HEIGHT }}
                                    contentFit="cover"
                                    transition={200}
                                />
                            </View>
                        )}
                    />

                    {/* Gallery gradient overlays */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.55)', 'transparent']}
                        style={styles.galleryTopGrad}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.galleryBottomGrad}
                    />

                    {/* Back + Actions overlay */}
                    <View style={[styles.galleryTopRow, { paddingTop: insets.top + 10 }]}>
                        <TouchableOpacity style={styles.glassBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color="white" />
                        </TouchableOpacity>
                        <View style={styles.galleryTopActions}>
                            <TouchableOpacity style={styles.glassBtn} onPress={() => setShowShareModal(true)}>
                                <Ionicons name="share-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.glassBtn, isFavorite && styles.glassBtnActive]} onPress={handleToggleFavorite} disabled={favoriteLoading}>
                                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#EF4444" : "white"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Image counter + dots */}
                    <View style={styles.galleryBottomRow}>
                        {ad.is_featured && (
                            <View style={styles.featuredTag}>
                                <Ionicons name="star" size={12} color="#F59E0B" />
                                <Text style={styles.featuredTagText}>Featured</Text>
                            </View>
                        )}
                        <View style={{ flex: 1 }} />
                        {images.length > 1 && (
                            <View style={styles.imageDots}>
                                {images.map((_: any, i: number) => (
                                    <View key={i} style={[styles.dot, i === activeImageIndex && styles.dotActive]} />
                                ))}
                            </View>
                        )}
                    </View>
                </View>

                {/* ΓöÇΓöÇΓöÇ MAIN INFO CARD ΓöÇΓöÇΓöÇ */}
                <View style={styles.infoCard}>
                    {/* Price Badge */}
                    <View style={styles.priceRow}>
                        <Text style={styles.priceText}>{formattedPrice}</Text>
                        {ad.negotiable && (
                            <View style={styles.negotiableBadge}>
                                <Text style={styles.negotiableText}>Negotiable</Text>
                            </View>
                        )}
                        {ad.is_urgent && (
                            <View style={styles.urgentBadge}>
                                <Ionicons name="time-outline" size={12} color="white" />
                                <Text style={styles.urgentText}>Urgent</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.adTitle}>{ad.title}</Text>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-outline" size={15} color="#64748B" />
                        <Text style={styles.locationText}>{ad.location || "Sri Lanka"}</Text>
                        <View style={styles.dot2} />
                        <Ionicons name="time-outline" size={13} color="#94A3B8" />
                        <Text style={styles.timeText}>
                            {ad.created_at ? new Date(ad.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                        </Text>
                    </View>

                    {/* Quick Highlights */}
                    {(details.year || details.mileage || details.fuel_type || details.transmission) && (
                        <View style={styles.highlightRow}>
                            {details.year && <View style={styles.highlight}><Ionicons name="calendar-outline" size={14} color={COLORS.primary} /><Text style={styles.highlightText}>{details.year}</Text></View>}
                            {details.mileage && <View style={styles.highlight}><Ionicons name="speedometer-outline" size={14} color={COLORS.primary} /><Text style={styles.highlightText}>{Number(details.mileage).toLocaleString()} km</Text></View>}
                            {details.fuel_type && <View style={styles.highlight}><Ionicons name="flash-outline" size={14} color={COLORS.primary} /><Text style={styles.highlightText}>{details.fuel_type}</Text></View>}
                            {details.transmission && <View style={styles.highlight}><Ionicons name="settings-outline" size={14} color={COLORS.primary} /><Text style={styles.highlightText}>{details.transmission}</Text></View>}
                        </View>
                    )}
                </View>

                {/* ΓöÇΓöÇΓöÇ SPECS GRID ΓöÇΓöÇΓöÇ */}
                {specs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Vehicle Specifications</Text>
                        <View style={styles.specsGrid}>
                            {specs.map((spec, i) => (
                                <View key={i} style={styles.specCard}>
                                    <View style={styles.specIconBox}>
                                        <Ionicons name={spec.icon as any} size={20} color={COLORS.primary} />
                                    </View>
                                    <Text style={styles.specLabel}>{spec.label}</Text>
                                    <Text style={styles.specValue} numberOfLines={1}>{String(spec.value)}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ΓöÇΓöÇΓöÇ DESCRIPTION ΓöÇΓöÇΓöÇ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descText}>{ad.description || "No description provided."}</Text>
                </View>

                {/* ΓöÇΓöÇΓöÇ FEATURES ΓöÇΓöÇΓöÇ */}
                {activeAttrs.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Features & Extras</Text>
                        <View style={styles.featuresWrap}>
                            {activeAttrs.map((attr: any, i: number) => (
                                <View key={i} style={styles.featureChip}>
                                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                                    <Text style={styles.featureText}>
                                        {attr.value === 'true' ? attr.attribute?.attribute_name : `${attr.attribute?.attribute_name}: ${attr.value}`}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* ΓöÇΓöÇΓöÇ SELLER CARD ΓöÇΓöÇΓöÇ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Listed By</Text>
                    <View style={styles.sellerCard}>
                        <View style={styles.sellerAvatar}>
                            {ad.users?.avatar ? (
                                <Image source={{ uri: ad.users.avatar }} style={styles.sellerAvatarImg} contentFit="cover" />
                            ) : (
                                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sellerAvatarGrad}>
                                    <Text style={styles.sellerInitial}>{ad.users?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                                </LinearGradient>
                            )}
                        </View>
                        <View style={styles.sellerInfo}>
                            <View style={styles.sellerNameRow}>
                                <Text style={styles.sellerName}>{ad.users?.name || "Private Seller"}</Text>
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="checkmark-circle" size={11} color="white" />
                                    <Text style={styles.verifiedText}>Verified</Text>
                                </View>
                            </View>
                            <Text style={styles.sellerMeta}>Member since 2024 ┬╖ Very Responsive</Text>
                            {ad.users?.phone && (
                                <Text style={styles.sellerPhone}>{ad.users.phone}</Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* ΓöÇΓöÇΓöÇ SHARE ΓöÇΓöÇΓöÇ */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Share this Vehicle</Text>
                    <View style={styles.shareRow}>
                        <TouchableOpacity style={styles.shareBtn} onPress={handleWhatsAppShare}>
                            <View style={[styles.shareIcon, { backgroundColor: "#DCFCE7" }]}><Ionicons name="logo-whatsapp" size={22} color="#16A34A" /></View>
                            <Text style={styles.shareBtnText}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} onPress={() => Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=https://easyauto.lk/cars/${id}`)}>
                            <View style={[styles.shareIcon, { backgroundColor: "#DBEAFE" }]}><Ionicons name="logo-facebook" size={22} color="#1D4ED8" /></View>
                            <Text style={styles.shareBtnText}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn} onPress={handleNativeShare}>
                            <View style={[styles.shareIcon, { backgroundColor: "#F3E8FF" }]}><Ionicons name="share-social" size={22} color="#7C3AED" /></View>
                            <Text style={styles.shareBtnText}>More</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ΓöÇΓöÇΓöÇ REVIEWS ΓöÇΓöÇΓöÇ */}
                <View style={styles.section}>
                    <View style={styles.reviewHeader}>
                        <Text style={styles.sectionTitle}>Reviews</Text>
                        {reviewStats.totalReviews > 0 && (
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={13} color="#F59E0B" />
                                <Text style={styles.ratingText}>{Number(reviewStats.averageRating).toFixed(1)} ({reviewStats.totalReviews})</Text>
                            </View>
                        )}
                    </View>
                    {!showReviewForm && (
                        <TouchableOpacity style={styles.writeReviewBtn} onPress={() => setShowReviewForm(true)}>
                            <Ionicons name="create-outline" size={16} color={COLORS.primary} />
                            <Text style={styles.writeReviewText}>Write a Review</Text>
                        </TouchableOpacity>
                    )}
                    {showReviewForm && (
                        <View style={{ marginBottom: 12 }}>
                            <ReviewForm adId={id as string} onSuccess={() => { setShowReviewForm(false); fetchReviews(); fetchReviewStats(); }} />
                            <TouchableOpacity onPress={() => setShowReviewForm(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <ReviewList reviews={reviews.slice(0, 3)} loading={reviewsLoading} />
                </View>

                {/* Report */}
                <TouchableOpacity style={styles.reportBtn} onPress={() => setShowReportModal(true)}>
                    <Ionicons name="flag-outline" size={14} color="#94A3B8" />
                    <Text style={styles.reportText}>Report this Ad</Text>
                </TouchableOpacity>
            </Animated.ScrollView>

            {/* ΓöÇΓöÇΓöÇ STICKY FOOTER ΓöÇΓöÇΓöÇ */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity style={styles.callBtn} onPress={() => setShowContactModal(true)}>
                    <Ionicons name="call-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.callBtnText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.chatBtn, sendingChat && { opacity: 0.7 }]} onPress={handleChatWithSeller} disabled={sendingChat}>
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.chatBtnGrad}>
                        {sendingChat ? <Loading size="small" /> : (
                            <>
                                <Ionicons name="chatbubble-ellipses" size={20} color="white" />
                                <Text style={styles.chatBtnText}>Chat with Seller</Text>
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* ΓöÇΓöÇΓöÇ CONTACT MODAL ΓöÇΓöÇΓöÇ */}
            <Modal visible={showContactModal} transparent animationType="slide" onRequestClose={() => setShowContactModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowContactModal(false)}>
                    <View style={[styles.contactSheet, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.contactSheetTitle}>Contact Seller</Text>
                        <View style={styles.sellerCardLg}>
                            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sellerAvatarLg}>
                                <Text style={styles.sellerInitialLg}>{ad.users?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                            </LinearGradient>
                            <Text style={styles.sellerNameLg}>{ad.users?.name || "Private Seller"}</Text>
                        </View>
                        <View style={styles.contactOptions}>
                            {ad.users?.phone ? (
                                <TouchableOpacity style={styles.contactOption} onPress={() => Linking.openURL(`tel:${ad.users.phone}`)}>
                                    <View style={[styles.contactOptionIcon, { backgroundColor: "#DCFCE7" }]}>
                                        <Ionicons name="call" size={26} color="#16A34A" />
                                    </View>
                                    <Text style={styles.contactOptionLabel}>{ad.users.phone}</Text>
                                    <Text style={styles.contactOptionSub}>Tap to Call</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.contactOption}>
                                    <View style={[styles.contactOptionIcon, { backgroundColor: "#F1F5F9" }]}>
                                        <Ionicons name="call-outline" size={26} color="#94A3B8" />
                                    </View>
                                    <Text style={[styles.contactOptionLabel, { color: "#94A3B8" }]}>Not Available</Text>
                                </View>
                            )}
                            {ad.users?.email && (
                                <TouchableOpacity style={styles.contactOption} onPress={() => Linking.openURL(`mailto:${ad.users.email}`)}>
                                    <View style={[styles.contactOptionIcon, { backgroundColor: "#EFF6FF" }]}>
                                        <Ionicons name="mail" size={26} color="#2563EB" />
                                    </View>
                                    <Text style={styles.contactOptionLabel}>Email Seller</Text>
                                    <Text style={styles.contactOptionSub}>~2hr response</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            <ReportModal visible={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F1F5F9" },

    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', gap: 14 },
    loadingText: { color: '#64748B', fontSize: 15, fontWeight: '500' },

    // FLOATING HEADER
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200,
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16, paddingBottom: 12,
        elevation: 8,
        shadowColor: '#0F172A', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 4 }, shadowRadius: 10,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    floatingBackBtn: { width: 32, height: 32, alignItems: 'flex-start', justifyContent: 'center' },
    logoImg: { width: 85, height: 22 },
    floatingShareBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },

    // GALLERY
    galleryWrap: { height: GALLERY_HEIGHT, position: 'relative' },
    galleryTopGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 120, zIndex: 10 },
    galleryBottomGrad: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, zIndex: 10 },
    galleryTopRow: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    galleryTopActions: { flexDirection: 'row', gap: 10 },
    glassBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.35)',
        alignItems: 'center', justifyContent: 'center',
    },
    glassBtnActive: { backgroundColor: 'rgba(239,68,68,0.25)' },
    galleryBottomRow: {
        position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 20,
        flexDirection: 'row', alignItems: 'center',
    },
    featuredTag: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(245,158,11,0.85)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
    },
    featuredTagText: { color: 'white', fontSize: 11, fontWeight: '800' },
    imageDots: { flexDirection: 'row', gap: 5, justifyContent: 'flex-end' },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.45)' },
    dotActive: { backgroundColor: 'white', width: 18 },

    // INFO CARD
    infoCard: {
        backgroundColor: 'white', marginHorizontal: 16, marginTop: -30,
        borderRadius: 28, padding: 24, zIndex: 100,
        elevation: 10, shadowColor: COLORS.primary, shadowOpacity: 0.12, shadowOffset: { width: 0, height: 8 }, shadowRadius: 24,
    },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    priceText: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: -1 },
    negotiableBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, borderWidth: 1, borderColor: COLORS.primary + '20' },
    negotiableText: { color: COLORS.primary, fontSize: 12, fontWeight: '800' },
    urgentBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EF4444', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    urgentText: { color: 'white', fontSize: 12, fontWeight: '800' },
    adTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5, marginBottom: 12, lineHeight: 28 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 18 },
    locationText: { fontSize: 14, color: '#64748B', fontWeight: '500', flex: 1 },
    dot2: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 4 },
    timeText: { fontSize: 13, color: '#94A3B8' },
    highlightRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    highlight: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    highlightText: { fontSize: 13, fontWeight: '700', color: '#1E293B' },

    // SECTIONS
    section: { backgroundColor: 'white', marginHorizontal: 12, marginTop: 12, borderRadius: 20, padding: 20, elevation: 2, shadowColor: '#0F172A', shadowOpacity: 0.04, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginBottom: 16, letterSpacing: -0.3 },

    // SPECS
    specsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    specCard: {
        width: (width - 64) / 3,
        backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14,
        alignItems: 'center', gap: 8,
        borderWidth: 1.5, borderColor: '#F1F5F9',
        elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    },
    specIconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
    specLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
    specValue: { fontSize: 14, color: '#0F172A', fontWeight: '800', textAlign: 'center' },

    // DESCRIPTION
    descText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '400' },

    // FEATURES
    featuresWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    featureChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#DCFCE7' },
    featureText: { fontSize: 12, color: '#166534', fontWeight: '600' },

    // SELLER
    sellerCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    sellerAvatar: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden' },
    sellerAvatarImg: { width: '100%', height: '100%' },
    sellerAvatarGrad: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
    sellerInitial: { color: 'white', fontSize: 22, fontWeight: '800' },
    sellerInfo: { flex: 1 },
    sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    sellerName: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#10B981', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
    verifiedText: { color: 'white', fontSize: 10, fontWeight: '700' },
    sellerMeta: { fontSize: 12, color: '#64748B', marginTop: 3 },
    sellerPhone: { fontSize: 13, color: COLORS.primary, fontWeight: '700', marginTop: 4 },

    // SHARE
    shareRow: { flexDirection: 'row', gap: 12 },
    shareBtn: { flex: 1, alignItems: 'center', gap: 6 },
    shareIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    shareBtnText: { fontSize: 12, color: '#64748B', fontWeight: '600' },

    // REVIEWS
    reviewHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFBEB', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#FEF3C7' },
    ratingText: { fontSize: 13, fontWeight: '700', color: '#D97706' },
    writeReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 14, backgroundColor: '#EEF2FF', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    writeReviewText: { fontSize: 13, color: COLORS.primary, fontWeight: '700' },
    cancelBtn: { alignItems: 'center', marginTop: 8 },
    cancelText: { color: '#94A3B8', fontWeight: '600', fontSize: 13 },

    // REPORT
    reportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', paddingVertical: 20, opacity: 0.6 },
    reportText: { fontSize: 13, color: '#94A3B8', fontWeight: '500' },

    // FOOTER
    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'white', flexDirection: 'row',
        paddingHorizontal: 16, paddingTop: 12, gap: 12,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        elevation: 20, shadowColor: '#0F172A', shadowOpacity: 0.12, shadowOffset: { width: 0, height: -4 }, shadowRadius: 20,
    },
    callBtn: {
        width: 64, height: 52, borderRadius: 16,
        borderWidth: 2, borderColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center', gap: 2,
    },
    callBtnText: { fontSize: 10, color: COLORS.primary, fontWeight: '700' },
    chatBtn: { flex: 1, borderRadius: 16, overflow: 'hidden' },
    chatBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
    chatBtnText: { color: 'white', fontWeight: '800', fontSize: 15 },

    // CONTACT MODAL
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    contactSheet: { backgroundColor: 'white', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 8 },
    sheetHandle: { width: 40, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
    contactSheetTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 20 },
    sellerCardLg: { alignItems: 'center', marginBottom: 24, gap: 10 },
    sellerAvatarLg: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
    sellerInitialLg: { color: 'white', fontSize: 28, fontWeight: '800' },
    sellerNameLg: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    contactOptions: { flexDirection: 'row', gap: 16 },
    contactOption: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, padding: 16, alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#E2E8F0' },
    contactOptionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    contactOptionLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
    contactOptionSub: { fontSize: 11, color: '#94A3B8', fontWeight: '500' },
});
