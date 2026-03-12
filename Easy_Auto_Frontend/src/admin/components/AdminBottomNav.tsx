import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "@/constants/Colors";

type NavTab = "Dashboard" | "Ads" | "Users" | "Analytics" | "Settings";

// Route mapping - centralized navigation configuration
const ROUTE_MAP: Record<NavTab, string | null> = {
  Dashboard: "/admin",
  Ads: "/admin/ads",
  Users: "/admin/users",
  Analytics: "/admin/analytics",
  Settings: null, // Coming soon
};

interface AdminBottomNavProps {
  insetBottom?: number;
}

export default function AdminBottomNav({
  insetBottom = 0,
}: AdminBottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Auto-detect active tab from current route
  const getActiveTab = (): NavTab => {
    if (pathname?.includes("/admin/users")) return "Users";
    if (pathname?.includes("/admin/ads")) return "Ads";
    if (pathname?.includes("/admin/analytics")) return "Analytics";
    if (pathname === "/admin" || pathname === "/admin/") return "Dashboard";
    return "Dashboard";
  };

  const activeTab = getActiveTab();

  const items: {
    key: NavTab;
    icon: string;
    outline: string;
    label: string;
  }[] = [
      {
        key: "Dashboard",
        icon: "grid",
        outline: "grid-outline",
        label: "Dashboard",
      },
      { key: "Ads", icon: "car", outline: "car-outline", label: "Ads" },
      {
        key: "Users",
        icon: "people",
        outline: "people-outline",
        label: "Users",
      },
      {
        key: "Analytics",
        icon: "bar-chart",
        outline: "bar-chart-outline",
        label: "Analytics",
      },
      {
        key: "Settings",
        icon: "settings",
        outline: "settings-outline",
        label: "Settings",
      },
    ];

  const handleTabPress = (tab: NavTab) => {
    // Haptic feedback on every press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const route = ROUTE_MAP[tab];

    if (!route) {
      // Show "Coming Soon" alert for unimplemented features
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Coming Soon",
        `${tab} feature is under development and will be available soon.`,
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    // Navigate to the route
    if (pathname !== route && route) {
      router.push(route as any);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insetBottom }]}>
      <LinearGradient
        colors={[COLORS.admin.surface, COLORS.admin.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {items.map((item) => {
        const active = activeTab === item.key;
        const isDisabled = !ROUTE_MAP[item.key];

        return (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.item,
              active && styles.itemActive,
              isDisabled && styles.itemDisabled,
            ]}
            onPress={() => handleTabPress(item.key)}
            activeOpacity={0.8}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active, disabled: isDisabled }}
            accessibilityHint={
              isDisabled
                ? `${item.label} is coming soon`
                : `Navigate to ${item.label}`
            }
          >
            {active && !isDisabled && (
              <LinearGradient
                colors={[`${COLORS.admin.primary}15`, `${COLORS.admin.primary}05`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons
              name={(active ? item.icon : item.outline) as any}
              size={22}
              color={
                isDisabled ? "#D1D5DB" : active ? COLORS.admin.primary : "#9CA3AF"
              }
            />
            <Text
              style={[
                styles.label,
                active && !isDisabled && styles.labelActive,
                isDisabled && styles.labelDisabled,
              ]}
            >
              {item.label}
            </Text>
            {isDisabled && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>Soon</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    paddingTop: 10,
    zIndex: 100,
  },
  item: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minHeight: 56,
    position: "relative",
  },
  itemActive: {
    borderRadius: 16,
    marginHorizontal: 4,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },
  labelActive: {
    color: COLORS.admin.primary,
    fontWeight: "600",
  },
  labelDisabled: {
    color: "#D1D5DB",
  },
  comingSoonBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#F59E0B",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  comingSoonText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
});
