import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
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

export default function BuyCarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { brandId, brandName } = params;

  const [searchQuery, setSearchQuery] = useState('');
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
      if (selectedBrand) {
        const brandObj = brands.find(b => b.value === selectedBrand);
        if (brandObj) {
            endpoint += `&brand=${encodeURIComponent(brandObj.label)}`;
        } else if (brandName && String(brandId) === selectedBrand) {
            endpoint += `&brand=${encodeURIComponent(String(brandName))}`;
        }
      }
      if (selectedModel) {
        const modelObj = models.find(m => m.value === selectedModel);
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

  const handleCategoryPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(selectedCategory === key ? 'all' : key);
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
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{t('buy_car_screen.filter_vehicles')}</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#111827" />
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

            <SelectField
              label={t('buy_car_screen.sort_by')}
              value={selectedSort}
              options={SORT_OPTIONS}
              onSelect={setSelectedSort}
            />

            <SelectField
              label={t('buy_car_screen.select_brand')}
              value={selectedBrand}
              options={brands}
              onSelect={setSelectedBrand}
              disabled={selectedCategory === 'all' || isBrandsLoading}
              placeholder={isBrandsLoading ? "Loading..." : t('buy_car_screen.select_brand')}
              searchable={true}
            />

            <SelectField
              label={t('buy_car_screen.select_model')}
              value={selectedModel}
              options={models}
              onSelect={setSelectedModel}
              disabled={!selectedBrand || isModelsLoading}
              placeholder={isModelsLoading ? "Loading..." : t('buy_car_screen.select_model')}
              searchable={true}
            />

            <View style={{ marginBottom: 16 }}>
              <Text style={styles.filterGroupTitle}>{t('location')}</Text>
              <TouchableOpacity
                style={styles.locationInputWrap}
                onPress={() => setShowLocationModal(true)}
              >
                <Ionicons name="location-outline" size={20} color={locationFilter ? "#111827" : "#9CA3AF"} />
                <Text style={[styles.locationInput, !locationFilter && { color: '#9CA3AF' }]}>
                  {locationFilter || t('buy_car_screen.select_location')}
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

  const renderCategory = (item: any) => {
    const isActive = selectedCategory === item.key;
    return (
      <TouchableOpacity
        key={item.key}
        style={[styles.categoryCard, isActive && styles.categoryCardActive]}
        onPress={() => handleCategoryPress(item.key)}
        activeOpacity={0.7}
      >
        <View style={[styles.categoryIconContainer, isActive && styles.categoryIconContainerActive]}>
          <Ionicons
            name={item.icon as any}
            size={18}
            color={isActive ? '#235CF8' : '#9CA3AF'}
          />
        </View>
        <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />
      {renderFilterModal()}

      <View style={styles.topicWrap}>
        <Ionicons name="car-sport" size={24} color="#235CF8" style={{ marginRight: 8 }} />
        <Text style={styles.topicTitle}>{t('buy_car_screen.find_vehicle')}</Text>
      </View>

      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Search Section */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder={t('home.search_placeholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />
              <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(true)}>
                <Ionicons name="options-outline" size={24} color="#235CF8" />
                {(minPrice || maxPrice || selectedBrand || locationFilter) && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </View>
          </View>

          {/* Browse Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('buy_car_screen.browse_category')}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {isCategoriesLoading ? (
              <ActivityIndicator color="#235CF8" style={{ marginLeft: 20 }} />
            ) : (
              vehicleTypes.map(renderCategory)
            )}
          </ScrollView>

          {/* Listings */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('buy_car_screen.results')}</Text>
            <Text style={styles.sectionSubtitle}>{ads.length} {t('buy_car_screen.items')}</Text>
          </View>

          <View style={styles.carsSection}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#235CF8" style={{ marginTop: 40 }} />
            ) : ads.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                <Text style={styles.emptyText}>{t('buy_car_screen.no_vehicles_found')}</Text>
                <TouchableOpacity onPress={resetFilters}>
                  <Text style={styles.resetLink}>{t('buy_car_screen.clear_filters')}</Text>
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
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  topicWrap: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  topicTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  searchSection: { padding: 16 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },
  filterBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F4FF', borderRadius: 12 },
  filterDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1, borderColor: '#fff' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  sectionSubtitle: { fontSize: 14, color: '#6B7280' },
  categoryScroll: { paddingHorizontal: 16, gap: 12 },
  categoryCard: { padding: 16, borderRadius: 16, backgroundColor: '#fff', width: 100, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  categoryCardActive: { borderColor: '#235CF8', backgroundColor: '#F0F4FF' },
  categoryIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9FAFB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  categoryIconContainerActive: { backgroundColor: '#E3F2FD' },
  categoryLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280' },
  categoryLabelActive: { color: '#235CF8' },
  carsSection: { paddingHorizontal: 16 },
  carsGrid: { gap: 16 },
  carsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  carCard: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 },
  carImageContainer: { height: 120, position: 'relative' },
  carCardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  yearBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(35, 92, 248, 0.9)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  yearBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  favoriteButton: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  carCardBody: { padding: 12 },
  carTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  carMetaRow: { marginBottom: 8 },
  carMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  carMetaText: { fontSize: 11, color: '#6B7280' },
  price: { fontSize: 16, fontWeight: '700', color: '#235CF8' },
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
  applyButton: { flex: 2, height: 56, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: '#235CF8' },
  applyButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  emptyState: { alignItems: 'center', padding: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#374151', marginTop: 16 },
  resetLink: { color: '#235CF8', fontWeight: '600', marginTop: 8 },
});
