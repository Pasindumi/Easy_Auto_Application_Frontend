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

export type AdStatus = "all" | "active" | "pending" | "rejected" | "expired";

interface StatusFilter {
  key: AdStatus;
  label: string;
  color: string;
  icon: string;
  gradient: [string, string];
}

interface FilterBarProps {
  filters: StatusFilter[];
  selectedStatus: AdStatus;
  onStatusChange: (status: AdStatus) => void;
  getStatusCount: (status: AdStatus) => number;
}

export default function FilterBar({
  filters,
  selectedStatus,
  onStatusChange,
  getStatusCount,
}: FilterBarProps) {
  const renderStatCard = (filter: StatusFilter) => {
    const count = getStatusCount(filter.key);
    const isActive = selectedStatus === filter.key;

    return (
      <TouchableOpacity
        key={filter.key}
        style={[styles.statCard, isActive && styles.statCardActive]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onStatusChange(filter.key);
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
          <View
            style={[
              styles.statIconContainer,
              {
                backgroundColor: isActive
                  ? "rgba(255,255,255,0.2)"
                  : `${filter.color}15`,
              },
            ]}
          >
            <Ionicons
              name={filter.icon as any}
              size={20}
              color={isActive ? "#fff" : filter.color}
            />
          </View>
          <Text style={[styles.statCount, isActive && styles.statCountActive]}>
            {count}
          </Text>
          <Text style={[styles.statLabel, isActive && styles.statLabelActive]}>
            {filter.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {filters.map(renderStatCard)}
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
    paddingVertical: 20,
    gap: 14,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    minWidth: 115,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statCardActive: {
    borderColor: "transparent",
    transform: [{ scale: 1.05 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  statCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statCardContent: {
    padding: 18,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  statIconContainer: {
    width: 48,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statCountActive: {
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  statLabelActive: {
    color: "rgba(255,255,255,0.9)",
  },
});
