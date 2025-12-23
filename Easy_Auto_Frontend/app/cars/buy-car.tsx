// app/buy-car.tsx
import ProfileHeader from '@/components/ProfileHeader';
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
import { SafeAreaView } from 'react-native-safe-area-context';

// Assets and Types
import { CATEGORIES, FILTER_OPTIONS, SUV_CARS } from "../../constants/dummydata/buy-car";
import { BuyCarItem } from '../../types/buy-car.types';

// Components
import BuyCarCard from "../../components/cars/buy/BuyCarCard";
import CategoryCard from "../../components/cars/buy/CategoryCard";
import SearchFilterBar from "../../components/cars/buy/SearchFilterBar";

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_GAP = 16;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP) / 2;

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
    // Navigate to car details if needed
  };

  const currentCategoryLabel = CATEGORIES.find(c => c.key === selectedCategory)?.label || 'Cars';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Buy a Car" showProfileCard={false} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
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
            <Text style={styles.sectionSubtitle}>{SUV_CARS.length} listings</Text>
          </View>

          <View style={styles.carsSection}>
            <View style={styles.carsGrid}>
              {SUV_CARS.map((item, index) => {
                if (index % 2 === 0) {
                  const nextItem = SUV_CARS[index + 1];
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
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollView: { flex: 1 },
  scrollContent: { paddingTop: 80, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', letterSpacing: -0.3 },
  sectionSubtitle: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  categoriesSection: { paddingHorizontal: 16, marginBottom: 8 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  carsSection: { paddingHorizontal: 16 },
  carsGrid: { flexDirection: 'column' },
  carsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: CARD_GAP },
});
