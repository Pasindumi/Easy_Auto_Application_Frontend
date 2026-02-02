import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../utils/api';

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
  if (lower.includes('lorry') || lower.includes('truck')) return 'bus-outline'; // approximation
  if (lower.includes('bike') || lower.includes('motor')) return 'bicycle';
  if (lower.includes('cab') || lower.includes('taxi')) return 'taxi';
  return 'car-sport'; // default
};

const FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'price-low', label: 'Price: Low to High' },
  { key: 'price-high', label: 'Price: High to Low' },
  { key: 'year-new', label: 'Newest First' },
  { key: 'year-old', label: 'Oldest First' },
];

export default function BuyCarScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Real Data State
  const [ads, setAds] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Fetch Vehicle Types (Categories)
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res: any = await api.get('/api/vehicle-config/types');
        // Backend returns direct array
        if (Array.isArray(res)) {
          const mapped = res
            .filter((t: any) => t.status === 'ACTIVE') // Filter if status exists
            .map((t: any) => ({
              key: t.id,
              label: t.type_name,
              icon: getIconForType(t.type_name)
            }));
          setVehicleTypes(mapped);
        } else {
          console.error("Unexpected response format for vehicle types:", res);
        }
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchTypes();
  }, []);

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        let endpoint = `/api/cars?status=ACTIVE`;

        if (selectedCategory && selectedCategory !== 'all') {
          endpoint += `&vehicleTypeId=${selectedCategory}`;
        }

        // Note: Backend might not support 'search' on this endpoint fully yet based on analysis, 
        // but let's try or we rely on client side filter if needed. 
        // Backend `getAds` supports: brand, model, minPrice, maxPrice, vehicleTypeId.
        // It DOES NOT seem to support generic 'search' query param in the `getAds` controller we saw earlier.
        // Wait, looking at `carController.js` step 35:
        // `export const getAds = async (req, res) => { ... const { page = 1, limit = 10, brand, model, minPrice, maxPrice, vehicleTypeId } = req.query; ... }`
        // It does NOT have 'search'. `adminGetAds` HAS 'search'.
        // So for public `getAds`, we might only be able to filter by strict fields or we need to add search support to backend.
        // For now, I will Fetch ALL (or strict filter) and maybe client-side filter for 'search' if results are few, 
        // OR just ignore search if not supported. 
        // Actually, let's look at `title` filtering. It's missing in `getAds`. 
        // I will assume for now we just filter by category. Client-side search for title if needed.

        const res = await api.get<any>(endpoint);
        if (res.success) {
          let fetchedAds = res.data || [];

          // Client-side search filtering since backend `getAds` didn't show explicit search support in the snippet I saw
          if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            fetchedAds = fetchedAds.filter((ad: any) =>
              ad.title?.toLowerCase().includes(lowerQ) ||
              ad.CarDetails?.brand?.toLowerCase().includes(lowerQ) ||
              ad.CarDetails?.model?.toLowerCase().includes(lowerQ)
            );
          }

          // Client-side sorting
          if (selectedFilter === 'price-low') {
            fetchedAds.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
          } else if (selectedFilter === 'price-high') {
            fetchedAds.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
          } else if (selectedFilter === 'year-new') {
            fetchedAds.sort((a: any, b: any) => (b.CarDetails?.year || 0) - (a.CarDetails?.year || 0));
          } else if (selectedFilter === 'year-old') {
            fetchedAds.sort((a: any, b: any) => (a.CarDetails?.year || 0) - (b.CarDetails?.year || 0));
          }

          setAds(fetchedAds);
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchAds();
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, selectedFilter]);

  const toggleFavorite = (carId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFavorites((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const handleCategoryPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // If clicking same category, toggle off to 'all'? Or just keep as is. 
    // Usually toggle off is nice.
    if (selectedCategory === key) {
      setSelectedCategory('all');
    } else {
      setSelectedCategory(key);
    }
  };

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
            size={15}
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
    // Format price
    const formattedPrice = item.price ? `Rs. ${(item.price / 1000000).toFixed(1)}Mn` : 'N/A';

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.carCard, { width: CARD_WIDTH }]}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push(`/cars/${item.id}`);
        }}
      >
        <View style={styles.carImageContainer}>
          <Image
            source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
            style={styles.carCardImage}
            resizeMode="cover"
          />
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>{item.CarDetails?.year || 'N/A'}</Text>
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={15}
              color={isFavorite ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.carCardBody}>
          <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.carMetaRow}>
            <View style={[styles.carMetaItem, { marginBottom: 4 }]}>
              <Ionicons name="speedometer-outline" size={14} color="#6B7280" />
              <Text style={styles.carMetaText}>
                {item.CarDetails?.mileage ? `${item.CarDetails.mileage.toLocaleString()} Km` : 'N/A'}
              </Text>
            </View>
            <View style={[styles.carMetaItem, { marginBottom: 0 }]}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.carMetaText} numberOfLines={1}>
                {item.location ? item.location.split(',')[0] : 'N/A'}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>{formattedPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getActiveCategoryLabel = () => {
    if (selectedCategory === 'all') return 'Cars';
    const cat = vehicleTypes.find(c => c.key === selectedCategory);
    return cat ? cat.label : 'Cars';
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />
      <View style={[styles.topicWrap, { justifyContent: 'center' }]}>
        <View style={styles.topicLeft}>
          <Ionicons name="car-sport" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={styles.topicTitle}>Buy a Car</Text>
        </View>
      </View>
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Modern Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                placeholder="Find your dream car, brand or model"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
                placeholderTextColor="#B6B8C9"
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilters((prev) => !prev)}
                activeOpacity={0.7}
              >
                <Ionicons name="options-outline" size={20} color="#235CF8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Chips */}
          {showFilters && (
            <View style={styles.filtersSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              >
                {FILTER_OPTIONS.map((filter) => (
                  <TouchableOpacity
                    key={filter.key}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter.key && styles.filterChipActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFilter(filter.key);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedFilter === filter.key && styles.filterChipTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Section Header: Browse by Category */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
          </View>

          {/* Category Grid */}
          <View style={styles.categoriesSection}>
            {isCategoriesLoading ? (
              <ActivityIndicator size="small" color="#235CF8" />
            ) : (
              <View style={styles.categoryRow}>
                {vehicleTypes.map((item) => renderCategory(item))}
              </View>
            )}
          </View>

          {/* Section Header: Available Cars */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Available {getActiveCategoryLabel()}
            </Text>
            <Text style={styles.sectionSubtitle}>{ads.length} listings</Text>
          </View>

          {/* Car Grid */}
          <View style={styles.carsSection}>
            {isLoading ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#235CF8" />
              </View>
            ) : ads.length === 0 ? (
              <View style={styles.noAdsContainer}>
                <Ionicons name="car-sport-outline" size={48} color="#D1D5DB" />
                <Text style={styles.noAdsText}>No ads found to display</Text>
                <Text style={styles.noAdsSubText}>Try changing your filters or search query.</Text>
              </View>
            ) : (
              <View style={styles.carsGrid}>
                {ads.map((item, index) => {
                  // We render in pairs manually in the original code, but flexWrap is easier.
                  // However, to keep original layout logic if it was row-based:
                  // The original code used a manual row approach. Let's stick to flexWrap 'row' generally 
                  // or use the original manual pairing if we want to be exact. 
                  // To be safe and cleaner, let's use a standard flex wrap container logic 
                  // or just map everything and let flexbox handle it if we change styles.
                  // But sticking to the original manual pairing 'row' logic ensures strictly 2 columns logic matches.
                  if (index % 2 === 0) {
                    const nextItem = ads[index + 1];
                    return (
                      <View key={`row-${index}`} style={styles.carsRow}>
                        <View key={item.id}>
                          {renderCarCard(item)}
                        </View>
                        {nextItem ? (
                          <View key={nextItem.id}>
                            {renderCarCard(nextItem)}
                          </View>
                        ) : (
                          // Empty filler to maintain alignment if using flex space-between
                          <View style={{ width: CARD_WIDTH }} />
                        )}
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
            )}
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80, // Account for header
    paddingBottom: 100, // Account for tab bar
  },
  // Modern Search Section
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 15,
    marginTop: -32,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: -32,
  },
  searchInput: {
    flex: 1,
    fontSize: 11,
    color: '#111827',
    padding: 0,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#F0F4FF',
  },
  // Filter Chips
  filtersSection: {
    marginBottom: 8,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F6F8FC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
    marginBottom: 4,
    shadowColor: '#235CF8',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
    shadowColor: '#235CF8',
    shadowOpacity: 0.15,
    elevation: 4,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#235CF8',
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  filterChipTextActive: {
    color: '#fff',
    textShadowColor: 'rgba(35,92,248,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  // Categories Section
  categoriesSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Changed from space-between to allow natural flow if fewer items
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 24) / 3, // Keep same width logic
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.01,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  categoryCardActive: {
    borderColor: '#235CF8',
    backgroundColor: '#F0F4FF',
    shadowColor: '#235CF8',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  categoryIconContainer: {
    width: 24, // slightly larger touch target
    height: 24,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryIconContainerActive: {
    backgroundColor: '#E3F2FD',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#235CF8',
    fontWeight: '700',
  },
  // Cars Section
  carsSection: {
    paddingHorizontal: 16,
  },
  carsGrid: {
    flexDirection: 'column',
  },
  carsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: CARD_GAP,
  },
  // Empty State
  noAdsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  noAdsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  noAdsSubText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  // Modern Car Card
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  carImageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  carCardImage: {
    width: '100%',
    height: '100%',
  },
  yearBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(35, 92, 248, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  yearBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carCardBody: {
    padding: 14,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  carMetaRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 0,
    marginBottom: 10,
    marginTop: 2,
  },
  carMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 0,
  },
  carMetaText: {
    fontSize: 11,
    color: '#7B7F8A',
    fontWeight: '500',
    flexShrink: 1,
    marginLeft: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#235CF8',
    letterSpacing: -0.3,
  },
  // Topic Section
  topicWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  topicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E60FF',
    letterSpacing: -0.5,
  },
});
