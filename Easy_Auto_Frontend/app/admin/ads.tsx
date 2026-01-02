import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ad, AdStatus } from "@/types/ad.types";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
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
import AdCard from "../../components/admin/AdCard";
import SkeletonAdCard from "../../components/admin/SkeletonAdCard";
import { STATUS_FILTERS } from "../../constants/ads";

const ADMIN_ADS_DATA: Ad[] = [
  {
    id: "1",
    title: "BMW 3 Series 2021",
    price: "$45,000",
    priceNum: 45000,
    location: "Malabe, Sri Lanka",
    userName: "John Doe",
    userEmail: "john@example.com",
    userPhone: "+94 77 123 4567",
    views: 1200,
    likes: 50,
    messages: 15,
    status: "pending",
    postedDate: "2024-12-05",
    expiryDate: "2025-01-05",
    description:
      "Well-maintained BMW 3 Series with full service history. Single owner, accident-free.",
    mileage: "45,000 km",
    year: 2021,
    fuelType: "Petrol",
    transmission: "Automatic",
    image: require("../../assets/images/car.jpg"),
  },
  {
    id: "2",
    title: "Mercedes-Benz C-Class",
    price: "$52,000",
    priceNum: 52000,
    location: "Colombo, Sri Lanka",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    userPhone: "+94 77 234 5678",
    views: 850,
    likes: 32,
    messages: 8,
    status: "active",
    postedDate: "2024-12-04",
    expiryDate: "2025-01-04",
    description:
      "Luxury sedan in pristine condition. Premium features and excellent performance.",
    mileage: "32,000 km",
    year: 2022,
    fuelType: "Diesel",
    transmission: "Automatic",
    image: require("../../assets/images/car.jpg"),
  },
];

export default function AdminAdsScreen() {
  const insets = useSafeAreaInsets();

  // State
  const [ads, setAds] = useState<Ad[]>(ADMIN_ADS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedStatus, setSelectedStatus] = useState<AdStatus>("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const filteredAds = React.useMemo(() => {
    return ads.filter((ad) => {
      const statusMatch =
        selectedStatus === "all" || ad.status === selectedStatus;
      const searchMatch =
        !searchQuery ||
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.location.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [selectedStatus, searchQuery, ads]);

  // Filtered ads
  const filteredAds = React.useMemo(() => {
    return ads
      .filter((ad) => {
        const statusMatch =
          selectedStatus === "all" || ad.status === selectedStatus;
        const searchMatch =
          !searchQuery ||
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.location.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return (
            new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
          );
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "price") return b.priceNum - a.priceNum;
        return 0;
      });
  }, [ads, selectedStatus, searchQuery, sortBy]);

  // Handlers
  const toggleSelectAd = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleApprove = (id: string) => {
    Alert.alert("Approve Ad", "Approve this listing?", [
      { text: "Cancel" },
      {
        text: "Approve",
        onPress: () =>
          setAds((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "active" } : a))
          ),
      },
    ]);
  };

  const handleReject = (id: string) => {
    Alert.alert("Reject Ad", "Reject this listing?", [
      { text: "Cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () =>
          setAds((prev) =>
            prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
          ),
      },
    ]);
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Ad", "Delete this listing permanently?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setAds((prev) => prev.filter((a) => a.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons
            name="car-sport-outline"
            size={22}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.subHeaderTitle}>Ads Management</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color={COLORS.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.text.muted}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              selectedStatus === f.key && { backgroundColor: COLORS.primary },
            ]}
            onPress={() => setSelectedStatus(f.key as AdStatus)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === f.key && { color: COLORS.white },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.listContent}>
          <SkeletonAdCard />
          <SkeletonAdCard />
        </View>
      ) : (
        <FlatList
          data={filteredAds}
          renderItem={({ item, index }) => (
            <AdCard
              item={item}
              isSelected={selectedAds.includes(item.id)}
              isLast={index === filteredAds.length - 1}
              onToggleSelect={toggleSelectAd}
              onView={() => {}}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => setRefreshing(false)}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      {/* Admin Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => router.push("/admin")}
        >
          <Ionicons name="grid-outline" size={24} color={COLORS.text.muted} />
          <Text style={styles.bottomNavLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => {}}>
          <Ionicons name="car" size={24} color={COLORS.primary} />
          <Text
            style={[
              styles.bottomNavLabel,
              { color: COLORS.primary, fontWeight: "700" },
            ]}
          >
            Ads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => {}}>
          <Ionicons name="people-outline" size={24} color={COLORS.text.muted} />
          <Text style={styles.bottomNavLabel}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => {}}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={COLORS.text.muted}
          />
          <Text style={styles.bottomNavLabel}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background,
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 15,
    color: COLORS.text.primary,
  },
  filtersScroll: {
    maxHeight: 50,
    marginBottom: 10,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.divider,
    justifyContent: "center",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text.muted,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    paddingTop: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomNavLabel: {
    fontSize: 10,
    color: COLORS.text.muted,
    marginTop: 4,
  },
});
