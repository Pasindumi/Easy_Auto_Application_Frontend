import ProfileHeader from '@/components/ProfileHeader';
import AdCard from '@/components/admin/AdCard';
import SkeletonAdCard from '@/components/admin/SkeletonAdCard';
import { STATUS_FILTERS } from '@/constants/ads';
import { Ad, AdStatus, NavTab } from '@/types/ad.types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Sample Ads Data for Admin
const ADMIN_ADS_DATA: Ad[] = [
  {
    id: '1',
    title: 'BMW 3 Series 2021',
    price: '$45,000',
    priceNum: 45000,
    location: 'Malabe, Sri Lanka',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    userPhone: '+94 77 123 4567',
    views: 1200,
    likes: 50,
    messages: 15,
    status: 'pending',
    postedDate: '2024-12-05',
    expiryDate: '2025-01-05',
    description: 'Well-maintained BMW 3 Series with full service history. Single owner, accident-free.',
    mileage: '45,000 km',
    year: 2021,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: require('../../assets/images/car.jpg'),
  },
  {
    id: '2',
    title: 'Mercedes-Benz C-Class',
    price: '$52,000',
    priceNum: 52000,
    location: 'Colombo, Sri Lanka',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    userPhone: '+94 77 234 5678',
    views: 850,
    likes: 32,
    messages: 8,
    status: 'active',
    postedDate: '2024-12-04',
    expiryDate: '2025-01-04',
    description: 'Luxury sedan in pristine condition. Premium features and excellent performance.',
    mileage: '32,000 km',
    year: 2022,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    image: require('../../assets/images/car.jpg'),
  },
  {
    id: '3',
    title: 'Nissan GTR R35',
    price: '$56,000',
    priceNum: 56000,
    location: 'Galle, Sri Lanka',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    userPhone: '+94 77 345 6789',
    views: 2100,
    likes: 150,
    messages: 60,
    status: 'rejected',
    postedDate: '2024-12-03',
    expiryDate: '2025-01-03',
    description: 'High-performance sports car. Modified with aftermarket parts.',
    mileage: '28,000 km',
    year: 2020,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: require('../../assets/images/car.jpg'),
  },
  {
    id: '4',
    title: 'Toyota Supra 2020',
    price: '$50,000',
    priceNum: 50000,
    location: 'Kandy, Sri Lanka',
    userName: 'Sarah Williams',
    userEmail: 'sarah@example.com',
    userPhone: '+94 77 456 7890',
    views: 900,
    likes: 25,
    messages: 10,
    status: 'active',
    postedDate: '2024-12-02',
    expiryDate: '2025-01-02',
    description: 'Iconic sports car in excellent condition. Low mileage, well maintained.',
    mileage: '15,000 km',
    year: 2020,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    image: require('../../assets/images/car.jpg'),
  },
  {
    id: '5',
    title: 'Honda Civic Type R',
    price: '$38,000',
    priceNum: 38000,
    location: 'Negombo, Sri Lanka',
    userName: 'David Brown',
    userEmail: 'david@example.com',
    userPhone: '+94 77 567 8901',
    views: 680,
    likes: 20,
    messages: 7,
    status: 'pending',
    postedDate: '2024-12-01',
    expiryDate: '2025-01-01',
    description: 'Hot hatch with aggressive styling. Perfect for enthusiasts.',
    mileage: '22,000 km',
    year: 2021,
    fuelType: 'Petrol',
    transmission: 'Manual',
    image: require('../../assets/images/car.jpg'),
  },
  {
    id: '6',
    title: 'Audi A4 2022',
    price: '$48,000',
    priceNum: 48000,
    location: 'Gampaha, Sri Lanka',
    userName: 'Emily Davis',
    userEmail: 'emily@example.com',
    userPhone: '+94 77 678 9012',
    views: 1500,
    likes: 75,
    messages: 22,
    status: 'expired',
    postedDate: '2024-11-28',
    expiryDate: '2024-12-28',
    description: 'Premium sedan with advanced technology. Comfortable and efficient.',
    mileage: '18,000 km',
    year: 2022,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    image: require('../../assets/images/car.jpg'),
  },
];




import { Alert } from 'react-native';

