import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { ENDPOINTS } from '@/constants/API';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
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

export default function FindDealersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching dealers from:', `${ENDPOINTS.USERS}/sellers`);
      const response = await fetch(`${ENDPOINTS.USERS}/sellers`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json = await response.json();
      console.log('Dealers response:', json);

      if (json.success) {
        setDealers(json.data || []);
      } else {
        setError(json.message || 'Failed to fetch dealers');
      }
    } catch (error: any) {
      console.error('Error fetching dealers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = dealers.filter(dealer =>
    dealer.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderDealerCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.dealerCard}
      onPress={() => router.push(`/seller/${item.id}`)}
    >
      <Image
        source={item.avatar ? { uri: item.avatar } : require('@/assets/images/car.jpg')}
        style={styles.dealerImage}
        resizeMode="cover"
      />
      <View style={styles.dealerCardBody}>
        <View style={styles.dealerHeader}>
          <View style={styles.dealerInfo}>
            <Text style={styles.dealerName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating || 'Not rated'}</Text>
              <Text style={styles.reviews}>{item.verification_status === 'VERIFIED' ? 'Verified' : 'Member'}</Text>
            </View>
          </View>
          <View style={styles.distanceBadge}>
            <Ionicons name="location-outline" size={14} color={COLORS.primary} />
            <Text style={styles.distanceText}>{item.location || 'Sri Lanka'}</Text>
          </View>
        </View>
        <Text style={styles.dealerAddress}>{item.bio || 'Professional automobile dealer.'}</Text>
        <View style={styles.dealerFooter}>
          <Text style={styles.listingsCount}>
            {item.listingsCount} listings available
          </Text>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => router.push(`/seller/${item.id}`)}
          >
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
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={48} color={COLORS.status.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchDealers}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>
                  {filteredDealers.length} Dealers Found
                </Text>
                {filteredDealers.map((item) => renderDealerCard({ item }))}
                {filteredDealers.length === 0 && (
                  <Text style={styles.noDealersText}>No dealers found matching your search.</Text>
                )}
              </>
            )}
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
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    marginTop: 8,
  },
  retryText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  noDealersText: {
    textAlign: 'center',
    color: COLORS.text.muted,
    marginTop: 40,
    fontSize: 15,
  },
});
