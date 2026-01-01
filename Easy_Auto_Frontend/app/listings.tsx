import COLORS from "@/constants/Colors";
import { LISTINGS } from "@/constants/dummydata/listings";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
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
import ListingCard from "../components/cards/ListingCard";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StatusCards from "../components/status/StatusCards";
import { headerSectionStyles } from "../styles/headerSectionStyles";

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
        <Ionicons name="car-outline" size={48} color={COLORS.divider} />
      </View>
      <Text style={styles.emptyTitle}>{searchQuery ? "No listings found" : "No listings yet"}</Text>
      {!searchQuery && !filterStatus && (
        <TouchableOpacity style={styles.emptyButton} onPress={() => router.push("/cars/sell-car")}>
          <Text style={styles.emptyButtonText}>Create New Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderScrollableContent = () => (
    <>
      <TouchableOpacity style={styles.boostCard} activeOpacity={0.9} onPress={() => router.push("/packages/packages")}>
        <View style={styles.boostIconWrapper}>
          <Ionicons name="rocket-outline" size={18} color={COLORS.primary} />
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
            <Ionicons name="close" size={16} color={COLORS.text.muted} />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.selectAllRow} onPress={handleSelectAll}>
        <View style={[styles.checkbox, selected.length === filteredListings.length && selected.length > 0 && styles.checkboxActive]}>
          {selected.length === filteredListings.length && selected.length > 0 && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
        </View>
        <Text style={styles.selectAllText}>Select all</Text>
        {selected.length > 0 && <Text style={styles.selectedCount}>{selected.length} selected</Text>}
      </TouchableOpacity>

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
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="layers-outline" size={22} color={COLORS.primary} style={{ marginRight: 6 }} />
          <Text style={headerSectionStyles.headerTitle}>My Listings</Text>
        </View>
      </View>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search listings..." />
      <StatusCards
        counts={counts}
        selectedFilter={filterStatus === null ? "all" : (filterStatus as any)}
        onSelect={(k) => setFilterStatus(k === "all" ? null : (k as any))}
      />

      <FlatList
        data={[{ key: "scrollable" }]}
        renderItem={renderScrollableContent}
        keyExtractor={(item) => item.key}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  boostCard: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  boostIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  boostContent: {
    flex: 1,
  },
  boostTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  boostDescription: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginTop: 2,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 2,
    marginTop: 8,
    width: "80%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  boostMeta: {
    alignItems: "flex-end",
  },
  boostPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },

  bulkActionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
  },
  bulkActionsLeft: {
    flexDirection: "row",
    gap: 16,
  },
  bulkActionButton: {
    paddingVertical: 4,
  },
  bulkActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  bulkActionButtonDanger: {},
  bulkActionTextDanger: {
    color: COLORS.status.danger,
  },

  selectAllRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.divider,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  selectedCount: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginLeft: 8,
  },

  emptyContainer: {
    padding: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIconWrapper: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    color: COLORS.text.muted,
    fontWeight: "600",
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: "700",
  },
});