export default function AdminAdsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [ads, setAds] = useState<Ad[]>(ADMIN_ADS_DATA);
  const [selectedStatus, setSelectedStatus] = useState<AdStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'price'>('date');
  const [showSortModal, setShowSortModal] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('Ads');

  const filteredAds = React.useMemo(() => {
    return ads.filter(ad => {
      const statusMatch = selectedStatus === 'all' || ad.status === selectedStatus;
      const searchMatch = !searchQuery || 
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    }).sort((a, b) => {
      if (sortBy === 'date') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'price') return b.priceNum - a.priceNum;
      return 0;
    });
  }, [selectedStatus, searchQuery, sortBy]);

  const getStatusCount = (status: AdStatus) => {
    if (status === 'all') return ads.length;
    return ads.filter(ad => ad.status === status).length;
  };

  const toggleSelectAd = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleApprove = useCallback((id: string) => {
    Alert.alert(
      "Approve Ad",
      "Are you sure you want to approve this ad?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'active' } : ad));
          }
        }
      ]
    );
  }, []);

  const handleReject = useCallback((id: string) => {
    Alert.alert(
      "Reject Ad",
      "Are you sure you want to reject this ad?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject", 
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'rejected' } : ad));
          }
        }
      ]
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert(
      "Delete Ad",
      "Are you sure you want to permanently delete this ad?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setAds(prev => prev.filter(ad => ad.id !== id));
            setSelectedAds(prev => prev.filter(selectedId => selectedId !== id));
          }
        }
      ]
    );
  }, []);

  const handleView = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    console.log('View:', id);
    // TODO: Navigate to detail
  }, []);

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selectedAds.length === filteredAds.length && filteredAds.length > 0) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map(ad => ad.id));
    }
  };

  const handleBulkApprove = useCallback(() => {
    Alert.alert(
      "Bulk Approve",
      `Approve ${selectedAds.length} ads?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve All", 
          onPress: () => {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
             setAds(prev => prev.map(ad => selectedAds.includes(ad.id) ? { ...ad, status: 'active' } : ad));
             setSelectedAds([]);
          }
        }
      ]
    );
  }, [selectedAds]);

  const handleBulkReject = useCallback(() => {
    Alert.alert(
      "Bulk Reject",
      `Reject ${selectedAds.length} ads?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Reject All", 
          style: "destructive",
          onPress: () => {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
             setAds(prev => prev.map(ad => selectedAds.includes(ad.id) ? { ...ad, status: 'rejected' } : ad));
             setSelectedAds([]);
          }
        }
      ]
    );
  }, [selectedAds]);

  const handleBulkDelete = useCallback(() => {
    Alert.alert(
      "Bulk Delete",
      `Delete ${selectedAds.length} ads?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete All", 
          style: "destructive",
          onPress: () => {
             Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
             setAds(prev => prev.filter(ad => !selectedAds.includes(ad.id)));
             setSelectedAds([]);
          }
        }
      ]
    );
  }, [selectedAds]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderStatCard = (filter: typeof STATUS_FILTERS[0]) => {
    const count = getStatusCount(filter.key as AdStatus);
    const isActive = selectedStatus === filter.key;

    return (
      <TouchableOpacity
        key={filter.key}
        style={[styles.statCard, isActive && styles.statCardActive]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setSelectedStatus(filter.key as AdStatus);
        }}
        activeOpacity={0.7}
      >
        {isActive && (
          <LinearGradient
            colors={[filter.gradient[0], filter.gradient[1]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCardGradient}
          />
        )}
        <View style={styles.statCardContent}>
          <View style={[styles.statIconContainer, { backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${filter.color}15` }]}>
            <Ionicons name={filter.icon as any} size={20} color={isActive ? '#fff' : filter.color} />
          </View>
          <Text style={[styles.statCount, isActive && styles.statCountActive]}>{count}</Text>
          <Text style={[styles.statLabel, isActive && styles.statLabelActive]}>{filter.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAdCard = useCallback(({ item, index }: { item: Ad; index: number }) => {
    return (
      <AdCard
        item={item}

        isSelected={selectedAds.includes(item.id)}
        isLast={index === filteredAds.length - 1}
        onToggleSelect={toggleSelectAd}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
      />
    );
  }, [selectedAds, filteredAds.length, toggleSelectAd, handleView, handleApprove, handleReject, handleDelete]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* ProfileHeader */}
      <ProfileHeader title="Ads Management" showProfileCard={false} />

      {/* Search Bar - Enhanced */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={22} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads, users, locations..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text.slice(0, 50))}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          style={styles.sortButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="funnel-outline" size={22} color="#235CF8" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScrollContent}
        style={styles.statsScroll}
      >
        {STATUS_FILTERS.map(renderStatCard)}
      </ScrollView>

      {/* Bulk Actions Bar */}
      {selectedAds.length > 0 && (
        <View style={styles.bulkActionsBar}>
          <View style={styles.bulkActionsLeft}>
            <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
              <Ionicons 
                name={selectedAds.length === filteredAds.length ? "checkbox" : "square-outline"} 
                size={20} 
                color="#235CF8" 
              />
              <Text style={styles.bulkActionsText}>{selectedAds.length} selected</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bulkActionsRight}>
            <TouchableOpacity style={styles.bulkActionButton} onPress={handleBulkApprove}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bulkActionButton} onPress={handleBulkReject}>
              <Ionicons name="close-circle-outline" size={20} color="#F59E0B" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bulkActionButton} onPress={handleBulkDelete}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Ads List */}
      {loading ? (
        <ScrollView 
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        >
          {[1, 2, 3, 4, 5].map((key) => (
            <SkeletonAdCard key={key} />
          ))}
        </ScrollView>
      ) : (
        <FlatList
        data={filteredAds}
        renderItem={renderAdCard}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        // Performance optimizations
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        updateCellsBatchingPeriod={50}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#235CF8"
            colors={['#235CF8']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No ads found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search query</Text>
          </View>
        }
      />
      )}

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
        <LinearGradient
          colors={["#FFFFFF", "#FAFBFC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomNavGradient}
        />
        <TouchableOpacity
          style={[styles.bottomNavItem, activeNavTab === "Dashboard" && styles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Dashboard");
            router.push("/admin");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Dashboard" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomNavActiveIndicator}
              />
            </>
          )}
          <Ionicons
            name={activeNavTab === "Dashboard" ? "grid" : "grid-outline"}
            size={24}
            color={activeNavTab === "Dashboard" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeNavTab === "Dashboard" && styles.bottomNavLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomNavItem, activeNavTab === "Ads" && styles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Ads");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Ads" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomNavActiveIndicator}
              />
            </>
          )}
          <Ionicons
            name={activeNavTab === "Ads" ? "car" : "car-outline"}
            size={24}
            color={activeNavTab === "Ads" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[styles.bottomNavLabel, activeNavTab === "Ads" && styles.bottomNavLabelActive]}
          >
            Ads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomNavItem, activeNavTab === "Users" && styles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Users");
            console.log("Users clicked");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Users" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomNavActiveIndicator}
              />
            </>
          )}
          <Ionicons
            name={activeNavTab === "Users" ? "people" : "people-outline"}
            size={24}
            color={activeNavTab === "Users" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[styles.bottomNavLabel, activeNavTab === "Users" && styles.bottomNavLabelActive]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomNavItem, activeNavTab === "Analytics" && styles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Analytics");
            console.log("Analytics clicked");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Analytics" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomNavActiveIndicator}
              />
            </>
          )}
          <Ionicons
            name={activeNavTab === "Analytics" ? "bar-chart" : "bar-chart-outline"}
            size={24}
            color={activeNavTab === "Analytics" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeNavTab === "Analytics" && styles.bottomNavLabelActive,
            ]}
          >
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bottomNavItem, activeNavTab === "Settings" && styles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Settings");
            console.log("Settings clicked");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Settings" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomNavActiveIndicator}
              />
            </>
          )}
          <Ionicons
            name={activeNavTab === "Settings" ? "settings" : "settings-outline"}
            size={24}
            color={activeNavTab === "Settings" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              styles.bottomNavLabel,
              activeNavTab === "Settings" && styles.bottomNavLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModal}>
            <Text style={styles.sortModalTitle}>Sort By</Text>
            {[
              { key: 'date', label: 'Date Posted', icon: 'calendar-outline' },
              { key: 'views', label: 'Most Viewed', icon: 'eye-outline' },
              { key: 'price', label: 'Price (High to Low)', icon: 'cash-outline' },
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[styles.sortOption, sortBy === option.key && styles.sortOptionActive]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSortBy(option.key as any);
                  setShowSortModal(false);
                }}
              >
                <Ionicons name={option.icon as any} size={20} color={sortBy === option.key ? '#235CF8' : '#6B7280'} />
                <Text style={[styles.sortOptionText, sortBy === option.key && styles.sortOptionTextActive]}>
                  {option.label}
                </Text>
                {sortBy === option.key && <Ionicons name="checkmark" size={20} color="#235CF8" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minHeight: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    marginLeft: 12,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  sortButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#235CF8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsScroll: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 14,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    minWidth: 115,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardActive: {
    borderColor: 'transparent',
    transform: [{ scale: 1.05 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statCardContent: {
    padding: 18,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statCountActive: {
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  statLabelActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  bulkActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  bulkActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bulkActionsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#235CF8',
  },
  bulkActionsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 20,
    paddingBottom: 20,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    paddingTop: 10,
    zIndex: 100,
    overflow: 'hidden',
  },
  bottomNavGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    minHeight: 56,
  },
  bottomNavItemActive: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    marginHorizontal: 4,
  },
  bottomNavActiveIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    borderRadius: 2,
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 4,
  },
  bottomNavLabelActive: {
    color: '#235CF8',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sortModal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sortModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  sortOptionActive: {
    backgroundColor: '#EEF2FF',
  },
  sortOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  sortOptionTextActive: {
    color: '#235CF8',
  },
});
