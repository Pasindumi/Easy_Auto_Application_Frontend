// app/buy-car.tsx
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SUV_CARS, CAR_CARS } from '../dummydata/buy-a-car';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 25 - CARD_GAP) / 2;

const CATEGORIES = [
  { key: 'car', label: 'Car', icon: 'car-sport' },
  { key: 'van', label: 'Van', icon: 'car' },
  { key: 'cab', label: 'Cab', icon: 'taxi' },
  { key: 'suv', label: 'SUV', icon: 'car-sport' },
  { key: 'lorry', label: 'Lorry', icon: 'car' },
  { key: 'bus', label: 'Bus', icon: 'bus' },
];

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>('suv');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

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
    setSelectedCategory(key);
  };

  const renderCategory = (item: typeof CATEGORIES[0]) => {
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

  const renderCarCard = (item: typeof SUV_CARS[0]) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.carCard, { width: CARD_WIDTH }]}
        activeOpacity={0.8}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          // Navigate to car details
        }}
      >
        <View style={styles.carImageContainer}>
          <Image
            source={item.image}
            style={styles.carCardImage}
            resizeMode="cover"
          />
          <View style={styles.yearBadge}>
            <Text style={styles.yearBadgeText}>{item.year}</Text>
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
            <View style={[styles.carMetaItem, { marginBottom: 4 }]}> {/* km row with more gap below */}
              <Ionicons name="speedometer-outline" size={14} color="#6B7280" />
              <Text style={styles.carMetaText}>{item.km}</Text>
            </View>
            <View style={[styles.carMetaItem, { marginBottom: 0 }]}> {/* location row, no extra gap below */}
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.carMetaText} numberOfLines={1}>{item.location.split(',')[0]}</Text>
            </View>
          </View>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Filter cars by selected category
  const getFilteredCars = () => {
    if (!selectedCategory || selectedCategory === 'all') return SUV_CARS;
    if (selectedCategory === 'suv') {
      // Only show SUVs
      return SUV_CARS;
    }
    if (selectedCategory === 'car') {
      // Only show Cars
      return CAR_CARS;
    }
    // For demo: return empty for other categories
    return [];
  };

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
                placeholderTextColor="#B6B8C9" // lighter, modern
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
                      // Do NOT hide filter section after select
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
            <View style={styles.categoryRow}>
              {CATEGORIES.map((item) => renderCategory(item))}
            </View>
          </View>

          {/* Section Header: Available Cars */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Available {selectedCategory ? CATEGORIES.find(c => c.key === selectedCategory)?.label : 'Cars'}
            </Text>
            <Text style={styles.sectionSubtitle}>{getFilteredCars().length} listings</Text>
          </View>

          {/* Car Grid */}
          <View style={styles.carsSection}>
            <View style={styles.carsGrid}>
              {getFilteredCars().map((item, index) => {
                if (index % 2 === 0) {
                  const nextItem = getFilteredCars()[index + 1];
                  return (
                    <View key={`row-${index}`} style={styles.carsRow}>
                      <View key={item.id}>
                        {renderCarCard(item)}
                      </View>
                      {nextItem && (
                        <View key={nextItem.id}>
                          {renderCarCard(nextItem)}
                        </View>
                      )}
                    </View>
                  );
                }
                return null;
              })}
            </View>
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
    paddingBottom: 15, // reduced from 16
    marginTop: -32,
    zIndex: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4, // reduced from 8
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
    fontSize: 11, // reduced from 13
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
    backgroundColor: '#235CF8', // solid blue
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
    color: '#fff', // white text for active
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
    justifyContent: 'space-between',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 32 - 24) / 3, // Account for padding and gaps
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // reduced from 16
    paddingVertical: 12, // reduced from 16
    paddingHorizontal: 12, // reduced from 12
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.01, // reduced
    shadowRadius: 2, // reduced
    shadowOffset: { width: 0, height: 1 }, // reduced
    elevation: 1, // reduced
  },
  categoryCardActive: {
    borderColor: '#235CF8',
    backgroundColor: '#F0F4FF',
    shadowColor: '#235CF8',
    shadowOpacity: 0.1,
    elevation: 4,
  },
  categoryIconContainer: {
    width: 16, // reduced from 22
    height: 16, // reduced from 22
    borderRadius: 4, // reduced from 6
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2, // reduced from 3
  },
  categoryIconContainerActive: {
    backgroundColor: '#E3F2FD',
  },
  categoryLabel: {
    fontSize: 10, // reduced from 13
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: -0.2,
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
    fontSize: 10, // reduced from 12
    fontWeight: '600', // slightly lighter for clarity
    letterSpacing: 0.2, // subtle modern touch
  },
  favoriteButton: {
    position: 'absolute',
    top: 6, // moved up from 12
    right: 6, // moved closer to right edge from 12
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
    fontSize: 11, // smaller for modern look
    color: '#7B7F8A', // lighter
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
