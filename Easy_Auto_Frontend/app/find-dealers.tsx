import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
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

const SCREEN_WIDTH = Dimensions.get('window').width;

const DEALERS = [
  {
    id: '1',
    name: 'AutoMax Dealers',
    rating: 4.8,
    reviews: 245,
    distance: '2.5 km',
    address: '123 Main Street, Colombo',
    specialties: ['Luxury Cars', 'SUVs', 'Electric'],
    image: require('@/assets/images/car.jpg'),
    listings: 156,
  },
  {
    id: '2',
    name: 'Premium Motors',
    rating: 4.9,
    reviews: 389,
    distance: '5.1 km',
    address: '456 High Street, Kandy',
    specialties: ['Sedans', 'Hatchbacks'],
    image: require('@/assets/images/car.jpg'),
    listings: 203,
  },
  {
    id: '3',
    name: 'City Auto Center',
    rating: 4.7,
    reviews: 178,
    distance: '3.8 km',
    address: '789 Business Park, Galle',
    specialties: ['Budget Cars', 'Used Cars'],
    image: require('@/assets/images/car.jpg'),
    listings: 98,
  },
  {
    id: '4',
    name: 'Elite Car Gallery',
    rating: 4.9,
    reviews: 512,
    distance: '7.2 km',
    address: '321 Luxury Avenue, Negombo',
    specialties: ['Premium', 'Sports Cars'],
    image: require('@/assets/images/car.jpg'),
    listings: 87,
  },
];

export default function FindDealersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const renderDealerCard = ({ item }: { item: typeof DEALERS[0] }) => (
    <TouchableOpacity style={styles.dealerCard}>
      <Image source={item.image} style={styles.dealerImage} resizeMode="cover" />
      <View style={styles.dealerCardBody}>
        <View style={styles.dealerHeader}>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating}</Text>
              <Text style={styles.reviews}>({item.reviews} reviews)</Text>
            </View>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="location-outline" size={14} color={COLORS.primary} />
            <Text style={styles.distanceText}>{item.distance}</Text>
          </View>
        </View>
        <Text style={styles.dealerAddress}>{item.address}</Text>
        <View style={styles.specialtiesContainer}>
          {item.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
        <View style={styles.dealerFooter}>
          <Text style={styles.listingsCount}>
            {item.listings} listings available
          </Text>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Find Dealers" />

      <View style={styles.contentContainer}>

        {/* Unified Sub-Header */}


        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color={COLORS.text.muted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search dealers..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.text.muted}
              />
              <TouchableOpacity>
                <Ionicons name="options-outline" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersContainer}
            >
              {['All', 'Nearby', 'Top Rated', 'Most Listings'].map(
                (filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter.toLowerCase().replace(' ', '-') &&
                      styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedFilter(
                        filter.toLowerCase().replace(' ', '-')
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selectedFilter === filter.toLowerCase().replace(' ', '-') &&
                        styles.filterTextActive,
                      ]}
                    >
                      {filter}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>

          {/* Dealers List */}
          <View style={styles.dealersSection}>
            <Text style={styles.sectionTitle}>
              {DEALERS.length} Dealers Found
            </Text>
            {DEALERS.map((item) => renderDealerCard({ item }))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  filtersSection: {
    marginBottom: 20,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.muted,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  dealersSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  dealerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  dealerImage: {
    width: '100%',
    height: 160,
  },
  dealerCardBody: {
    padding: 16,
  },
  dealerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dealerInfo: {
    flex: 1,
  },
  dealerName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginLeft: 4,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  dealerAddress: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.muted,
  },
  dealerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  listingsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
