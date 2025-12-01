// app/my-listings.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Sample listings data
const LISTINGS = [
  {
    id: '1',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '2',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Paused',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '3',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '4',
    title: 'Mercedex Benz',
    price: '$27,900',
    km: '42,000km',
    views: 950,
    likes: 35,
    messages: 35,
    status: 'Paused',
    image: require('../assets/images/car.jpg'),
  },
];

export default function MyListingsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter listings based on status and search
  const filteredListings = LISTINGS.filter(item => {
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate status counts
  const activeCount = LISTINGS.filter(item => item.status === 'Active').length;
  const draftCount = LISTINGS.filter(item => item.status === 'Draft').length;
  const pausedCount = LISTINGS.filter(item => item.status === 'Paused').length;

  // Handlers
  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selected.length === filteredListings.length && filteredListings.length > 0) {
      setSelected([]);
    } else {
      setSelected(filteredListings.map(item => item.id));
    }
  };

  // NAVIGATION HANDLERS (linked to pages)
  const handleEdit = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate to the edit page with id param
    router.push(`/edit-car?id=${encodeURIComponent(id)}`);
  };

  const handleBoost = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Navigate to the boost page with id param
    router.push(`/packages?id=${encodeURIComponent(id)}`);
  };

  const handleShare = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Option 1: Navigate to a dedicated share screen (uncomment if you have share-car screen)
    // router.push(`/share-car?id=${encodeURIComponent(id)}`);

    // Option 2: Open native share sheet with basic content (keeps user in context)
    const item = LISTINGS.find(x => x.id === id);
    if (!item) return;

    try {
      const result = await Share.share({
        message: `${item.title} — ${item.price}\nCheck this listing: myapp://view-car?id=${item.id}`,
        title: `${item.title}`,
      });
      // result.action can be used to track share outcome if needed
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleFilterStatus = (status: string | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setFilterStatus(filterStatus === status ? null : status);
  };

  const handleBoostCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add boost card action (e.g. navigate to boost screen)
    router.push('/packages'); // example
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBulkDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add bulk delete action: call API to delete selected then refresh UI
    setSelected([]);
  };

  const handleBulkPause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Add bulk pause action: call API to pause selected then refresh UI
    setSelected([]);
  };

  // Render individual listing card with premium design
  const renderListing = ({ item, index }: { item: typeof LISTINGS[0]; index: number }) => (
    <View style={[
      styles.listingCard,
      index === filteredListings.length - 1 && styles.lastCard
    ]}>
      {/* Card Header: Checkbox positioned at top-left */}
      <View style={styles.cardHeader}>
        <TouchableOpacity
          onPress={() => toggleSelect(item.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.checkboxWrapper}
        >
          <View style={[
            styles.checkbox,
            selected.includes(item.id) && styles.checkboxActive
          ]}>
            {selected.includes(item.id) && (
              <Ionicons name="checkmark" size={13} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Card Body: Image + Content */}
      <View style={styles.cardBody}>
        {/* Car Image with status badge */}
        <View style={styles.imageWrapper}>
          <Image
            source={item.image}
            style={styles.carImage}
            resizeMode="cover"
          />
          {item.status === 'Active' && (
            <View style={styles.imageBadge}>
              <View style={styles.activeIndicatorDot} />
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title Row: Title + Status Badge */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={[
              styles.statusBadge,
              item.status === 'Active' ? styles.activeBadge : styles.pauseBadge
            ]}>
              <View style={[
                styles.statusIndicator,
                item.status === 'Active' ? styles.statusIndicatorActive : styles.statusIndicatorPaused
              ]} />
              <Text style={[
                styles.statusText,
                item.status === 'Active' && styles.activeStatusText
              ]}>{item.status}</Text>
            </View>
          </View>

          {/* Price and Mileage */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.mileage}>{item.km}</Text>
          </View>

          {/* Stats: Views, Likes, Messages */}
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.views.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.messages}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Full-Width Action Buttons */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item.id)}
          activeOpacity={0.75}
        >
          <Ionicons name="create-outline" size={16} color="#235CF8" />
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleBoost(item.id)}
          activeOpacity={0.75}
        >
          <Ionicons name="rocket-outline" size={16} color="#235CF8" />
          <Text style={styles.actionLabel}>Boost</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item.id)}
          activeOpacity={0.75}
        >
          <Ionicons name="share-social-outline" size={16} color="#235CF8" />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Ionicons name="car-outline" size={56} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>
        {searchQuery ? 'No listings found' : 'No listings yet'}
      </Text>
      <Text style={styles.emptyMessage}>
        {searchQuery
          ? `No listings match "${searchQuery}"`
          : filterStatus
            ? `You don't have any ${filterStatus.toLowerCase()} listings`
            : 'Start by creating your first listing'
        }
      </Text>
      {!searchQuery && !filterStatus && (
        <TouchableOpacity
          style={styles.emptyButton}
          activeOpacity={0.8}
          onPress={() => router.push('/post-add')}
        >
          <Ionicons name="add-circle-outline" size={18} color="#fff" />
          <Text style={styles.emptyButtonText}>Create New Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.headerWrapper}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Listings</Text>
          <View style={{ width: 22 }} />
        </View>
      </SafeAreaView>

      {/* Content */}
      <FlatList
        data={filteredListings}
        renderItem={renderListing}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={
          <>
            {/* Search Bar */}
            <View style={styles.searchWrapper}>
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={18} color="#9CA3AF" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search listings..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Status Filter Cards */}
            <View style={styles.statusRow}>
              <TouchableOpacity
                style={[
                  styles.statusCard,
                  filterStatus === 'Active' && styles.statusCardActive
                ]}
                onPress={() => handleFilterStatus('Active')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={filterStatus === 'Active' ? '#235CF8' : '#9CA3AF'}
                />
                <Text style={[
                  styles.statusCardLabel,
                  filterStatus === 'Active' && styles.statusCardLabelActive
                ]}>
                  Active
                </Text>
                <Text style={[
                  styles.statusCardNumber,
                  filterStatus === 'Active' && styles.statusCardNumberActive
                ]}>
                  {activeCount.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusCard,
                  filterStatus === 'Draft' && styles.statusCardActive
                ]}
                onPress={() => handleFilterStatus('Draft')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="document-text"
                  size={18}
                  color={filterStatus === 'Draft' ? '#235CF8' : '#9CA3AF'}
                />
                <Text style={[
                  styles.statusCardLabel,
                  filterStatus === 'Draft' && styles.statusCardLabelActive
                ]}>
                  Draft
                </Text>
                <Text style={[
                  styles.statusCardNumber,
                  filterStatus === 'Draft' && styles.statusCardNumberActive
                ]}>
                  {draftCount.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.statusCard,
                  filterStatus === 'Paused' && styles.statusCardActive
                ]}
                onPress={() => handleFilterStatus('Paused')}
                activeOpacity={0.85}
              >
                <Ionicons
                  name="pause-circle"
                  size={18}
                  color={filterStatus === 'Paused' ? '#235CF8' : '#9CA3AF'}
                />
                <Text style={[
                  styles.statusCardLabel,
                  filterStatus === 'Paused' && styles.statusCardLabelActive
                ]}>
                  Paused
                </Text>
                <Text style={[
                  styles.statusCardNumber,
                  filterStatus === 'Paused' && styles.statusCardNumberActive
                ]}>
                  {pausedCount.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Total Count & Clear Filter */}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>
                {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'}
                {filterStatus && ` · ${filterStatus}`}
              </Text>
              {filterStatus && (
                <TouchableOpacity
                  onPress={() => handleFilterStatus(null)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Boost Card */}
            <TouchableOpacity
              style={styles.boostCard}
              onPress={handleBoostCard}
              activeOpacity={0.9}
            >
              <View style={styles.boostIconWrapper}>
                <Ionicons name="rocket" size={20} color="#235CF8" />
              </View>
              <View style={styles.boostContent}>
                <Text style={styles.boostTitle}>Boost Visibility</Text>
                <Text style={styles.boostDescription}>
                  Promote top listing to reach more buyers
                </Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '68%' }]} />
                </View>
              </View>
              <View style={styles.boostMeta}>
                <Text style={styles.boostPercent}>68%</Text>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </View>
            </TouchableOpacity>

            {/* Bulk Actions Bar */}
            {selected.length > 0 && (
              <View style={styles.bulkActionsBar}>
                <View style={styles.bulkActionsLeft}>
                  <TouchableOpacity
                    style={styles.bulkActionButton}
                    onPress={handleBulkPause}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="pause" size={16} color="#235CF8" />
                    <Text style={styles.bulkActionText}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.bulkActionButton, styles.bulkActionButtonDanger]}
                    onPress={handleBulkDelete}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    <Text style={[styles.bulkActionText, styles.bulkActionTextDanger]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => setSelected([])}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            )}

            {/* Select All */}
            <TouchableOpacity
              style={styles.selectAllRow}
              onPress={handleSelectAll}
              activeOpacity={0.7}
            >
              <View style={[
                styles.checkbox,
                selected.length === filteredListings.length && filteredListings.length > 0 && styles.checkboxActive
              ]}>
                {selected.length === filteredListings.length && filteredListings.length > 0 && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text style={styles.selectAllText}>Select all</Text>
              {selected.length > 0 && (
                <Text style={styles.selectedCount}>{selected.length} selected</Text>
              )}
            </TouchableOpacity>
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#235CF8"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Refined background
  },

  // Header
  headerWrapper: {
    backgroundColor: '#235CF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#235CF8',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 0.3,
  },

  // Search
  searchWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
    fontWeight: '400',
  },

  // Status Cards
  statusRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  statusCardActive: {
    backgroundColor: '#F0F7FF',
    borderColor: '#235CF8',
    borderWidth: 1.5,
    shadowColor: '#235CF8',
    shadowOpacity: 0.08,
  },
  statusCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    letterSpacing: 0.2,
  },
  statusCardLabelActive: {
    color: '#235CF8',
  },
  statusCardNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  statusCardNumberActive: {
    color: '#235CF8',
  },

  // Total Row
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  clearFilterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#235CF8',
  },

  // Boost Card
  boostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 12,
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  boostIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boostContent: {
    flex: 1,
    gap: 4,
  },
  boostTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  boostDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#235CF8',
    borderRadius: 3,
  },
  boostMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  boostPercent: {
    fontSize: 15,
    fontWeight: '700',
    color: '#235CF8',
  },

  // Bulk Actions
  bulkActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  bulkActionsLeft: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  bulkActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F0F7FF',
    gap: 6,
  },
  bulkActionButtonDanger: {
    backgroundColor: '#FEF3F2',
  },
  bulkActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#235CF8',
  },
  bulkActionTextDanger: {
    color: '#EF4444',
  },

  // Select All
  selectAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 8,
    gap: 10,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  selectedCount: {
    marginLeft: 'auto',
    fontSize: 13,
    fontWeight: '600',
    color: '#235CF8',
  },

  // Listing Card - Premium Design
  listingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  lastCard: {
    marginBottom: 24,
  },

  // Card Header: Checkbox positioning
  cardHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  checkboxWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxActive: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
  },

  // Card Body: Image + Content layout
  cardBody: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 48,
    gap: 14,
  },
  imageWrapper: {
    position: 'relative',
  },
  carImage: {
    width: 104,
    height: 78,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },
  imageBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#fff',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#fff',
  },

  // Content Section: Improved spacing and hierarchy
  contentSection: {
    flex: 1,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  activeBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  pauseBadge: {
    backgroundColor: '#FEF3F2',
    borderWidth: 1,
    borderColor: '#FEE4E2',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusIndicatorActive: {
    backgroundColor: '#10B981',
  },
  statusIndicatorPaused: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.3,
  },
  activeStatusText: {
    color: '#10B981',
  },

  // Price Section: Enhanced typography
  priceSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
    marginTop: 2,
  },
  price: {
    fontSize: 19,
    fontWeight: '700',
    color: '#235CF8',
    letterSpacing: -0.3,
  },
  mileage: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    letterSpacing: 0.1,
  },

  // Stats Section: Refined icon and text alignment
  statsSection: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Full-Width Action Buttons: Premium design spanning entire card
  actionButtonsRow: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 56,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: '100%',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    height: 32,
    alignSelf: 'center',
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#235CF8',
    letterSpacing: 0.1,
  },

  // Empty State
  emptyContainer: {
    paddingVertical: 80,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#235CF8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // List Content
  listContent: {
    paddingBottom: 32,
  },
});
