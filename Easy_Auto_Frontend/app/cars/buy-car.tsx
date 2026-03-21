import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
    Image as RNImage,
    Dimensions,
    FlatList,
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
import { api } from "../../utils/api";
import SelectField from "@/components/ui/SelectField";
import LocationModal from "../../components/ui/LocationModal";

const { width, height } = Dimensions.get("window");
// App brand gradient colours (same as all other headers)
const BRAND_GRAD: [string, string] = ["#235CF8", "#1E4DB7"];

const PRICE_RANGES = [
    { label: "Any Price", min: "", max: "" },
    { label: "Under 1M", min: "", max: "1000000" },
    { label: "1M – 3M", min: "1000000", max: "3000000" },
    { label: "3M – 5M", min: "3000000", max: "5000000" },
    { label: "5M – 10M", min: "5000000", max: "10000000" },
    { label: "Above 10M", min: "10000000", max: "" },
];

import Header from '@/components/Header';
import COLORS from '@/constants/Colors';
import Loading from '@/components/ui/Loading';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../utils/api';
import SelectField from '@/components/ui/SelectField';
import LocationModal from '../../components/ui/LocationModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 25 - CARD_GAP) / 2;

// Helper to map vehicle types to icons
const getIconForType = (typeName: string) => {
    const l = typeName.toLowerCase();
    if (l.includes("car")) return "car-sport";
    if (l.includes("van")) return "car";
    if (l.includes("suv")) return "car-sport";
    if (l.includes("bus")) return "bus";
    if (l.includes("lorry") || l.includes("truck")) return "construct";
    if (l.includes("bike") || l.includes("motor")) return "bicycle";
    if (l.includes("cab") || l.includes("taxi")) return "car";
    return "car-sport";
};

const formatPrice = (price: number) => {
    if (!price) return "N/A";
    if (price >= 1000000) return `Rs. ${(price / 1000000).toFixed(1)}M`;
    if (price >= 1000) return `Rs. ${(price / 1000).toFixed(0)}K`;
    return `Rs. ${price}`;
};

const formatMileage = (m: any) => {
    if (!m) return null;
    const n = Number(m);
    if (n >= 1000) return `${(n / 1000).toFixed(0)}k km`;
    return `${n} km`;
};

const SORT_OPTIONS = [
    { value: "all", label: "Best Match" },
    { value: "price-low", label: "Price: Low → High" },
    { value: "price-high", label: "Price: High → Low" },
    { value: "year-new", label: "Newest Year" },
    { value: "year-old", label: "Classic First" },
];

// Shimmer card for loading state
const ShimmerCard = () => {
    const shimmer = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, { toValue: 1, duration: 900, useNativeDriver: true }),
                Animated.timing(shimmer, { toValue: 0, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);
    const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0.9] });
    return (
        <Animated.View style={[styles.shimmerCard, { opacity }]}>
            <View style={styles.shimmerImage} />
            <View style={{ padding: 12 }}>
                <View style={styles.shimmerLine} />
                <View style={[styles.shimmerLine, { width: "60%", marginTop: 8 }]} />
                <View style={[styles.shimmerLine, { width: "40%", marginTop: 8 }]} />
            </View>
        </Animated.View>
    );
};

