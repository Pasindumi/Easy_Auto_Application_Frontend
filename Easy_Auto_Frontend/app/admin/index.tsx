import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as React from "react";
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AdminBottomNav from "./components/AdminBottomNav";
import NotificationsDrawer from "./components/NotificationsDrawer";
import ProfileMenu from "./components/ProfileMenu";
import QuickActions from "./components/QuickActions";
import RecentActivity from "./components/RecentActivity";
import StatCard from "./components/StatCard";
import TimeFilterButton from "./components/TimeFilterButton";
import {
  ADMIN_PROFILE,
  DASHBOARD_STATS,
  NOTIFICATIONS,
  QUICK_ACTIONS,
  RECENT_ACTIVITIES,
  TIME_FILTERS,
} from "./data/adminDashboard";

const { width } = Dimensions.get("window");

const spacing = {
  horizontal: width < 375 ? 16 : 20,
  vertical: width < 375 ? 12 : 16,
  gap: width < 375 ? 8 : 12,
  section: width < 375 ? 20 : 24,
  card: width < 375 ? 12 : 16,
};

export default function AdminDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] =
    React.useState("Last 7 Days");

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons
            name="grid-outline"
            size={22}
            color={COLORS.primary}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.subHeaderTitle}>Admin Dashboard</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Revenue"
              value="$128,450"
              label="Vs last month"
              trend="+12.5%"
              trendUp={true}
              icon="cash-outline"
              color={COLORS.primary}
            />
            <StatCard
              title="Total Ads"
              value="1,248"
              label="Vs last week"
              trend="+5.2%"
              trendUp={true}
              icon="car-outline"
              color="#10B981"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Active Users"
              value="8,420"
              label="Vs last month"
              trend="+8.1%"
              trendUp={true}
              icon="people-outline"
              color="#8B5CF6"
            />
            <StatCard
              title="Pending Ads"
              value="42"
              label="Needs attention"
              trend="-12%"
              trendUp={false}
              icon="time-outline"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <QuickActionItem
            title="Approve Recent Ads"
            description="Review and approve 12 pending vehicle listings"
            icon="checkmark-done-circle-outline"
            color="#10B981"
            badge={12}
            onPress={() => router.push("/admin/ads")}
          />
          <QuickActionItem
            title="User Management"
            description="View reports and manage user permissions"
            icon="people-circle-outline"
            color="#235CF8"
            onPress={() => {}}
          />
          <QuickActionItem
            title="System Reports"
            description="Export detailed analytics and performance PDF"
            icon="bar-chart-outline"
            color="#8B5CF6"
            onPress={() => {}}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <ActivityItem
            title="New User Registered"
            description="John Doe created a new dealer account"
            time="2 minutes ago"
            type="user"
          />
          <ActivityItem
            title="Ad Published"
            description="BMW 3 Series 2021 was approved and published"
            time="15 minutes ago"
            type="ad"
          />
          <ActivityItem
            title="Payment Received"
            description="Premium Plan subscription for Jane Smith"
            time="1 hour ago"
            type="payment"
          />
        </View>
      </ScrollView>

      {/* Admin Bottom Nav */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.bottomNavItem} onPress={() => {}}>
          <Ionicons name="grid" size={24} color={COLORS.primary} />
          <Text
            style={[
              styles.bottomNavLabel,
              { color: COLORS.primary, fontWeight: "700" },
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomNavItem}
          onPress={() => router.push("/admin/ads")}
        >
          <Ionicons name="car-outline" size={24} color={COLORS.text.muted} />
          <Text style={styles.bottomNavLabel}>Ads</Text>
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

/* Sub-components for AdminDashboard */

function StatCard({ title, value, label, trend, trendUp, icon, color }: any) {
  return (
    <TouchableOpacity style={styles.statCard}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <Text style={styles.statCardTitle} numberOfLines={1}>
            {title}
          </Text>
          <View
            style={[
              styles.statIconContainer,
              { backgroundColor: `${color}15` },
            ]}
          >
            <Ionicons name={icon} size={20} color={color} />
          </View>
        </View>
        <Text style={styles.statCardValue}>{value}</Text>
        <View style={styles.statCardFooter}>
          <Text style={styles.statCardLabel} numberOfLines={1}>
            {label}
          </Text>
          <View style={styles.trendContainer}>
            <Ionicons
              name={trendUp ? "arrow-up" : "arrow-down"}
              size={12}
              color={trendUp ? "#10B981" : "#EF4444"}
            />
            <Text
              style={[
                styles.trendText,
                trendUp ? styles.trendTextUp : styles.trendTextDown,
              ]}
            >
              {trend}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function QuickActionItem({
  title,
  description,
  icon,
  color,
  badge,
  onPress,
}: any) {
  return (
    <TouchableOpacity style={styles.quickActionItem} onPress={onPress}>
      <View
        style={[
          styles.quickActionIconWrapper,
          { backgroundColor: `${color}15` },
        ]}
      >
        <Ionicons name={icon} size={26} color={color} />
      </View>
      <View style={styles.quickActionContent}>
        <Text style={styles.quickActionText}>{title}</Text>
        <Text style={styles.quickActionDescription} numberOfLines={1}>
          {description}
        </Text>
      </View>
      <View style={styles.quickActionRight}>
        {badge && (
          <View style={styles.quickActionBadge}>
            <Text style={styles.quickActionBadgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={COLORS.divider} />
      </View>
    </TouchableOpacity>
  );
}

function ActivityItem({ title, description, time, type }: any) {
  const getIcon = () => {
    if (type === "user")
      return { name: "person-circle-outline", color: "#235CF8" };
    if (type === "ad") return { name: "car-sport-outline", color: "#10B981" };
    return { name: "cash-outline", color: "#8B5CF6" };
  };
  const icon = getIcon();

  return (
    <TouchableOpacity style={styles.activityItem}>
      <View
        style={[
          styles.activityIconContainer,
          { backgroundColor: `${icon.color}15` },
        ]}
      >
        <Ionicons name={icon.name as any} size={24} color={icon.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription}>{description}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
  },
  statsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.divider,
    overflow: "hidden",
  },
  statCardContent: {
    padding: 16,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  statCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text.muted,
    flex: 1,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  statCardLabel: {
    fontSize: 11,
    color: COLORS.text.muted,
    flex: 1,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 2,
  },
  trendTextUp: { color: "#10B981" },
  trendTextDown: { color: "#EF4444" },

  quickActionsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 16,
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  quickActionIconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  quickActionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickActionBadge: {
    backgroundColor: COLORS.status.danger,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginRight: 8,
  },
  quickActionBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "700",
  },

  recentActivityContainer: {
    paddingHorizontal: spacing.horizontal,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.text.muted,
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
