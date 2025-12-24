import ProfileHeader from "@/components/ProfileHeader";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminBottomNav from "./components/AdminBottomNav";
import { Ad, ADMIN_ADS_DATA, AdStatus } from "./data/adminAds";

type SortOption = "date" | "views" | "price";

export default function AdminAdsScreen() {
  const insets = useSafeAreaInsets();

  // State
  const [ads, setAds] = useState<Ad[]>(ADMIN_ADS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAds, setSelectedAds] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedStatus, setSelectedStatus] = useState<AdStatus>("all");

  // Stats
  const stats = {
    total: ads.length,
    active: ads.filter((ad) => ad.status === "active").length,
    pending: ads.filter((ad) => ad.status === "pending").length,
    rejected: ads.filter((ad) => ad.status === "rejected").length,
  };

  // Filtered ads
  const filteredAds = React.useMemo(() => {
    return ads
      .filter((ad) => {
        const statusMatch = selectedStatus === "all" || ad.status === selectedStatus;
        const searchMatch =
          !searchQuery ||
          ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.location.toLowerCase().includes(searchQuery.toLowerCase());
        return statusMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "price") return b.priceNum - a.priceNum;
        return 0;
      });
  }, [ads, selectedStatus, searchQuery, sortBy]);

  // Handlers
  const toggleSelectAd = useCallback((id: string) => {
    setSelectedAds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = () => {
    if (selectedAds.length === filteredAds.length && filteredAds.length > 0) {
      setSelectedAds([]);
    } else {
      setSelectedAds(filteredAds.map((ad) => ad.id));
    }
  };

  const handleApprove = useCallback((id: string) => {
    Alert.alert("Approve Ad", "Approve this ad?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setAds((prev) =>
            prev.map((ad) => (ad.id === id ? { ...ad, status: "active" } : ad))
          );
        },
      },
    ]);
  }, []);

  const handleReject = useCallback((id: string) => {
    Alert.alert("Reject Ad", "Reject this ad?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setAds((prev) =>
            prev.map((ad) => (ad.id === id ? { ...ad, status: "rejected" } : ad))
          );
        },
      },
    ]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete Ad", "Permanently delete this ad?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setAds((prev) => prev.filter((ad) => ad.id !== id));
          setSelectedAds((prev) => prev.filter((sid) => sid !== id));
        },
      },
    ]);
  }, []);

  const handleBulkAction = (action: "approve" | "reject" | "delete") => {
    const count = selectedAds.length;
    if (count === 0) return;

    if (action === "delete") {
      Alert.alert("Bulk Delete", `Delete ${count} ad${count > 1 ? "s" : ""}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setAds((prev) => prev.filter((ad) => !selectedAds.includes(ad.id)));
            setSelectedAds([]);
          },
        },
      ]);
    } else if (action === "approve") {
      setAds((prev) =>
        prev.map((ad) =>
          selectedAds.includes(ad.id) ? { ...ad, status: "active" } : ad
        )
      );
      setSelectedAds([]);
    } else {
      setAds((prev) =>
        prev.map((ad) =>
          selectedAds.includes(ad.id) ? { ...ad, status: "rejected" } : ad
        )
      );
      setSelectedAds([]);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "rejected":
        return "#EF4444";
      case "expired":
        return "#94A3B8";
      default:
        return "#64748B";
    }
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case "views":
        return "eye";
      case "price":
        return "cash";
      default:
        return "calendar";
    }
  };

  const renderAdCard = ({ item }: { item: Ad }) => (
    <View style={styles.adCard}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          toggleSelectAd(item.id);
        }}
      >
        <Ionicons
          name={selectedAds.includes(item.id) ? "checkbox" : "square-outline"}
          size={24}
          color={selectedAds.includes(item.id) ? "#3B82F6" : "#CBD5E1"}
        />
      </TouchableOpacity>

      <View style={styles.adContent}>
        <Image source={item.image} style={styles.adImage} />
        <View style={styles.adInfo}>
          <Text style={styles.adTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.adPrice}>{item.price}</Text>
          <View style={styles.adMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="person" size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{item.userName}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location" size={12} color="#94A3B8" />
              <Text style={styles.metaText}>{item.location}</Text>
            </View>
          </View>
          <View style={styles.adStats}>
            <View style={styles.statBadge}>
              <Ionicons name="eye" size={14} color="#64748B" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <View style={styles.statBadge}>
              <Ionicons name="heart" size={14} color="#64748B" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor(item.status)}20` },
              ]}
            >
              <Text
                style={[styles.statusText, { color: getStatusColor(item.status) }]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.adActions}>
        {item.status === "pending" && (
          <>
            <TouchableOpacity
              style={[styles.actionBtn, styles.approveBtn]}
              onPress={() => handleApprove(item.id)}
            >
              <Ionicons name="checkmark-circle" size={16} color="#059669" />
              <Text style={styles.approveText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.rejectBtn]}
              onPress={() => handleReject(item.id)}
            >
              <Ionicons name="close-circle" size={16} color="#DC2626" />
              <Text style={styles.rejectText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status !== "pending" && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={16} color="#DC2626" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Ads Management" showProfileCard={false} />

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="car" size={20} color="#3B82F6" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{stats.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="time" size={20} color="#F59E0B" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>
      </View>

      {/* Search & Sort */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ads..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.sortBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setSortBy((prev) =>
              prev === "date" ? "views" : prev === "views" ? "price" : "date"
            );
          }}
        >
          <Ionicons name={getSortIcon()} size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          {(["all", "active", "pending", "rejected", "expired"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterTab,
                selectedStatus === status && styles.filterTabActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedStatus(status);
              }}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedStatus === status && styles.filterTabTextActive,
                ]}
              >
                {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bulk Actions */}
      {selectedAds.length > 0 && (
        <View style={styles.bulkBar}>
          <TouchableOpacity onPress={handleSelectAll} style={styles.bulkSelectAll}>
            <Ionicons
              name={
                selectedAds.length === filteredAds.length
                  ? "checkbox"
                  : "square-outline"
              }
              size={20}
              color="#3B82F6"
            />
            <Text style={styles.bulkText}>{selectedAds.length} selected</Text>
          </TouchableOpacity>
          <View style={styles.bulkActions}>
            <TouchableOpacity
              onPress={() => handleBulkAction("approve")}
              style={styles.bulkActionBtn}
            >
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleBulkAction("reject")}
              style={styles.bulkActionBtn}
            >
              <Ionicons name="close-circle" size={18} color="#F59E0B" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleBulkAction("delete")}
              style={styles.bulkActionBtn}
            >
              <Ionicons name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredAds.length} {filteredAds.length === 1 ? "ad" : "ads"} found
        </Text>
      </View>

      {/* Ads List */}
      <FlatList
        data={filteredAds}
        renderItem={renderAdCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="car-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No ads found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      />

      <AdminBottomNav insetBottom={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "#fff",
  },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    gap: 10,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500",
  },
  searchSection: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  sortBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  filterSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterTabs: {
    flexDirection: "row",
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
  },
  filterTabActive: {
    backgroundColor: "#3B82F6",
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  filterTabTextActive: {
    color: "#fff",
  },
  bulkBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#EFF6FF",
    borderBottomWidth: 1,
    borderBottomColor: "#DBEAFE",
  },
  bulkSelectAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  bulkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  bulkActions: {
    flexDirection: "row",
    gap: 8,
  },
  bulkActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  adCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  checkbox: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  adContent: {
    flexDirection: "row",
    padding: 14,
    paddingRight: 48,
    gap: 12,
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
  },
  adInfo: {
    flex: 1,
  },
  adTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  adPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3B82F6",
    marginBottom: 6,
  },
  adMeta: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  adStats: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  adActions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 10,
    gap: 5,
  },
  approveBtn: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  rejectBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  approveText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#059669",
  },
  rejectText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  deleteText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
    marginTop: 16,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94A3B8",
  },
});
