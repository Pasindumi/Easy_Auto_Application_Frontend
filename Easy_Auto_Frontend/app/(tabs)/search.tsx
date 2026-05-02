import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  Animated,
  FlatList,
  RefreshControl,
  Image as RNImage,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { api } from '@/utils/api';
import SelectField from '@/components/ui/SelectField';
import SearchBar from '@/components/SearchBar';

import Loading from '@/components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Helper to map vehicle types to icons
const getIconForType = (typeName: string) => {
  const lower = typeName.toLowerCase();
  if (lower.includes('car')) return 'car-sport';
  if (lower.includes('van')) return 'car';
  if (lower.includes('suv')) return 'car-sport';
  if (lower.includes('bus')) return 'bus';
  if (lower.includes('lorry') || lower.includes('truck')) return 'bus-outline';
  if (lower.includes('bike') || lower.includes('motor')) return 'bicycle';
  if (lower.includes('cab') || lower.includes('taxi')) return 'taxi';
  return 'car-sport';
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'year-new', label: 'Newest First' },
  { value: 'year-old', label: 'Oldest First' },
  { value: 'mileage-low', label: 'Lowest Mileage' },
];

const PRICE_RANGES = [
  { label: 'Any Price', min: '', max: '' },
  { label: 'Under 1M', min: '', max: '1000000' },
  { label: '1M to 3M', min: '1000000', max: '3000000' },
  { label: '3M to 5M', min: '3000000', max: '5000000' },
  { label: '5M to 10M', min: '5000000', max: '10000000' },
  { label: 'Above 10M', min: '10000000', max: '' },
];

