import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
import LocationModal from '@/components/ui/LocationModal';

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
  { label: '1M - 3M', min: '1000000', max: '3000000' },
  { label: '3M - 5M', min: '3000000', max: '5000000' },
  { label: '5M - 10M', min: '5000000', max: '10000000' },
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
  const insets = useSafeAreaInsets();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
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
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Data States
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [conditions, setConditions] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Animation
  const filterSlideAnim = React.useRef(new Animated.Value(0)).current;

  // Fetch initial data
  useEffect(() => {
    fetchVehicleTypes();
  }, []);

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
  const fetchConditions = async (typeId: string) => {
    if (!typeId || typeId === 'all') {
      setConditions([]);
      setSelectedCondition('');
      return;
    }
    try {
      const res: any = await api.get(`/api/vehicle-config/conditions/${typeId}`);
      if (Array.isArray(res)) {
        setConditions(res.map(c => ({ label: c.condition_name, value: c.id })));
      }
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  };

  // Fetch conditions when category changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      fetchConditions(selectedCategory);
    } else {
      setConditions([]);
      setSelectedCondition('');
    }
  }, [selectedCategory]);

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
      if (selectedCategory !== 'all') params.vehicleTypeId = selectedCategory; // ✅ was: vehicle_type_id
      if (locationFilter) params.location = locationFilter;

      // Brand: backend expects brand NAME, not ID — resolve from list
      if (selectedBrand) {
        const brandObj = brands.find((b: any) => b.value === selectedBrand);
        if (brandObj) params.brand = brandObj.label; // ✅ was: brand_id
      }

      // Model: backend expects model NAME, not ID — resolve from list
      if (selectedModel) {
        const modelObj = models.find((m: any) => m.value === selectedModel);
        if (modelObj) params.model = modelObj.label; // ✅ was: model_id
      }

      if (selectedCondition) params.condition = selectedCondition; // ✅ was: condition_id
      if (selectedFuelType) params.fuelType = selectedFuelType;     // ✅ was: fuel_type
      if (selectedTransmission) params.transmission = selectedTransmission;

      const priceRange = PRICE_RANGES[selectedPriceRange];
      if (priceRange.min) params.minPrice = priceRange.min; // ✅ was: min_price
      if (priceRange.max) params.maxPrice = priceRange.max; // ✅ was: max_price

      const yearRange = YEAR_RANGES[selectedYearRange];
      if (yearRange.min) params.minYear = yearRange.min; // ✅ was: min_year
      if (yearRange.max) params.maxYear = yearRange.max; // ✅ was: max_year

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

  // Auto-search on ANY filter change (Fix 4: was missing brand/model/condition/fuel/transmission/location)
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [performSearch]); // ✅ performSearch already has all deps via useCallback


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
      {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTopRow}>
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

          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.headerSearchArea}>
           <View style={styles.glassSearch}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" />
            <TextInput
              style={styles.headerSearchInput}
              placeholder="Search cars, brands, models..."
              placeholderTextColor="rgba(255,255,255,0.6)"
      {/* Search Bar section - cleaned up without redundant gradient */}
      <View style={styles.searchSection}>
        <View style={styles.searchBarContainer}>
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <LinearGradient
              colors={searchFocused ? ['rgba(255,255,255,1)', 'rgba(255,255,255,0.9)'] : ['#F3F4F6', '#F3F4F6']}
              style={styles.searchGradient}
            />
            <Ionicons
              name="search"
              size={16}
              color={searchFocused ? COLORS.primary : COLORS.text.muted}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cars..."
              placeholderTextColor={COLORS.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              onSubmitEditing={performSearch}
              onFocus={() => {
                setSearchFocused(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              onBlur={() => setSearchFocused(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="rgba(255,255,255,0.5)" />
                <Ionicons name="close-circle" size={16} color={COLORS.text.muted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

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
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
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
            {isSearching ? 'Searching...' : `${searchResults.length} results found`}
          </Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              // Could open a sort modal here
            }}
          >
            <Ionicons name="swap-vertical" size={16} color={COLORS.primary} />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      <BrandedRefreshOverlay refreshing={refreshing} top={120} />
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
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isSearching ? (
              <Loading size="medium" message="Searching..." />
            ) : (
              <>
                <View style={styles.emptyIcon}>
                  <Ionicons name="search-outline" size={64} color={COLORS.border} />
                </View>
                <Text style={styles.emptyTitle}>No results found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your search or filters
                </Text>
                {activeFilterCount > 0 && (
                  <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
                    <Text style={styles.clearButtonText}>Clear All Filters</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        }
      />

      {/* Advanced Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilters}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.sheetHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advanced Filters</Text>
              <TouchableOpacity
                style={styles.closeBtnCircle}
                onPress={toggleFilters}
              >
                <Ionicons name="close" size={20} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              {/* Location & Sort Row */}
              <View style={[styles.filterRow, { marginBottom: 24 }]}>
                <View style={styles.filterCol}>
                  <Text style={styles.filterLabel}>Location</Text>
                  <TouchableOpacity
                    style={styles.locationInputWrap}
                    onPress={() => setShowLocationModal(true)}
                  >
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={locationFilter ? COLORS.primary : COLORS.text.muted}
                    />
                    <Text style={[styles.locationInput, !locationFilter && { color: COLORS.text.muted }]} numberOfLines={1}>
                      {locationFilter || "Select Location"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color={COLORS.text.muted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.filterCol}>
                  <SelectField
                    label="Sort By"
                    value={selectedSort}
                    onSelect={setSelectedSort}
                    options={SORT_OPTIONS}
                  />
                </View>
              </View>

              {/* Price Range */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
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

              {/* Brand & Model Row */}
              <View style={[styles.filterRow, { marginBottom: 8 }]}>
                {brands.length > 0 && (
                  <View style={styles.filterCol}>
                    <SelectField
                      label="Brand"
                      value={selectedBrand}
                      onSelect={setSelectedBrand}
                      options={[{ label: 'All Brands', value: '' }, ...brands]}
                    />
                  </View>
                )}

                {models.length > 0 && (
                  <View style={styles.filterCol}>
                    <SelectField
                      label="Model"
                      value={selectedModel}
                      onSelect={setSelectedModel}
                      options={[{ label: 'All Models', value: '' }, ...models]}
                    />
                  </View>
                )}
              </View>

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

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearFiltersBtn}
                onPress={clearAllFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyFiltersBtn}
                onPress={() => {
                  performSearch();
                  toggleFilters();
                }}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LocationModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelect={setLocationFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 100,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoCentre: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 100,
    height: 24,
  },
  headerRightSpacer: {
    width: 40,
  },
  headerSearchArea: {
    width: '100%',
  },
  glassSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 42,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  searchBarFocused: {
    borderColor: 'rgba(35, 92, 248, 0.3)',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadowPremium || COLORS.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  searchGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 15,
    color: 'white',
    marginLeft: 10,
    fontSize: 13,
    color: COLORS.text.primary,
    fontWeight: '500',
    padding: 0,
  },
  filterStatsSection: {
    backgroundColor: COLORS.white,
    paddingBottom: 4,
  },
  quickFilters: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
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
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImageContainer: {
    width: '100%',
    height: 140,
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
  emptyIcon: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '85%',
    paddingTop: 12,
    paddingBottom: 0,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  closeBtnCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  rangeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  rangeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  clearFiltersBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  applyFiltersBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterCol: {
    flex: 1,
  },
  locationInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  locationInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
});
