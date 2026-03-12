import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { api } from "../../utils/api";
import SelectField from "@/components/ui/SelectField";
import LocationModal from "../../components/ui/LocationModal";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

// Helper to map vehicle types to icons
const getIconForType = (typeName: string) => {
    const lower = typeName.toLowerCase();
    if (lower.includes("car")) return "car-sport-outline";
    if (lower.includes("van")) return "car-outline";
    if (lower.includes("suv")) return "car-sport-outline";
    if (lower.includes("bus")) return "bus-outline";
    if (lower.includes("lorry") || lower.includes("truck")) return "bus-outline";
    if (lower.includes("bike") || lower.includes("motor")) return "bicycle-outline";
    if (lower.includes("cab") || lower.includes("taxi")) return "taxi-outline";
    return "car-sport-outline";
};

const SORT_OPTIONS = [
    { value: "all", label: "Default" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "year-new", label: "Newest First" },
    { value: "year-old", label: "Oldest First" },
];

export default function BuyCarScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { brandId, brandName } = params;

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
            setIsLoading(false);
            setRefreshing(false);
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
                            <Text style={styles.modalSubtitle}>Find your perfect ride</Text>
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
                             <Text style={styles.filterGroupTitle}>Budget (LKR)</Text>
                             <View style={styles.priceRow}>
                                <View style={styles.priceInputWrap}>
                                    <TextInput
                                        placeholder="Min"
                                        value={minPrice}
                                        onChangeText={setMinPrice}
                                        keyboardType="numeric"
                                        style={styles.priceInput}
                                        placeholderTextColor="#9CA3AF"
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
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>
                            </View>
                        </View>

                        <SelectField
                            label="Sort By"
                            value={selectedSort}
                            options={SORT_OPTIONS}
                            onSelect={setSelectedSort}
                        />

                        <SelectField
                            label="Brand"
                            value={selectedBrand}
                            options={brands}
                            onSelect={setSelectedBrand}
                            disabled={selectedCategory === "all" || isBrandsLoading}
                            placeholder={isBrandsLoading ? "Loading..." : "Select Brand"}
                            searchable={true}
                        />

                        <SelectField
                            label="Model"
                            value={selectedModel}
                            options={models}
                            onSelect={setSelectedModel}
                            disabled={!selectedBrand || isModelsLoading}
                            placeholder={isModelsLoading ? "Loading..." : "Select Model"}
                            searchable={true}
                        />

                        <View style={{ marginBottom: 20 }}>
                            <Text style={styles.filterGroupTitle}>Location</Text>
                            <TouchableOpacity
                                style={styles.locationInputWrap}
                                onPress={() => setShowLocationModal(true)}
                            >
                                <Ionicons name="location-outline" size={20} color={locationFilter ? COLORS.primary : "#9CA3AF"} />
                                <Text style={[styles.locationInputLabel, !locationFilter && { color: "#9CA3AF" }]}>
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
                            <Text style={styles.resetButtonText}>Reset</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.applyButton} 
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setShowFilters(false);
                            }}
                        >
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderCategory = (item: any) => {
        const isActive = selectedCategory === item.key;
        return (
            <TouchableOpacity
                key={item.key}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => handleCategoryPress(item.key)}
                activeOpacity={0.8}
            >
                <Ionicons
                    name={item.icon as any}
                    size={16}
                    color={isActive ? "#FFFFFF" : "#64748B"}
                />
                <Text style={[styles.categoryPillLabel, isActive && styles.categoryPillLabelActive]}>
                    {item.label}
                </Text>
            </TouchableOpacity>
        );
    };

    const renderCarCard = (item: any) => {
        const isFavorite = favorites.includes(item.id);
        const imageUrl = item.AdImage?.[0]?.image_url;
        const formattedPrice = item.price ? `Rs. ${(item.price / 1000000).toFixed(1)}Mn` : "N/A";

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
                    <View style={styles.cardBadges}>
                        <View style={styles.yearBadge}>
                            <Text style={styles.yearBadgeText}>{item.CarDetails?.year || "—"}</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.favBtn} 
                        onPress={() => toggleFavorite(item.id)}
                    >
                        <Ionicons 
                            name={isFavorite ? "heart" : "heart-outline"} 
                            size={18} 
                            color={isFavorite ? "#EF4444" : "#FFFFFF"} 
                        />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.carCardInfo}>
                    <Text style={styles.carCardTitle} numberOfLines={1}>{item.title}</Text>
                    
                    <View style={styles.carCardMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="location-outline" size={12} color="#94A3B8" />
                            <Text style={styles.metaText} numberOfLines={1}>{item.location?.split(",")[0] || "N/A"}</Text>
                        </View>
                        <View style={styles.metaDot} />
                        <View style={styles.metaItem}>
                             <Ionicons name="speedometer-outline" size={12} color="#94A3B8" />
                             <Text style={styles.metaText}>{item.CarDetails?.mileage || "—"} km</Text>
                        </View>
                    </View>

                    <Text style={styles.carCardPrice}>{formattedPrice}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />
            {renderFilterModal()}

            {/* ── Custom Premium Header ── */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }} 
                        style={styles.backBtnHeader}
                    >
                        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerTitleContainer}>
                         <Text style={styles.headerTitle}>Browse Vehicles</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.headerSettingsBtn}
                        onPress={() => setShowFilters(true)}
                    >
                        <Ionicons name="options-outline" size={20} color="#FFFFFF" />
                        {(minPrice || maxPrice || selectedBrand || locationFilter) && <View style={styles.headerFilterIndicator} />}
                    </TouchableOpacity>
                </View>

                {/* Integrated Search Bar */}
                <View style={styles.searchWrapper}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search-outline" size={18} color="#94A3B8" />
                        <TextInput
                            placeholder="Search by brand, model or keyword..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchBarInput}
                            placeholderTextColor="#94A3B8"
                        />
                        {searchQuery.length > 0 && (
                             <TouchableOpacity onPress={() => setSearchQuery("")}>
                                 <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                             </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.mainScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {/* Categories Section */}
                <View style={styles.categoryHeader}>
                    <Text style={styles.categoryTitle}>Categories</Text>
                </View>
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    contentContainerStyle={styles.categoryList}
                >
                    <TouchableOpacity
                        style={[styles.categoryPill, selectedCategory === "all" && styles.categoryPillActive]}
                        onPress={() => setSelectedCategory("all")}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.categoryPillLabel, selectedCategory === "all" && styles.categoryPillLabelActive]}>
                            All Vehicles
                        </Text>
                    </TouchableOpacity>
                    {isCategoriesLoading ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginLeft: 10 }} />
                    ) : (
                        vehicleTypes.map(renderCategory)
                    )}
                </ScrollView>

                {/* Results Summary */}
                <View style={styles.resultsStrip}>
                     <Text style={styles.resultsCount}>
                         Found <Text style={{ color: "#1E293B", fontWeight: "800" }}>{ads.length}</Text> listings
                     </Text>
                     <TouchableOpacity style={styles.sortToggle} onPress={() => setShowFilters(true)}>
                         <Text style={styles.sortToggleText}>
                             {SORT_OPTIONS.find(o => o.value === selectedSort)?.label || "Sort"}
                         </Text>
                         <Ionicons name="chevron-down" size={14} color="#64748B" />
                     </TouchableOpacity>
                </View>

                {/* Cars Grid */}
                <View style={styles.gridContainer}>
                    {isLoading && !refreshing ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                            <Text style={styles.loadingText}>Searching market...</Text>
                        </View>
                    ) : ads.length === 0 ? (
                        <View style={styles.emptyResults}>
                            <View style={styles.emptyBlob}>
                                <Ionicons name="search-outline" size={48} color="#CBD5E1" />
                            </View>
                            <Text style={styles.emptyResultsTitle}>No exact matches</Text>
                            <Text style={styles.emptyResultsText}>Try adjusting your filters or search keywords to find more vehicles.</Text>
                            <TouchableOpacity style={styles.clearBtn} onPress={resetFilters}>
                                <Text style={styles.clearBtnText}>Clear all filters</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.carsGrid}>
                            {ads.map((item, index) => (
                                <View key={item.id || index} style={styles.gridItem}>
                                    {renderCarCard(item)}
                                </View>
                            ))}
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
        backgroundColor: "#F9FAFB", // Soft professional background
    },
    // Header Styles
    header: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius: 15,
        elevation: 12,
        zIndex: 100,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 56,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: -0.5,
    },
    backBtnHeader: {
        width: 44,
        height: 44,
        justifyContent: "center",
    },
    headerSettingsBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
    },
    headerFilterIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FCD34D",
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    searchWrapper: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        paddingHorizontal: 16,
        height: 52,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    searchBarInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: "#1F2937",
        fontWeight: "500",
    },

    mainScroll: {
        flex: 1,
    },

    // Categories
    categoryHeader: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    categoryTitle: {
        fontSize: 15,
        fontWeight: "800",
        color: "#1E293B",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    categoryList: {
        paddingHorizontal: 20,
        gap: 8,
        paddingBottom: 4,
    },
    categoryPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    categoryPillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    categoryPillLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#64748B",
    },
    categoryPillLabelActive: {
        color: "#FFFFFF",
    },

    // Results Summary
    resultsStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 24,
        marginBottom: 16,
    },
    resultsCount: {
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500",
    },
    sortToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 4,
    },
    sortToggleText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
    },

    // Grid Container
    gridContainer: {
        paddingHorizontal: CARD_MARGIN,
    },
    loadingBox: {
        paddingTop: 80,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#64748B",
        fontWeight: "500",
    },
    emptyResults: {
        paddingTop: 80,
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyBlob: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#F1F5F9",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyResultsTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 8,
    },
    emptyResultsText: {
        fontSize: 14,
        color: "#64748B",
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    clearBtn: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    clearBtnText: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.primary,
    },

    // Cars Grid
    carsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: CARD_WIDTH,
        marginBottom: 16,
    },

    // Car Card
    carCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    carImageWrapper: {
        height: 125,
        width: '100%',
        position: 'relative',
    },
    carImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardBadges: {
        position: 'absolute',
        top: 10,
        left: 10,
    },
    yearBadge: {
        backgroundColor: "rgba(35, 92, 248, 0.85)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    yearBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
    },
    favBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.25)",
        alignItems: 'center',
        justifyContent: 'center',
    },
    carCardInfo: {
        padding: 12,
    },
    carCardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 5,
        letterSpacing: -0.2,
    },
    carCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    metaDot: {
        width: 3,
        height: 3,
        borderRadius: 1.5,
        backgroundColor: "#CBD5E1",
        marginHorizontal: 8,
    },
    metaText: {
        fontSize: 10,
        color: "#94A3B8",
        fontWeight: "600",
    },
    carCardPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(15,23,42,0.6)",
        justifyContent: "flex-end",
    },
    filterModalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        padding: 24,
        maxHeight: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#111827",
        letterSpacing: -0.5,
    },
    modalSubtitle: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 2,
    },
    modalCloseBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterModalScroll: {
        paddingBottom: 20,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterGroupTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: "#374151",
        marginBottom: 12,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    priceInputWrap: {
        flex: 1,
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    priceInput: {
        height: 52,
        fontSize: 15,
        color: "#111827",
        fontWeight: "600",
    },
    priceDivider: {
        width: 10,
        height: 1.5,
        backgroundColor: "#D1D5DB",
    },
    locationInputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F9FAFB",
        borderRadius: 14,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    locationInputLabel: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        fontWeight: "500",
        color: "#1F2937",
    },
    modalFooter: {
        flexDirection: "row",
        gap: 12,
        marginTop: 20,
    },
    resetButton: {
        flex: 1,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: "#F3F4F6",
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#4B5563",
    },
    applyButton: {
        flex: 2,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FFFFFF",
    },
});
