import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Header from '../../../components/Header';
import COLORS from '../../../constants/Colors';
import { api } from '@/utils/api';

export default function BoostPackageDetailScreen() {
    const { adId, packageId } = useLocalSearchParams();
    const router = useRouter();

    const [pkg, setPkg] = useState<any | null>(null);
    const [adDetails, setAdDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        if (adId && packageId) {
            fetchData();
        }
    }, [adId, packageId]);

    const fetchData = async () => {
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
    };

    const handleActivate = async () => {
        try {
            setActivating(true);
            const price = pkg?.rules?.[0]?.price || 0;

            const res: any = await api.post('/api/boosts/apply', {
                adId: adId,
                packageId: packageId,
                amount: price
            });

            if (res.success) {
                Alert.alert("Success", "Boost applied successfully!", [
                    { text: "OK", onPress: () => router.replace('/ads/my-ads') }
                ]);
            } else {
                throw new Error(res.error || res.message || "Failed to apply boost");
            }
        } catch (error: any) {
            console.error("Activation failed:", error);
            Alert.alert("Error", error.message || "Failed to activate boost.");
        } finally {
            setActivating(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.safe}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title="Boost Details" />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={{ marginTop: 12, color: '#666' }}>Loading details...</Text>
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

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
                        <Ionicons name="chevron-back" size={22} color="#111" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Package Details</Text>
                </View>

                <View style={[styles.card, { backgroundColor: pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}15` : '#EAF2FF' }]}>
                    <Text style={styles.cardTitle}>{pkg.name}</Text>
                    <Text style={styles.cardSubtitle}>Code: {pkg.code}</Text>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>LKR {price}</Text>
                        <Text style={styles.durationText}>for {duration} days</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.buyButton, { backgroundColor: pkg.config?.COLOR_THEME || COLORS.primary }]}
                        onPress={handleActivate}
                        disabled={activating}
                    >
                        {activating ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buyText}>Proceed to Payment</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>What's Included</Text>
                    {pkg.included_items && pkg.included_items.length > 0 ? (
                        pkg.included_items.map((it: any) => (
                            <View key={it.id} style={styles.featureRow}>
                                <Ionicons name="checkmark-circle" size={18} color={pkg.config?.COLOR_THEME || COLORS.primary} />
                                <View style={{ marginLeft: 10 }}>
                                    <Text style={styles.featureTitle}>{it.price_items?.name || 'Boost Item'}</Text>
                                    <Text style={styles.featureMeta}>
                                        {it.is_unlimited ? 'Active for full duration' : `Includes ${it.quantity} slot(s)`}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.emptyText}>No items listed for this package.</Text>
                    )}
                </View>

                {/* Description */}
                {pkg.description ? (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.descriptionText}>{pkg.description}</Text>
                    </View>
                ) : null}

                {/* Ad Context */}
                {adDetails && (
                    <View style={styles.adContext}>
                        <Text style={styles.contextTitle}>Applying to:</Text>
                        <Text style={styles.adTitle}>{adDetails.title}</Text>
                        <Text style={styles.adLocation}>{adDetails.location}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F9FAFB' },
    container: { padding: 16, paddingBottom: 40 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
    backButton: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: COLORS.primary, borderRadius: 8 },
    backText: { color: '#fff', fontWeight: '700' },
    topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    iconWrap: { padding: 6, borderRadius: 10, backgroundColor: '#fff', elevation: 2 },
    title: { fontSize: 18, fontWeight: '800' },
    card: { padding: 20, borderRadius: 16, marginBottom: 18 },
    cardTitle: { fontSize: 22, fontWeight: '900' },
    cardSubtitle: { marginTop: 4, color: '#666', fontSize: 12 },
    priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 16 },
    price: { fontSize: 26, fontWeight: '900' },
    durationText: { fontSize: 14, color: '#666', marginBottom: 4 },
    buyButton: { marginTop: 20, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    buyText: { color: '#fff', fontWeight: '800', fontSize: 16 },
    section: { marginTop: 8, padding: 16, backgroundColor: '#fff', borderRadius: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
    featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    featureTitle: { fontWeight: '700', fontSize: 14 },
    featureMeta: { color: '#666', fontSize: 12, marginTop: 1 },
    emptyText: { color: '#999', fontSize: 13 },
    descriptionText: { color: '#444', lineHeight: 22, fontSize: 14 },
    adContext: { marginTop: 24, padding: 16, borderTopWidth: 1, borderColor: '#EEE' },
    contextTitle: { fontSize: 12, color: '#888', fontWeight: '600', textTransform: 'uppercase' },
    adTitle: { fontSize: 16, fontWeight: '700', marginTop: 4 },
    adLocation: { fontSize: 13, color: '#666', marginTop: 2 },
});
