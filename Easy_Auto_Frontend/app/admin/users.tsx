import ProfileHeader from "@/components/ProfileHeader";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminBottomNav from "./components/AdminBottomNav";
import UserCard from "./components/UserCard";
import { ADMIN_USERS_DATA, User, USER_STATS, UserRole, UserStatus } from "./data/adminUsers";

type SortOption = "date" | "ads" | "revenue" | "name";

export default function AdminUsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State
  const [users, setUsers] = useState<User[]>(ADMIN_USERS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "all">("all");

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    return users
      .filter((user) => {
        const roleMatch = selectedRole === "all" || user.role === selectedRole;
        const statusMatch = selectedStatus === "all" || user.status === selectedStatus;
        const searchMatch =
          !searchQuery ||
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.phone.includes(searchQuery);
        return roleMatch && statusMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === "date")
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime();
        if (sortBy === "ads") return b.adsPosted - a.adsPosted;
        if (sortBy === "revenue") return b.totalRevenue - a.totalRevenue;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [users, selectedRole, selectedStatus, searchQuery, sortBy]);

  // Handlers
  const toggleSelectUser = useCallback((id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSuspend = useCallback((id: string) => {
    Alert.alert("Suspend User", "Are you sure you want to suspend this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Suspend",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: "suspended" as UserStatus } : u))
          );
        },
      },
    ]);
  }, []);

  const handleActivate = useCallback((id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "active" as UserStatus } : u))
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert("Delete User", "Are you sure you want to permanently delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setUsers((prev) => prev.filter((u) => u.id !== id));
          setSelectedUsers((prev) => prev.filter((sid) => sid !== id));
        },
      },
    ]);
  }, []);

  const handleViewDetails = useCallback((id: string) => {
    console.log("View user details:", id);
  }, []);

  // Bulk actions
  const handleBulkAction = (action: "suspend" | "activate" | "delete") => {
    const count = selectedUsers.length;
    if (count === 0) return;

    if (action === "delete") {
      Alert.alert("Bulk Delete", `Delete ${count} user${count > 1 ? "s" : ""}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setUsers((prev) => prev.filter((u) => !selectedUsers.includes(u.id)));
            setSelectedUsers([]);
          },
        },
      ]);
    } else if (action === "suspend") {
      Alert.alert("Bulk Suspend", `Suspend ${count} user${count > 1 ? "s" : ""}?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Suspend",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            setUsers((prev) =>
              prev.map((u) =>
                selectedUsers.includes(u.id) ? { ...u, status: "suspended" as UserStatus } : u
              )
            );
            setSelectedUsers([]);
          },
        },
      ]);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setUsers((prev) =>
        prev.map((u) =>
          selectedUsers.includes(u.id) ? { ...u, status: "active" as UserStatus } : u
        )
      );
      setSelectedUsers([]);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const renderUserCard = useCallback(
    ({ item }: { item: User }) => (
      <UserCard
        user={item}
        isSelected={selectedUsers.includes(item.id)}
        onToggleSelect={toggleSelectUser}
        onSuspend={handleSuspend}
        onActivate={handleActivate}
        onDelete={handleDelete}
        onViewDetails={handleViewDetails}
      />
    ),
    [selectedUsers, toggleSelectUser, handleSuspend, handleActivate, handleDelete, handleViewDetails]
  );

  const getSortIcon = () => {
    switch (sortBy) {
      case "name": return "text";
      case "ads": return "car";
      case "revenue": return "cash";
      default: return "calendar";
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="User Management" showProfileCard={false} />

      {/* Stats Overview */}
      <View style={styles.statsOverview}>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#DBEAFE" }]}>
            <Ionicons name="people" size={20} color="#3B82F6" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{USER_STATS.total}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#D1FAE5" }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{USER_STATS.active}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="star" size={20} color="#F59E0B" />
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statValue}>{USER_STATS.premium}</Text>
            <Text style={styles.statLabel}>Premium</Text>
          </View>
        </View>
      </View>

      {/* Search & Sort */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or email..."
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
            setSortBy((prev) => {
              if (prev === "date") return "name";
              if (prev === "name") return "ads";
              if (prev === "ads") return "revenue";
              return "date";
            });
          }}
        >
          <Ionicons name={getSortIcon()} size={18} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <View style={styles.filterTabs}>
          {(["all", "admin", "premium", "user"] as const).map((role) => (
            <TouchableOpacity
              key={role}
              style={[styles.filterTab, selectedRole === role && styles.filterTabActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedRole(role);
              }}
            >
              <Text style={[styles.filterTabText, selectedRole === role && styles.filterTabTextActive]}>
                {role === "all" ? "All" : role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterTabs}>
          {(["all", "active", "pending", "suspended"] as const).map((status) => (
            <TouchableOpacity
              key={status}
              style={[styles.filterChip, selectedStatus === status && styles.filterChipActive]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedStatus(status);
              }}
            >
              <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextActive]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <View style={styles.bulkBar}>
          <TouchableOpacity onPress={handleSelectAll} style={styles.bulkSelectAll}>
            <Ionicons name={selectedUsers.length === filteredUsers.length ? "checkbox" : "square-outline"} size={20} color="#3B82F6" />
            <Text style={styles.bulkText}>{selectedUsers.length} selected</Text>
          </TouchableOpacity>
          <View style={styles.bulkActions}>
            <TouchableOpacity onPress={() => handleBulkAction("activate")} style={styles.bulkActionBtn}>
              <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleBulkAction("suspend")} style={styles.bulkActionBtn}>
              <Ionicons name="ban" size={18} color="#F59E0B" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleBulkAction("delete")} style={styles.bulkActionBtn}>
              <Ionicons name="trash" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results Info */}
      <View style={styles.resultsInfo}>
        <Text style={styles.resultsText}>
          {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} found
        </Text>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your filters or search</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
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
  statsOverview: {
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
    gap: 10,
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
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#F0F9FF",
    borderColor: "#3B82F6",
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
  },
  filterChipTextActive: {
    color: "#3B82F6",
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
