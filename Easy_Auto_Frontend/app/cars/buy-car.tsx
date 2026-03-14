import Header from '@/components/Header';
import COLORS from '@/constants/Colors';
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
  ActivityIndicator,
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
  const lower = typeName.toLowerCase();
  if (lower.includes('car')) return 'car-sport';
  if (lower.includes('van')) return 'car';
  if (lower.includes('suv')) return 'car-sport';
  if (lower.includes('bus')) return 'bus';
  if (lower.includes('lorry') || lower.includes('truck')) return 'bus-outline';
  if (lower.includes('bike') || lower.includes('motor')) return 'bicycle';
  if (lower.includes('cab') || lower.includes('taxi')) return 'taxi';
  return 'car-sport'; // default
};

const SORT_OPTIONS = [
  { value: 'all', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'year-new', label: 'Newest First' },
  { value: 'year-old', label: 'Oldest First' },
];

import { useTranslation } from 'react-i18next';

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
    if (selectedCategory && selectedCategory !== 'all') {
      const fetchBrands = async () => {
        setIsBrandsLoading(true);
        try {
          const res: any = await api.get(`/api/vehicle-config/brands/${selectedCategory}`);
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
    } else {
      setBrands([]);
      setSelectedBrand('');
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
            setModels(res.map(m => ({ label: m.model_name, value: m.id })));
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

            <LocationModal
              visible={showLocationModal}
              onClose={() => setShowLocationModal(false)}
              onSelect={setLocationFilter}
            />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>{t('buy_car_screen.reset_all')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>{t('buy_car_screen.apply_filters')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );


  const renderCarCard = (item: any) => {
    const isFavorite = favorites.includes(item.id);
    const imageUrl = item.AdImage?.[0]?.image_url;
    const formattedPrice = item.price ? `Rs. ${(item.price / 1000000).toFixed(1)}Mn` : 'N/A';

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.carCard, { width: CARD_WIDTH }]}
        onPress={() => router.push(`/cars/${item.id}`)}
      >
        <View style={styles.carImageContainer}>
          <Image
            source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
            style={styles.carCardImage}
          />
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>{item.CarDetails?.year || 'N/A'}</Text>
          </View>
          <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(item.id)}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={16} color={isFavorite ? '#EF4444' : '#FFFFFF'} />
          </TouchableOpacity>
        </View>
        <View style={styles.carCardBody}>
          <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.carMetaRow}>
            <View style={styles.carMetaItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.carMetaText} numberOfLines={1}>{item.location?.split(',')[0] || 'N/A'}</Text>
            </View>
          </View>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </TouchableOpacity>
    );
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
              <ActivityIndicator color={COLORS.primary} style={{ marginLeft: 20 }} />
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
                <ActivityIndicator size="large" color={COLORS.primary} />
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
