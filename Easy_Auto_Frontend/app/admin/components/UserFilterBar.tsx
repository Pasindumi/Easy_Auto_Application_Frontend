import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { UserRole, UserStatus } from "../data/adminUsers";

interface FilterOption {
  key: UserRole | UserStatus | "all";
  label: string;
  icon: string;
  color: string;
  gradient: [string, string];
}

interface UserFilterBarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  getCount: (filter: string) => number;
  filterType: "role" | "status";
}

const ROLE_FILTERS: FilterOption[] = [
  {
    key: "all",
    label: "All Roles",
    icon: "people",
    color: "#6B7280",
    gradient: ["#6B7280", "#4B5563"],
  },
  {
    key: "admin",
    label: "Admins",
    icon: "shield-checkmark",
    color: "#8B5CF6",
    gradient: ["#8B5CF6", "#7C3AED"],
  },
  {
    key: "premium",
    label: "Premium",
    icon: "star",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#D97706"],
  },
  {
    key: "user",
    label: "Users",
    icon: "person",
    color: "#3B82F6",
    gradient: ["#3B82F6", "#2563EB"],
  },
];

const STATUS_FILTERS: FilterOption[] = [
  {
    key: "all",
    label: "All",
    icon: "apps",
    color: "#6B7280",
    gradient: ["#6B7280", "#4B5563"],
  },
  {
    key: "active",
    label: "Active",
    icon: "checkmark-circle",
    color: "#10B981",
    gradient: ["#10B981", "#059669"],
  },
  {
    key: "pending",
    label: "Pending",
    icon: "time",
    color: "#F59E0B",
    gradient: ["#F59E0B", "#D97706"],
  },
  {
    key: "suspended",
    label: "Suspended",
    icon: "ban",
    color: "#EF4444",
    gradient: ["#EF4444", "#DC2626"],
  },
];

export default function UserFilterBar({
  selectedFilter,
  onFilterChange,
  getCount,
  filterType,
}: UserFilterBarProps) {
  const filters = filterType === "role" ? ROLE_FILTERS : STATUS_FILTERS;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {filters.map((filter) => {
        const count = getCount(filter.key);
        const isActive = selectedFilter === filter.key;

        return (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterCard, isActive && styles.filterCardActive]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onFilterChange(filter.key);
            }}
            activeOpacity={0.7}
          >
            {isActive && (
              <LinearGradient
                colors={filter.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.filterCardGradient}
              />
            )}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.2)"
                    : `${filter.color}15`,
                },
              ]}
            >
              <Ionicons
                name={filter.icon as any}
                size={18}
                color={isActive ? "#fff" : filter.color}
              />
            </View>
            <Text
              style={[styles.count, isActive && styles.countActive]}
            >
              {count}
            </Text>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    minWidth: 100,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  filterCardActive: {
    borderColor: "transparent",
    shadowOpacity: 0.15,
    elevation: 6,
  },
  filterCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    flexShrink: 0,
  },
  count: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: -0.5,
    flexShrink: 0,
  },
  countActive: {
    color: "#fff",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  labelActive: {
    color: "rgba(255,255,255,0.9)",
  },
});
