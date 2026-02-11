import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { User } from "../data/adminUsers";

interface UserCardProps {
  user: User;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSuspend: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export default function UserCard({
  user,
  isSelected,
  onToggleSelect,
  onSuspend,
  onActivate,
  onDelete,
  onViewDetails,
}: UserCardProps) {
  const [imageError, setImageError] = useState(false);

  const getRoleConfig = () => {
    switch (user.role) {
      case "admin":
        return { color: "#8B5CF6", bg: "#F3E8FF", label: "ADMIN" };
      case "premium":
        return { color: "#F59E0B", bg: "#FEF3C7", label: "PREMIUM" };
      default:
        return { color: "#3B82F6", bg: "#DBEAFE", label: "USER" };
    }
  };

  const getStatusConfig = () => {
    switch (user.status) {
      case "active":
        return { color: "#10B981", label: "Active" };
      case "suspended":
        return { color: "#EF4444", label: "Suspended" };
      default:
        return { color: "#F59E0B", label: "Pending" };
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const roleConfig = getRoleConfig();
  const statusConfig = getStatusConfig();

  return (
    <View style={styles.cardWrapper}>
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {/* Selection Checkbox - Top Right */}
        <TouchableOpacity
          style={styles.checkboxBtn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onToggleSelect(user.id);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isSelected ? "checkbox" : "square-outline"}
            size={24}
            color={isSelected ? "#235CF8" : "#CBD5E1"}
          />
        </TouchableOpacity>

        {/* Card Content - Tappable */}
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onViewDetails(user.id);
          }}
          activeOpacity={0.95}
        >
          <View style={styles.cardContent}>
            {/* Row 1: Avatar + User Info */}
            <View style={styles.topSection}>
              {/* Avatar */}
              <View style={styles.avatarWrapper}>
                {imageError ? (
                  <View style={[styles.avatar, styles.avatarError]}>
                    <Ionicons name="person" size={24} color="#94A3B8" />
                  </View>
                ) : (
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.avatar}
                    onError={() => setImageError(true)}
                  />
                )}
                {user.verified && (
                  <View style={styles.verifiedIcon}>
                    <Ionicons name="checkmark" size={8} color="#fff" />
                  </View>
                )}
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: statusConfig.color },
                  ]}
                />
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                <View style={styles.nameSection}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <View
                    style={[styles.rolePill, { backgroundColor: roleConfig.bg }]}
                  >
                    <Text
                      style={[styles.roleLabel, { color: roleConfig.color }]}
                    >
                      {roleConfig.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.userEmail} numberOfLines={1}>
                  {user.email}
                </Text>
                <View style={styles.quickInfo}>
                  <View style={styles.quickInfoItem}>
                    <Ionicons name="location" size={11} color="#94A3B8" />
                    <Text style={styles.quickInfoText} numberOfLines={1}>
                      {user.location}
                    </Text>
                  </View>
                  <View style={styles.quickInfoDot} />
                  <Text style={styles.quickInfoText}>{user.lastActive}</Text>
                </View>
              </View>
            </View>

            {/* Row 2: Stats */}
            <View style={styles.statsSection}>
              <View style={styles.statColumn}>
                <View style={styles.statIcon}>
                  <Ionicons name="car" size={14} color="#64748B" />
                </View>
                <View style={styles.statDetails}>
                  <Text style={styles.statValue}>{user.adsPosted}</Text>
                  <Text style={styles.statLabel}>Ads</Text>
                </View>
              </View>
              <View style={styles.statColumn}>
                <View style={styles.statIcon}>
                  <Ionicons name="cash" size={14} color="#64748B" />
                </View>
                <View style={styles.statDetails}>
                  <Text style={styles.statValue}>
                    Rs {formatNumber(user.totalRevenue)}
                  </Text>
                  <Text style={styles.statLabel}>Revenue</Text>
                </View>
              </View>
            </View>

            {/* Row 3: Actions */}
            <View style={styles.actionsSection}>
              {user.status === "active" ? (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.suspendBtn]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onSuspend(user.id);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="ban" size={15} color="#DC2626" />
                  <Text style={styles.suspendText}>Suspend</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.activateBtn]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onActivate(user.id);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark-circle" size={15} color="#059669" />
                  <Text style={styles.activateText}>Activate</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionBtn, styles.deleteBtn]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onDelete(user.id);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="trash" size={15} color="#DC2626" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: {
    borderColor: "#3B82F6",
    borderWidth: 2,
    backgroundColor: "#F0F9FF",
  },
  checkboxBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  cardContent: {
    padding: 14,
    paddingRight: 48,
  },
  topSection: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F1F5F9",
  },
  avatarError: {
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedIcon: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  statusIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userInfo: {
    flex: 1,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
    marginRight: 8,
  },
  rolePill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 5,
  },
  roleLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
  },
  quickInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 6,
    maxWidth: "50%",
  },
  quickInfoText: {
    fontSize: 11,
    color: "#94A3B8",
    marginLeft: 3,
  },
  quickInfoDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
    marginHorizontal: 6,
  },
  statsSection: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 10,
  },
  statColumn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  statDetails: {
    flex: 1,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 1,
  },
  statLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  actionsSection: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    borderRadius: 9,
    gap: 5,
  },
  suspendBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  activateBtn: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  deleteBtn: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  suspendText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },
  activateText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
  },
  deleteText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },
});
