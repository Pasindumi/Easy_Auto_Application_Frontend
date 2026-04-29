import COLORS from "@/constants/Colors";
import Loading from "@/components/ui/Loading";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";
import { api } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdCard from "../../components/cards/AdCard";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";

export default function MyAdsScreen() {
  // Protect this route - require authentication
  useProtectedRoute();

  const router = useRouter();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'expired' | 'draft' | 'banned'>('all');

  // Fetch ALL ads to get correct counts, filter Client Side
  const fetchAllAds = async () => {
    try {
      if (!refreshing) setLoading(true);

      const [carsRes, rentalsRes] = await Promise.all([
        api.get<{ success: boolean; data: any[] }>(`/api/cars/my-ads`),
        api.get<{ success: boolean; data: any[] }>(`/api/rentals/my-ads`)
      ]);

      let allMappedAds: any[] = [];

      if (carsRes.success) {
        const mappedCars = carsRes.data.map((ad: any) => ({
          ...ad,
          price: ad.price ? `Rs. ${Number(ad.price).toLocaleString()}` : "Contact for Price",
          status: ad.status ? ad.status.toLowerCase() : "draft",
          image: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
          views: ad.views_count || 0,
          likes: ad.likes_count || 0,
          adType: 'car'
        }));
        allMappedAds = [...allMappedAds, ...mappedCars];
      }

      if (rentalsRes.success) {
        const mappedRentals = rentalsRes.data.map((ad: any) => ({
          ...ad,
          price: ad.price_per_day ? `Rs. ${Number(ad.price_per_day).toLocaleString()}/day` : "Contact for Pricing",
          status: ad.status ? ad.status.toLowerCase() : "draft",
          image: ad.images?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
          views: ad.views_count || 0,
          likes: ad.likes_count || 0,
          adType: 'rental'
        }));
        allMappedAds = [...allMappedAds, ...mappedRentals];
      }

      // Sort by creation date descending
      allMappedAds.sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime());

      setAds(allMappedAds);
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
    draft: ads.filter(a => a.status === 'draft' || a.status === 'pending_payment').length,
    paused: ads.filter(a => a.status === 'expired' || a.status === 'paused' || a.status === 'banned').length,
  };

  const clientFilteredAds = ads.filter(ad => {
    let statusMatch = true;
    if (selectedFilter === 'active') statusMatch = ad.status === 'active';
    if (selectedFilter === 'draft') statusMatch = ad.status === 'draft' || ad.status === 'pending_payment';
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
    setSelected(allSelected ? [] : clientFilteredAds.map(ad => ad.id));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllAds();
  }, []);

  const renderSkeleton = () => (
    <View style={{ padding: 16 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonImg} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonLineShort} />
            <View style={styles.skeletonLineLong} />
            <View style={styles.skeletonLinePrice} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="My Ads" />

      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchFilterContainer}>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search ads by title..."
          />
        </View>

        {/* Quick Filter Tabs */}
        <View style={styles.filterTabs}>
          {[
            { id: 'all', label: 'All', count: counts.total },
            { id: 'active', label: 'Active', count: counts.active },
            { id: 'draft', label: 'Drafts', count: counts.draft },
            { id: 'expired', label: 'Paused', count: counts.paused },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.filterTab, selectedFilter === tab.id && styles.filterTabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedFilter(tab.id as any);
              }}
            >
              <Text style={[styles.filterTabText, selectedFilter === tab.id && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
              <View style={[styles.filterTabBadge, selectedFilter === tab.id && styles.filterTabBadgeActive]}>
                <Text style={[styles.filterTabBadgeText, selectedFilter === tab.id && styles.filterTabBadgeTextActive]}>
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <Loading message="Loading your ads..." />
        ) : (
          <>
            <BrandedRefreshOverlay refreshing={refreshing} top={240} />
            <FlatList
              data={clientFilteredAds}
              renderItem={({ item }) => (
                <AdCard ad={item} selected={selected.includes(item.id)} toggleSelect={toggleSelect} />
              )}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="car-sport-outline" size={40} color={COLORS.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>No ads found</Text>
                  <Text style={styles.emptyDesc}>Try adjusting your search or filters to find what you're looking for.</Text>
                  <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/cars/sell-car')}>
                    <Text style={styles.createBtnText}>Create New Ad</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              }
              contentContainerStyle={[styles.listContent, { paddingBottom: 24 }]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                />
              }
            />
          </>
        )}
      </View>

      {/* Bulk Actions Floating Bar */}
      {selected.length > 0 && (
        <View style={[styles.bulkActions, { bottom: insets.bottom + 16 }]}>
          <Text style={styles.bulkCount}>{selected.length} Selected</Text>
          <View style={styles.bulkRight}>
            <TouchableOpacity
              style={styles.bulkBtn}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                showToast({ message: `${selected.length} ads have been paused successfully.`, type: 'info' });
                setSelected([]);
              }}
            >
              <Ionicons name="pause-outline" size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bulkBtn, styles.bulkBtnDelete]}
              onPress={() => {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                showToast({ message: `${selected.length} ads have been deleted successfully.`, type: 'success' });
                setSelected([]);
              }}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
            <View style={styles.bulkDivider} />
            <TouchableOpacity style={styles.bulkBtnClose} onPress={() => setSelected([])}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  selectAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectAllBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  selectAllTextActive: {
    color: COLORS.primary,
  },
  searchFilterContainer: {
    marginTop: 4,
    marginBottom: 4,
  },

  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  filterTabBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  filterTabBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterTabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabBadgeTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 5,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  createBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  // Skeleton Styles
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  skeletonImg: {
    width: 100,
    height: 80,
    borderRadius: 5,
    backgroundColor: '#F1F5F9',
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
    gap: 10,
    justifyContent: 'center',
  },
  skeletonLineShort: {
    width: '40%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  skeletonLineLong: {
    width: '80%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F8FAFC',
  },
  skeletonLinePrice: {
    width: '30%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  // Bulk Actions Bar
  bulkActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  bulkCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  bulkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bulkBtn: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#F8FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkBtnDelete: {
    backgroundColor: '#FEF2F2',
  },
  bulkDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 8,
  },
  bulkBtnClose: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
