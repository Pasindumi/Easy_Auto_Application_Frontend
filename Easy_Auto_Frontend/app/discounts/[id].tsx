import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import { Image } from "expo-image";
import Header from '../../components/Header';
import COLORS from '../../constants/Colors';
import { api } from '@/utils/api';

const { width } = Dimensions.get("window");

export default function DiscountDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [discount, setDiscount] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDiscount();
        }
    }, [id]);

    const fetchDiscount = async () => {
        try {
            setLoading(true);
            const data: any = await api.get(`/api/discounts/${id}`);
            setDiscount(data);
        } catch (err) {
            console.error('Error loading discount detail', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: "long",
            day: "numeric"
        });
    };

    if (loading) {
        return (
            <View style={styles.safe}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 12, color: '#666' }}>Loading offer...</Text>
                </View>
            </View>
        );
    }

    if (!discount) {
        return (
            <View style={styles.safe}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header />
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color="#999" />
                    <Text style={{ marginTop: 12, color: '#999' }}>Offer not found.</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
                        <Ionicons name="chevron-back" size={22} color="#111" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Offer Details</Text>
                </View>

                {/* Hero Card */}
                <View style={[styles.heroCard, { backgroundColor: discount.color_theme || "#235CF8" }]}>
                    {discount.offer_image_url && (
                        <Image
                            source={{ uri: discount.offer_image_url }}
                            style={StyleSheet.absoluteFillObject}
                            contentFit="cover"
                        />
                    )}
                    <View style={[styles.heroOverlay, discount.offer_image_url && styles.imageOver]}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>SPECIAL OFFER</Text>
                        </View>
                        <Text style={styles.heroTitle}>{discount.name}</Text>
                        <Text style={styles.heroValue}>
                            {discount.discount_type === 'PERCENTAGE' ? `${discount.value}% OFF` : `$${discount.value} OFF`}
                        </Text>
                    </View>
                </View>

                {/* Details Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Offer Validity</Text>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Valid From</Text>
                            <Text style={styles.infoValueText}>{formatDate(discount.start_date)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={20} color="#EF4444" />
                        <View style={styles.infoText}>
                            <Text style={styles.infoLabel}>Expires On</Text>
                            <Text style={styles.infoValueText}>{formatDate(discount.end_date)}</Text>
                        </View>
                    </View>
                </View>

                {/* Requirements Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Requirements & Eligibility</Text>
                    {discount.is_first_time_user && (
                        <View style={styles.featureRow}>
                            <Ionicons name="person-add-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.featureText}>Exclusive for first-time users</Text>
                        </View>
                    )}
                    {discount.min_bulk_ads > 0 && (
                        <View style={styles.featureRow}>
                            <Ionicons name="layers-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.featureText}>Minimum {discount.min_bulk_ads} ads required</Text>
                        </View>
                    )}
                    {!discount.is_first_time_user && discount.min_bulk_ads === 0 && (
                        <View style={styles.featureRow}>
                            <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
                            <Text style={styles.featureText}>Available for all users</Text>
                        </View>
                    )}
                </View>

                {/* Linked Packages */}
                {discount.discount_packages && discount.discount_packages.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Applicable Packages</Text>
                        <View style={styles.linkedContainer}>
                            {discount.discount_packages.map((pkg: any, idx: number) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.linkedItem}
                                    onPress={() => router.push(`/packages/${pkg.package_id}`)}
                                >
                                    <View style={styles.linkedIcon}>
                                        <Ionicons name="cube-outline" size={16} color={COLORS.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.linkedName}>{pkg.price_items?.name || "Package"}</Text>
                                        <Text style={styles.linkedAction}>View Package Details</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={16} color="#999" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Linked Vehicles */}
                {discount.discount_vehicle_types && discount.discount_vehicle_types.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Applicable Vehicle Types</Text>
                        <View style={styles.tagContainer}>
                            {discount.discount_vehicle_types.map((vt: any, idx: number) => (
                                <View key={idx} style={styles.tag}>
                                    <Text style={styles.tagText}>{vt.vehicle_types?.type_name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: discount.color_theme || COLORS.primary }]}
                    onPress={() => {
                        const packageId = discount.discount_packages?.[0]?.package_id;
                        if (packageId) router.push(`/packages/${packageId}`);
                        else router.push('/packages/packages');
                    }}
                >
                    <Text style={styles.primaryButtonText}>Go to Linked Package</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F9FAFB' },
    container: { padding: 16, paddingBottom: 40 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    backButton: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: COLORS.primary },
    backText: { color: '#fff', fontWeight: '700' },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    iconWrap: { padding: 8, borderRadius: 12, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
    title: { fontSize: 20, fontWeight: '800', color: '#111' },
    heroCard: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    heroOverlay: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    imageOver: {
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
    heroTitle: { color: '#fff', fontSize: 28, fontWeight: '900', marginBottom: 4 },
    heroValue: { color: '#fff', fontSize: 22, fontWeight: '700', opacity: 0.9 },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 16 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    infoText: { marginLeft: 12, flex: 1 },
    infoLabel: { fontSize: 12, color: '#64748B', marginBottom: 2 },
    infoValueText: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
    featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    featureText: { marginLeft: 10, fontSize: 14, color: '#475569', fontWeight: '600' },
    linkedContainer: { gap: 12 },
    linkedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    linkedIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    linkedName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
    linkedAction: { fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 2 },
    tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    tagText: { fontSize: 13, fontWeight: '600', color: '#475569' },
    primaryButton: {
        marginTop: 8,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
    },
    primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
