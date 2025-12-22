// app/my-ads.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import StatusCards from "../../components/StatusCards";
import AdCard from "../../components/cards/AdCard";
import { ADS_DATA } from "../dummydata/ads";

export default function MyAdsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'expired' | 'draft'>('all');

  const counts = {
    total: ADS_DATA.length,
    active: ADS_DATA.filter(a => a.status === 'active').length,
    draft: ADS_DATA.filter(a => a.status === 'draft').length,
    paused: ADS_DATA.filter(a => a.status === 'expired').length,
  };

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

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (filteredAds.length === 0) {
      setSelected([]);
      return;
    }
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

  const handleEdit = (id: string) => router.push(`/ads/edit-car?id=${encodeURIComponent(id)}`);
  const handleBoost = (id: string) => router.push(`/packages/packages?id=${encodeURIComponent(id)}`);
  const handleDelete = (id: string) => router.push(`/ads/delete-car?id=${encodeURIComponent(id)}`);
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
    <AdCard ad={item} selected={selected.includes(item.id)} toggleSelect={toggleSelect} />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <Header />

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
              <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/cars/buy-car')}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#F3F4F6' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
  headerRight: { paddingHorizontal: 8, paddingVertical: 4 },
  selectAllText: { fontSize: 13, color: '#6B7280' },
});