const YEAR_RANGES = [
  { label: 'Any Year', min: '', max: '' },
  { label: '2023-2024', min: '2023', max: '2024' },
  { label: '2020-2022', min: '2020', max: '2022' },
  { label: '2015-2019', min: '2015', max: '2019' },
  { label: '2010-2014', min: '2010', max: '2014' },
  { label: 'Before 2010', min: '', max: '2009' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState('relevance');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedYearRange, setSelectedYearRange] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  // UI States
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Animation
  const filterSlideAnim = React.useRef(new Animated.Value(0)).current;

  const params = useLocalSearchParams<{ openFilters?: string }>();

  // Fetch initial data
  useEffect(() => {
    fetchVehicleTypes();
    fetchConditions();

    if (params.openFilters === 'true') {
      setShowFilters(true);
    }
  }, [params.openFilters]);

  // Fetch vehicle types
  const fetchVehicleTypes = async () => {
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
      }
    } catch (error) {
      console.error("Error fetching vehicle types:", error);
    }
  };

  // Fetch conditions
  const fetchConditions = async () => {
    try {
      const res: any = await api.get('/api/vehicle-config/conditions');
      if (Array.isArray(res)) {
        setConditions(res.map(c => ({ label: c.condition_name, value: c.id })));
      }
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  };

  // Fetch brands when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      fetchBrands();
    } else {
      setBrands([]);
      setSelectedBrand('');
    }
  }, [selectedCategory]);

  const fetchBrands = async () => {
    try {
      const res: any = await api.get(`/api/vehicle-config/brands/${selectedCategory}`);
      if (Array.isArray(res)) {
        setBrands(res.map(b => ({ label: b.brand_name, value: b.id })));
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Fetch models when brand changes
  useEffect(() => {
    if (selectedBrand) {
      fetchModels();
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedBrand]);

  const fetchModels = async () => {
    try {
      const res: any = await api.get(`/api/vehicle-config/models/by-brand/${selectedBrand}`);
      if (Array.isArray(res)) {
        setModels(res.map(m => ({ label: m.model_name, value: m.id })));
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Perform search
  const performSearch = useCallback(async () => {
    setIsSearching(true);
    try {
      const params: any = {};

      if (searchQuery) params.search = searchQuery;
      if (selectedCategory !== 'all') params.vehicleTypeId = selectedCategory; 
      if (locationFilter) params.location = locationFilter;

      if (selectedBrand) {
        const brandObj = brands.find((b: any) => b.value === selectedBrand);
        if (brandObj) params.brand = brandObj.label; 
      }

      if (selectedModel) {
        const modelObj = models.find((m: any) => m.value === selectedModel);
        if (modelObj) params.model = modelObj.label; 
      }

      if (selectedCondition) {
        const condObj = conditions.find((c: any) => c.value === selectedCondition);
        if (condObj) params.condition = condObj.label;
      }
      if (selectedFuelType) params.fuelType = selectedFuelType;     
      if (selectedTransmission) params.transmission = selectedTransmission;

      const priceRange = PRICE_RANGES[selectedPriceRange];
      if (priceRange.min) params.minPrice = priceRange.min; 
      if (priceRange.max) params.maxPrice = priceRange.max; 

      const yearRange = YEAR_RANGES[selectedYearRange];
      if (yearRange.min) params.minYear = yearRange.min; 
      if (yearRange.max) params.maxYear = yearRange.max; 

      if (selectedSort !== 'relevance') params.sort = selectedSort;

      const queryString = new URLSearchParams(params).toString();
      const response = await api.get<{ success: boolean; data: any[] }>(
        `/api/cars${queryString ? `?${queryString}` : ''}`
      );

      if (response.success) {
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
      setRefreshing(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, selectedModel, selectedCondition,
    selectedFuelType, selectedTransmission, locationFilter, selectedPriceRange,
    selectedYearRange, selectedSort, brands, models]);

  // Auto-search on ANY filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [performSearch]); 

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrand) count++;
    if (selectedModel) count++;
    if (selectedCondition) count++;
    if (selectedFuelType) count++;
    if (selectedTransmission) count++;
    if (locationFilter) count++;
    if (selectedPriceRange > 0) count++;
    if (selectedYearRange > 0) count++;
    setActiveFilterCount(count);
  }, [selectedCategory, selectedBrand, selectedModel, selectedCondition,
    selectedFuelType, selectedTransmission, locationFilter, selectedPriceRange, selectedYearRange]);

  // Toggle filters
  const toggleFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFilters(!showFilters);
    Animated.spring(filterSlideAnim, {
      toValue: showFilters ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  // Clear all filters
  const clearAllFilters = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCategory('all');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedCondition('');
    setSelectedFuelType('');
    setSelectedTransmission('');
    setLocationFilter('');
    setSelectedPriceRange(0);
    setSelectedYearRange(0);
    setSearchQuery('');
  };

  // Toggle favorite
  const toggleFavorite = async (adId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const response = await api.post<{ success: boolean; isFavorite: boolean }>(
        '/api/favorites/toggle',
        { ad_id: adId }
      );
      if (response.success) {
        setFavorites(prev =>
          response.isFavorite
            ? [...prev, adId]
            : prev.filter(id => id !== adId)
        );
      }
    } catch (error) {
      console.error("Toggle favorite error:", error);
    }
  };

  // Render search result card
  const renderSearchCard = ({ item }: { item: any }) => {
    const mainImage = item.AdImage?.find((img: any) => img.is_main)?.image_url || 
      item.AdImage?.[0]?.image_url;
    const details = item.CarDetails?.[0] || item.CarDetails || {};
    const formattedPrice = new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(item.price);
    const isFavorite = favorites.includes(String(item.id));

    return (
      <TouchableOpacity
        style={styles.resultCard}
        activeOpacity={0.9}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(`/cars/${item.id}` as any);
        }}
      >
        <View style={styles.cardImageContainer}>
          {mainImage ? (
            <Image
              source={{ uri: mainImage }}
              style={styles.cardImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="car-outline" size={40} color={COLORS.border} />
            </View>
          )}
          <TouchableOpacity
            style={styles.favoriteBtn}
            onPress={() => toggleFavorite(String(item.id))}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={isFavorite ? "#EF4444" : COLORS.white}
            />
          </TouchableOpacity>
          {item.is_featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardPrice}>{formattedPrice}</Text>

          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.text.muted} />
              <Text style={styles.metaText}>{details.year || 'N/A'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="speedometer-outline" size={12} color={COLORS.text.muted} />
              <Text style={styles.metaText}>
                {details.mileage ? `${Number(details.mileage).toLocaleString()}km` : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.cardLocation}>
            <Ionicons name="location-outline" size={12} color={COLORS.text.muted} />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t("buy_car_screen.search", "Search Vehicles")} />

      <View style={styles.mainContentContainer}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t("home.search_placeholder", "Search cars, brands, models...")}
          backgroundColor="#F1F5F9"
        />

        {/* Filter and stats section */}
        <View style={styles.filterStatsSection}>

          {/* Quick Filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickFilters}
          >
            <TouchableOpacity
              style={[styles.filterChip, activeFilterCount > 0 && styles.filterChipActive]}
              onPress={toggleFilters}
            >
              <Ionicons
                name="options-outline"
                size={16}
                color={activeFilterCount > 0 ? COLORS.white : COLORS.primary}
              />
              <Text style={[styles.filterChipText, activeFilterCount > 0 && styles.filterChipTextActive]}>
                {t("buy_car_screen.filter_vehicles", "Filters")} {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Text>
            </TouchableOpacity>

            {vehicleTypes.slice(0, 5).map((type) => (
              <TouchableOpacity
                key={type.key}
                style={[
                  styles.filterChip,
                  selectedCategory === type.key && styles.filterChipActive
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedCategory(selectedCategory === type.key ? 'all' : type.key);
                }}
              >
                <Ionicons
                  name={type.icon as any}
                  size={16}
                  color={selectedCategory === type.key ? COLORS.white : COLORS.primary}
                />
                <Text
                  style={[
                    styles.filterChipText,
                    selectedCategory === type.key && styles.filterChipTextActive
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Sort & Results Count */}
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>
              {isSearching ? 'Searching...' : `${searchResults.length} ${t("buy_car_screen.results", "results found")}`}
            </Text>
          </View>
        </View>

        {/* Search Results */}
        <View style={{ flex: 1, position: 'relative' }}>
          <BrandedRefreshOverlay refreshing={refreshing} top={20} />
          <FlatList
          data={searchResults}
          renderItem={renderSearchCard}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.resultsGrid}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                performSearch();
              }}
              tintColor="transparent"
              colors={['transparent']}
              progressBackgroundColor="transparent"
              progressViewOffset={-500}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              {isSearching && !refreshing ? (
                <Loading />
              ) : (
                <>
                  <View style={styles.premiumEmptyIconContainer}>
                    <View style={styles.premiumEmptyIconInner}>
                      <Ionicons name="car-sport-outline" size={48} color={COLORS.primary} />
                      <View style={styles.premiumSearchBadge}>
                        <Ionicons name="search" size={14} color={COLORS.white} />
                      </View>
                    </View>
                  </View>

                  <Text style={styles.premiumEmptyTitle}>{t("buy_car_screen.no_vehicles_found", "No vehicles found")}</Text>
                  <Text style={styles.premiumEmptyText}>
                    We couldn't find any matches. Try adjusting your search or resetting the filters.
                  </Text>
                  {activeFilterCount > 0 && (
                    <TouchableOpacity style={styles.premiumClearButton} onPress={clearAllFilters} activeOpacity={0.8}>
                      <Text style={styles.premiumClearButtonText}>{t("buy_car_screen.clear_filters", "Clear All Filters")}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          }
        />
        </View>

      </View>

      {/* Advanced Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilters}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t("buy_car_screen.filter_vehicles", "Advanced Filters")}</Text>
              <TouchableOpacity onPress={toggleFilters}>
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>{t("buy_car_screen.price_range", "Price Range")}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.rangeChips}>
                    {PRICE_RANGES.map((range, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.rangeChip,
                          selectedPriceRange === index && styles.rangeChipActive
                        ]}
                        onPress={() => setSelectedPriceRange(index)}
                      >
                        <Text
                          style={[
                            styles.rangeChipText,
                            selectedPriceRange === index && styles.rangeChipTextActive
                          ]}
                        >
                          {range.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Year Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Year</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.rangeChips}>
                    {YEAR_RANGES.map((range, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.rangeChip,
                          selectedYearRange === index && styles.rangeChipActive
                        ]}
                        onPress={() => setSelectedYearRange(index)}
                      >
                        <Text
                          style={[
                            styles.rangeChipText,
                            selectedYearRange === index && styles.rangeChipTextActive
                          ]}
                        >
                          {range.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Brand */}
              {brands.length > 0 && (
                <View style={styles.filterSection}>
                  <SelectField
                    label="Brand"
                    value={selectedBrand}
                    onSelect={setSelectedBrand}
                    options={[{ label: 'All Brands', value: '' }, ...brands]}
                  />
                </View>
              )}

              {/* Model */}
              {models.length > 0 && (
                <View style={styles.filterSection}>
                  <SelectField
                    label="Model"
                    value={selectedModel}
                    onSelect={setSelectedModel}
                    options={[{ label: 'All Models', value: '' }, ...models]}
                  />
                </View>
              )}

              {/* Condition */}
              {conditions.length > 0 && (
                <View style={styles.filterSection}>
                  <SelectField
                    label="Condition"
                    value={selectedCondition}
                    onSelect={setSelectedCondition}
                    options={[{ label: 'Any Condition', value: '' }, ...conditions]}
                  />
                </View>
              )}

              {/* Fuel Type */}
              <View style={styles.filterSection}>
                <SelectField
                  label="Fuel Type"
                  value={selectedFuelType}
                  onSelect={setSelectedFuelType}
                  options={[
                    { label: 'Any Fuel Type', value: '' },
                    { label: 'Petrol', value: 'Petrol' },
                    { label: 'Diesel', value: 'Diesel' },
                    { label: 'Electric', value: 'Electric' },
                    { label: 'Hybrid', value: 'Hybrid' },
                  ]}
                />
              </View>

              {/* Transmission */}
              <View style={styles.filterSection}>
                <SelectField
                  label="Transmission"
                  value={selectedTransmission}
                  onSelect={setSelectedTransmission}
                  options={[
                    { label: 'Any Transmission', value: '' },
                    { label: 'Automatic', value: 'Automatic' },
                    { label: 'Manual', value: 'Manual' },
                  ]}
                />
              </View>
            </ScrollView>

            <View style={[styles.modalFooter, { paddingBottom: Math.max(insets.bottom, 24) }]}>
              <TouchableOpacity
                style={styles.clearFiltersBtn}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>{t("buy_car_screen.reset_all", "Clear All")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersBtn}
                onPress={() => {
                  performSearch();
                  toggleFilters();
                }}
              >
                <Text style={styles.applyFiltersText}>{t("buy_car_screen.apply_filters", "Apply Filters")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  mainContentContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  filterStatsSection: {
    backgroundColor: COLORS.white,
    paddingBottom: 4,
  },
  quickFilters: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  resultsGrid: {
    padding: 16,
    paddingBottom: 130,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: "#DBEAFE",
    elevation: 0,
    shadowOpacity: 0,
  },
  cardImageContainer: {
    width: '100%',
    height: 110,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featuredText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.text.muted,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 11,
    color: COLORS.text.muted,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  clearButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  rangeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rangeChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rangeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  rangeChipTextActive: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  clearFiltersBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  applyFiltersBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
  premiumEmptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(35, 92, 248, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  premiumEmptyIconInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(35, 92, 248, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  premiumSearchBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F9FAFB',
  },
  premiumEmptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  premiumEmptyText: {
    fontSize: 15,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  premiumClearButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 5,
  },
  premiumClearButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
});
