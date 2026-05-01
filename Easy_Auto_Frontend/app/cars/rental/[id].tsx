import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import ImageGallery from '@/components/ui/ImageGallery';

import Loading from '@/components/ui/Loading';

const { width, height } = Dimensions.get('window');
const GALLERY_HEIGHT = height * 0.35;

export default function RentalAdDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { id } = useLocalSearchParams();

    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [sendingChat, setSendingChat] = useState(false);
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [initialGalleryIndex, setInitialGalleryIndex] = useState(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const galleryRef = useRef<FlatList>(null);
    const thumbRef = useRef<FlatList>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    const CARD_WIDTH = width;
    const SNAP_INTERVAL = CARD_WIDTH;

    useEffect(() => {
        if (id) {
            fetchAdDetails();
            checkFavoriteStatus();
        }
    }, [id]);

    const fetchAdDetails = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: any }>(`/api/rentals/${id}`);
            if (response.success) {
                setAd(response.data);
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

    const checkFavoriteStatus = async () => {
        try {
            const res = await api.get<{ success: boolean; isFavorite: boolean }>(`/api/favorites/check/${id}`);
            if (res.success) setIsFavorite(res.isFavorite);
        } catch {}
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

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = event.nativeEvent.contentOffset.x;
        const index = Math.round(x / SNAP_INTERVAL);
        if (index !== activeIndex && index >= 0 && index < (ad?.images?.length || 0)) {
            setActiveIndex(index);
        }
    };

    const scrollToImage = (index: number) => {
        setActiveIndex(index);
        galleryRef.current?.scrollToOffset({ offset: index * SNAP_INTERVAL, animated: true });
        thumbRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
    };

    const handleNativeShare = async () => {
        try {
            const shareMessage = ad ? `Check out this ${ad.title} for rent on EasyAuto!\nhttps://easyauto.lk/cars/rental/${id}` : '';
            await Share.share({ message: shareMessage });
        } catch {}
    };

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
                        adImage: ad.images?.[0]?.image_url
                    }
                });
            }
        } catch (error: any) {
            Alert.alert("Error", "Could not start chat.");
        } finally {
            setSendingChat(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loading}>
                <Stack.Screen options={{ headerShown: false }} />
                <Loading />
                <Text style={styles.loadingText}>Loading rental details...</Text>
            </View>
        );
    }

    if (!ad) return null;

    const images = ad.images || [];
    const details = ad.rental_ad_details || {};
    const isVerified = ad.verification_status === 'VERIFIED';

    const headerOpacity = scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 60, GALLERY_HEIGHT - 20], outputRange: [0, 1], extrapolate: 'clamp' });
    const headerTitleOpacity = scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 40, GALLERY_HEIGHT], outputRange: [0, 1], extrapolate: 'clamp' });
    const headerElevation = scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 40, GALLERY_HEIGHT], outputRange: [0, 8], extrapolate: 'clamp' });



    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* ─── DYNAMIC SCROLLING HEADER ─── */}
            <Animated.View
                pointerEvents="box-none"
                style={[
                    styles.floatingHeader, 
                    { 
                        paddingTop: insets.top + 8, 
                        opacity: headerOpacity,
                        elevation: headerElevation,
                        shadowOpacity: scrollY.interpolate({ inputRange: [GALLERY_HEIGHT - 40, GALLERY_HEIGHT], outputRange: [0, 0.2], extrapolate: 'clamp' })
                    }
                ]}
            >
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </TouchableOpacity>

                <Animated.View style={[styles.headerTitleContainer, { opacity: headerTitleOpacity }]}>
                    <Text style={styles.headerTitleText} numberOfLines={1}>{ad.title}</Text>
                    <Text style={styles.headerPriceSubText}>Rs. {ad.price_per_day?.toLocaleString()} / Day</Text>
                </Animated.View>

                <TouchableOpacity style={styles.headerBtn} onPress={handleNativeShare}>
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
                            <TouchableOpacity 
                                activeOpacity={0.9} 
                                style={{ width: width, height: GALLERY_HEIGHT }}
                                onPress={() => {
                                    setInitialGalleryIndex(index);
                                    setGalleryVisible(true);
                                }}
                            >
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={styles.galleryImgFull} contentFit="contain" />
                                ) : (
                                    <View style={[styles.galleryImgFull, { backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="image" size={60} color="#E2E8F0" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    <View style={[styles.galleryNavRow, { top: insets.top + 10 }]}>
                        <TouchableOpacity style={styles.glassCircle} onPress={() => router.back()}>
                            <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                        
                        <View style={styles.galleryTopActions}>
                            <View style={styles.photoCountBadgeSm}>
                                <Text style={styles.photoCountText}>{activeIndex + 1} / {images.length || 1}</Text>
                            </View>
                            <TouchableOpacity style={styles.glassCircle} onPress={handleNativeShare}>
                                <Ionicons name="share-social" size={18} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.glassCircle, isFavorite && styles.glassBtnActive]}
                                onPress={handleToggleFavorite}
                                disabled={favoriteLoading}
                            >
                                <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={20} color={isFavorite ? "#EF4444" : COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>

                {/* ─── MINI THUMBNAILS PREVIEW ─── */}
                <View style={styles.thumbnailSection}>
                    <FlatList
                        ref={thumbRef}
                        data={images}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(_, index) => index.toString()}
                        contentContainerStyle={styles.thumbnailListContent}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                onPress={() => scrollToImage(index)}
                                style={[
                                    styles.miniThumb,
                                    activeIndex === index && styles.miniThumbActive
                                ]}
                            >
                                <Image source={{ uri: item.image_url }} style={styles.miniThumbImg} contentFit="cover" />
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* ─── CONTENT HEADER ─── */}
                <View style={styles.contentHeader}>
                    <View style={styles.mainInfoRow}>
                        <View style={styles.titleLocationCol}>
                            <Text style={styles.adTitleBig} numberOfLines={2}>{ad.title}</Text>
                            {ad.location && (
                                <View style={styles.locationRow}>
                                    <Ionicons name="location" size={14} color={COLORS.primary} />
                                    <Text style={styles.locationText}>{ad.location}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.priceCol}>
                            <Text style={styles.headerPriceText}>Rs. {ad.price_per_day?.toLocaleString()}</Text>
                            <View style={styles.headerNegBadge}>
                                <Text style={styles.headerNegText}>Per Day</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ─── RENTAL PRICING OPTIONS ─── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rental Pricing</Text>
                    <View style={styles.pricingTable}>
                        <View style={styles.tableRow}>
                            <View style={styles.tableLabelCol}>
                                <Ionicons name="calendar-outline" size={18} color="#64748B" />
                                <Text style={styles.tableLabel}>Daily Rate</Text>
                            </View>
                            <Text style={styles.tableValue}>Rs. {ad.price_per_day?.toLocaleString()}</Text>
                        </View>
                        
                        {ad.price_per_week && (
                            <View style={[styles.tableRow, styles.tableRowBorder]}>
                                <View style={styles.tableLabelCol}>
                                    <Ionicons name="repeat-outline" size={18} color="#64748B" />
                                    <Text style={styles.tableLabel}>Weekly Rate</Text>
                                </View>
                                <Text style={styles.tableValue}>Rs. {ad.price_per_week?.toLocaleString()}</Text>
                            </View>
                        )}

                        {ad.price_per_month && (
                            <View style={[styles.tableRow, styles.tableRowBorder]}>
                                <View style={styles.tableLabelCol}>
                                    <Ionicons name="calendar-sharp" size={18} color="#64748B" />
                                    <Text style={styles.tableLabel}>Monthly Rate</Text>
                                </View>
                                <Text style={styles.tableValue}>Rs. {ad.price_per_month?.toLocaleString()}</Text>
                            </View>
                        )}
                    </View>
                </View>



                {/* ─── RENTAL CONDITIONS ─── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rental Conditions</Text>
                    <View style={styles.conditionsWrap}>
                        <View style={styles.conditionChip}>
                            <Ionicons name="person-outline" size={18} color="#64748B" />
                            <Text style={styles.conditionChipText}>Min Age: {ad.min_age || '21'}+</Text>
                        </View>
                        <View style={styles.conditionChip}>
                            <Ionicons name="speedometer-outline" size={18} color="#64748B" />
                            <Text style={styles.conditionChipText}>Limit: {ad.daily_mileage_limit || '100'} km/day</Text>
                        </View>
                        <View style={styles.conditionChip}>
                            <MaterialCommunityIcons name={ad.allow_smoking ? "smoking" : "smoking-off"} size={18} color="#64748B" />
                            <Text style={styles.conditionChipText}>{ad.allow_smoking ? "Smoking Allowed" : "No Smoking"}</Text>
                        </View>
                        <View style={styles.conditionChip}>
                            <Ionicons name="paw-outline" size={18} color="#64748B" />
                            <Text style={styles.conditionChipText}>{ad.allow_pets ? "Pets Allowed" : "No Pets"}</Text>
                        </View>
                    </View>
                    {ad.security_deposit > 0 && (
                        <View style={styles.depositAlert}>
                            <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                            <Text style={styles.depositText}>Security Deposit: Rs. {ad.security_deposit.toLocaleString()}</Text>
                        </View>
                    )}
                </View>

                {/* ─── DESCRIPTION ─── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About this Rental</Text>
                    <Text style={styles.descText}>{ad.description || "No specific rules provided."}</Text>
                    {ad.other_conditions && (
                        <Text style={[styles.descText, { marginTop: 12, color: '#64748B', fontStyle: 'italic' }]}>{ad.other_conditions}</Text>
                    )}
                </View>

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
                                <Text style={styles.sellerName} numberOfLines={1}>{ad.users?.name || "Verified Owner"}</Text>
                                <View style={styles.verifiedBadge}>
                                    <MaterialCommunityIcons name="check-decagram" size={12} color="#16A34A" />
                                    <View style={{ width: 2 }} />
                                    <Text style={styles.verifiedText}>Verified</Text>
                                </View>
                            </View>
                            <Text style={styles.sellerMeta}>Joined {ad.users?.created_at ? new Date(ad.users.created_at).getFullYear() : 'Unknown'}</Text>
                            {ad.users?.phone && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
                                    <Ionicons name="call" size={14} color={COLORS.primary} />
                                    <Text style={styles.sellerPhone}>{ad.users.phone}</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity 
                            style={{ backgroundColor: '#F1F5F9', padding: 8, borderRadius: 12 }}
                            onPress={() => setShowContactModal(true)}
                        >
                            <Ionicons name="chevron-forward" size={20} color="#64748B" />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>

            {/* ─── STICKY FOOTER ─── */}
            <View style={[styles.footerAction, { paddingBottom: insets.bottom + 12 }]}>
                {user?.id === ad.seller_id && ad.status !== 'ACTIVE' ? (
                    <TouchableOpacity
                        style={styles.mainActionBtn}
                        onPress={() => router.push({ pathname: '/cars/create-rental-ad', params: { id: id as string } } as any)}
                    >
                        <Text style={styles.mainActionText}>Edit Rental Details</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.mainActionBtn}
                            onPress={handleChatWithSeller}
                            disabled={sendingChat}
                        >
                            {sendingChat ? <ActivityIndicator size="small" color="white" /> : (
                                <Text style={styles.mainActionText}>Chat to Rent</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.secondaryActions}>
                            <TouchableOpacity
                                style={styles.secActionBtn}
                                onPress={() => setShowContactModal(true)}
                            >
                                <Ionicons name="call" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.secActionBtn}
                                onPress={handleNativeShare}
                            >
                                <Ionicons name="share-social" size={24} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>

            {/* ─── CONTACT MODAL ─── */}
            <Modal visible={showContactModal} transparent animationType="slide" onRequestClose={() => setShowContactModal(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowContactModal(false)}>
                    <View style={[styles.contactSheet, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.sheetHandle} />
                        <Text style={styles.contactSheetTitle}>Contact Owner</Text>
                        <View style={styles.sellerCardLg}>
                            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.sellerAvatarLg}>
                                <Text style={styles.sellerInitialLg}>{ad.users?.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                            </LinearGradient>
                            <Text style={styles.sellerNameLg}>{ad.users?.name || "Verified Owner"}</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F8FAFC" },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F1F5F9', gap: 14 },
    loadingText: { color: '#64748B', fontSize: 15, fontWeight: '500' },

    // DYNAMIC HEADER
    floatingHeader: {
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 200,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16, paddingBottom: 12,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
    },
    headerBtn: { 
        width: 42, height: 42, borderRadius: 21, 
        alignItems: 'center', justifyContent: 'center', 
        backgroundColor: 'rgba(255,255,255,0.15)' 
    },
    headerTitleContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 12 },
    headerTitleText: { color: 'white', fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
    headerPriceSubText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '700' },

    // GALLERY
    galleryContainer: { height: GALLERY_HEIGHT, width: width, position: 'relative', backgroundColor: '#EFF6FF' },
    galleryNavRow: { position: 'absolute', left: 16, right: 16, zIndex: 100, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    galleryTopActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    glassCircle: { 
        width: 32, height: 32, borderRadius: 16, 
        backgroundColor: '#FFFFFF', 
        alignItems: 'center', justifyContent: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    glassBtnActive: { backgroundColor: '#FFFFFF' },
    photoCountBadgeSm: {
        backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
        marginRight: 4, height: 24, justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3
    },
    photoCountText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },
    
    thumbnailSection: {
        backgroundColor: '#F8FAFC',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    thumbnailListContent: {
        paddingHorizontal: 16,
        gap: 8,
        flexGrow: 1,
        justifyContent: 'center',
    },
    miniThumb: { width: 75, height: 50, borderRadius: 12, borderWidth: 2, borderColor: 'transparent', overflow: 'hidden', backgroundColor: '#FFF' },
    miniThumbActive: { borderColor: COLORS.primary },
    miniThumbImg: { width: '100%', height: '100%' },
    galleryImgFull: { width: '100%', height: '100%' },

    contentHeader: { 
        paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
    },
    mainInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    titleLocationCol: { flex: 1 },
    priceCol: { alignItems: 'flex-end' },
    adTitleBig: { fontSize: 20, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
    headerPriceText: { fontSize: 20, fontWeight: '800', color: COLORS.primary },
    headerNegBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
    headerNegText: { color: '#64748B', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },

    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
    locationText: { fontSize: 12, color: '#64748B', fontWeight: '500' },

    section: { 
        backgroundColor: 'white',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
    },
    sectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12, letterSpacing: -0.3 },

    // PRICING TABLE
    pricingTable: { backgroundColor: '#F8FAFC', borderRadius: 8, padding: 2 },
    tableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
    tableRowBorder: { borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    tableLabelCol: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    tableLabel: { fontSize: 13, color: '#475569', fontWeight: '700' },
    tableValue: { fontSize: 16, fontWeight: '900', color: COLORS.primary },

    // CONDITIONS
    conditionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    conditionChip: { 
        flexDirection: 'row', alignItems: 'center', gap: 8, 
        backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 8, 
        borderRadius: 8, flexGrow: 1, minWidth: '45%'
    },
    conditionChipText: { fontSize: 13, color: '#475569', fontWeight: '700' },
    depositAlert: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', 
        padding: 16, borderRadius: 8, marginTop: 16, gap: 12,
        borderWidth: 1, borderColor: '#BFDBFE'
    },
    depositText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

    // DESCRIPTION
    descText: { fontSize: 15, color: '#475569', lineHeight: 24, fontWeight: '400' },

    // SELLER
    sellerCard: {
        flexDirection: 'row', alignItems: 'center', gap: 16,
        backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8,
        borderWidth: 1, borderColor: '#BFDBFE'
    },
    sellerAvatar: { width: 56, height: 56, borderRadius: 28, overflow: 'hidden', borderWidth: 2, borderColor: '#10B981' },
    sellerAvatarImg: { width: '100%', height: '100%' },
    sellerAvatarGrad: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
    sellerInitial: { color: 'white', fontSize: 20, fontWeight: '900' },
    sellerInfo: { flex: 1 },
    sellerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sellerName: { fontSize: 16, fontWeight: '900', color: '#0F172A', flexShrink: 1 },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5 },
    verifiedText: { color: '#16A34A', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    sellerMeta: { fontSize: 13, color: '#94A3B8', marginTop: 4, fontWeight: '700' },
    sellerPhone: { fontSize: 14, color: COLORS.primary, fontWeight: '800', marginTop: 6 },

    // FOOTER
    footerAction: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 14,
        flexDirection: 'row', alignItems: 'center', gap: 12,
        borderTopWidth: 1, borderTopColor: '#F1F5F9',
        shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10
    },
    mainActionBtn: {
        flex: 1, backgroundColor: COLORS.primary, height: 54, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
    },
    mainActionText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
    secondaryActions: { flexDirection: 'row', gap: 12 },
    secActionBtn: {
        width: 54, height: 54, borderRadius: 18, borderWidth: 1, borderColor: '#F1F5F9',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC'
    },

    // CONTACT MODAL
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
    contactSheet: { backgroundColor: 'white', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 10 },
    sheetHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    contactSheetTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A', textAlign: 'center', marginBottom: 24, letterSpacing: -0.5 },
    sellerCardLg: { alignItems: 'center', marginBottom: 32, gap: 12 },
    sellerAvatarLg: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    sellerInitialLg: { color: 'white', fontSize: 32, fontWeight: '900' },
    sellerNameLg: { fontSize: 20, fontWeight: '900', color: '#0F172A' },
    contactOptions: { gap: 16 },
    contactOption: { 
        flexDirection: 'row', alignItems: 'center', gap: 16, 
        backgroundColor: '#F8FAFC', padding: 16, borderRadius: 8,
        borderWidth: 1, borderColor: '#BFDBFE'
    },
    contactOptionIcon: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    contactOptionLabel: { fontSize: 17, fontWeight: '800', color: '#1E293B', flex: 1 },
    contactOptionSub: { fontSize: 12, color: '#64748B', fontWeight: '700' },
});

