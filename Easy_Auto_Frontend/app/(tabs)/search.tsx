import Header from "@/components/Header";
import Loading from "@/components/ui/Loading";
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
import EmptyState from '@/components/ui/EmptyState';

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
      setModels([]);
      setSelectedModel('');
      setConditions([]);
      setSelectedCondition('');
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
      const res: any = await api.get(`/api/vehicle-config/models/${selectedBrand}`);
      if (Array.isArray(res)) {
        setModels(res.map(m => ({ label: m.model_name, value: m.id })));
      }
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  // Initial and filtered search
  const performSearch = useCallback(async (isRefreshing = false) => {
    setIsSearching(true);
    try {
      const params: any = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        brand: selectedBrand || undefined,
        model: selectedModel || undefined,
        sort: selectedSort,
        minPrice: PRICE_RANGES[selectedPriceRange].min || undefined,
        maxPrice: PRICE_RANGES[selectedPriceRange].max || undefined,
        minYear: YEAR_RANGES[selectedYearRange].min || undefined,
        maxYear: YEAR_RANGES[selectedYearRange].max || undefined,
        condition: selectedCondition || undefined,
        search: searchQuery || undefined,
        location: locationFilter || undefined,
      };

      const res: any = await api.get('/api/cars/search', params);
      setSearchResults(Array.isArray(res) ? res : []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      setRefreshing(false);
    }
  }, [
    selectedCategory, selectedBrand, selectedModel, selectedSort,
    selectedPriceRange, selectedYearRange, selectedCondition,
    searchQuery, locationFilter
  ]);

  useEffect(() => {
    performSearch();
  }, [selectedSort]);

  useEffect(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (selectedBrand) count++;
    if (selectedModel) count++;
    if (selectedPriceRange > 0) count++;
    if (selectedYearRange > 0) count++;
    if (selectedCondition) count++;
    if (locationFilter) count++;
    setActiveFilterCount(count);
  }, [selectedCategory, selectedBrand, selectedModel, selectedPriceRange, selectedYearRange, selectedCondition, locationFilter]);

  const toggleFilters = () => {
    if (showFilters) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.timing(filterSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowFilters(false));
    } else {
      setShowFilters(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Animated.timing(filterSlideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const clearFilters = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedCategory('all');
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedPriceRange(0);
    setSelectedYearRange(0);
    setSelectedCondition('');
    setLocationFilter('');
    setSearchQuery('');
  };

  const handleFavorite = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await api.post(`/api/favorites/toggle/${id}`);
      setFavorites(prev => 
        prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.resultCard}
      activeOpacity={0.9}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/cars/${item.id}`);
      }}
    >
      <View style={styles.cardImageContainer}>
        {item.images?.[0] ? (
          <Image 
            source={{ uri: item.images[0] }}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="car-outline" size={40} color={COLORS.text.muted} />
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.favoriteBtn}
          onPress={() => handleFavorite(item.id)}
        >
          <Ionicons 
            name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
            size={18} 
            color={favorites.includes(item.id) ? COLORS.status.danger : COLORS.white} 
          />
        </TouchableOpacity>

        {item.is_featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="star" size={10} color={COLORS.status.warning} />
            <Text style={styles.featuredText}>FEATURED</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardPrice}>Rs. {item.price?.toLocaleString()}</Text>
        
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={COLORS.text.muted} />
            <Text style={styles.metaText}>{item.year}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={12} color={COLORS.text.muted} />
            <Text style={styles.metaText}>{item.mileage} km</Text>
          </View>
        </View>

        <View style={styles.cardLocation}>
          <Ionicons name="location-outline" size={12} color={COLORS.text.muted} />
          <Text style={styles.locationText} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Header
        showBack={true}
        isFlat={true}
        centerElement={
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.text.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cars, brands..."
              placeholderTextColor={COLORS.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => performSearch()}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={COLORS.text.muted} />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <View style={styles.tabBarWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity 
            style={[styles.categoryTab, selectedCategory === 'all' && styles.categoryTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Ionicons 
              name="grid-outline" 
              size={16} 
              color={selectedCategory === 'all' ? COLORS.primary : COLORS.white} 
            />
            <Text style={[styles.categoryTabText, selectedCategory === 'all' && styles.categoryTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>

          {vehicleTypes.map((type) => (
            <TouchableOpacity 
              key={type.key}
              style={[styles.categoryTab, selectedCategory === type.key && styles.categoryTabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCategory(type.key);
              }}
            >
              <Ionicons 
                name={getIconForType(type.label) as any} 
                size={16} 
                color={selectedCategory === type.key ? COLORS.primary : "#64748B"} 
              />
              <Text style={[styles.categoryTabText, selectedCategory === type.key && styles.categoryTabTextActive]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {isSearching ? 'Searching...' : `${searchResults.length} results found`}
        </Text>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={toggleFilters}
        >
          <Ionicons name="options-outline" size={18} color={COLORS.primary} />
          <Text style={styles.sortText}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.activeFilterBadge}>
              <Text style={styles.activeFilterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderResultItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.resultsGrid}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              performSearch(true);
            }}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          isSearching ? (
            <View style={styles.loadingContainer}>
              <Loading size="large" message="Finding your perfect car..." />
            </View>
          ) : (
            <EmptyState
              icon="search-outline"
              title="No Results Found"
              description="We couldn't find any cars matching your criteria. Try adjusting your filters or search terms."
              actionText="Clear All Filters"
              onActionPress={clearFilters}
            />
          )
        }
      />

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleFilters}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.filterModal,
              {
                transform: [{
                  translateY: filterSlideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  })
                }]
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={toggleFilters}>
                <Ionicons name="close" size={24} color={COLORS.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Price Range</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangeChips}>
                  {PRICE_RANGES.map((range, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.rangeChip, selectedPriceRange === index && styles.rangeChipActive]}
                      onPress={() => setSelectedPriceRange(index)}
                    >
                      <Text style={[styles.rangeChipText, selectedPriceRange === index && styles.rangeChipTextActive]}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Manufacturing Year</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rangeChips}>
                  {YEAR_RANGES.map((range, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.rangeChip, selectedYearRange === index && styles.rangeChipActive]}
                      onPress={() => setSelectedYearRange(index)}
                    >
                      <Text style={[styles.rangeChipText, selectedYearRange === index && styles.rangeChipTextActive]}>
                        {range.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Brand & Model</Text>
                <SelectField
                  label="Select Brand"
                  value={selectedBrand}
                  options={brands}
                  onSelect={setSelectedBrand}
                  placeholder="All Brands"
                />
                <View style={{ height: 12 }} />
                <SelectField
                  label="Select Model"
                  value={selectedModel}
                  options={models}
                  onSelect={setSelectedModel}
                  placeholder="All Models"
                  disabled={!selectedBrand}
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Condition</Text>
                <SelectField
                  label="Vehicle Condition"
                  value={selectedCondition}
                  options={conditions}
                  onSelect={setSelectedCondition}
                  placeholder="Any Condition"
                />
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.rangeChips}>
                  {SORT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[styles.rangeChip, selectedSort === option.value && styles.rangeChipActive]}
                      onPress={() => setSelectedSort(option.value)}
                    >
                      <Text style={[styles.rangeChipText, selectedSort === option.value && styles.rangeChipTextActive]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearFiltersBtn}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Reset All</Text>
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
          </Animated.View>
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
  header: {
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    paddingHorizontal: 16,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  tabBarWrapper: {
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 90,
  },
  categoriesScroll: {
    gap: 8,
    paddingRight: 16,
    paddingLeft: 16,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryTabTextActive: {
    color: COLORS.primary,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    position: 'relative',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  activeFilterBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.status.danger,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  activeFilterBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
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
    paddingHorizontal: 32,
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
    maxHeight: '85%',
    paddingBottom: 20,
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
    flexWrap: 'wrap',
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
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  clearFiltersBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
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
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
  },
});
