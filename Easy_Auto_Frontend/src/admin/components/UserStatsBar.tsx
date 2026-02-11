import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface StatItem {
  label: string;
  value: number;
  icon: string;
  color: string;
  gradient: [string, string];
}

interface UserStatsBarProps {
  stats: {
    total: number;
    active: number;
    suspended: number;
    pending: number;
    premium: number;
    verified: number;
  };
}

export default function UserStatsBar({ stats }: UserStatsBarProps) {
  const statItems: StatItem[] = [
    {
      label: "Total Users",
      value: stats.total,
      icon: "people",
      color: "#3B82F6",
      gradient: ["#3B82F6", "#2563EB"],
    },
    {
      label: "Active",
      value: stats.active,
      icon: "checkmark-circle",
      color: "#10B981",
      gradient: ["#10B981", "#059669"],
    },
    {
      label: "Premium",
      value: stats.premium,
      icon: "star",
      color: "#F59E0B",
      gradient: ["#F59E0B", "#D97706"],
    },
    {
      label: "Verified",
      value: stats.verified,
      icon: "shield-checkmark",
      color: "#8B5CF6",
      gradient: ["#8B5CF6", "#7C3AED"],
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: "time",
      color: "#F59E0B",
      gradient: ["#F59E0B", "#D97706"],
    },
    {
      label: "Suspended",
      value: stats.suspended,
      icon: "ban",
      color: "#EF4444",
      gradient: ["#EF4444", "#DC2626"],
    },
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      {statItems.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <LinearGradient
            colors={stat.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statCardGradient}
          />
          <Ionicons name={stat.icon as any} size={24} color="#fff" />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
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
    gap: 12,
  },
  statCard: {
    width: 120,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  statCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginTop: 12,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
});
