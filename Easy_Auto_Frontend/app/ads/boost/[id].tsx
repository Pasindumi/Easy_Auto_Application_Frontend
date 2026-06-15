import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from '../../../components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity,
    TextInput
} from 'react-native';

import Header from '../../../components/Header';
import PackagePlanCard from '../../../components/packages/packages/PackagePlanCard';
import { api } from '@/utils/api';
import { COLORS } from '../../../constants/Colors';

export default function BoostSelectionScreen() {
    const router = useRouter();
    const { id: adId } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<any[]>([]);
    const [adDetails, setAdDetails] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // 1. Fetch Ad Details to get Vehicle Type
            const adResponse = await api.get<{ success: boolean; data: any }>(`/api/cars/${adId}`);

            if (!adResponse.success || !adResponse.data) {
                Alert.alert("Error", "Failed to load advertisement details.");
                router.back();
                return;
            }

            setAdDetails(adResponse.data);
            const vehicleTypeId = adResponse.data.vehicle_type_id;

            // 2. Fetch Boost Packages for this vehicle type
            const pkgResponse = await api.get<any[]>(`/api/boosts/packages?vehicleTypeId=${vehicleTypeId}`);

            // The boost controller returns an array directly, not wrapped in { success: true, data: [...] } ?
            // Let's check boostController.js getBoostPackages.
            // It returns res.json(enrichedPackages); so it's an array.

            if (Array.isArray(pkgResponse)) {
                setPackages(pkgResponse);
            } else {
                setPackages([]);
            }

        } catch (error) {
            console.error("Error fetching boost data:", error);
            Alert.alert("Error", "Failed to load boost packages.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [adId, router]);

    useEffect(() => {
        if (adId) {
            fetchData();
        }
    }, [adId, fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleSelectPackage = (pkg: any) => {
        // Navigate to details page instead of PayHere
        router.push({
            pathname: '/ads/boost/package-details',
            params: {
                adId: adId,
                packageId: pkg.id
            }
        });
    };

    const getPackagePrice = (pkg: any) => parseFloat(pkg.rules?.[0]?.price || "0");
    const getPackageDuration = (pkg: any) => parseInt(pkg.config?.DURATION_DAYS || "0");
    const getPackageFeatures = (pkg: any) => {
        const features = pkg.included_items?.map((item: any) => item.price_items?.name).filter(Boolean) || [];
        if (pkg.description) features.push(pkg.description);
        return features;
    };

    const minPriceValue = minPrice.trim() ? parseFloat(minPrice) : null;
    const maxPriceValue = maxPrice.trim() ? parseFloat(maxPrice) : null;
    const activeFilterCount = [searchQuery.trim(), minPrice.trim(), maxPrice.trim()].filter(Boolean).length;
    const filteredPackages = packages.filter((pkg) => {
        const price = getPackagePrice(pkg);
        const searchableText = [
            pkg.name,
            pkg.code,
            pkg.description,
            ...getPackageFeatures(pkg),
        ].filter(Boolean).join(' ').toLowerCase();
        const matchesSearch = !searchQuery.trim() || searchableText.includes(searchQuery.trim().toLowerCase());
        const matchesMin = minPriceValue === null || Number.isNaN(minPriceValue) || price >= minPriceValue;
        const matchesMax = maxPriceValue === null || Number.isNaN(maxPriceValue) || price <= maxPriceValue;
        return matchesSearch && matchesMin && matchesMax;
    }).sort((a, b) => getPackagePrice(a) - getPackagePrice(b));

    const clearFilters = () => {
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
    };

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="Boost Ad" showBack={true} />

            <BrandedRefreshOverlay refreshing={refreshing} top={200} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
            >
                <View style={styles.summaryPanel}>
                    <View style={styles.summaryIcon}>
                        <Ionicons name="trending-up-outline" size={22} color={COLORS.primary} />
                    </View>
                    <View style={styles.summaryContent}>
                        <Text style={styles.summaryTitle}>Boost Packages</Text>
                        <Text style={styles.summaryText}>Choose a visibility package for {adDetails?.title || 'your advertisement'}.</Text>
                    </View>
                </View>

                <View style={styles.toolBar}>
                    <View style={styles.searchBox}>
                        <Ionicons name="search-outline" size={18} color={COLORS.text.placeholder} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search packages"
                            placeholderTextColor={COLORS.text.placeholder}
                            style={styles.searchInput}
                            returnKeyType="search"
                        />
                        {searchQuery ? (
                            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.75}>
                                <Ionicons name="close-circle" size={18} color={COLORS.text.placeholder} />
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <TouchableOpacity
                        style={[styles.filterButton, showFilters && styles.filterButtonActive]}
                        onPress={() => setShowFilters((value) => !value)}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="options-outline" size={18} color={showFilters ? COLORS.white : COLORS.primary} />
                        {activeFilterCount > 0 && <View style={styles.filterDot} />}
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <View style={styles.filterPanel}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterTitle}>Price Range</Text>
                            {activeFilterCount > 0 && (
                                <TouchableOpacity onPress={clearFilters} activeOpacity={0.75}>
                                    <Text style={styles.clearText}>Clear</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={styles.priceInputs}>
                            <View style={styles.priceInputBox}>
                                <Text style={styles.priceInputLabel}>Minimum</Text>
                                <TextInput
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    placeholder="LKR 0"
                                    placeholderTextColor={COLORS.text.placeholder}
                                    keyboardType="numeric"
                                    style={styles.priceInput}
                                />
                            </View>
                            <View style={styles.priceInputBox}>
                                <Text style={styles.priceInputLabel}>Maximum</Text>
                                <TextInput
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    placeholder="Any price"
                                    placeholderTextColor={COLORS.text.placeholder}
                                    keyboardType="numeric"
                                    style={styles.priceInput}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <Loading size="large" message="Loading boost packages..." />
                    </View>
                ) : packages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#999" />
                        <Text style={styles.emptyText}>No boost packages available for this vehicle type.</Text>
                    </View>
                ) : filteredPackages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={44} color={COLORS.text.placeholder} />
                        <Text style={styles.emptyTitle}>No matching packages</Text>
                        <Text style={styles.emptyText}>Adjust the search or price range to see available boost packages.</Text>
                    </View>
                ) : (
                    filteredPackages.map((pkg) => {
                        // Extract price from first rule
                        const price = getPackagePrice(pkg);
                        // Duration
                        const duration = getPackageDuration(pkg);

                        // Features from Included Items
                        const features = getPackageFeatures(pkg);

                        return (
                            <PackagePlanCard
                                key={pkg.id}
                                id={pkg.id}
                                title={pkg.name}
                                days={duration}
                                price={price}
                                perDay={duration > 0 ? `LKR ${(price / duration).toFixed(0)}/day` : ''}
                                backgroundColor={COLORS.white}
                                themeColor={pkg.config?.COLOR_THEME || COLORS.primary}
                                features={features}
                                isPopular={pkg.code.includes('GOLD') || pkg.code.includes('POPULAR')}
                                btnText="Select Boost"
                                onSelect={() => handleSelectPackage(pkg)}
                            />
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        padding: 16,
        paddingTop: 16,
        paddingBottom: 40,
    },
    summaryPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
    },
    summaryIcon: {
        width: 42,
        height: 42,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    summaryContent: {
        flex: 1,
    },
    summaryTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    summaryText: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 3,
        lineHeight: 18,
    },
    toolBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    searchBox: {
        flex: 1,
        height: 46,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text.primary,
        paddingVertical: 0,
    },
    filterButton: {
        width: 46,
        height: 46,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterDot: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: COLORS.status.warning,
        borderWidth: 1,
        borderColor: COLORS.white,
    },
    filterPanel: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    clearText: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.primary,
    },
    priceInputs: {
        flexDirection: 'row',
        gap: 10,
    },
    priceInputBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.background,
    },
    priceInputLabel: {
        fontSize: 11,
        color: COLORS.text.muted,
        marginBottom: 2,
    },
    priceInput: {
        fontSize: 14,
        color: COLORS.text.primary,
        paddingVertical: 0,
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        marginTop: 14,
        color: COLORS.text.primary,
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    emptyText: {
        marginTop: 8,
        color: COLORS.text.muted,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
        fontWeight: '400',
    },
});
