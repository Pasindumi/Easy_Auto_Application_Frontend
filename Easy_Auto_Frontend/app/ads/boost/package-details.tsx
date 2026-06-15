import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from '../../../components/ui/Loading';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Header from '../../../components/Header';
import { COLORS } from '../../../constants/Colors';
import { api } from '@/utils/api';

export default function BoostPackageDetailScreen() {
    const { adId, packageId } = useLocalSearchParams();
    const router = useRouter();

    const [pkg, setPkg] = useState<any | null>(null);
    const [adDetails, setAdDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const activating = false;

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Fetch Ad Details
            const adResponse = await api.get<{ success: boolean; data: any }>(`/api/cars/${adId}`);
            if (adResponse.success) {
                setAdDetails(adResponse.data);
            }

            // 2. Fetch Packages for the vehicle type of this ad
            const vehicleTypeId = adResponse.data?.vehicle_type_id;
            const pkgResponse = await api.get<any[]>(`/api/boosts/packages?vehicleTypeId=${vehicleTypeId}`);

            if (Array.isArray(pkgResponse)) {
                const found = pkgResponse.find(p => String(p.id) === String(packageId));
                setPkg(found || null);
            }
        } catch (error) {
            console.error('Error loading boost detail', error);
            Alert.alert("Error", "Failed to load boost package details.");
        } finally {
            setLoading(false);
        }
    }, [adId, packageId]);

    useEffect(() => {
        if (adId && packageId) {
            fetchData();
        }
    }, [adId, packageId, fetchData]);

    const handleActivate = () => {
        router.push({
            pathname: '/payments/invoice',
            params: {
                packageId: packageId,
                adId: adId,
                plan: pkg.name,
                price: price,
                days: duration
            }
        });
    };

    if (loading) {
        return (
            <View style={styles.safe}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title="Boost Details" />
                <View style={styles.centered}>
                    <Loading size="large" message="Loading details..." />
                </View>
            </View>
        );
    }

    if (!pkg) {
        return (
            <View style={styles.safe}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title="Boost Details" />
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color="#999" />
                    <Text style={{ marginTop: 12, color: '#999' }}>Boost package not found.</Text>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const price = pkg.rules?.[0]?.price || 0;
    const duration = parseInt(pkg.config?.DURATION_DAYS || '0');

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Boost Details" />

            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
            >
                {/* Package Info */}
                <View style={styles.heroCard}>
                    <View style={styles.heroHeader}>
                        <View style={styles.heroInfo}>
                            <Text style={[styles.packageCode, { color: pkg.config?.COLOR_THEME || COLORS.primary }]}>{pkg.code}</Text>
                            <Text style={styles.packageName}>{pkg.name}</Text>
                        </View>
                        <View style={[styles.badgeIcon, { backgroundColor: pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}20` : '#E0E7FF' }]}>
                            <Ionicons name="rocket" size={28} color={pkg.config?.COLOR_THEME || COLORS.primary} />
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.priceLabel}>Total amount</Text>
                            <Text style={styles.priceValue}>LKR {price.toLocaleString()}</Text>
                        </View>
                        <View style={styles.durationBadge}>
                            <Ionicons name="time-outline" size={14} color="#64748b" />
                            <Text style={styles.durationValue}>{duration} days</Text>
                        </View>
                    </View>
                </View>

                {/* Ad Context - Applying to */}
                {adDetails && (
                    <View style={styles.contextSection}>
                        <Text style={styles.sectionHeading}>Target Advertisement</Text>
                        <View style={styles.adRefCard}>
                            <View style={styles.adIconBox}>
                                <Ionicons name="car" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.adInfo}>
                                <Text style={styles.adRefTitle} numberOfLines={1}>{adDetails.title}</Text>
                                <Text style={styles.adRefLocation}>{adDetails.location || "Sri Lanka"}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Features */}
                <View style={styles.featuresSection}>
                    <Text style={styles.sectionHeading}>Package Includes</Text>
                    {pkg.included_items && pkg.included_items.length > 0 ? (
                        pkg.included_items.map((it: any) => (
                            <View key={it.id} style={styles.featureItem}>
                                <View style={[styles.checkCircle, { backgroundColor: pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}10` : '#f0f9ff' }]}>
                                    <Ionicons name="checkmark" size={16} color={pkg.config?.COLOR_THEME || COLORS.primary} />
                                </View>
                                <View style={styles.featureTextContainer}>
                                    <Text style={styles.featureName}>{it.price_items?.name || 'Boost Item'}</Text>
                                    <Text style={styles.featureDescription}>
                                        {it.is_unlimited ? 'Premium placement for full duration' : `Includes ${it.quantity} prioritized slot(s)`}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyText}>Standard boost performance included.</Text>
                        </View>
                    )}
                </View>

                {/* Description */}
                {pkg.description ? (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionHeading}>Overview</Text>
                        <Text style={styles.descriptionText}>{pkg.description}</Text>
                    </View>
                ) : null}

                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: pkg.config?.COLOR_THEME || COLORS.primary }]}
                    onPress={handleActivate}
                    disabled={activating}
                    activeOpacity={0.8}
                >
                    {activating ? (
                        <Loading size="small" />
                    ) : (
                        <>
                            <Text style={styles.primaryButtonText}>Proceed to Payment</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.background },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 32 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    heroCard: {
        padding: 18,
        borderRadius: 14,
        marginBottom: 22,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    heroInfo: {
        flex: 1,
    },
    packageCode: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0,
        marginBottom: 4,
    },
    packageName: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.text.primary,
        lineHeight: 28,
        textTransform: 'capitalize',
    },
    badgeIcon: {
        width: 54,
        height: 54,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginVertical: 20,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.divider,
        paddingTop: 16,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '400',
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 26,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    durationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: COLORS.background,
        borderRadius: 999,
        gap: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    durationValue: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text.secondary,
    },
    contextSection: {
        marginBottom: 24,
    },
    sectionHeading: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0,
        marginBottom: 12,
    },
    adRefCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    adIconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    adInfo: {
        flex: 1,
    },
    adRefTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    adRefLocation: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
    },
    featuresSection: {
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    checkCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    featureTextContainer: {
        flex: 1,
    },
    featureName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    featureDescription: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        lineHeight: 18,
    },
    descriptionSection: {
        marginBottom: 32,
    },
    descriptionText: {
        fontSize: 15,
        color: COLORS.text.secondary,
        lineHeight: 22,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 10,
        gap: 12,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.16,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 20,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyBox: {
        padding: 20,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#cbd5e1',
    },
    emptyText: {
        color: COLORS.text.muted,
        fontSize: 14,
        fontWeight: '400',
    },
    backButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    backText: {
        color: '#fff',
        fontWeight: '600',
    },
});
