import Header from '@/components/Header';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../utils/api';
import SelectField from '@/components/ui/SelectField';
import LocationModal from '../../components/ui/LocationModal';
import COLORS from '@/constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

const SORT_OPTIONS = [
    { value: 'all', label: 'Default' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function RentalAdsListScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Filter States
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    // Data States
    const [ads, setAds] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBrandsLoading, setIsBrandsLoading] = useState(false);

    // Fetch Brands (generic for now, or fetch all used in rentals)
    useEffect(() => {
        const fetchBrands = async () => {
            setIsBrandsLoading(true);
            try {
                // Ideally fetch only brands that have rental ads, 
                // but for simplicity fetching all car brands
                const res: any = await api.get('/api/vehicle-config/brands/1'); // Assuming 1 is Car
                if (Array.isArray(res)) {
                    setBrands(res.map(b => ({ label: b.brand_name, value: b.id })));
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            } finally {
                setIsBrandsLoading(false);
            }
        };
        fetchBrands();
    }, []);

    const fetchAds = useCallback(async () => {
        setIsLoading(true);
        try {
            let endpoint = `/api/rentals?status=ACTIVE`;

            if (minPrice) endpoint += `&minPrice=${minPrice}`;
            if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;
            if (locationFilter) endpoint += `&location=${encodeURIComponent(locationFilter)}`;
            if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

            if (selectedBrand) {
                const brandObj = brands.find(b => b.value === selectedBrand);
                if (brandObj) endpoint += `&brand=${encodeURIComponent(brandObj.label)}`;
            }

            const res = await api.get<any>(endpoint);
            if (res.success) {
                let fetchedAds = res.data || [];

                // Sorting
                if (selectedSort === 'price-low') {
                    fetchedAds.sort((a: any, b: any) => (a.price_per_day || 0) - (b.price_per_day || 0));
                } else if (selectedSort === 'price-high') {
                    fetchedAds.sort((a: any, b: any) => (b.price_per_day || 0) - (a.price_per_day || 0));
                } else if (selectedSort === 'newest') {
                    fetchedAds.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                }

                setAds(fetchedAds);
            }
        } catch (error) {
            console.error("Error fetching rental ads:", error);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedSort, minPrice, maxPrice, selectedBrand, locationFilter, brands]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAds();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchAds]);

    const resetFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrand('');
        setLocationFilter('');
        setSelectedSort('all');
    };

    const renderFilterModal = () => (
        <Modal visible={showFilters} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.filterModalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filter Rentals</Text>
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Ionicons name="close" size={24} color="#111827" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.filterGroupTitle}>Daily Price Range (LKR)</Text>
                        <View style={styles.priceRow}>
                            <View style={styles.priceInputWrap}>
                                <TextInput
                                    placeholder="Min"
                                    value={minPrice}
                                    onChangeText={setMinPrice}
                                    keyboardType="numeric"
                                    style={styles.priceInput}
                                />
                            </View>
                            <View style={styles.priceDivider} />
                            <View style={styles.priceInputWrap}>
                                <TextInput
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChangeText={setMaxPrice}
                                    keyboardType="numeric"
                                    style={styles.priceInput}
                                />
                            </View>
                        </View>

                        <SelectField
                            label="Sort By"
                            value={selectedSort}
                            options={SORT_OPTIONS}
                            onSelect={setSelectedSort}
                        />

                        <SelectField
                            label="Select Brand"
                            value={selectedBrand}
                            options={brands}
                            onSelect={setSelectedBrand}
                            disabled={isBrandsLoading}
                            placeholder={isBrandsLoading ? "Loading..." : "Select Brand"}
                            searchable={true}
                        />

                        <View style={{ marginBottom: 16 }}>
                            <Text style={styles.filterGroupTitle}>Location</Text>
                            <TouchableOpacity
                                style={styles.locationInputWrap}
                                onPress={() => setShowLocationModal(true)}
                            >
                                <Ionicons name="location-outline" size={20} color={locationFilter ? "#111827" : "#9CA3AF"} />
                                <Text style={[styles.locationInput, !locationFilter && { color: '#9CA3AF' }]}>
                                    {locationFilter || "Select Location"}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        <LocationModal
                            visible={showLocationModal}
                            onClose={() => setShowLocationModal(false)}
                            onSelect={setLocationFilter}
                        />
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
                            <Text style={styles.resetButtonText}>Reset All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderRentalCard = (item: any) => {
        const imageUrl = item.images?.[0]?.image_url;
        const formattedPrice = item.price_per_day ? `Rs. ${item.price_per_day.toLocaleString()}` : 'N/A';
        const isVerified = item.verification_status === 'VERIFIED';

        return (
            <TouchableOpacity
                key={item.id}
                style={[styles.carCard, { width: CARD_WIDTH }]}
                onPress={() => router.push(`/cars/rental/${item.id}`)}
            >
                <View style={styles.carImageContainer}>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                        style={styles.carCardImage}
                    />
                    {isVerified && (
                        <View style={styles.verifiedBadge}>
                            <MaterialIcons name="verified" size={14} color="#fff" />
                            <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                    )}
                    <View style={styles.yearBadge}>
                        <Text style={styles.yearBadgeText}>{item.rental_ad_details?.year || 'N/A'}</Text>
                    </View>
                </View>
                <View style={styles.carCardBody}>
                    <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.carMetaRow}>
                        <View style={styles.carMetaItem}>
                            <Ionicons name="location-outline" size={14} color="#6B7280" />
                            <Text style={styles.carMetaText} numberOfLines={1}>{item.location?.split(',')[0] || 'N/A'}</Text>
                        </View>
                    </View>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.price}>{formattedPrice}</Text>
                        <Text style={styles.priceUnit}>/day</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Rental Vehicles" />
            {renderFilterModal()}

            <View style={styles.mainContentContainer}>
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Search Section */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#94A3B8" />
                            <TextInput
                                placeholder="Search rentals (e.g. Toyota...)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                style={styles.searchInput}
                                placeholderTextColor="#94A3B8"
                            />
                            <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
                                <Ionicons name="options-outline" size={22} color={COLORS.primary} />
                                {(minPrice || maxPrice || selectedBrand || locationFilter) && <View style={styles.filterDot} />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Listings */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Available for Rent</Text>
                        <Text style={styles.sectionSubtitle}>{ads.length} items</Text>
                    </View>

                    <View style={styles.carsSection}>
                        {isLoading ? (
                            <Loading />
                        ) : ads.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Ionicons name="car-outline" size={64} color="#D1D5DB" />
                                <Text style={styles.emptyText}>No rental vehicles found</Text>
                                <TouchableOpacity onPress={resetFilters}>
                                    <Text style={styles.resetLink}>Clear filters</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.carsGrid}>
                                {ads.map((_, idx) => {
                                    if (idx % 2 === 0) {
                                        return (
                                            <View key={idx} style={styles.carsRow}>
                                                {renderRentalCard(ads[idx])}
                                                {ads[idx + 1] ? renderRentalCard(ads[idx + 1]) : <View style={{ width: CARD_WIDTH }} />}
                                            </View>
                                        );
                                    }
                                    return null;
                                })}
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: COLORS.primary },
    mainContentContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: 0, // Removed negative margin to fix overlap
        overflow: 'hidden',
    },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 60 },
    searchSection: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16 },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9', // Slate-50 look
        borderRadius: 18,
        paddingHorizontal: 14,
        height: 54,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#0F172A', fontWeight: '500' },
    filterBtn: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
    filterDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#fff' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 10, marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    sectionSubtitle: { fontSize: 14, color: '#6B7280' },
    carsSection: { paddingHorizontal: 16 },
    carsGrid: { gap: 16 },
    carsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    carCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
    carImageContainer: { height: 120, position: 'relative' },
    carCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    yearBadge: { position: 'absolute', bottom: 8, left: 8, backgroundColor: 'rgba(35, 92, 248, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    yearBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
    verifiedBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#059669', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, gap: 3 },
    verifiedText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
    carCardBody: { padding: 12 },
    carTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
    carMetaRow: { marginBottom: 8 },
    carMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    carMetaText: { fontSize: 11, color: '#6B7280' },
    priceRowItem: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
    price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
    priceUnit: { fontSize: 11, color: '#6B7280' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    filterModalContent: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '90%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
    filterGroupTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 },
    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    priceInputWrap: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12 },
    priceInput: { height: 48, fontSize: 15, color: '#111827' },
    priceDivider: { width: 12, height: 1, backgroundColor: '#D1D5DB' },
    locationInputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 12, height: 52 },
    locationInput: { flex: 1, marginLeft: 8, fontSize: 15 },
    modalFooter: { flexDirection: 'row', gap: 12, marginTop: 24, paddingBottom: 20 },
    resetButton: { flex: 1, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#F3F4F6' },
    resetButtonText: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
    applyButton: { flex: 2, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: COLORS.primary },
    applyButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
    emptyState: { alignItems: 'center', padding: 60 },
    emptyText: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 16 },
    resetLink: { color: COLORS.primary, fontWeight: '600', marginTop: 8 },
});

import { MaterialIcons } from '@expo/vector-icons';

import Loading from '@/components/ui/Loading';
