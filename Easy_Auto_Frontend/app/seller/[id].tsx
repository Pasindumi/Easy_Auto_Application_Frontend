import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image as RNImage, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator,
    Linking, RefreshControl, StatusBar, Alert, Share
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import COLORS from '@/constants/Colors';
import { api } from '@/utils/api';
import AdCard from '@/components/cards/AdCard';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const BRAND_GRAD: [string, string] = ["#235CF8", "#1E4DB7"];

export default function SellerProfileScreen() {
    const router = useRouter();
    const { id, sellerData } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { user } = useAuth();

    const [seller, setSeller] = useState<any>(null);
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({ active: 0, totalViews: 0 });
    const [sendingChat, setSendingChat] = useState(false);
    const [notFound, setNotFound] = useState(false);

    const fetchSellerData = useCallback(async () => {
        if (!refreshing) setLoading(true);
        try {
            // Priority 1: Use passed sellerData from the previous screen as pre-fill
            if (sellerData && typeof sellerData === 'string') {
                try {
                    setSeller(JSON.parse(sellerData));
                } catch (e) { }
            }

            // Priority 2: Fetch fresh seller user details from the dedicated endpoint
            const userRes = await api.get<{ success: boolean; data: any }>(`/api/users/${id}`).catch(() => null);
            if (userRes?.success) {
                setSeller(userRes.data);
            }

            // Fetch seller's active ads using the new backend filter
            const adsRes = await api.get<{ success: boolean; data: any[] }>(`/api/cars?sellerId=${id}`).catch(() => null);

            let fetchedAds = [];
            if (adsRes?.success && Array.isArray(adsRes.data)) {
                fetchedAds = adsRes.data;
            }

            setAds(fetchedAds);

            // Calculate stats
            let totalViews = 0;
            fetchedAds.forEach((a: any) => { totalViews += (a.views_count || 0) });
            setStats({ active: fetchedAds.length, totalViews });

        } catch (error: any) {
            console.error("Error fetching seller details:", error);
            if (error.message?.includes("not found") || error.status === 404) {
                setNotFound(true);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id, refreshing, sellerData]);

    useEffect(() => {
        if (id) fetchSellerData();
    }, [id, fetchSellerData]);

    const handleWhatsApp = () => {
        if (!seller?.phone) return;
        Linking.openURL(`https://wa.me/${seller.phone.replace(/[^0-9]/g, '')}`);
    };

    const handleCall = () => {
        if (!seller?.phone) return;
        Linking.openURL(`tel:${seller.phone}`);
    };

    const handleChat = async () => {
        if (!id) return;
        if (!user) {
            Alert.alert("Login Required", "Please login to chat with the seller.");
            return;
        }
        if (user.id === id) {
            Alert.alert("Info", "This is your own profile.");
            return;
        }

        setSendingChat(true);
        try {
            const res = await api.post<{ success: boolean; data: { id: string } }>('/api/chat/conversations', {
                participantId: id
            });
            if (res.success) {
                router.push(`/chat/${res.data.id}` as any);
            } else {
                Alert.alert("Error", "Failed to start conversation.");
            }
        } catch (error) {
            console.error("Chat Error:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setSendingChat(false);
        }
    };

    const handleShareProfile = async () => {
        try {
            const shareUrl = `https://easyauto.lk/seller/${id}`;
            await Share.share({
                message: `Check out ${sellerName}'s profile on EasyAuto!\n${shareUrl}`,
            });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.error("Share error:", error);
        }
    };

    const formatPrice = (price: number) => {
        if (!price) return "N/A";
        if (price >= 1000000) return `Rs. ${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `Rs. ${(price / 1000).toFixed(0)}K`;
        return `Rs. ${price}`;
    };

    if (notFound && !seller) {
        return (
            <View style={styles.root}>
                <Header title="Seller Profile" showBack={true} />
                <View style={styles.emptyStateContainer}>
                    <Ionicons name="person-remove-outline" size={64} color="#CBD5E1" />
                    <Text style={styles.emptyHeader}>Seller Not Found</Text>
                    <Text style={styles.emptySub}>The seller account you are looking for may have been deleted or moved.</Text>
                    <TouchableOpacity style={styles.backButtonAction} onPress={() => router.back()}>
                        <Text style={styles.backButtonActionText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading && !seller) {
        return (
            <View style={styles.loadingWrapper}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const sellerName = seller?.name || "Private Seller";
    const initial = sellerName.charAt(0).toUpperCase();

    // Format full date, e.g., "January 15, 2024"
    const joinedDateObj = seller?.created_at ? new Date(seller.created_at) : new Date();
    const joinedDate = joinedDateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <View style={styles.root}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header 
                title="Seller Profile" 
                showBack={true} 
                rightElement={
                    <TouchableOpacity onPress={handleShareProfile}>
                        <Ionicons name="share-social-outline" size={22} color="white" />
                    </TouchableOpacity>
                }
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} tintColor={COLORS.primary} />}
            >
                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        {seller?.avatar ? (
                            <Image source={{ uri: seller.avatar }} style={styles.avatarImg} contentFit="cover" />
                        ) : (
                            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.avatarGrad}>
                                <Text style={styles.avatarInitial}>{initial}</Text>
                            </LinearGradient>
                        )}
                        {seller?.verification_status === 'VERIFIED' && (
                            <View style={styles.verifiedBadgeAbsolute}>
                                <Ionicons name="checkmark-sharp" size={14} color="white" />
                            </View>
                        )}
                    </View>

                    <Text style={styles.sellerName}>{sellerName}</Text>
                    <View style={styles.joinedBadge}>
                        <Ionicons name="calendar-outline" size={12} color="#64748B" />
                        <Text style={styles.joinedText}>Member Since {joinedDate}</Text>
                    </View>

                    <View style={styles.contactActions}>
                        <TouchableOpacity style={styles.contactIconBtn} onPress={handleCall} disabled={!seller?.phone}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0F9FF' }]}>
                                <Ionicons name="call" size={20} color={COLORS.primary} />
                            </View>
                            <Text style={styles.iconLabel}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.contactIconBtn} onPress={handleWhatsApp} disabled={!seller?.phone}>
                            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
                                <Ionicons name="logo-whatsapp" size={22} color="#10B981" />
                            </View>
                            <Text style={styles.iconLabel}>WhatsApp</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.contactIconBtn, sendingChat && { opacity: 0.7 }]}
                            onPress={handleChat}
                            disabled={sendingChat || !id}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#FFF7ED' }]}>
                                {sendingChat ? (
                                    <ActivityIndicator size="small" color="#F97316" />
                                ) : (
                                    <Ionicons name="chatbubbles" size={20} color="#F97316" />
                                )}
                            </View>
                            <Text style={styles.iconLabel}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STATS OVERVIEW */}
                <View style={styles.statsOverview}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{stats.active}</Text>
                        <Text style={styles.statTitle}>Active Ads</Text>
                    </View>
                    <View style={styles.vDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>98%</Text>
                        <Text style={styles.statTitle}>Resp. Rate</Text>
                    </View>
                    <View style={styles.vDivider} />
                    <View style={styles.statItem}>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#F59E0B" />
                            <Text style={styles.statNumber}>4.9</Text>
                        </View>
                        <Text style={styles.statTitle}>Top Seller</Text>
                    </View>
                </View>

                {/* ADS SECTION */}
                <View style={[styles.adsSection, { marginTop: 12 }]}>
                    <Text style={styles.sectionHeader}>Vehicles for Sale</Text>

                    {ads.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="car-sport-outline" size={48} color="#CBD5E1" />
                            <Text style={styles.emptyText}>This seller doesn't have any active ads right now.</Text>
                        </View>
                    ) : (
                        <View style={styles.adsGrid}>
                            {ads.map((adItem) => {
                                const details = Array.isArray(adItem.CarDetails) ? adItem.CarDetails[0] : (adItem.CarDetails || {});
                                const imageUrl = adItem.AdImage?.[0]?.image_url;
                                return (
                                    <TouchableOpacity
                                        key={adItem.id}
                                        style={styles.adCard}
                                        activeOpacity={0.9}
                                        onPress={() => router.push(`/cars/${adItem.id}` as any)}
                                    >
                                        <View style={styles.adImgWrap}>
                                            <Image
                                                source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                                style={styles.adImg}
                                                contentFit="cover"
                                            />
                                            <View style={styles.priceBadge}>
                                                <Text style={styles.priceText}>{formatPrice(adItem.price)}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.adBody}>
                                            <Text style={styles.adTitle} numberOfLines={1}>{adItem.title || `${details.brand} ${details.model}`}</Text>
                                            <View style={styles.adMetaRow}>
                                                {details.year && <Text style={styles.adMetaText}>{details.year}</Text>}
                                                {details.year && details.mileage && <Text style={styles.adMetaDot}>┬╖</Text>}
                                                {details.mileage && <Text style={styles.adMetaText}>{Number(details.mileage).toLocaleString()} km</Text>}
                                            </View>
                                            <View style={styles.adMetaRow}>
                                                <Ionicons name="location-outline" size={12} color="#94A3B8" />
                                                <Text style={styles.adLocationText} numberOfLines={1}>{adItem.location || 'Sri Lanka'}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F8FAFF" },
    loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFF' },
    scrollContent: { padding: 20, paddingBottom: 60 },

    profileCard: {
        backgroundColor: 'white',
        borderRadius: 32,
        padding: 24,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 10,
    },
    avatarWrap: { 
        position: 'relative', 
        marginBottom: 16,
        padding: 4,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: COLORS.primary + '20',
    },
    avatarImg: { 
        width: 100, 
        height: 100, 
        borderRadius: 50,
    },
    avatarGrad: { 
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    avatarInitial: { fontSize: 40, color: 'white', fontWeight: '900' },
    verifiedBadgeAbsolute: { 
        position: 'absolute', 
        bottom: 2, 
        right: 2, 
        backgroundColor: '#10B981', 
        width: 28, 
        height: 28, 
        borderRadius: 14, 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderWidth: 3, 
        borderColor: 'white' 
    },

    sellerName: { 
        fontSize: 24, 
        fontWeight: '900', 
        color: '#0F172A', 
        letterSpacing: -0.8 
    },
    joinedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginTop: 8,
    },
    joinedText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },

    contactActions: {
        flexDirection: 'row',
        gap: 20,
        width: '100%',
        marginTop: 24,
        justifyContent: 'center',
    },
    contactIconBtn: {
        alignItems: 'center',
        gap: 8,
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },
    iconLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E293B',
    },

    statsOverview: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
    },
    statTitle: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '700',
        marginTop: 4,
        textTransform: 'uppercase',
    },
    vDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#F1F5F9',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },

    adsSection: {
        marginTop: 32,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 20,
        letterSpacing: -0.5,
    },

    emptyState: { 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingVertical: 60, 
        backgroundColor: 'white', 
        borderRadius: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#CBD5E1',
    },
    emptyText: { 
        fontSize: 14, 
        color: '#94A3B8', 
        textAlign: 'center', 
        marginTop: 16, 
        fontWeight: '500', 
        lineHeight: 20,
        paddingHorizontal: 40 
    },

    adsGrid: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
    adCard: {
        width: (width - 56) / 2,
        backgroundColor: 'white',
        borderRadius: 24,
        marginBottom: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    adImgWrap: { 
        height: 120, 
        position: 'relative' 
    },
    adImg: { width: '100%', height: '100%' },
    priceBadge: { 
        position: 'absolute', 
        bottom: 10, 
        left: 10, 
        backgroundColor: COLORS.primary, 
        paddingHorizontal: 10, 
        paddingVertical: 5, 
        borderRadius: 12 
    },
    priceText: { color: 'white', fontSize: 12, fontWeight: '900' },
    adBody: { padding: 12 },
    adTitle: { 
        fontSize: 14, 
        fontWeight: '800', 
        color: '#0F172A', 
        marginBottom: 6 
    },
    adMetaRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 4, 
        marginBottom: 4 
    },
    adMetaText: { 
        fontSize: 11, 
        color: '#64748B', 
        fontWeight: '600' 
    },
    adMetaDot: { 
        fontSize: 11, 
        color: '#CBD5E1' 
    },
    adLocationText: { 
        fontSize: 11, 
        color: '#94A3B8', 
        flex: 1,
        fontWeight: '500' 
    },

    emptyStateContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: 'white',
    },
    emptyHeader: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        marginTop: 20,
    },
    emptySub: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 10,
        lineHeight: 22,
    },
    backButtonAction: {
        marginTop: 30,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
    },
    backButtonActionText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 15,
    },
});


