import COLORS from "@/constants/Colors";
import Loading from "@/components/ui/Loading";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";
import { api } from "@/utils/api";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AdCard from "../../components/cards/AdCard";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import StatusCards from "../../components/status/StatusCards";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function MyAdsScreen() {
  // Protect this route - require authentication
  useProtectedRoute();

  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'expired' | 'draft' | 'banned'>('all');

  // REVISED STRATEGY: Fetch ALL ads to get correct counts, filter Client Side
  const fetchAllAds = async () => {
    try {
      if (!refreshing) setLoading(true); // Don't show full loader on refresh
      const response = await api.get<{ success: boolean; data: any[] }>(`/api/cars/my-ads`);
      if (response.success) {
        // Map backend data to frontend format
        const mappedAds = response.data.map((ad: any) => ({
          ...ad,
          // Format price
          price: ad.price ? `Rs. ${Number(ad.price).toLocaleString('en-LK')}` : "Contact for Price",
          // Map status to lowercase for frontend logic
          status: ad.status ? ad.status.toLowerCase() : "draft",
          ban_reason: ad.ban_reason,
          ban_expires_at: ad.ban_expires_at,
          // Extract first image
          image: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
          // Map counts
          views: ad.views_count || 0,
          likes: ad.likes_count || 0, // Assuming backend might have this or default to 0
          messages: 0 // Placeholder until implemented
        }));
        setAds(mappedAds);
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAds();
  }, []);

  const counts = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    draft: ads.filter(a => a.status === 'draft').length,
    paused: ads.filter(a => a.status === 'expired' || a.status === 'paused' || a.status === 'banned').length,
  };

  const mapPageFilterToStatusCard = (f: typeof selectedFilter) => {
    if (f === 'all') return 'all';
    if (f === 'active') return 'Active';
    if (f === 'draft') return 'Draft';
    if (f === 'expired' || f === 'banned') return 'Paused';
    return null;
  };

  const handleStatusCardSelect = (key: "all" | "Active" | "Draft" | "Paused" | null) => {
    if (!key || key === 'all') return setSelectedFilter('all');
    if (key === 'Active') return setSelectedFilter('active');
    if (key === 'Draft') return setSelectedFilter('draft');
    if (key === 'Paused') return setSelectedFilter('expired');
  };

  const filteredAds = ads.filter(ad => {
    // Legacy filter function if needed, but we use clientFilteredAds below
    return true;
  });

  const clientFilteredAds = ads.filter(ad => {
    let statusMatch = true;
    if (selectedFilter === 'active') statusMatch = ad.status === 'active';
    if (selectedFilter === 'draft') statusMatch = ad.status === 'draft';
    if (selectedFilter === 'expired') statusMatch = ad.status === 'expired' || ad.status === 'paused' || ad.status === 'banned';

    const searchMatch = !searchQuery || (ad.title && ad.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });


  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (clientFilteredAds.length === 0) {
      setSelected([]);
      return;
    }
    const allSelected = clientFilteredAds.every(ad => selected.includes(ad.id));
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(clientFilteredAds.map(ad => ad.id));
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllAds();
  }, []);

  const renderAd = ({ item }: { item: any; index: number }) => (
    <AdCard ad={item} selected={selected.includes(item.id)} toggleSelect={toggleSelect} />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        <Header />

        <View style={headerSectionStyles.headerWrap}>
          <View style={headerSectionStyles.header}>
            <View style={headerSectionStyles.headerLeft}>
              <Ionicons name="layers-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={headerSectionStyles.headerTitle}>My Ads</Text>
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
              <TouchableOpacity style={styles.bulkActionButton} onPress={() => setSelected([])}>
                <Ionicons name="pause" size={14} color={COLORS.primary} />
                <Text style={styles.bulkActionText}>Pause</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bulkActionButton} onPress={() => setSelected([])}>
                <Ionicons name="trash-outline" size={14} color={COLORS.status.danger} />
                <Text style={[styles.bulkActionText, { color: COLORS.status.danger }]}>Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setSelected([])}>
              <Ionicons name="close" size={16} color={COLORS.text.muted} />
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <Loading message="Loading your ads..." />
        ) : (
          <>
          <BrandedRefreshOverlay refreshing={refreshing} top={240} />
          <FlatList
            data={clientFilteredAds}
            renderItem={renderAd}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="car-outline" size={48} color={COLORS.divider} />
                <Text style={styles.emptyTitle}>No ads found</Text>
                <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/cars/sell-car')}>
                  <Ionicons name="add-circle-outline" size={16} color={COLORS.white} />
                  <Text style={styles.emptyButtonText}>Create New Ad</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh} 
                tintColor="transparent"
                colors={["transparent"]}
                progressBackgroundColor="transparent"
              />
            }
          />
          </>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  bulkActionsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.primaryLight },
  bulkActionsLeft: { flexDirection: 'row', marginRight: 8 },
  bulkActionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  bulkActionText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },

  emptyContainer: { justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text.muted, marginTop: 12 },
  emptyButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, marginTop: 12 },
  emptyButtonText: { color: COLORS.white, fontWeight: '500', fontSize: 13 },
});

const localStyles = StyleSheet.create({
  headerRight: { paddingHorizontal: 8, paddingVertical: 4 },
  selectAllText: { fontSize: 13, color: COLORS.text.muted },
});
