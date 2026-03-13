import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
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
    StatusBar,
    Animated,
    RefreshControl,
    Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { api } from "../../utils/api";
import SelectField from "@/components/ui/SelectField";
import LocationModal from "../../components/ui/LocationModal";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

// Helper to map vehicle types to icons
const getIconForType = (typeName: string) => {
    const lower = typeName.toLowerCase();
    if (lower.includes("car")) return "car-sport";
    if (lower.includes("van")) return "car";
    if (lower.includes("suv")) return "car-sport";
    if (lower.includes("bus")) return "bus";
    if (lower.includes("lorry") || lower.includes("truck")) return "bus-outline";
    if (lower.includes("bike") || lower.includes("motor")) return "bicycle";
    if (lower.includes("cab") || lower.includes("taxi")) return "taxi";
    return "car-sport";
};

const SORT_OPTIONS = [
    { value: "all", label: "Recommended" },
    { value: "price-low", label: "Lowest Price" },
    { value: "price-high", label: "Highest Price" },
    { value: "year-new", label: "Newest Model" },
    { value: "year-old", label: "Classic First" },
];

export default function BuyCarScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { brandId, brandName } = params;

    // Search & UI States
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedSort, setSelectedSort] = useState("all");
    const [favorites, setFavorites] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);

    // Filter States
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedBrand, setSelectedBrand] = useState(brandId ? String(brandId) : "");
    const [selectedModel, setSelectedModel] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Data States
    const [ads, setAds] = useState<any[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isBrandsLoading, setIsBrandsLoading] = useState(false);
    const [isModelsLoading, setIsModelsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Fade/Scale animations
    const scrollY = useRef(new Animated.Value(0)).current;

    // Fetch Vehicle Types
    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const res: any = await api.get("/api/vehicle-config/types");
                if (Array.isArray(res)) {
                    const mapped = res
                        .filter((t: any) => t.status === "ACTIVE")
                        .map((t: any) => ({
                            key: t.id,
                            label: t.type_name,
                            icon: getIconForType(t.type_name),
                        }));
                    setVehicleTypes(mapped);

                    if (brandId) {
                        const carType = mapped.find((t: any) => t.label.toLowerCase().includes("car"));
                        if (carType) setSelectedCategory(carType.key);
                    }
                }
            } catch (error) {
                console.error("Error fetching vehicle types:", error);
            } finally {
                setIsCategoriesLoading(false);
            }
        };
        fetchTypes();
    }, [brandId]);

    // Fetch Brands when category changes
    useEffect(() => {
        if (selectedCategory && selectedCategory !== "all") {
            const fetchBrands = async () => {
                setIsBrandsLoading(true);
                try {
                    const res: any = await api.get(`/api/vehicle-config/brands/${selectedCategory}`);
                    if (Array.isArray(res)) {
                        setBrands(res.map((b) => ({ label: b.brand_name, value: b.id })));
                    }
                } catch (error) {
                    console.error("Error fetching brands:", error);
                } finally {
                    setIsBrandsLoading(false);
                }
            };
            fetchBrands();
        } else {
            setBrands([]);
            setSelectedBrand("");
        }
    }, [selectedCategory]);

    // Fetch Models when brand changes
    useEffect(() => {
        if (selectedBrand) {
            const fetchModels = async () => {
                setIsModelsLoading(true);
                try {
                    const res: any = await api.get(`/api/vehicle-config/models/by-brand/${selectedBrand}`);
                    if (Array.isArray(res)) {
                        setModels(res.map((m) => ({ label: m.model_name, value: m.id })));
                    }
                } catch (error) {
                    console.error("Error fetching models:", error);
                } finally {
                    setIsModelsLoading(false);
                }
            };
            fetchModels();
        } else {
            setModels([]);
            setSelectedModel("");
        }
    }, [selectedBrand]);

    const fetchAds = useCallback(async () => {
        if (!refreshing) setIsLoading(true);
        try {
            let endpoint = `/api/cars?status=ACTIVE`;

            if (selectedCategory && selectedCategory !== "all") {
                endpoint += `&vehicleTypeId=${selectedCategory}`;
            }
            if (minPrice) endpoint += `&minPrice=${minPrice}`;
            if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;
            if (locationFilter) endpoint += `&location=${encodeURIComponent(locationFilter)}`;
            if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

            if (selectedBrand) {
                const brandObj = brands.find((b) => b.value === selectedBrand);
                if (brandObj) {
                    endpoint += `&brand=${encodeURIComponent(brandObj.label)}`;
                } else if (brandName && String(brandId) === selectedBrand) {
                    endpoint += `&brand=${encodeURIComponent(String(brandName))}`;
                }
            }
            if (selectedModel) {
                const modelObj = models.find((m) => m.value === selectedModel);
                if (modelObj) endpoint += `&model=${encodeURIComponent(modelObj.label)}`;
            }

            const res = await api.get<any>(endpoint);
            if (res.success) {
                let fetchedAds = res.data || [];

                // Sorting
                if (selectedSort === "price-low") {
                    fetchedAds.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
                } else if (selectedSort === "price-high") {
                    fetchedAds.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
                } else if (selectedSort === "year-new") {
                    fetchedAds.sort((a: any, b: any) => (b.CarDetails?.year || 0) - (a.CarDetails?.year || 0));
                } else if (selectedSort === "year-old") {
                    fetchedAds.sort((a: any, b: any) => (a.CarDetails?.year || 0) - (b.CarDetails?.year || 0));
                }

                setAds(fetchedAds);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
                setRefreshing(false);
            }, 400); // Smooth snap
        }
    }, [
        selectedCategory,
        searchQuery,
        selectedSort,
        minPrice,
        maxPrice,
        selectedBrand,
        selectedModel,
        locationFilter,
        brands,
        models,
        brandName,
        brandId,
        refreshing,
    ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchAds();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchAds]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchAds();
    };

    const toggleFavorite = (carId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFavorites((prev) =>
            prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
        );
    };

    const handleCategoryPress = (key: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedCategory(selectedCategory === key ? "all" : key);
    };

    const resetFilters = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMinPrice("");
        setMaxPrice("");
        setSelectedBrand("");
        setSelectedModel("");
        setLocationFilter("");
        setSelectedSort("all");
    };

    const renderFilterModal = () => (
        <Modal visible={showFilters} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.filterModalContent}>
                    <View style={styles.modalHeader}>
                        <View>
                            <Text style={styles.modalTitle}>Refine Your Search</Text>
                            <Text style={styles.modalSubtitle}>Set your preferences to find the perfect car</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => setShowFilters(false)}
                            style={styles.modalCloseBtn}
                        >
                            <Ionicons name="close" size={24} color="#1F2937" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterModalScroll}>
                        <View style={styles.filterSection}>
                             <Text style={styles.filterGroupTitle}>Pricing Details (LKR)</Text>
                             <View style={styles.priceRow}>
                                <View style={styles.priceInputWrap}>
                                    <TextInput
                                        placeholder="Min Price"
                                        value={minPrice}
                                        onChangeText={setMinPrice}
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                                <View style={styles.priceInterval} />
                                <View style={styles.priceInputWrap}>
                                    <TextInput
                                        placeholder="Max Price"
                                        value={maxPrice}
                                        onChangeText={setMaxPrice}
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        placeholderTextColor="#94A3B8"
                                    />
                                </View>
                            </View>
                        </View>

                        <SelectField
                            label="Sort Order"
                            value={selectedSort}
                            options={SORT_OPTIONS}
                            onSelect={setSelectedSort}
                        />

                        <SelectField
                            label="Make / Brand"
                            value={selectedBrand}
                            options={brands}
                            onSelect={setSelectedBrand}
                            disabled={selectedCategory === "all" || isBrandsLoading}
                            placeholder={isBrandsLoading ? "Loading Brands..." : "Choose Brand"}
                            searchable={true}
                        />

                        <SelectField
                            label="Model"
                            value={selectedModel}
                            options={models}
                            onSelect={setSelectedModel}
                            disabled={!selectedBrand || isModelsLoading}
                            placeholder={isModelsLoading ? "Loading Models..." : "Choose Model"}
                            searchable={true}
                        />

                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.filterGroupTitle}>Preferred Location</Text>
                            <TouchableOpacity
                                style={styles.locationInputWrap}
                                onPress={() => setShowLocationModal(true)}
                            >
                                <Ionicons name="location-outline" size={20} color={locationFilter ? COLORS.primary : "#94A3B8"} />
                                <Text style={[styles.locationInputLabel, !locationFilter && { color: "#94A3B8" }]}>
                                    {locationFilter || "Select City or District"}
                                </Text>
                                <Ionicons name="chevron-down" size={18} color="#94A3B8" />
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
                            <Text style={styles.resetButtonText}>Clear All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.applyButton} 
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowFilters(false);
                            }}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#7C3AED']}
                                style={styles.applyGradient}
                            >
                                <Text style={styles.applyButtonText}>Show Results</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderCarCard = (item: any) => {
        const isFavorite = favorites.includes(item.id);
        const imageUrl = item.AdImage?.[0]?.image_url;
        const formattedPrice = item.price ? `Rs. ${(item.price / 1000000).toFixed(1)}M` : "N/A";

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.carCard}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/cars/${item.id}`);
                }}
                activeOpacity={0.9}
            >
                <View style={styles.carImageWrapper}>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/car.jpg")}
                        style={styles.carImage}
                    />
                    
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent']}
                        style={styles.cardImageOverlay}
                    />

                    <View style={styles.cardTopStrip}>
                        <View style={styles.yearBadge}>
                            <Text style={styles.yearBadgeText}>{item.CarDetails?.year || "—"}</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.favCircle, isFavorite && styles.favCircleActive]} 
                            onPress={() => toggleFavorite(item.id)}
                        >
                            <Ionicons 
                                name={isFavorite ? "heart" : "heart-outline"} 
                                size={16} 
                                color={isFavorite ? "#fff" : "#fff"} 
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.priceFloating}>
                        <Text style={styles.floatingPriceText}>{formattedPrice}</Text>
                    </View>
                </View>
                
                <View style={styles.carCardInfo}>
                    <Text style={styles.carCardTitle} numberOfLines={1}>{item.title}</Text>
                    
                    <View style={styles.carCardMeta}>
                        <View style={styles.tagItem}>
                             <Ionicons name="speedometer-outline" size={10} color="#64748B" />
                             <Text style={styles.tagText}>{item.CarDetails?.mileage?.toLocaleString() || "—"} km</Text>
                        </View>
                        <View style={styles.tagItem}>
                             <Ionicons name="location-outline" size={10} color="#64748B" />
                             <Text style={styles.tagText} numberOfLines={1}>{item.location?.split(",")[0] || "Lanka"}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent />
            <Stack.Screen options={{ headerShown: false }} />
            {renderFilterModal()}

            {/* ── Premium Glass Header ── */}
            <LinearGradient
                colors={['#1E293B', '#0F172A']}
                style={[styles.premiumHeader, { paddingTop: insets.top + 10 }]}
            >
                <View style={styles.headerActionRow}>
                    <TouchableOpacity 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }} 
                        style={styles.iconCircle}
                    >
                        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerCenter}>
                         <Text style={styles.headerMainTitle}>Marketplace</Text>
                         <Text style={styles.headerSubTitle}>Premium Car Search</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.iconCircle, (minPrice || maxPrice || selectedBrand || locationFilter) && styles.iconCircleActive]}
                        onPress={() => setShowFilters(true)}
                    >
                        <Ionicons name="options" size={20} color="#FFFFFF" />
                        {(minPrice || maxPrice || selectedBrand || locationFilter) && <View style={styles.activeDot} />}
                    </TouchableOpacity>
                </View>

                {/* Hero Search Bar */}
                <View style={styles.heroSearchContainer}>
                    <View style={styles.heroSearchBar}>
                        <Ionicons name="search" size={20} color="#94A3B8" />
                        <TextInput
                            placeholder="Find your next car..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.heroSearchInput}
                            placeholderTextColor="#64748B"
                        />
                        {searchQuery.length > 0 && (
                             <TouchableOpacity onPress={() => setSearchQuery("")}>
                                 <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                             </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Horizontal Categories */}
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.categoryScroll}
                >
                    <TouchableOpacity
                        style={[styles.pill, selectedCategory === "all" && styles.pillActive]}
                        onPress={() => setSelectedCategory("all")}
                    >
                        <Text style={[styles.pillLabel, selectedCategory === "all" && styles.pillLabelActive]}>
                            Discovery
                        </Text>
                    </TouchableOpacity>
                    {vehicleTypes.map((type) => {
                        const active = selectedCategory === type.key;
                        return (
                            <TouchableOpacity
                                key={type.key}
                                style={[styles.pill, active && styles.pillActive]}
                                onPress={() => handleCategoryPress(type.key)}
                            >
                                <Ionicons name={type.icon as any} size={14} color={active ? '#fff' : '#94A3B8'} style={{marginRight: 6}} />
                                <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                                    {type.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </LinearGradient>

            <ScrollView
                style={styles.mainContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {/* Results Dashboard */}
                <View style={styles.dashboardStrip}>
                     <View>
                        <Text style={styles.dashboardCount}>{ads.length} Vehicles found</Text>
                        <Text style={styles.dashboardSub}>Most relevant first</Text>
                     </View>
                     <TouchableOpacity style={styles.compactSort} onPress={() => setShowFilters(true)}>
                         <Ionicons name="swap-vertical" size={14} color={COLORS.primary} />
                         <Text style={styles.compactSortText}>
                             {SORT_OPTIONS.find(o => o.value === selectedSort)?.label || "Sort"}
                         </Text>
                     </TouchableOpacity>
                </View>

                {/* Animated Grid */}
                <View style={styles.listingsGrid}>
                    {isLoading && !refreshing ? (
                        <View style={styles.premiumLoader}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                            <Text style={styles.loaderText}>Curating your showroom...</Text>
                        </View>
                    ) : ads.length === 0 ? (
                        <View style={styles.emptyShowroom}>
                            <View style={styles.emptyLottiePlaceholder}>
                                <Ionicons name="car-outline" size={60} color="#E2E8F0" />
                            </View>
                            <Text style={styles.emptyTitle}>Nothing found yet</Text>
                            <Text style={styles.emptySub}>We couldn't find a vehicle matching these exact specifications.</Text>
                            <TouchableOpacity style={styles.actionOutlineBtn} onPress={resetFilters}>
                                <Text style={styles.actionOutlineText}>Clear All Filters</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.cardGrid}>
                            {ads.map((item) => renderCarCard(item))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },
    premiumHeader: {
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingBottom: 24,
        zIndex: 10,
    },
    headerActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    iconCircleActive: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(79, 70, 229, 0.15)',
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerMainTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '900',
        letterSpacing: -0.5,
    },
    headerSubTitle: {
        color: '#94A3B8',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    activeDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#0F172A',
    },
    heroSearchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    heroSearchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 56,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    heroSearchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        fontWeight: '600',
        color: '#1E293B',
    },
    categoryScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    pillActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#6366F1',
    },
    pillLabel: {
        color: '#94A3B8',
        fontSize: 13,
        fontWeight: '800',
    },
    pillLabelActive: {
        color: '#fff',
    },
    mainContent: {
        flex: 1,
    },
    dashboardStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 24,
        marginBottom: 20,
    },
    dashboardCount: {
        fontSize: 16,
        fontWeight: '900',
        color: '#1E293B',
    },
    dashboardSub: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    compactSort: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    compactSortText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#1E293B',
    },
    listingsGrid: {
        paddingHorizontal: CARD_MARGIN,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    carCard: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    carImageWrapper: {
        height: 125,
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardImageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 40,
    },
    cardTopStrip: {
        position: 'absolute',
        top: 8,
        left: 8,
        right: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    yearBadge: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    yearBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#1E293B',
    },
    favCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    favCircleActive: {
        backgroundColor: '#EF4444',
    },
    priceFloating: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    floatingPriceText: {
        fontSize: 13,
        fontWeight: '900',
        color: '#4F46E5',
    },
    carCardInfo: {
        padding: 12,
    },
    carCardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    carCardMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tagItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        maxWidth: '50%',
    },
    tagText: {
        fontSize: 9,
        fontWeight: '600',
        color: '#64748B',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        justifyContent: 'flex-end',
    },
    filterModalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        height: '85%',
        paddingTop: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    modalCloseBtn: {
        padding: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
    },
    filterModalScroll: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    filterSection: {
        marginBottom: 24,
    },
    filterGroupTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    priceInputWrap: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        justifyContent: 'center',
    },
    priceInput: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    priceInterval: {
        width: 10,
        height: 2,
        backgroundColor: '#CBD5E1',
    },
    locationInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 56,
        gap: 12,
    },
    locationInputLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '700',
        color: '#1E293B',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
        borderTopWidth: 1,
        borderColor: '#F1F5F9',
    },
    resetButton: {
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        width: 110,
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#64748B',
    },
    applyButton: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },
    applyGradient: {
        paddingVertical: 18,
        alignItems: 'center',
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
    premiumLoader: {
        paddingTop: 100,
        alignItems: 'center',
        gap: 16,
    },
    loaderText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    emptyShowroom: {
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyLottiePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    actionOutlineBtn: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    actionOutlineText: {
        fontSize: 15,
        fontWeight: '800',
        color: COLORS.primary,
    }
});
