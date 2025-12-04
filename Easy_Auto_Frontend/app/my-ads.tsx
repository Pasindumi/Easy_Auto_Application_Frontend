// app/my-ads.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatusCards from "../components/StatusCards";

// Sample Ads Data
const ADS_DATA = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    price: '$45,000',
    location: 'Malabe, Sri Lanka',
    views: 1200,
    likes: 50,
    messages: 15,
    status: 'active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '2',
    title: 'BMW 3 Series 2021',
    price: '$45,000',
    location: 'Malabe, Sri Lanka',
    views: 850,
    likes: 12,
    messages: 8,
    status: 'draft',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '3',
    title: 'Nissan GTR R35',
    price: '$56,000',
    location: 'Galle, Sri Lanka',
    views: 2100,
    likes: 150,
    messages: 60,
    status: 'expired',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '4',
    title: 'Toyota Supra 2020',
    price: '$50,000',
    location: 'Colombo, Sri Lanka',
    views: 900,
    likes: 25,
    messages: 10,
    status: 'active',
    image: require('../assets/images/car.jpg'),
  },
  {
    id: '5',
    title: 'Honda Civic Type R',
    price: '$38,000',
    location: 'Kandy, Sri Lanka',
    views: 680,
    likes: 20,
    messages: 7,
    status: 'active',
    image: require('../assets/images/car.jpg'),
  },
];

