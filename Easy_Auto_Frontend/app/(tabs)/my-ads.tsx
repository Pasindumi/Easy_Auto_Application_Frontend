import { COLORS } from "@/constants/Colors";
import Loading from "@/components/ui/Loading";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";
import { api } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  Alert,
  FlatList,
  Image,
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
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'paused' | 'draft' | 'deleted'>('all');

  // Fetch ALL ads to get correct counts, filter Client Side
  const fetchAllAds = useCallback(async () => {
    try {
      setLoading(true);

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
  }, []);

  useEffect(() => {
    fetchAllAds();
  }, [fetchAllAds]);

  const counts = {
    total: ads.filter(a => a.status !== 'deleted').length,
    active: ads.filter(a => a.status === 'active').length,
    draft: ads.filter(a => a.status === 'draft' || a.status === 'pending_payment').length,
    paused: ads.filter(a => a.status === 'expired' || a.status === 'paused' || a.status === 'banned').length,
    deleted: ads.filter(a => a.status === 'deleted').length,
  };

  const clientFilteredAds = ads.filter(ad => {
    let statusMatch = true;
    if (selectedFilter === 'all') statusMatch = ad.status !== 'deleted';
    if (selectedFilter === 'active') statusMatch = ad.status === 'active';
    if (selectedFilter === 'draft') statusMatch = ad.status === 'draft' || ad.status === 'pending_payment';
    if (selectedFilter === 'paused') statusMatch = ad.status === 'expired' || ad.status === 'paused' || ad.status === 'banned';
    if (selectedFilter === 'deleted') statusMatch = ad.status === 'deleted';

    const searchMatch = !searchQuery || (ad.title && ad.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return statusMatch && searchMatch;
  });

  const toggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllAds();
  }, [fetchAllAds]);

  const updateAdStatus = async (ad: any, status: 'ACTIVE' | 'PAUSED' | 'DELETED') => {
    try {
      const endpoint = ad.adType === 'rental'
        ? `/api/rentals/${ad.id}/status`
        : `/api/cars/${ad.id}/status`;

      const response = await api.put<{ success: boolean; message?: string }>(endpoint, { status });
      if (!response.success) {
        throw new Error(response.message || 'Status update failed');
      }

      const normalizedStatus = status.toLowerCase();
      setAds(prev => prev.map(item => item.id === ad.id && item.adType === ad.adType ? { ...item, status: normalizedStatus } : item));
      showToast({
        message: status === 'ACTIVE' ? 'Ad resumed successfully.' : status === 'PAUSED' ? 'Ad paused successfully.' : 'Ad moved to deleted.',
        type: status === 'ACTIVE' ? 'success' : 'info'
      });
    } catch (error: any) {
      console.error("Status update failed:", error);
      Alert.alert("Error", error.message || "Failed to update ad status.");
    }
  };

  const handleResumeAd = (ad: any) => {
    Alert.alert(
      "Resume Ad",
      "This will make the ad active again and visible to buyers.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Resume", onPress: () => updateAdStatus(ad, 'ACTIVE') }
      ]
    );
  };

  const renderDeletedAd = ({ item }: { item: any }) => (
    <View style={styles.deletedCard}>
      <Image source={{ uri: item.image }} style={styles.deletedImage} />
      <View style={styles.deletedContent}>
        <View style={styles.deletedHeader}>
          <Text style={styles.deletedTitle} numberOfLines={1}>{item.title}</Text>
          <View style={styles.deletedBadge}>
            <Ionicons name="trash-outline" size={12} color={COLORS.text.muted} />
            <Text style={styles.deletedBadgeText}>Deleted</Text>
          </View>
        </View>
        <Text style={styles.deletedMeta} numberOfLines={1}>{item.location || "Sri Lanka"}</Text>
        <Text style={styles.deletedPrice}>{item.price}</Text>
        <Text style={styles.deletedNote}>This ad is archived and cannot be opened.</Text>
      </View>
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
            { id: 'paused', label: 'Paused', count: counts.paused },
            { id: 'deleted', label: 'Deleted', count: counts.deleted },
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
            {selectedFilter === 'paused' && clientFilteredAds.length > 0 && (
              <View style={styles.pauseNotice}>
                <Ionicons name="information-circle-outline" size={18} color={COLORS.status.warning} />
                <Text style={styles.pauseNoticeText}>Paused ads are hidden from buyers and may be automatically deleted after 14 days. Resume them before the deadline to keep them active.</Text>
              </View>
            )}
            <FlatList
              data={clientFilteredAds}
              renderItem={({ item }) => (
                selectedFilter === 'deleted' || item.status === 'deleted'
                  ? renderDeletedAd({ item })
                  : <AdCard ad={item} selected={selected.includes(item.id)} toggleSelect={toggleSelect} onResume={handleResumeAd} />
              )}
              keyExtractor={item => `${item.adType}-${item.id}`}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconCircle}>
                    <Ionicons name="car-sport-outline" size={40} color={COLORS.primary} />
                  </View>
                  <Text style={styles.emptyTitle}>No ads found</Text>
                  <Text style={styles.emptyDesc}>Try adjusting your search or filters to find what you are looking for.</Text>
                  {selectedFilter !== 'deleted' && (
                    <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/cars/sell-car')}>
                      <Text style={styles.createBtnText}>Create New Ad</Text>
                      <Ionicons name="arrow-forward" size={16} color="#fff" />
                    </TouchableOpacity>
                  )}
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
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                showToast({ message: `Pause actions are available from each ad's delete screen.`, type: 'info' });
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
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
    gap: 6,
    marginBottom: 20,
    justifyContent: 'center',
  },
  filterTab: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 12,
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
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabBadgeTextActive: {
    color: '#fff',
  },
  pauseNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
  },
  pauseNoticeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text.secondary,
  },
  deletedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  deletedImage: {
    width: 74,
    height: 62,
    borderRadius: 8,
    backgroundColor: COLORS.divider,
    opacity: 0.72,
  },
  deletedContent: {
    flex: 1,
    marginLeft: 12,
  },
  deletedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deletedTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  deletedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  deletedBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.text.muted,
  },
  deletedMeta: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.text.muted,
  },
  deletedPrice: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  deletedNote: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.text.placeholder,
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
    paddingVertical: 12,
    borderRadius: 5,
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
