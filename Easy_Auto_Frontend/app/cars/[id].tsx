import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
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
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ReportModal from '@/components/ui/ReportModal';
import ImageGallery from '@/components/ui/ImageGallery';
import { api } from '@/utils/api';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import TrendingCars from '@/components/home/TrendingCars';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const GALLERY_HEIGHT = height * 0.45;

export default function AdDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { id } = useLocalSearchParams();

    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
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
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

    const getFeatureInfo = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('a/c') || n.includes('air condition')) return { name: 'snow-outline', color: '#0EA5E9' };
        if (n.includes('steering')) return { name: 'car-outline', color: '#3B82F6' };
        if (n.includes('mirror')) return { name: 'copy-outline', color: '#6366F1' };
        if (n.includes('window')) return { name: 'browsers-outline', color: '#8B5CF6' };
        if (n.includes('abs') || n.includes('safety')) return { name: 'shield-checkmark-outline', color: '#EF4444' };
        if (n.includes('airbag')) return { name: 'lifebuoy-outline', color: '#F59E0B' };
        if (n.includes('lock')) return { name: 'lock-closed-outline', color: '#EC4899' };
        if (n.includes('key')) return { name: 'key-outline', color: '#D946EF' };
        if (n.includes('sunroof')) return { name: 'sunny-outline', color: '#F97316' };
        if (n.includes('wheel') || n.includes('alloy')) return { name: 'disc-outline', color: '#64748B' };
        if (n.includes('fog')) return { name: 'cloud-outline', color: '#94A3B8' };
        if (n.includes('camera')) return { name: 'videocam-outline', color: '#10B981' };
        if (n.includes('sensor')) return { name: 'radio-outline', color: '#14B8A6' };
        if (n.includes('screen') || n.includes('touch')) return { name: 'tablet-portrait-outline', color: '#0891B2' };
        if (n.includes('bluetooth')) return { name: 'bluetooth-outline', color: '#2563EB' };
        if (n.includes('usb')) return { name: 'usb-outline', color: '#059669' };
        return { name: 'checkmark-circle-outline', color: COLORS.primary };
    };

    const dummyAnim = useRef(new Animated.Value(1)).current;
    const dummyAnimSlide = useRef(new Animated.Value(0)).current;

    const [activeIndex, setActiveIndex] = useState(0);
    const galleryRef = useRef<FlatList>(null);
    const thumbRef = useRef<FlatList>(null);

    const CARD_WIDTH = width; // Full width for edge-to-edge
    const SNAP_INTERVAL = CARD_WIDTH;

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / SNAP_INTERVAL);
        if (index !== activeIndex && index >= 0 && index < images.length) {
            setActiveIndex(index);
        }
    };

    const scrollToImage = (index: number) => {
        setActiveIndex(index);
        galleryRef.current?.scrollToOffset({
            offset: index * SNAP_INTERVAL,
            animated: true
        });
        thumbRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    };

    const scrollY = useRef(new Animated.Value(0)).current;

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

    const shareMessage = ad ? `Check out this ${ad.title} on EasyAuto!\nhttps://easyauto.lk/cars/${id}` : '';
    const handleNativeShare = async () => {
        try { await Share.share({ message: shareMessage }); } catch { }
    };
    const handleWhatsAppShare = () => {
        Linking.openURL(`whatsapp://send?text=${encodeURIComponent(shareMessage)}`).catch(() =>
            Linking.openURL(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`)
        );
    };

    // Auto-play gallery effect
    useEffect(() => {
        const adImages = ad?.AdImage || [];
        if (adImages.length <= 1) return;

        const timer = setInterval(() => {
            let nextIndex = activeImageIndex + 1;
            if (nextIndex >= adImages.length) {
                nextIndex = 0;
            }
            if (galleryRef.current) {
                galleryRef.current.scrollToOffset({ offset: nextIndex * width, animated: true });
                setActiveImageIndex(nextIndex);
            }
        }, 3000);

        return () => clearInterval(timer);
    }, [ad, activeImageIndex, width]);

    const headerOpacity = scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 100, GALLERY_HEIGHT - 60], outputRange: [0, 1], extrapolate: 'clamp' });

    if (loading) {
        return (
            <View style={styles.loading}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading vehicle details...</Text>
            </View>
        );
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

            {/* ΓöÇΓöÇΓöÇ FLOATING HEADER (appears on scroll) ΓöÇΓöÇΓöÇ */}
            <Animated.View
                pointerEvents="box-none"
                style={[styles.floatingHeader, { paddingTop: insets.top + 8, opacity: headerOpacity }]}
            >
                <TouchableOpacity style={styles.floatingBackBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>
                <View pointerEvents="none" style={styles.logoCentreFixed}>
                    <Image
                        source={require("@/assets/logoHome.png")}
                        contentFit="contain"
                        style={styles.logoImg}
                    />
                </View>
                <TouchableOpacity style={styles.floatingShareBtn} onPress={() => setShowShareModal(true)}>
                    <Ionicons name="share-social" size={20} color="white" />
                </TouchableOpacity>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
                scrollEventThrottle={16}
            >
                {/* ─── EDGE-TO-EDGE IMAGE GALLERY ─── */}
                <View style={styles.galleryContainer}>
                    <FlatList
                        ref={galleryRef}
                        data={images.length > 0 ? images : [{ image_url: null }]}
                        horizontal
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        onScroll={onScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={{ width: width, height: 300 }}>
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={styles.galleryImgFull} contentFit="cover" />
                                ) : (
                                    <View style={[styles.galleryImgFull, { backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="image-outline" size={60} color="#CBD5E1" />
                                    </View>
                                )}
                            </View>
                        )}
                    />

                    <View style={[styles.galleryNavRow, { top: insets.top + 10 }]}>
                        <TouchableOpacity style={styles.glassCircle} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <View style={styles.galleryTopActions}>
                            <TouchableOpacity style={styles.glassCircle} onPress={() => setShowShareModal(true)}>
                                <Ionicons name="share-social-outline" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.glassCircle, isFavorite && styles.glassBtnActive]}
                                onPress={handleToggleFavorite}
                                disabled={favoriteLoading}
                            >
                                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#EF4444" : "white"} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Floating Thumbnails Row */}
                    <View style={styles.floatingThumbRow}>
                        <FlatList
                            data={images}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(_, index) => index.toString()}
                            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    onPress={() => scrollToImage(index)}
                                    style={[
                                        styles.miniThumb,
                                        activeIndex === index && styles.miniThumbActive
                                    ]}
                                >
                                    <Image source={{ uri: item.image_url }} style={styles.miniThumbImg} />
                                </TouchableOpacity>
                            )}
                        />
                    </View>

                    {/* Photo Count Badge */}
                    <View style={styles.photoCountBadge}>
                        <Ionicons name="camera" size={14} color="white" />
                        <Text style={styles.photoCountText}>{activeIndex + 1} / {images.length || 1}</Text>
                    </View>
                </View>

                <View style={[styles.contentHeader, { paddingTop: 20 }]}>
                    <Text style={styles.adTitleBig}>{ad.title}</Text>

                    <View style={styles.headerPriceRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <Text style={styles.headerPriceText}>{formattedPrice}</Text>
                            {ad.negotiable && (
                                <View style={styles.headerNegBadge}>
                                    <Text style={styles.headerNegText}>Negotiable</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {(ad.city || ad.location || ad.district) && (
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={15} color={COLORS.primary} />
                            <Text style={styles.locationText}>
                                {ad.city || ad.location || ad.district}
                            </Text>
                        </View>
                    )}
                </View>

                {/* ─── VEHICLE SPECIFICATIONS ─── */}
                <View style={[styles.section, { padding: 16, marginTop: 12 }]}>
                    <Text style={[styles.sectionTitle, { fontSize: 16, marginBottom: 12 }]}>Vehicle Specifications</Text>
                    <View style={styles.specThreeGrid}>
                        {specs.map((spec, i) => (
                            <View key={i} style={styles.specThreeItem}>
                                <Ionicons name={spec.icon as any} size={18} color={COLORS.primary} />
                                <Text style={styles.specThreeLabel} numberOfLines={1}>{spec.label}</Text>
                                <Text style={styles.specThreeValue} numberOfLines={1}>{String(spec.value)}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ─── DESCRIPTION ─── */}
                <View style={styles.section}>
                    <Text style={styles.descText}>{ad.description || "No description provided."}</Text>
                </View>

                {/* ΓöÇΓöÇΓöÇ FEATURES ΓöÇΓöÇΓöÇ */}
                {
                    activeAttrs.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Features & Extras</Text>
                            <View style={styles.featuresWrap}>
                                {activeAttrs.map((attr: any, i: number) => {
                                    const feature = getFeatureInfo(attr.attribute?.attribute_name || "");
                                    return (
                                        <View key={i} style={styles.featureChip}>
                                            <Ionicons
                                                name={feature.name as any}
                                                size={16}
                                                color={feature.color}
                                            />
                                            <Text style={styles.featureText}>
                                                {attr.value === 'true' ? attr.attribute?.attribute_name : `${attr.attribute?.attribute_name}: ${attr.value}`}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>
                    )
                }

                {/* ─── SELLER CARD ─── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Listed By</Text>
                    <TouchableOpacity
                        style={styles.sellerCard}
                        activeOpacity={0.8}
                        onPress={() => {
                            if (ad.users?.id) {
                                router.push({
                                    pathname: `/seller/${ad.users.id}` as any,
                                    params: { sellerData: JSON.stringify(ad.users) }
                                });
                            }
                        }}
                    >
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
                                    <MaterialCommunityIcons name="check-decagram" size={14} color="white" />
                                    <Text style={styles.verifiedText}>Verified</Text>
                                </View>
                            </View>
                            <Text style={styles.sellerMeta}>Verified Seller • Highly Responsive</Text>
                            {ad.users?.phone && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                    <Ionicons name="call-outline" size={14} color={COLORS.primary} style={{ marginTop: 2 }} />
                                    <Text style={[styles.sellerPhone, { lineHeight: 17 }]}>{ad.users.phone}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            style={{ backgroundColor: '#F1F5F9', padding: 8, borderRadius: 12 }}
                            onPress={() => setShowContactModal(true)}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
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

                {/* ─── SIMILAR CARS ─── */}
                <View style={[styles.section, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, paddingHorizontal: 0, marginHorizontal: 0 }]}>
                    <Text style={[styles.sectionTitle, { paddingHorizontal: 20 }]}>Similar Cars You Might Like</Text>
                    <TrendingCars
                        fadeAnim={dummyAnim}
                        slideAnim={dummyAnimSlide}
                        trendingCategory="All"
                        setTrendingCategory={() => { }}
                    />
                </View>

            </Animated.ScrollView>

            {/* ─── STICKY FOOTER ─── */}
            <View style={[styles.footerAction, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={styles.mainActionBtn}
                    onPress={() => setShowContactModal(true)}
                >
                    <Text style={styles.mainActionText}>Contact Seller</Text>
                </TouchableOpacity>

                <View style={styles.secondaryActions}>
                    <TouchableOpacity
                        style={styles.secActionBtn}
                        onPress={() => ad.users?.phone && Linking.openURL(`tel:${ad.users.phone}`)}
                    >
                        <Ionicons name="call-outline" size={24} color="#0369A1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secActionBtn}
                        onPress={handleChatWithSeller}
                        disabled={sendingChat}
                    >
                        {sendingChat ? <ActivityIndicator size="small" color="#0369A1" /> : (
                            <Ionicons name="chatbubbles-outline" size={24} color="#0369A1" />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* ─── CONTACT MODAL ─── */}
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

            {/* ─── FULL-SCREEN IMAGE GALLERY MODAL ─── */}
            <ImageGallery
                images={images}
                visible={galleryVisible}
                initialIndex={initialGalleryIndex}
                onClose={() => setGalleryVisible(false)}
            />

            <ReportModal visible={showReportModal} onClose={() => setShowReportModal(false)} onSubmit={handleReportSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFFFF" },

    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', gap: 14 },
    loadingText: { color: '#64748B', fontSize: 15, fontWeight: '500' },

    // FLOATING HEADER
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16, paddingBottom: 12,
        elevation: 10,
        shadowColor: COLORS.primaryDark, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    floatingBackBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    logoCentreFixed: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
        marginTop: 20,
    },
    logoImg: { width: 100, height: 22 },
    floatingShareBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },

    // GALLERY
    // NEW EDGE-TO-EDGE GALLERY
    galleryContainer: { height: 300, width: width, position: 'relative', backgroundColor: 'black' },
    galleryImgFull: { width: '100%', height: '100%' },
    galleryNavRow: { position: 'absolute', left: 16, right: 16, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    galleryTopActions: { flexDirection: 'row', gap: 10 },
    glassCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
    glassBtnActive: { backgroundColor: 'rgba(239,68,68,0.25)' },

    floatingThumbRow: { position: 'absolute', bottom: 15, left: 0, right: 0, zIndex: 110 },
    miniThumb: { width: 75, height: 50, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden', backgroundColor: '#333' },
    miniThumbActive: { borderColor: '#0066FF' },
    miniThumbImg: { width: '100%', height: '100%' },

    photoCountBadge: {
        position: 'absolute', bottom: 15, right: 16, zIndex: 120,
        backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        flexDirection: 'row', alignItems: 'center', gap: 6
    },
    photoCountText: { color: 'white', fontSize: 12, fontWeight: '700' },

    contentHeader: { paddingHorizontal: 16, paddingTop: 16 },
    adTitleBig: { fontSize: 20, fontWeight: '900', color: '#0F172A', textTransform: 'uppercase', letterSpacing: -0.5 },
    headerPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    headerPriceText: { fontSize: 22, fontWeight: '900', color: '#0066FF' },
    headerNegBadge: { backgroundColor: '#E0EEFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#D0E4FF' },
    headerNegText: { color: '#0369A1', fontSize: 12, fontWeight: '700' },
    headerViewsBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
    headerViewsText: { fontSize: 12, color: '#64748B', fontWeight: '600' },

    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
    locationText: { fontSize: 13, color: '#64748B', fontWeight: '600' },

    postedBadge: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, zIndex: 30 },
    postedText: { fontSize: 10, color: 'white', fontWeight: '600' },

    headerTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, marginBottom: 12 },
    headerTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F8FAFC', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9' },
    headerTagText: { fontSize: 11, color: '#64748B', fontWeight: '700' },

    specThreeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    specThreeItem: {
        width: '31.33%', alignItems: 'center', backgroundColor: 'white',
        paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9',
        marginBottom: 4
    },
    specThreeLabel: { fontSize: 10, color: '#64748B', fontWeight: '600', marginTop: 6, textTransform: 'uppercase' },
    specThreeValue: { fontSize: 12, color: '#0F172A', fontWeight: '800', marginTop: 2 },

    section: { backgroundColor: '#F0F7FF', marginHorizontal: 16, marginTop: 20, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#D0E4FF' },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 16 },

    // DESCRIPTION
    descText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '400' },

    // FEATURES
    featuresWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    featureChip: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'white', paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0',
        minWidth: '47%', flexGrow: 1,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1
    },
    featureText: { fontSize: 13, color: '#475569', fontWeight: '700' },

    // SELLER
    sellerCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: '#F8FAFC', padding: 16, borderRadius: 24,
        borderWidth: 1, borderColor: '#E2E8F0'
    },
    sellerAvatar: { width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: '#10B981' },
    sellerAvatarImg: { width: '100%', height: '100%' },
    sellerAvatarGrad: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
    sellerInitial: { color: 'white', fontSize: 22, fontWeight: '800' },
    sellerInfo: { flex: 1 },
    sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    sellerName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    verifiedText: { color: 'white', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
    sellerMeta: { fontSize: 13, color: '#64748B', marginTop: 4, fontWeight: '500' },
    sellerPhone: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginTop: 6 },

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
    footerAction: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'white', paddingHorizontal: 16, paddingVertical: 12,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderTopWidth: 1, borderTopColor: '#E2E8F0'
    },
    mainActionBtn: {
        flex: 1, backgroundColor: '#2563EB', height: 50, borderRadius: 10,
        alignItems: 'center', justifyContent: 'center'
    },
    mainActionText: { color: 'white', fontSize: 16, fontWeight: '800' },
    secondaryActions: { flexDirection: 'row', gap: 12 },
    secActionBtn: {
        width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: '#D0E4FF',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F7FF'
    },

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
