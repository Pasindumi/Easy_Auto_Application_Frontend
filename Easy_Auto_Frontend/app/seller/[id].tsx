import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image as RNImage, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator,
    Linking, RefreshControl, StatusBar, Alert
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

        } catch (error) {
            console.error("Error fetching seller details:", error);
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

    const formatPrice = (price: number) => {
        if (!price) return "N/A";
        if (price >= 1000000) return `Rs. ${(price / 1000000).toFixed(1)}M`;
        if (price >= 1000) return `Rs. ${(price / 1000).toFixed(0)}K`;
        return `Rs. ${price}`;
    };

    if (loading) {
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
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            {/* HEADER */}
            <LinearGradient colors={BRAND_GRAD} style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Seller Profile</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

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
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Text style={styles.sellerName}>{sellerName}</Text>
                        {seller?.verification_status === 'VERIFIED' && (
                            <MaterialIcons name="verified" size={20} color="#10B981" />
                        )}
                    </View>

                    <Text style={styles.sellerSub}>{stats.active} Active Ads</Text>

                    {/* DETAILED INFO LIST */}
                    <View style={styles.detailsContainer}>
                        {seller?.verification_status === 'VERIFIED' && (
                            <View style={styles.detailRow}>
                                <MaterialIcons name="verified-user" size={18} color="#10B981" />
                                <Text style={[styles.detailText, { color: '#10B981', fontWeight: '700' }]}>Verified Seller</Text>
                            </View>
                        )}
                        <View style={styles.detailRow}>
                            <Ionicons name="calendar-outline" size={18} color="#64748B" />
                            <Text style={styles.detailText}>Joined on {joinedDate}</Text>
                        </View>
                        {seller?.phone && (
                            <View style={styles.detailRow}>
                                <Ionicons name="call-outline" size={18} color="#64748B" />
                                <Text style={styles.detailText}>{seller.phone}</Text>
                            </View>
                        )}
                        {seller?.email && (
                            <View style={styles.detailRow}>
                                <Ionicons name="mail-outline" size={18} color="#64748B" />
                                <Text style={styles.detailText}>{seller.email}</Text>
                            </View>
                        )}
                        {seller?.address && (
                            <View style={styles.detailRow}>
                                <Ionicons name="location-outline" size={18} color="#64748B" />
                                <Text style={styles.detailText}>{seller.address}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.contactRow}>
                        <TouchableOpacity style={styles.contactBtn} onPress={handleCall} disabled={!seller?.phone}>
                            <Ionicons name="call" size={20} color={seller?.phone ? COLORS.primary : "#94A3B8"} />
                            <Text style={[styles.contactBtnText, !seller?.phone && { color: "#94A3B8" }]}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactBtn} onPress={handleWhatsApp} disabled={!seller?.phone}>
                            <Ionicons name="logo-whatsapp" size={20} color={seller?.phone ? "#10B981" : "#94A3B8"} />
                            <Text style={[styles.contactBtnText, !seller?.phone && { color: "#94A3B8" }]}>WhatsApp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.contactBtn, sendingChat && { opacity: 0.7 }]}
                            onPress={handleChat}
                            disabled={sendingChat || !id}
                        >
                            {sendingChat ? (
                                <ActivityIndicator size="small" color={COLORS.primary} />
                            ) : (
                                <>
                                    <Ionicons name="chatbubble" size={20} color={COLORS.primary} />
                                    <Text style={styles.contactBtnText}>Chat</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* STATS ROW */}
                <View style={styles.statsWrap}>
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>{stats.active}</Text>
                        <Text style={styles.statLabel}>Active Listings</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statVal}>98%</Text>
                        <Text style={styles.statLabel}>Response Rate</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Ionicons name="star" size={18} color="#F59E0B" />
                        <Text style={styles.statLabel}>Top Seller</Text>
                    </View>
                </View>

                {/* ADS SECTION */}
                <View style={styles.adsSection}>
                    <Text style={styles.sectionTitle}>Vehicles For Sale</Text>

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
    root: { flex: 1, backgroundColor: "#F8FAFC" },
    loadingWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },

    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44, marginTop: 10 },
    backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: 'white' },

    scrollContent: { paddingBottom: 60, paddingTop: 16, paddingHorizontal: 16 },

    profileCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginTop: 10,
        elevation: 6, shadowColor: COLORS.primary, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12,
    },
    avatarWrap: { position: 'relative', marginBottom: 16 },
    avatarImg: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#F1F5F9' },
    avatarGrad: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#F1F5F9' },
    avatarInitial: { fontSize: 36, color: 'white', fontWeight: '800' },
    verifiedBadgeAbsolute: { position: 'absolute', bottom: 2, right: 2, backgroundColor: '#10B981', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white' },

    sellerName: { fontSize: 22, fontWeight: '800', color: '#0F172A' },
    sellerSub: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 16 },

    detailsContainer: { width: '100%', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, marginBottom: 20, gap: 12 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    detailText: { fontSize: 13, color: '#334155', fontWeight: '500', flex: 1 },

    contactRow: { flexDirection: 'row', gap: 12, width: '100%' },
    contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 16 },
    contactBtnText: { fontSize: 13, fontWeight: '700', color: '#334155' },

    statsWrap: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: 'white', borderRadius: 20, padding: 20, marginTop: 16,
        elevation: 3, shadowColor: '#94A3B8', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    statBox: { flex: 1, alignItems: 'center' },
    statVal: { fontSize: 20, fontWeight: '800', color: COLORS.primary, marginBottom: 2 },
    statLabel: { fontSize: 11, color: '#64748B', fontWeight: '600' },
    statDivider: { width: 1, height: 24, backgroundColor: '#E2E8F0' },

    adsSection: { marginTop: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 16 },

    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, backgroundColor: 'white', borderRadius: 20 },
    emptyText: { fontSize: 14, color: '#94A3B8', textAlign: 'center', marginTop: 12, paddingHorizontal: 30 },

    adsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    adCard: {
        width: (width - 44) / 2,
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3, shadowColor: '#0F172A', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    adImgWrap: { height: 110, position: 'relative' },
    adImg: { width: '100%', height: '100%' },
    priceBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    priceText: { color: 'white', fontSize: 11, fontWeight: '800' },
    adBody: { padding: 10 },
    adTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
    adMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
    adMetaText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
    adMetaDot: { fontSize: 11, color: '#CBD5E1' },
    adLocationText: { fontSize: 11, color: '#94A3B8', flex: 1 },
});