// Premium Category Card Component
const CategoryCard = ({ item, isActive, onPress }: { item: any; isActive: boolean; onPress: (key: string) => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 12,
    }).start();
  };

  const colors = {
    bgActive: COLORS.primary,
    textActive: '#FFFFFF',
    bgInactive: 'rgba(255, 255, 255, 0.7)',
    textInactive: '#64748B',
    borderActive: COLORS.primary,
    borderInactive: 'rgba(226, 232, 240, 0.8)'
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          isActive && styles.categoryChipActive
        ]}
        onPress={() => onPress(item.key)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Text style={[
          styles.categoryChipText,
          isActive && styles.categoryChipTextActive
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function BuyCarScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams();
    const { brandId, brandName } = params;

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [selectedSort, setSelectedSort] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedBrand, setSelectedBrand] = useState(brandId ? String(brandId) : "");
    const [selectedModel, setSelectedModel] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);

    const [ads, setAds] = useState<any[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBrandsLoading, setIsBrandsLoading] = useState(false);
    const [isModelsLoading, setIsModelsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const activeFilterCount = [
        selectedCategory !== "all",
        !!minPrice, !!maxPrice, !!selectedBrand, !!selectedModel,
        !!locationFilter, selectedPriceRange > 0,
    ].filter(Boolean).length;

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
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { brandId, brandName } = params;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(brandId ? String(brandId) : '');
  const [selectedModel, setSelectedModel] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // Data States
  const [ads, setAds] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isBrandsLoading, setIsBrandsLoading] = useState(false);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  // Fetch Vehicle Types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res: any = await api.get('/api/vehicle-config/types');
        if (Array.isArray(res)) {
          const mapped = res
            .filter((t: any) => t.status === 'ACTIVE')
            .map((t: any) => ({
              key: t.id,
              label: t.type_name,
              icon: getIconForType(t.type_name)
            }));
          setVehicleTypes(mapped);

          // If brandId is present, try to find 'Car' category and select it
          if (brandId) {
            const carType = mapped.find((t: any) => t.label.toLowerCase().includes('car'));
            if (carType) {
              setSelectedCategory(carType.key);
            }
        };
        fetchTypes();
    }, [brandId]);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== "all") {
            setIsBrandsLoading(true);
            api.get(`/api/vehicle-config/brands/${selectedCategory}`)
                .then((res: any) => {
                    if (Array.isArray(res)) setBrands(res.map((b) => ({ label: b.brand_name, value: b.id })));
                })
                .catch(console.error)
                .finally(() => setIsBrandsLoading(false));
        } else {
            setBrands([]);
            setSelectedBrand("");
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedBrand) {
            setIsModelsLoading(true);
            api.get(`/api/vehicle-config/models/by-brand/${selectedBrand}`)
                .then((res: any) => {
                    if (Array.isArray(res)) setModels(res.map((m) => ({ label: m.model_name, value: m.id })));
                })
                .catch(console.error)
                .finally(() => setIsModelsLoading(false));
        } else {
            setModels([]);
            setSelectedModel("");
        }
    }, [selectedBrand]);

    const fetchAds = useCallback(async () => {
        if (!refreshing) setIsLoading(true);
        try {
            const priceRange = PRICE_RANGES[selectedPriceRange];
            let endpoint = `/api/cars?limit=60`;
            if (selectedCategory !== "all") endpoint += `&vehicleTypeId=${selectedCategory}`;
            const min = minPrice || priceRange.min;
            const max = maxPrice || priceRange.max;
            if (min) endpoint += `&minPrice=${min}`;
            if (max) endpoint += `&maxPrice=${max}`;
            if (locationFilter) endpoint += `&location=${encodeURIComponent(locationFilter)}`;
            if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;
            if (selectedBrand) {
                const brandObj = brands.find((b) => b.value === selectedBrand);
                const bName = brandObj?.label || (String(brandId) === selectedBrand ? String(brandName) : "");
                if (bName) endpoint += `&brand=${encodeURIComponent(bName)}`;
            }
            if (selectedModel) {
                const modelObj = models.find((m) => m.value === selectedModel);
                if (modelObj) endpoint += `&model=${encodeURIComponent(modelObj.label)}`;
            }

            const res = await api.get<any>(endpoint);
            if (res.success) {
                let data = res.data || [];
                if (selectedSort === "price-low") data.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
                else if (selectedSort === "price-high") data.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
                else if (selectedSort === "year-new") {
                    data.sort((a: any, b: any) => {
                        const dA = Array.isArray(a.CarDetails) ? a.CarDetails[0] : a.CarDetails;
                        const dB = Array.isArray(b.CarDetails) ? b.CarDetails[0] : b.CarDetails;
                        return (dB?.year || 0) - (dA?.year || 0);
                    });
                } else if (selectedSort === "year-old") {
                    data.sort((a: any, b: any) => {
                        const dA = Array.isArray(a.CarDetails) ? a.CarDetails[0] : a.CarDetails;
                        const dB = Array.isArray(b.CarDetails) ? b.CarDetails[0] : b.CarDetails;
                        return (dA?.year || 0) - (dB?.year || 0);
                    });
                }
                setAds(data);
            }
        } catch (error) {
            console.error("Error fetching ads:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
          setIsModelsLoading(false);
        }
      };
      fetchModels();
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedBrand]);

  const fetchAds = useCallback(async () => {
    setIsLoading(true);
    try {
      let endpoint = `/api/cars?status=ACTIVE`;

      if (selectedCategory && selectedCategory !== 'all') {
        endpoint += `&vehicleTypeId=${selectedCategory}`;
      }
      if (minPrice) endpoint += `&minPrice=${minPrice}`;
      if (maxPrice) endpoint += `&maxPrice=${maxPrice}`;
      if (locationFilter) endpoint += `&location=${encodeURIComponent(locationFilter)}`;
      if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;

      // For brand/model, backend expected names or IDs? 
      // Looking at backend `queryBuilder.eq('CarDetails.brand', brand)`, it expects bread name if stored as text.
      // In CarDetails table, brand and model ARE text.
      // Brand Filter logic with robust type matching
      if (selectedBrand) {
        const brandObj = brands.find(b => String(b.value) === String(selectedBrand));
        if (brandObj) {
          endpoint += `&brand=${encodeURIComponent(brandObj.label)}`;
        } else if (brandName && String(brandId) === String(selectedBrand)) {
          endpoint += `&brand=${encodeURIComponent(String(brandName))}`;
        }
      }

      // Model Filter logic with robust type matching
      if (selectedModel) {
        const modelObj = models.find(m => String(m.value) === String(selectedModel));
        if (modelObj) endpoint += `&model=${encodeURIComponent(modelObj.label)}`;
      }

      const res = await api.get<any>(endpoint);
      if (res.success) {
        let fetchedAds = res.data || [];

        // Sorting
        if (selectedSort === 'price-low') {
          fetchedAds.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        } else if (selectedSort === 'price-high') {
          fetchedAds.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
        } else if (selectedSort === 'year-new') {
          fetchedAds.sort((a: any, b: any) => (b.CarDetails?.year || 0) - (a.CarDetails?.year || 0));
        } else if (selectedSort === 'year-old') {
          fetchedAds.sort((a: any, b: any) => (a.CarDetails?.year || 0) - (b.CarDetails?.year || 0));
        }
    }, [selectedCategory, searchQuery, selectedSort, minPrice, maxPrice, selectedBrand, selectedModel, locationFilter, selectedPriceRange, brands, models, brandId, brandName, refreshing]);

    useEffect(() => {
        const t = setTimeout(() => fetchAds(), 600);
        return () => clearTimeout(t);
    }, [fetchAds]);

    const toggleFavorite = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };
        setAds(fetchedAds);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, selectedSort, minPrice, maxPrice, selectedBrand, selectedModel, locationFilter, brands, models, brandName, brandId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAds();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchAds]);

  const toggleFavorite = (carId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  // Handle Category Press
  const handleCategoryPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newCategory = selectedCategory === key ? 'all' : key;
    setSelectedCategory(newCategory);

    // Clear brand and model filters when switching categories
    // This prevents conflicting filters (e.g. searching for a "Toyota" bike)
    if (newCategory !== selectedCategory) {
      setSelectedBrand('');
      setSelectedModel('');
    }
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrand('');
    setSelectedModel('');
    setLocationFilter('');
    setSelectedSort('all');
  };

  const renderFilterModal = () => (
    <Modal visible={showFilters} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.filterModalContent}>
          <View style={styles.sheetHandle} />
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('buy_car_screen.filter_vehicles')}</Text>
            <TouchableOpacity
              style={styles.closeBtnCircle}
              onPress={() => setShowFilters(false)}
            >
              <Ionicons name="close" size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.filterGroupTitle}>{t('buy_car_screen.price_range')}</Text>
            <View style={styles.priceRow}>
              <View style={styles.priceInputWrap}>
                <TextInput
                  placeholder={t('buy_car_screen.min')}
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                />
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceInputWrap}>
                <TextInput
                  placeholder={t('buy_car_screen.max')}
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                />
              </View>
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.filterGroupTitle}>{t('location')}</Text>
                  <TouchableOpacity
                    style={styles.locationInputWrap}
                    onPress={() => setShowLocationModal(true)}
                  >
                    <Ionicons name="location-outline" size={20} color={locationFilter ? "#111827" : "#9CA3AF"} />
                    <Text style={[styles.locationInput, !locationFilter && { color: '#9CA3AF' }]} numberOfLines={1}>
                      {locationFilter || t('buy_car_screen.select_location')}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.filterCol}>
                <SelectField
                  label={t('buy_car_screen.sort_by')}
                  value={selectedSort}
                  options={SORT_OPTIONS}
                  onSelect={setSelectedSort}
                />
              </View>
            </View>

            <View style={styles.filterRow}>
              <View style={styles.filterCol}>
                <SelectField
                  label={t('buy_car_screen.select_brand')}
                  value={selectedBrand}
                  options={brands}
                  onSelect={setSelectedBrand}
                  disabled={selectedCategory === 'all' || isBrandsLoading}
                  placeholder={isBrandsLoading ? "Loading..." : t('buy_car_screen.select_brand')}
                  searchable={true}
                />
              </View>
              <View style={styles.filterCol}>
                <SelectField
                  label={t('buy_car_screen.select_model')}
                  value={selectedModel}
                  options={models}
                  onSelect={setSelectedModel}
                  disabled={!selectedBrand || isModelsLoading}
                  placeholder={isModelsLoading ? "Loading..." : t('buy_car_screen.select_model')}
                  searchable={true}
                />
              </View>
            </View>

    const resetFilters = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setMinPrice(""); setMaxPrice(""); setSelectedBrand(""); setSelectedModel("");
        setLocationFilter(""); setSelectedSort("all"); setSelectedPriceRange(0);
        setSelectedCategory("all");
    };

    const renderListCard = (item: any) => {
        const details = Array.isArray(item.CarDetails) ? item.CarDetails[0] : item.CarDetails;
        const imageUrl = item.AdImage?.[0]?.image_url;
        const isFav = favorites.includes(item.id);

        return (
            <TouchableOpacity
                style={styles.listCard}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/cars/${item.id}`); }}
                activeOpacity={0.93}
            >
                <View style={styles.listCardImageWrap}>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/car.jpg")}
                        style={styles.listCardImage}
                        contentFit="cover"
                        transition={250}
                    />
                    {item.is_featured && (
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredBadgeText}>⭐ Featured</Text>
                        </View>
                    )}
                </View>
                <View style={styles.listCardBody}>
                    <Text style={styles.listCardTitle} numberOfLines={2}>{item.title || `${details?.brand} ${details?.model}`}</Text>
                    <Text style={styles.listCardPrice}>{formatPrice(item.price)}</Text>
                    <View style={styles.listCardMeta}>
                        {details?.year ? <View style={styles.metaChip}><Ionicons name="calendar-outline" size={11} color="#64748B" /><Text style={styles.metaChipText}>{details.year}</Text></View> : null}
                        {details?.mileage ? <View style={styles.metaChip}><Ionicons name="speedometer-outline" size={11} color="#64748B" /><Text style={styles.metaChipText}>{formatMileage(details.mileage)}</Text></View> : null}
                        {details?.fuel_type ? <View style={styles.metaChip}><Ionicons name="flash-outline" size={11} color="#64748B" /><Text style={styles.metaChipText}>{details.fuel_type}</Text></View> : null}
                    </View>
                    <View style={styles.listCardFooter}>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={12} color="#94A3B8" />
                            <Text style={styles.locationText} numberOfLines={1}>{item.location?.split(",")[0] || "Sri Lanka"}</Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favBtnSmall}>
                            <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color={isFav ? "#EF4444" : "#94A3B8"} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderGridCard = (item: any) => {
        const details = Array.isArray(item.CarDetails) ? item.CarDetails[0] : item.CarDetails;
        const imageUrl = item.AdImage?.[0]?.image_url;
        const isFav = favorites.includes(item.id);

        return (
            <TouchableOpacity
                style={styles.gridCard}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/cars/${item.id}`); }}
                activeOpacity={0.93}
            >
                <View style={styles.gridImageWrap}>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/car.jpg")}
                        style={styles.gridImage}
                        contentFit="cover"
                        transition={250}
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.75)"]}
                        style={styles.gridGradient}
                    />
                    <View style={styles.gridPriceBadge}>
                        <Text style={styles.gridPriceText}>{formatPrice(item.price)}</Text>
                    </View>
                    <TouchableOpacity style={styles.gridFavBtn} onPress={() => toggleFavorite(item.id)}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={16} color={isFav ? "#EF4444" : "white"} />
                    </TouchableOpacity>
                    {item.is_featured && (
                        <View style={styles.gridFeaturedBadge}>
                            <Text style={styles.gridFeaturedText}>Featured</Text>
                        </View>
                    )}
                </View>
                <View style={styles.gridBody}>
                    <Text style={styles.gridTitle} numberOfLines={1}>{details?.brand ? `${details.brand} ${details.model || ""}`.trim() : item.title}</Text>
                    <View style={styles.gridMetaRow}>
                        {details?.year ? <Text style={styles.gridMeta}>{details.year}</Text> : null}
                        {details?.year && details?.mileage ? <Text style={styles.gridDot}>·</Text> : null}
                        {details?.mileage ? <Text style={styles.gridMeta}>{formatMileage(details.mileage)}</Text> : null}
                    </View>
                    <View style={styles.gridLocationRow}>
                        <Ionicons name="location-outline" size={10} color="#94A3B8" />
                        <Text style={styles.gridLocation} numberOfLines={1}>{item.location?.split(",")[0] || "Sri Lanka"}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderFilterModal = () => (
        <Modal visible={showFilters} transparent animationType="slide">
            <View style={styles.filterOverlay}>
                <View style={styles.filterSheet}>
                    {/* Handle */}
                    <View style={styles.sheetHandle} />
                    <View style={styles.filterHeader}>
                        <View>
                            <Text style={styles.filterTitle}>Filter Cars</Text>
                            <Text style={styles.filterSub}>Narrow down your search</Text>
                        </View>
                        <TouchableOpacity onPress={resetFilters} style={styles.clearBtn}>
                            <Text style={styles.clearBtnText}>Clear all</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        {/* Price Ranges Quick Select */}
                        <Text style={styles.filterGroupLabel}>Budget Range</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.priceRangeRow}>
                            {PRICE_RANGES.map((r, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.priceRangeChip, selectedPriceRange === i && styles.priceRangeChipActive]}
                                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedPriceRange(i); }}
                                >
                                    <Text style={[styles.priceRangeChipText, selectedPriceRange === i && styles.priceRangeChipTextActive]}>{r.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Custom Price */}
                        <Text style={styles.filterGroupLabel}>Custom Price (LKR)</Text>
                        <View style={styles.customPriceRow}>
                            <TextInput
                                placeholder="Min" value={minPrice} onChangeText={setMinPrice}
                                keyboardType="numeric" style={styles.priceInputField} placeholderTextColor="#94A3B8"
                            />
                            <View style={styles.priceDash} />
                            <TextInput
                                placeholder="Max" value={maxPrice} onChangeText={setMaxPrice}
                                keyboardType="numeric" style={styles.priceInputField} placeholderTextColor="#94A3B8"
                            />
                        </View>

                        {/* Sort */}
                        <Text style={styles.filterGroupLabel}>Sort By</Text>
                        <View style={styles.sortRow}>
                            {SORT_OPTIONS.map(opt => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[styles.sortChip, selectedSort === opt.value && styles.sortChipActive]}
                                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedSort(opt.value); }}
                                >
                                    <Text style={[styles.sortChipText, selectedSort === opt.value && styles.sortChipTextActive]}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Brand */}
                        <SelectField label="Make / Brand" value={selectedBrand} options={brands}
                            onSelect={setSelectedBrand} disabled={selectedCategory === "all" || isBrandsLoading}
                            placeholder={isBrandsLoading ? "Loading…" : "Select Brand"} searchable />

                        {/* Model */}
                        <SelectField label="Model" value={selectedModel} options={models}
                            onSelect={setSelectedModel} disabled={!selectedBrand || isModelsLoading}
                            placeholder={isModelsLoading ? "Loading…" : "Select Model"} searchable />

                        {/* Location */}
                        <Text style={styles.filterGroupLabel}>Location</Text>
                        <TouchableOpacity style={styles.locationPickerBtn} onPress={() => setShowLocationModal(true)}>
                            <Ionicons name="location-outline" size={18} color={locationFilter ? COLORS.primary : "#94A3B8"} />
                            <Text style={[styles.locationPickerText, !locationFilter && { color: "#94A3B8" }]}>
                                {locationFilter || "Any Location"}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                        </TouchableOpacity>
                        <LocationModal visible={showLocationModal} onClose={() => setShowLocationModal(false)} onSelect={setLocationFilter} />
                    </ScrollView>

                    <TouchableOpacity style={styles.applyBtn} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowFilters(false); }}>
                        <LinearGradient colors={["#4F46E5", "#7C3AED"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.applyBtnGradient}>
                            <Text style={styles.applyBtnText}>Show {ads.length} Results</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

  const renderCarCard = (item: any) => {
    const isFavorite = favorites.includes(item.id);
    const imageUrl = item.AdImage?.[0]?.image_url;
    const formattedPrice = item.price ? `Rs. ${(item.price / 1000000).toFixed(1)}Mn` : 'N/A';

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
            <Stack.Screen options={{ headerShown: false }} />

            {/* ─── APP BRANDED HEADER ─── */}
            <LinearGradient
                colors={BRAND_GRAD}
                style={[styles.header, { paddingTop: insets.top }]}
            >
                {/* Row 1: Back chevron + Logo + View Toggle */}
                <View style={styles.headerRow1}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </TouchableOpacity>

                    <View pointerEvents="none" style={styles.logoCentre}>
                        <RNImage
                            source={require("@/assets/logoHome.png")}
                            resizeMode="contain"
                            style={styles.logoImg}
                        />
                    </View>

                    <View style={styles.viewToggleWrap}>
                        <TouchableOpacity
                            style={[styles.viewToggleBtn, viewMode === "list" && styles.viewToggleBtnActive]}
                            onPress={() => setViewMode("list")}
                        >
                            <Ionicons name="list" size={18} color={viewMode === "list" ? "white" : "rgba(255,255,255,0.6)"} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.viewToggleBtn, viewMode === "grid" && styles.viewToggleBtnActive]}
                            onPress={() => setViewMode("grid")}
                        >
                            <Ionicons name="grid" size={15} color={viewMode === "grid" ? "white" : "rgba(255,255,255,0.6)"} />
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={styles.headerSub}>
                    {ads.length > 0 ? `${ads.length} listings available` : "Finding your perfect match..."}
                </Text>

                {/* Search Bar */}
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={17} color="rgba(255,255,255,0.7)" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search make, model, keyword..."
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery ? (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={17} color="rgba(255,255,255,0.7)" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Category Pills */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    <TouchableOpacity
                        style={[styles.categoryPill, selectedCategory === "all" && styles.categoryPillActive]}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedCategory("all"); }}
                    >
                        <Ionicons name="apps" size={13} color="white" />
                        <Text style={[styles.categoryPillText, selectedCategory === "all" && styles.categoryPillTextActive]}>All</Text>
                    </TouchableOpacity>
                    {vehicleTypes.map(t => (
                        <TouchableOpacity
                            key={t.key}
                            style={[styles.categoryPill, selectedCategory === t.key && styles.categoryPillActive]}
                            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setSelectedCategory(selectedCategory === t.key ? "all" : t.key); }}
                        >
                            <Ionicons name={t.icon as any} size={13} color="white" />
                            <Text style={[styles.categoryPillText, selectedCategory === t.key && styles.categoryPillTextActive]}>{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </LinearGradient>

            {/* ─── CONTENT ─── */}
            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingTop: 10 }]}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchAds(); }} tintColor={COLORS.primary} colors={[COLORS.primary]} />}
            >
                {isLoading ? (
                    <View style={viewMode === "grid" ? styles.gridWrap : undefined}>
                        {[1, 2, 3, 4, 5, 6].map(i => <ShimmerCard key={i} />)}
                    </View>
                ) : ads.length === 0 ? (
                    <View style={styles.emptyState}>
                        <MaterialCommunityIcons name="car-off" size={64} color="#334155" />
                        <Text style={styles.emptyTitle}>No Listings Found</Text>
                        <Text style={styles.emptySub}>Try adjusting your filters or search terms</Text>
                        <TouchableOpacity style={styles.emptyResetBtn} onPress={resetFilters}>
                            <Text style={styles.emptyResetText}>Reset All Filters</Text>
                        </TouchableOpacity>
                    </View>
                ) : viewMode === "grid" ? (
                    <View style={styles.gridWrap}>
                        {ads.map(item => (
                            <View key={item.id} style={styles.gridCardWrap}>
                                {renderGridCard(item)}
                            </View>
                        ))}
                    </View>
                ) : (
                    ads.map(item => (
                        <View key={item.id} style={styles.listCardWrap}>
                            {renderListCard(item)}
                        </View>
                    ))
                )}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ─── FILTER FAB ─── */}
            <View style={[styles.filterFabWrap, { bottom: insets.bottom + 20 }]}>
                    <TouchableOpacity
                    style={styles.filterFab}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowFilters(true); }}
                >
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.filterFabGradient}>
                        <Ionicons name="options-outline" size={20} color="white" />
                        <Text style={styles.filterFabText}>Filters</Text>
                        {activeFilterCount > 0 && (
                            <View style={styles.filterBadge}>
                                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                            </View>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {renderFilterModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#F1F5F9" },

    // HEADER (app brand style)
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        zIndex: 100,
    },
    headerRow1: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 52,
    },
    logoCentre: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
    },
    logoImg: { width: 100, height: 22 },
    backBtn: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: "center", justifyContent: "flex-start",
        zIndex: 10,
    },
    headerSub: { fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 8, marginLeft: 2 },

    viewToggleWrap: {
        flexDirection: "row", backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 10, padding: 2,
    },
    viewToggleBtn: { padding: 7, borderRadius: 8 },
    viewToggleBtnActive: { backgroundColor: "rgba(255,255,255,0.25)" },

    // SEARCH BAR — white glass effect on blue header
    searchBar: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.15)",
        marginBottom: 10,
    },
    searchInput: { flex: 1, fontSize: 14, color: "white" },

    // CATEGORIES
    categoryScroll: { gap: 8, paddingRight: 4 },
    categoryPill: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 20, backgroundColor: "rgba(255,255,255,0.15)",
        borderWidth: 1, borderColor: "rgba(255,255,255,0.12)",
    },
    categoryPillActive: {
        backgroundColor: "rgba(255,255,255,0.95)",
        borderColor: "white",
    },
    categoryPillText: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.85)" },
    categoryPillTextActive: { color: COLORS.primary },

    // SCROLL
    scrollContent: { paddingHorizontal: 12 },

    // GRID
    gridWrap: {
        flexDirection: "row", flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 0,
    },
    gridCardWrap: { width: (width - 30) / 2, marginBottom: 12 },
    gridCard: {
        backgroundColor: "white", borderRadius: 18,
        overflow: "hidden",
        elevation: 3,
        shadowColor: "#0F172A", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    gridImageWrap: { height: 130, position: "relative" },
    gridImage: { width: "100%", height: "100%" },
    gridGradient: { ...StyleSheet.absoluteFillObject },
    gridPriceBadge: {
        position: "absolute", bottom: 8, left: 8,
        backgroundColor: "#4F46E5",
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
    },
    gridPriceText: { color: "white", fontSize: 11, fontWeight: "800" },
    gridFavBtn: {
        position: "absolute", top: 8, right: 8,
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center", justifyContent: "center",
    },
    gridFeaturedBadge: {
        position: "absolute", top: 8, left: 8,
        backgroundColor: "#F59E0B",
        paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
    },
    gridFeaturedText: { fontSize: 9, fontWeight: "800", color: "white" },
    gridBody: { padding: 10 },
    gridTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 3 },
    gridMetaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
    gridMeta: { fontSize: 11, color: "#64748B", fontWeight: "500" },
    gridDot: { fontSize: 11, color: "#CBD5E1" },
    gridLocationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    gridLocation: { fontSize: 10, color: "#94A3B8", flex: 1 },

    // LIST CARD
    listCardWrap: { marginBottom: 12 },
    listCard: {
        flexDirection: "row", backgroundColor: "white",
        borderRadius: 18, overflow: "hidden",
        elevation: 3,
        shadowColor: "#0F172A", shadowOpacity: 0.07, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    listCardImageWrap: { width: 130, height: 115, position: "relative" },
    listCardImage: { width: "100%", height: "100%" },
    featuredBadge: {
        position: "absolute", top: 8, left: 0,
        backgroundColor: "#F59E0B",
        paddingHorizontal: 8, paddingVertical: 3,
        borderTopRightRadius: 8, borderBottomRightRadius: 8,
    },
    featuredBadgeText: { fontSize: 9, fontWeight: "800", color: "white" },
    listCardBody: { flex: 1, padding: 12, justifyContent: "space-between" },
    listCardTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A", lineHeight: 18 },
    listCardPrice: { fontSize: 16, fontWeight: "900", color: "#4F46E5", marginTop: 3 },
    listCardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 5 },
    metaChip: {
        flexDirection: "row", alignItems: "center", gap: 3,
        backgroundColor: "#F1F5F9", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
    },
    metaChipText: { fontSize: 10, color: "#64748B", fontWeight: "600" },
    listCardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5 },
    locationRow: { flexDirection: "row", alignItems: "center", gap: 3, flex: 1 },
    locationText: { fontSize: 11, color: "#94A3B8", flex: 1 },
    favBtnSmall: { padding: 4 },

    // SHIMMER
    shimmerCard: {
        width: (width - 30) / 2,
        backgroundColor: "#E2E8F0",
        borderRadius: 18, overflow: "hidden",
        marginBottom: 12,
    },
    shimmerImage: { height: 130, backgroundColor: "#CBD5E1" },
    shimmerLine: { height: 12, backgroundColor: "#CBD5E1", borderRadius: 6, width: "80%" },

    // EMPTY
    emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 80 },
    emptyTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B", marginTop: 16 },
    emptySub: { fontSize: 14, color: "#64748B", marginTop: 6, textAlign: "center", paddingHorizontal: 40 },
    emptyResetBtn: {
        marginTop: 20, backgroundColor: "#4F46E5",
        paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12,
    },
    emptyResetText: { color: "white", fontWeight: "700", fontSize: 14 },

    // FILTER FAB
    filterFabWrap: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 200 },
    filterFab: { borderRadius: 30, overflow: "hidden", elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.4, shadowOffset: { width: 0, height: 6 }, shadowRadius: 15 },
    filterFabGradient: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 14 },
    filterFabText: { color: "white", fontWeight: "700", fontSize: 15 },
    filterBadge: {
        backgroundColor: "#EF4444", borderRadius: 10, minWidth: 20, height: 20,
        alignItems: "center", justifyContent: "center", paddingHorizontal: 4,
    },
    filterBadgeText: { color: "white", fontSize: 11, fontWeight: "800" },

    // FILTER SHEET
    filterOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    filterSheet: {
        backgroundColor: "white", borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingHorizontal: 20, paddingBottom: 34, maxHeight: height * 0.85,
    },
    sheetHandle: {
        width: 40, height: 4, backgroundColor: "#E2E8F0",
        borderRadius: 2, alignSelf: "center", marginTop: 12, marginBottom: 16,
    },
    filterHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    filterTitle: { fontSize: 20, fontWeight: "800", color: "#0F172A" },
    filterSub: { fontSize: 13, color: "#64748B", marginTop: 2 },
    clearBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: "#FEF2F2" },
    clearBtnText: { color: "#EF4444", fontWeight: "700", fontSize: 13 },

    filterGroupLabel: { fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 10, marginTop: 16 },

    priceRangeRow: { gap: 8, paddingBottom: 4 },
    priceRangeChip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: "#F1F5F9", borderWidth: 1.5, borderColor: "#E2E8F0",
    },
    priceRangeChipActive: { backgroundColor: "#EEF2FF", borderColor: "#4F46E5" },
    priceRangeChipText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
    priceRangeChipTextActive: { color: "#4F46E5" },

    customPriceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    priceInputField: {
        flex: 1, borderWidth: 1.5, borderColor: "#E2E8F0", borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: "#0F172A",
        backgroundColor: "#F8FAFC",
    },
    priceDash: { width: 16, height: 2, backgroundColor: "#CBD5E1", borderRadius: 1 },

    sortRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
    sortChip: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        backgroundColor: "#F1F5F9", borderWidth: 1.5, borderColor: "#E2E8F0",
    },
    sortChipActive: { backgroundColor: "#EEF2FF", borderColor: "#4F46E5" },
    sortChipText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
    sortChipTextActive: { color: "#4F46E5" },

    locationPickerBtn: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#F8FAFC", borderRadius: 12, borderWidth: 1.5, borderColor: "#E2E8F0",
        paddingHorizontal: 14, paddingVertical: 13,
    },
    locationPickerText: { flex: 1, fontSize: 14, color: "#0F172A", fontWeight: "500" },

    applyBtn: { borderRadius: 16, overflow: "hidden", marginTop: 20 },
    applyBtnGradient: { paddingVertical: 16, alignItems: "center" },
    applyBtnText: { color: "white", fontWeight: "800", fontSize: 16 },
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title={t('buy_car_screen.find_vehicle')} />
      {renderFilterModal()}

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <View style={[styles.searchBarInner, searchFocused && styles.searchBarInnerFocused]}>
                <LinearGradient
                  colors={searchFocused ? ['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)'] : ['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.5)']}
                  style={styles.searchGradient}
                />
                <Ionicons
                  name="search-outline"
                  size={16}
                  color={searchFocused ? COLORS.primary : COLORS.text.muted}
                  style={{ marginLeft: 2 }}
                />
                <TextInput
                  placeholder={t('home.search_placeholder')}
                  placeholderTextColor={COLORS.text.placeholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  onFocus={() => {
                    setSearchFocused(true);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  onBlur={() => {
                    setSearchFocused(false);
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={{ marginRight: 6 }}>
                    <Ionicons name="close-circle" size={16} color={COLORS.text.muted} />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity
                style={styles.filterBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowFilters(true);
                }}
              >
                <Ionicons name="options-outline" size={20} color={COLORS.primary} />
                {(minPrice || maxPrice || selectedBrand || locationFilter) && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Browse Categories */}
          <View style={styles.sectionHeader}>
            <View style={styles.titleWithAccent}>
              <View style={styles.accentBar} />
              <View>
                <Text style={styles.sectionTitle}>{t('buy_car_screen.browse_category')}</Text>
                <Text style={styles.sectionSubtitleSmall}>Filter vehicles by type</Text>
              </View>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {isCategoriesLoading ? (
              <Loading style={{ marginLeft: 20, paddingVertical: 10 }} message="" />
            ) : (
              vehicleTypes.map((item) => (
                <CategoryCard
                  key={item.key}
                  item={item}
                  isActive={selectedCategory === item.key}
                  onPress={handleCategoryPress}
                />
              ))
            )}
          </ScrollView>

          {/* Listings */}
          <View style={[styles.sectionHeader, { marginTop: 24 }]}>
            <View style={styles.titleWithAccent}>
              <View style={styles.accentBar} />
              <View>
                <Text style={styles.sectionTitle}>{t('buy_car_screen.results')}</Text>
                <Text style={styles.sectionSubtitleSmall}>
                  {ads.length} {t('buy_car_screen.items')} available
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.carsSection}>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <Loading size="large" message="Fetching vehicles..." />
              </View>
            ) : ads.length === 0 ? (
              <View style={styles.emptyResultsContainer}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons name="search-outline" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.emptyTitle}>No Vehicles Found</Text>
                <Text style={styles.emptySubtitle}>
                  We couldn't find any vehicles matching your current filters.
                </Text>
                <TouchableOpacity
                  style={styles.clearFiltersButton}
                  onPress={() => {
                    setSelectedCategory('all');
                    setSelectedBrand('');
                    setSelectedModel('');
                    setLocationFilter('');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                >
                  <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.carsGrid}>
                {ads.map((item, idx) => {
                  if (idx % 2 === 0) {
                    return (
                      <View key={idx} style={styles.carsRow}>
                        {renderCarCard(ads[idx])}
                        {ads[idx + 1] ? renderCarCard(ads[idx + 1]) : <View style={{ width: CARD_WIDTH }} />}
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  safe: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 60 },
  searchSection: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 4 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    shadowColor: COLORS.shadowPremium || '#235CF8',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  searchBarInnerFocused: {
    borderColor: 'rgba(35, 92, 248, 0.3)',
    shadowOpacity: 0.1,
    elevation: 4,
    backgroundColor: COLORS.white,
  },
  searchGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  searchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '500'
  },
  filterBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: COLORS.shadowPremium || '#235CF8',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  filterDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.status.danger,
    borderWidth: 2,
    borderColor: COLORS.white
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12
  },
  titleWithAccent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accentBar: {
    width: 4,
    height: 32,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text.primary,
    letterSpacing: -0.8
  },
  sectionSubtitleSmall: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '600',
    marginTop: -2
  },
  underline: {
    height: 4,
    width: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: '700'
  },
  categoryScroll: { paddingHorizontal: 16, gap: 10, paddingBottom: 16, paddingTop: 4 },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    shadowColor: COLORS.shadowPremium || '#235CF8',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: COLORS.white,
    fontWeight: '800'
  },
  carsSection: { paddingHorizontal: 16, marginTop: 4 },
  carsGrid: { gap: 16 },
  carsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  carCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: COLORS.shadowPremium || '#235CF8',
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.4)',
  },
  carImageContainer: { height: 130, position: 'relative' },
  carCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  yearBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(35, 92, 248, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  yearBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)'
  },
  carCardBody: { padding: 14 },
  carTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 6,
    letterSpacing: -0.3
  },
  carMetaRow: { marginBottom: 10 },
  carMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  carMetaText: { fontSize: 12, color: COLORS.text.muted, fontWeight: '600' },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end'
  },
  filterModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 0,
    maxHeight: '85%'
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 20
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text.primary, letterSpacing: -0.5 },
  filterGroupTitle: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginBottom: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  priceInputWrap: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  priceInput: { height: 52, fontSize: 13, color: COLORS.text.primary, fontWeight: '600' },
  priceDivider: { width: 12, height: 2, backgroundColor: COLORS.border, borderRadius: 1 },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  filterCol: {
    flex: 1,
  },
  locationInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationInput: { flex: 1, marginLeft: 10, fontSize: 14, color: COLORS.text.primary, fontWeight: '500' },
  modalFooter: { flexDirection: 'row', gap: 12, marginTop: 20, paddingBottom: 10 },
  resetButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.backgroundMuted,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  resetButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.text.secondary },
  applyButton: {
    flex: 2,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  applyButtonText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
  itemsBadge: {
    backgroundColor: 'rgba(35, 92, 248, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loaderContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyResultsContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(35, 92, 248, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  clearFiltersButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  clearFiltersButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  }
});
