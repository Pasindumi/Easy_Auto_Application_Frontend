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
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FindDealersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
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
      const response = await fetch(`${ENDPOINTS.USERS}/sellers`);

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const json = await response.json();
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

  // Separate top-rated/featured dealers
  const featuredDealers = dealers.filter(d => d.rating >= 4.5 || d.verification_status === 'VERIFIED').slice(0, 5);

  const renderFeaturedDealer = (item: any) => (
    <TouchableOpacity
      key={`featured-${item.id}`}
      style={styles.featuredCard}
      onPress={() => router.push(`/seller/${item.id}`)}
      activeOpacity={0.9}
    >
      <Image
        source={item.avatar ? { uri: item.avatar } : require('@/assets/images/car.jpg')}
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.featuredGradient}
      />
      <View style={styles.featuredInfo}>
        {item.verification_status === 'VERIFIED' && (
          <View style={styles.verifiedBadgeMini}>
            <Ionicons name="checkmark-circle" size={12} color={COLORS.white} />
            <Text style={styles.verifiedTextMini}>Verified</Text>
          </View>
        )}
        <Text style={styles.featuredName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.featuredStats}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.featuredRating}>{item.rating || 'N/A'}</Text>
          <Text style={styles.featuredLocation} numberOfLines={1}> • {item.location || 'Sri Lanka'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDealerCard = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.dealerCard}
      onPress={() => router.push(`/seller/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.dealerRow}>
        <Image
          source={item.avatar ? { uri: item.avatar } : require('@/assets/images/car.jpg')}
          style={styles.dealerImage}
        />
        <View style={styles.dealerContent}>
          <View style={styles.dealerTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.dealerName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-sharp" size={14} color={COLORS.primary} />
                <Text style={styles.locationText} numberOfLines={1}>{item.location || 'Sri Lanka'}</Text>
              </View>
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating || '5.0'}</Text>
            </View>
          </View>

          <Text style={styles.dealerBio} numberOfLines={2}>
            {item.bio || 'Authorized professional automobile dealer with premium inventory.'}
          </Text>

          <View style={styles.dealerFooter}>
            <View style={styles.listingBadge}>
              <Text style={styles.listingCountText}>{item.listingsCount || 0} ADS</Text>
            </View>
            <View style={styles.tagContainer}>
              {item.verification_status === 'VERIFIED' ? (
                <View style={[styles.statusTag, { backgroundColor: COLORS.status.successLight }]}>
                  <Ionicons name="shield-checkmark" size={12} color={COLORS.status.success} />
                  <Text style={[styles.statusTabText, { color: COLORS.status.success }]}>Verified</Text>
                </View>
              ) : (
                <View style={[styles.statusTag, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name="person" size={12} color={COLORS.primary} />
                  <Text style={[styles.statusTabText, { color: COLORS.primary }]}>Member</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="Find Dealers"
        style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, elevation: 0, shadowOpacity: 0 }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={64} color={COLORS.text.muted} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDealers}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Search Header Area */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.searchHeader}
          >
            <View style={styles.searchWrapper}>
              <Ionicons name="search" size={20} color={COLORS.text.muted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by dealer or showroom name..."
                placeholderTextColor={COLORS.text.muted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity style={styles.filterTrigger}>
                <Ionicons name="options" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersList}
              contentContainerStyle={styles.filtersContent}
            >
              {['All', 'Verified Only', 'Top Rated'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterChip,
                    selectedFilter === filter && styles.filterChipActive
                  ]}
                >
                  <Text style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive
                  ]}>{filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>

          <View style={styles.mainContent}>
            {/* Featured Section */}
            {searchQuery === '' && featuredDealers.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Showrooms</Text>
                  <TouchableOpacity>
                    <Text style={styles.seeAllText}>See All</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.featuredContainer}
                >
                  {featuredDealers.map(renderFeaturedDealer)}
                </ScrollView>
              </View>
            )}

            {/* Main List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Search Results (${filteredDealers.length})` : 'Trusted Dealers'}
              </Text>
              {filteredDealers.length > 0 ? (
                filteredDealers.map(renderDealerCard)
              ) : (
                <View style={styles.emptyState}>
                  <Image
                    source={require('@/assets/images/car.jpg')}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyTitle}>No dealers found</Text>
                  <Text style={styles.emptySubtitle}>Try adjusting your search or filters to find what you're looking for.</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  searchHeader: {
    paddingTop: 10,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  filterTrigger: {
    backgroundColor: COLORS.primary,
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersList: {
    marginTop: 20,
  },
  filtersContent: {
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  filterChipActive: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.white,
  },
  filterChipText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.primary,
  },
  mainContent: {
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    letterSpacing: -0.5,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  featuredContainer: {
    gap: 15,
    paddingRight: 20,
  },
  featuredCard: {
    width: 240,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundMuted,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  featuredInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  featuredName: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featuredStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredRating: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  featuredLocation: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    flex: 1,
  },
  verifiedBadgeMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.status.success,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  verifiedTextMini: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  dealerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dealerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dealerImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    backgroundColor: COLORS.backgroundMuted,
  },
  dealerContent: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  dealerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  dealerName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginLeft: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E1',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D4AF37',
    marginLeft: 4,
  },
  dealerBio: {
    fontSize: 13,
    color: COLORS.text.secondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  dealerFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listingBadge: {
    backgroundColor: 'rgba(35, 92, 248, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  listingCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTabText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.muted,
    textAlign: 'center',
    marginTop: 15,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
