import Header from "@/components/Header";
import Loading from "@/components/ui/Loading";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";
import EmptyState from "@/components/ui/EmptyState";
import COLORS from "@/constants/Colors";
import { api } from "@/utils/api";
import { useToast } from "@/contexts/ToastContext";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdCard from "@/components/cards/AdCard";
import * as Haptics from 'expo-haptics';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

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
  // Tab Animation State
  const [tabWidths, setTabWidths] = useState<{ [key: string]: number }>({});
  const tabUnderlineLeft = React.useRef(new Animated.Value(0)).current;
  const tabUnderlineWidth = React.useRef(new Animated.Value(0)).current;

  // Fetch ALL ads to get correct counts, filter Client Side
  const fetchAllAds = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await api.get<{ success: boolean; data: any[] }>(`/api/cars/my-ads`);
      if (response.success) {
        const mappedAds = response.data.map((ad: any) => ({
          ...ad,
          price: ad.price ? `Rs. ${Number(ad.price).toLocaleString()}` : "Contact for Price",
          status: ad.status ? ad.status.toLowerCase() : "draft",
          image: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
          views: ad.views_count || 0,
          likes: ad.likes_count || 0,
          messages: 0
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

  // Update underline animation when filter changes or tab widths change
  useEffect(() => {
    const tabs = ['all', 'active', 'draft', 'expired'];
    const index = tabs.indexOf(selectedFilter);
    if (index !== -1 && tabWidths[selectedFilter]) {
      let left = 0;
      for (let i = 0; i < index; i++) {
        left += (tabWidths[tabs[i]] || 0) + 12; // 12 is the gap
      }
      
      Animated.parallel([
        Animated.spring(tabUnderlineLeft, {
          toValue: left,
          useNativeDriver: false,
          tension: 50,
        }),
        Animated.spring(tabUnderlineWidth, {
          toValue: tabWidths[selectedFilter],
          useNativeDriver: false,
          tension: 50,
        })
      ]).start();
    }
  }, [selectedFilter, tabWidths]);

  const counts = {
    total: ads.length,
    active: ads.filter(a => a.status === 'active').length,
    draft: ads.filter(a => a.status === 'draft').length,
    paused: ads.filter(a => a.status === 'expired' || a.status === 'paused' || a.status === 'banned').length,
  };

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
    setSelected(allSelected ? [] : clientFilteredAds.map(ad => ad.id));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAllAds();
  }, []);

  const TABS = [
    { id: 'all', label: 'All Ads', count: counts.total },
    { id: 'active', label: 'Active', count: counts.active },
    { id: 'draft', label: 'Drafts', count: counts.draft },
    { id: 'expired', label: 'Paused', count: counts.paused },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* 1. Compact Professional Header with Integrated Search */}
      <Header 
        showBack={true} 
        isFlat={true}
        centerElement={
          <View style={headerStyles.searchContainer}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              style={headerStyles.searchInput}
              placeholder="Search your ads..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color="#CBD5E1" />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {/* 2. Interactive Tab Bar (Now more compact) */}
      <View style={styles.tabBarWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.tabScroll}
        >
          <View>
            <View style={styles.tabsWrapper}>
                {TABS.map((tab) => (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.tabItem}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFilter(tab.id as any);
                    }}
                    onLayout={(e) => {
                      const { width } = e.nativeEvent.layout;
                      setTabWidths(prev => ({ ...prev, [tab.id]: width }));
                    }}
                  >
                    <Text style={[styles.tabLabel, selectedFilter === tab.id && styles.tabLabelActive]}>
                      {tab.label}
                    </Text>
                    <View style={[styles.tabBadge, selectedFilter === tab.id && styles.tabBadgeActive]}>
                      <Text style={[styles.tabBadgeText, selectedFilter === tab.id && styles.tabBadgeTextActive]}>
                        {tab.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Sliding Underline Indicator */}
              <Animated.View 
                style={[
                  styles.tabUnderline, 
                  { 
                    left: tabUnderlineLeft, 
                    width: tabUnderlineWidth 
                  }
                ]} 
              />
            </View>
          </ScrollView>
        </View>

      <View style={styles.mainContentArea}>
        {loading ? (
          <Loading message="Consulting database..." />
        ) : (
          <View style={{ flex: 1 }}>
            <BrandedRefreshOverlay refreshing={refreshing} top={20} />
            <FlatList
              data={clientFilteredAds}
              renderItem={({ item }) => (
                <AdCard ad={item} selected={selected.includes(item.id)} toggleSelect={toggleSelect} />
              )}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                <EmptyState
                  icon={searchQuery ? "search-outline" : "car-outline"}
                  title={searchQuery ? "No Matching Listings" : "Start Selling Cars"}
                  description={
                    searchQuery 
                      ? `We couldn't find any ads matching "${searchQuery}". Try a different term or filter.`
                      : "Your showroom is currently empty. Reach thousands of buyers by posting your first car ad today!"
                  }
                  actionText={searchQuery ? "Clear Search" : "Post Your First Ad"}
                  onActionPress={() => {
                    if (searchQuery) setSearchQuery('');
                    else router.push('/cars/sell-car');
                  }}
                  secondaryActionText={!searchQuery ? "View Selling Tips" : undefined}
                  onSecondaryActionPress={() => {}} // Could link to a guide
                />
              }
              contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={COLORS.primary}
                />
              }
            />
          </View>
        )}
      </View>

      {/* Bulk Actions Floating Bar (Enhanced Design) */}
      {selected.length > 0 && (
        <Animated.View 
          style={[
            styles.bulkActions, 
            { bottom: insets.bottom + 16 }
          ]}
        >
          <View style={styles.bulkContent}>
            <View style={styles.bulkInfo}>
              <View style={styles.bulkBadge}>
                <Text style={styles.bulkBadgeText}>{selected.length}</Text>
              </View>
              <Text style={styles.bulkCountText}>Selected</Text>
            </View>

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
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBarWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    zIndex: 90,
  },
  tabScroll: {
    paddingHorizontal: 16,
  },
  tabsWrapper: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 10,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  tabBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tabBadgeActive: {
    backgroundColor: COLORS.primary + '15',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  tabBadgeTextActive: {
    color: COLORS.primary,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  mainContentArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  bulkActions: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#1E293B',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  bulkContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bulkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulkBadge: {
    backgroundColor: COLORS.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  bulkCountText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  bulkRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bulkBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkBtnDelete: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  bulkDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 4,
  },
  bulkBtnClose: {
    padding: 4,
  },
});

const headerStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 12,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '500',
  },
});