export default function MyAdsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // page-level filter uses: 'all' | 'active' | 'expired' | 'draft'
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'expired' | 'draft'>('all');

  // --- counts for StatusCards component ---
  const counts = {
    total: ADS_DATA.length,
    active: ADS_DATA.filter(a => a.status === 'active').length,
    draft: ADS_DATA.filter(a => a.status === 'draft').length,
    paused: ADS_DATA.filter(a => a.status === 'expired').length, // map 'expired' -> paused
  };

  // Bridge helpers between this page filter and StatusCards keys
  const mapPageFilterToStatusCard = (f: typeof selectedFilter) => {
    if (f === 'all') return 'all';
    if (f === 'active') return 'Active';
    if (f === 'draft') return 'Draft';
    if (f === 'expired') return 'Paused';
    return null;
  };
  const handleStatusCardSelect = (key: "all" | "Active" | "Draft" | "Paused" | null) => {
    if (!key || key === 'all') return setSelectedFilter('all');
    if (key === 'Active') return setSelectedFilter('active');
    if (key === 'Draft') return setSelectedFilter('draft');
    if (key === 'Paused') return setSelectedFilter('expired');
  };

  const filteredAds = ADS_DATA.filter(ad => {
    const statusMatch = selectedFilter === 'all' || ad.status === selectedFilter;
    const searchMatch = !searchQuery || ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  // <-- Fix: define handleSelectAll so the header "Select all" button works -->
  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (filteredAds.length === 0) {
      setSelected([]);
      return;
    }
    // if everything already selected, clear; otherwise select all visible
    const allSelected = filteredAds.every(ad => selected.includes(ad.id));
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(filteredAds.map(ad => ad.id));
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleEdit = (id: string) => router.push(`/edit-car?id=${encodeURIComponent(id)}`);
  const handleBoost = (id: string) => router.push(`/packages?id=${encodeURIComponent(id)}`);
  const handleDelete = (id: string) => router.push(`/delete-car?id=${encodeURIComponent(id)}`);
  const handleShare = async (id: string) => {
    const item = ADS_DATA.find(ad => ad.id === id);
    if (!item) return;
    try {
      await Share.share({
        message: `${item.title} — ${item.price}\nCheck this ad: myapp://view-car?id=${item.id}`,
        title: item.title,
      });
    } catch (error) {
      console.warn('Share failed', error);
    }
  };

  const handleBulkPause = () => setSelected([]);
  const handleBulkDelete = () => setSelected([]);

  const renderAd = ({ item, index }: { item: typeof ADS_DATA[0]; index: number }) => (
    <View style={[styles.listingCard, index === filteredAds.length - 1 && styles.lastCard]}>
      <View style={styles.cardHeader}>
        <TouchableOpacity onPress={() => toggleSelect(item.id)} style={styles.checkboxWrapper}>
          <View style={[styles.checkbox, selected.includes(item.id) && styles.checkboxActive]}>
            {selected.includes(item.id) && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Image source={item.image} style={styles.carImage} resizeMode="cover" />

        <View style={styles.contentSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <View style={[
              styles.statusBadge,
              item.status === 'active' ? styles.activeBadge : item.status === 'draft' ? styles.pauseBadge : styles.expiredBadge
            ]}>
              <View style={[
                styles.statusIndicator,
                item.status === 'active' ? styles.statusIndicatorActive : item.status === 'draft' ? styles.statusIndicatorPaused : styles.statusIndicatorExpired
              ]} />
              <Text style={[
                styles.statusText,
                item.status === 'active' ? styles.activeStatusText : item.status === 'expired' ? styles.expiredStatusText : {}
              ]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          <View style={styles.priceSection}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.mileage}>{item.location}</Text>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.views.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={12} color="#9CA3AF" />
              <Text style={styles.statValue}>{item.messages}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/view-car?id=${item.id}`)}>
          <Ionicons name="eye-outline" size={14} color="#235CF8" />
          <Text style={styles.actionLabel}>View</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item.id)}>
          <Ionicons name="create-outline" size={14} color="#235CF8" />
          <Text style={styles.actionLabel}>Edit</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionButton} onPress={() => handleBoost(item.id)}>
          <Ionicons name="rocket-outline" size={14} color="#235CF8" />
          <Text style={styles.actionLabel}>Boost</Text>
        </TouchableOpacity>
        <View style={styles.actionDivider} />
        <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={14} color="#EF4444" />
          <Text style={[styles.actionLabel, { color: '#EF4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Blue top header component (unchanged) */}
        <Header />

        {/* White heading row directly below the blue header (icon + title) */}
        <View style={localStyles.headerWrap}>
          <View style={localStyles.header}>
            <View style={localStyles.headerLeft}>
              <Ionicons name="layers-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
              <Text style={localStyles.headerTitle}>My Ads</Text>
            </View>

            <TouchableOpacity onPress={handleSelectAll} style={localStyles.headerRight}>
              <Text style={localStyles.selectAllText}>{selected.length ? `${selected.length} selected` : 'Select all'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Componentized search + status */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search ads..." />
        <StatusCards
          counts={counts}
          selectedFilter={mapPageFilterToStatusCard(selectedFilter) as any}
          onSelect={handleStatusCardSelect}
        />

        {selected.length > 0 && (
          <View style={styles.bulkActionsBar}>
            <View style={styles.bulkActionsLeft}>
              <TouchableOpacity style={styles.bulkActionButton} onPress={handleBulkPause}>
                <Ionicons name="pause" size={14} color="#235CF8" />
                <Text style={styles.bulkActionText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.bulkActionButton, styles.bulkActionButtonDanger]} onPress={handleBulkDelete}>
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <Text style={[styles.bulkActionText, styles.bulkActionTextDanger]}>Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setSelected([])}>
              <Ionicons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredAds}
          renderItem={renderAd}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="car-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No ads found</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/post-add')}>
                <Ionicons name="add-circle-outline" size={16} color="#fff" />
                <Text style={styles.emptyButtonText}>Create New Ad</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#235CF8" />}
        />
      </SafeAreaView>
    </View>
  );
}

// --- Styles (kept mostly unchanged) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },

  searchWrapper: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 6 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  searchInput: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '400', padding: 0, marginHorizontal: 8 },

  statusRow: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 10 },
  statusCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6', marginRight: 8 },
  statusCardActive: { backgroundColor: '#F0F7FF', borderColor: '#235CF8', borderWidth: 1.5 },
  statusCardLabel: { fontSize: 11, fontWeight: '500', color: '#6B7280' },
  statusCardLabelActive: { color: '#235CF8' },
  statusCardNumber: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statusCardNumberActive: { color: '#235CF8' },

  listingCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0', elevation: 2 },
  lastCard: { marginBottom: 20 },
  cardHeader: { position: 'absolute', top: 12, left: 12, zIndex: 10 },
  checkboxWrapper: { width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: '#D1D5DB', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: '#235CF8', borderColor: '#235CF8' },
  cardBody: { flexDirection: 'row', padding: 12 },
  carImage: { width: 90, height: 68, borderRadius: 10 },
  contentSection: { flex: 1, marginLeft: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  activeBadge: { backgroundColor: '#ECFDF5', borderWidth: 1, borderColor: '#D1FAE5' },
  pauseBadge: { backgroundColor: '#FEF3F2', borderWidth: 1, borderColor: '#FEE4E2' },
  expiredBadge: { backgroundColor: '#FFE5E5', borderWidth: 1, borderColor: '#FECACA' },
  statusIndicator: { width: 5, height: 5, borderRadius: 2.5 },
  statusIndicatorActive: { backgroundColor: '#10B981' },
  statusIndicatorPaused: { backgroundColor: '#FBBF24' },
  statusIndicatorExpired: { backgroundColor: '#EF4444' },
  statusText: { fontSize: 10, fontWeight: '600', color: '#6B7280' },
  activeStatusText: { color: '#10B981' },
  expiredStatusText: { color: '#EF4444' },
  priceSection: { flexDirection: 'row', alignItems: 'baseline', marginTop: 2 },
  price: { fontSize: 14, fontWeight: '600', color: '#111827' },
  mileage: { fontSize: 12, fontWeight: '400', color: '#6B7280', marginLeft: 6 },
  statsSection: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  statValue: { fontSize: 11, color: '#6B7280', marginLeft: 2 },
  actionButtonsRow: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#F3F4F6', height: 40, justifyContent: 'space-around', alignItems: 'center' },
  actionButton: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 4 },
  actionDivider: { width: 1, height: 20, backgroundColor: '#E5E7EB' },
  actionLabel: { fontSize: 12, color: '#235CF8', fontWeight: '500' },

  bulkActionsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#F3F4F6' },
  bulkActionsLeft: { flexDirection: 'row', marginRight: 8 },
  bulkActionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  bulkActionText: { fontSize: 13, color: '#235CF8', fontWeight: '500' },
  bulkActionButtonDanger: {},
  bulkActionTextDanger: { color: '#EF4444' },

  emptyContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 12 },
  emptyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#235CF8', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginTop: 12 },
  emptyButtonText: { color: '#fff', fontWeight: '500', fontSize: 13 },
});

// small local styles used for the white heading row under the Header
const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#F3F4F6' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
  headerRight: { paddingHorizontal: 8, paddingVertical: 4 },
  selectAllText: { fontSize: 13, color: '#6B7280' },
});
