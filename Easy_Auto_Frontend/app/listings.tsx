// app/my-listings.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LISTINGS } from "@/constants/dummydata/listings"; // <- imported dummy data
import ListingCard from "../components/cards/ListingCard";
import Header from "../components/Header";
import styles from "../components/listingStyles";
import SearchBar from "../components/SearchBar";
import StatusCards from "../components/status/StatusCards";

export default function MyListingsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredListings = LISTINGS.filter((item) => {
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeCount = LISTINGS.filter((i) => i.status === "Active").length;
  const draftCount = LISTINGS.filter((i) => i.status === "Draft").length;
  const pausedCount = LISTINGS.filter((i) => i.status === "Paused").length;

  const onToggleSelect = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (selected.length === filteredListings.length && filteredListings.length > 0) setSelected([]);
    else setSelected(filteredListings.map((i) => i.id));
  };

  const handleEdit = (id: string) => router.push(`/ads/edit-car?id=${encodeURIComponent(id)}`);
  const handleBoost = (id: string) => router.push(`/packages/packages?id=${encodeURIComponent(id)}`);
  const handleShare = async (id: string) => {
    const item = LISTINGS.find((x) => x.id === id);
    if (!item) return;
    try {
      await Share.share({ message: `${item.title} — ${item.price}` });
    } catch (e) { }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const counts = { total: LISTINGS.length, active: activeCount, draft: draftCount, paused: pausedCount };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Text style={{ fontSize: 28 }}>🚗</Text>
      </View>
      <Text style={styles.emptyTitle}>{searchQuery ? "No listings found" : "No listings yet"}</Text>
      {!searchQuery && !filterStatus && (
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/cars/sell-car")}>
          <Text style={styles.emptyButtonText}>Create New Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Scrollable content after fixed header
  const renderScrollableContent = () => (
    <>
      {/* Boost Card */}
      <TouchableOpacity style={styles.boostCard} activeOpacity={0.9} onPress={() => router.push("/packages/packages")}>
        <View style={styles.boostIconWrapper}>
          <Text style={{ fontSize: 18, color: "#235CF8" }}>🚀</Text>
        </View>
        <View style={styles.boostContent}>
          <Text style={styles.boostTitle}>Boost Visibility</Text>
          <Text style={styles.boostDescription}>Promote top listing to reach more buyers</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "68%" }]} />
          </View>
        </View>
        <View style={styles.boostMeta}>
          <Text style={styles.boostPercent}>68%</Text>
        </View>
      </TouchableOpacity>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <View style={styles.bulkActionsBar}>
          <View style={styles.bulkActionsLeft}>
            <TouchableOpacity style={styles.bulkActionButton} onPress={() => setSelected([])}>
              <Text style={styles.bulkActionText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bulkActionButton, styles.bulkActionButtonDanger]} onPress={() => setSelected([])}>
              <Text style={[styles.bulkActionText, styles.bulkActionTextDanger]}>Delete</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => setSelected([])}>
            <Text style={{ fontSize: 16, color: "#6B7280" }}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Select All Row */}
      <TouchableOpacity style={styles.selectAllRow} onPress={handleSelectAll}>
        <View style={[styles.checkbox, selected.length === filteredListings.length && selected.length > 0 && styles.checkboxActive]}>
          {selected.length === filteredListings.length && selected.length > 0 && <Text style={{ color: "#fff" }}>✓</Text>}
        </View>
        <Text style={styles.selectAllText}>Select all</Text>
        {selected.length > 0 && <Text style={styles.selectedCount}>{selected.length} selected</Text>}
      </TouchableOpacity>

      {/* Listings */}
      <FlatList
        data={filteredListings}
        renderItem={({ item, index }) => (
          <ListingCard
            item={item}
            index={index}
            isSelected={selected.includes(item.id)}
            onToggleSelect={onToggleSelect}
            onEdit={handleEdit}
            onBoost={handleBoost}
            onShare={handleShare}
          />
        )}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={renderEmpty}
        scrollEnabled={false} // Prevent nested scroll
        showsVerticalScrollIndicator={false}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        {/* Fixed Top */}
        <Header />
        <View style={{ backgroundColor: "#fff" }}>
          <View style={localStyles.header}>
            <View style={localStyles.headerLeft}>
              <Ionicons name="layers-outline" size={22} color="#235CF8" style={{ marginRight: 6 }} />
              <Text style={localStyles.headerTitle}>My Listings</Text>
            </View>
          </View>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search listings..." />
          <StatusCards
            counts={counts}
            selectedFilter={filterStatus === null ? "all" : (filterStatus as any)}
            onSelect={(k) => setFilterStatus(k === "all" ? null : (k as any))}
          />
        </View>

        {/* Scrollable content */}
        <FlatList
          data={[{ key: "scrollable" }]} // dummy single item
          renderItem={renderScrollableContent}
          keyExtractor={(item) => item.key}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#235CF8" />}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 32 }}
        />
      </SafeAreaView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  header: { backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center" },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  headerTitle: { color: "#235CF8", fontSize: 18, fontWeight: "600" },
});
