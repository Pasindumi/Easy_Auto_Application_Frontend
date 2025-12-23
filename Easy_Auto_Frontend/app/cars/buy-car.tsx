import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import BuyCarCard from "../../components/cars/buy/BuyCarCard";
import CategoryCard from "../../components/cars/buy/CategoryCard";
import SearchFilterBar from "../../components/cars/buy/SearchFilterBar";
import { CATEGORIES, FILTER_OPTIONS, SUV_CARS } from "../../constants/dummydata/buy-car";
import { BuyCarItem } from '../../types/buy-car.types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 25 - CARD_GAP) / 2;

export default function BuyCarScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('suv');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const handleCarPress = (item: BuyCarItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const currentCategoryLabel = CATEGORIES.find(c => c.key === selectedCategory)?.label || 'Cars';

  const getFilteredCars = () => {
    let cars: BuyCarItem[] = [];
    if (!selectedCategory || selectedCategory === 'all') {
      cars = SUV_CARS;
    } else if (selectedCategory === 'suv') {
      cars = SUV_CARS;
    } else if (selectedCategory === 'car') {
      cars = SUV_CARS;
    }

    if (searchQuery) {
      cars = cars.filter(car =>
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return cars;
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="car-sport-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Buy a Car</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search and Filters */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={(key) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSelectedFilter(key);
          }}
          filterOptions={FILTER_OPTIONS}
          onFilterButtonPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />

        {/* Browse by Category */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
        </View>

        <View style={styles.categoriesSection}>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((item) => (
              <CategoryCard
                key={item.key}
                item={item}
                isActive={selectedCategory === item.key}
                onPress={handleCategoryPress}
              />
            ))}
          </View>
        </View>

        {/* Available Cars */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Available {currentCategoryLabel}</Text>
          <Text style={styles.sectionSubtitle}>{getFilteredCars().length} listings</Text>
        </View>

        <View style={styles.carsSection}>
          <View style={styles.carsGrid}>
            {getFilteredCars().map((item, index) => {
              if (index % 2 === 0) {
                const nextItem = getFilteredCars()[index + 1];
                return (
                  <View key={`row-${index}`} style={styles.carsRow}>
                    <BuyCarCard
                      item={item}
                      width={CARD_WIDTH}
                      isFavorite={favorites.includes(item.id)}
                      onToggleFavorite={toggleFavorite}
                      onPress={handleCarPress}
                    />
                    {nextItem && (
                      <BuyCarCard
                        item={nextItem}
                        width={CARD_WIDTH}
                        isFavorite={favorites.includes(nextItem.id)}
                        onToggleFavorite={toggleFavorite}
                        onPress={handleCarPress}
                      />
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
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600'
  },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text.primary, letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 14, fontWeight: '600', color: COLORS.text.muted },
  categoriesSection: { paddingHorizontal: 16, marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  carsSection: { paddingHorizontal: 16 },
  carsGrid: { flexDirection: 'column' },
  carsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: CARD_GAP },
});
