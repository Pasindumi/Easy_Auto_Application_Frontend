import ProfileHeader from "@/components/ProfileHeader";
import { Z_INDEX } from "@/constants/zIndex";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRouter } from "expo-router";
import * as React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
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

// Calculate responsive spacing values
const spacing = {
  horizontal: width < 375 ? 16 : 20,
  vertical: width < 375 ? 12 : 16,
  gap: width < 375 ? 8 : 12,
  section: width < 375 ? 20 : 24,
  card: width < 375 ? 12 : 16,
};

/**
 * Animated Header Button Component
 */
const AnimatedHeaderButton = ({
  children,
  onPress,
  accessibilityLabel,
  accessibilityHint,
}: {
  children: React.ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.headerActionButton}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Pulsing Badge Component
 */
const PulsingBadge = ({ count }: { count: number }) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  return (
    <Animated.View
      style={[styles.notificationBadge, { transform: [{ scale: pulseAnim }] }]}
    >
      <Text style={styles.notificationBadgeText}>{count}</Text>
    </Animated.View>
  );
};

/**
 * Main Admin Dashboard Component
 */
export default function AdminDashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // State Management
  const [activeTimeFilter, setActiveTimeFilter] = React.useState("Today");
  const [refreshing, setRefreshing] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [profileImageError, setProfileImageError] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [profileHeaderHeight, setProfileHeaderHeight] = React.useState(0);

  const headerRef = React.useRef<View>(null);
  const profileHeaderRef = React.useRef<View>(null);

  // Handlers
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleQuickActionPress = (action: string) => {
    console.log("Quick action:", action);
    if (action === "/admin/ads") {
      router.push("/admin/ads");
    }
    // Add other navigation logic here
  };

  const handleNotificationPress = (id: string) => {
    console.log("Notification pressed:", id);
    setShowNotifications(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#F8F9FA", "#E8EAED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.backgroundGradient}
      />
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Header */}
      <View
        ref={headerRef}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          const totalHeight = height + insets.top;
          setHeaderHeight(totalHeight);
        }}
      >
        <View style={styles.headerContainer}>
          <View
            ref={profileHeaderRef}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setProfileHeaderHeight(height);
            }}
          >
            <ProfileHeader title="Admin Dashboard" showProfileCard={false} />
          </View>

          {/* Header Actions Row */}
          <View
            style={[
              styles.headerActionsRow,
              { top: Math.max(insets.top, 20) },
            ]}
          >
            <View style={{ position: "relative" }}>
              <AnimatedHeaderButton
                onPress={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                accessibilityLabel="Notifications"
                accessibilityHint="Opens notification drawer"
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </AnimatedHeaderButton>
              <PulsingBadge count={NOTIFICATIONS.filter((n) => n.unread).length} />
            </View>
            <AnimatedHeaderButton
              onPress={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              accessibilityLabel="User Profile"
              accessibilityHint="Opens profile menu"
            >
              {isImageLoading && !profileImageError && (
                <View
                  style={[styles.headerProfileImage, styles.imagePlaceholder]}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color="rgba(255, 255, 255, 0.6)"
                  />
                </View>
              )}
              {profileImageError ? (
                <View
                  style={[styles.headerProfileImage, styles.imagePlaceholder]}
                >
                  <Ionicons
                    name="person-circle"
                    size={36}
                    color="rgba(255, 255, 255, 0.8)"
                  />
                </View>
              ) : (
                <Image
                  source={{ uri: ADMIN_PROFILE.imageUrl }}
                  style={[
                    styles.headerProfileImage,
                    isImageLoading && { opacity: 0 },
                  ]}
                  onLoad={() => setIsImageLoading(false)}
                  onError={() => {
                    setProfileImageError(true);
                    setIsImageLoading(false);
                  }}
                />
              )}
            </AnimatedHeaderButton>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#235CF8"
          />
        }
      >
        {/* Time Filters */}
        <View style={styles.timeFiltersContainer}>
          {TIME_FILTERS.map((filter) => (
            <TimeFilterButton
              key={filter}
              label={filter}
              isActive={activeTimeFilter === filter}
              onPress={() => setActiveTimeFilter(filter)}
            />
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <StatCard
              delay={100}
              title="Total Ads"
              value={DASHBOARD_STATS.totalAds.value}
              label={DASHBOARD_STATS.totalAds.label}
              iconName="car"
              iconColor="#10B981"
              trend={DASHBOARD_STATS.totalAds.trend}
              trendValue={DASHBOARD_STATS.totalAds.trendValue}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/admin/ads");
              }}
            />
            <StatCard
              delay={150}
              title="Total Income"
              value={DASHBOARD_STATS.totalIncome.value}
              label={DASHBOARD_STATS.totalIncome.label}
              iconName="bar-chart"
              iconColor="#EF4444"
              trend={DASHBOARD_STATS.totalIncome.trend}
              trendValue={DASHBOARD_STATS.totalIncome.trendValue}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Total Income pressed");
              }}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              delay={200}
              title="Total Users"
              value={DASHBOARD_STATS.totalUsers.value}
              label={DASHBOARD_STATS.totalUsers.label}
              iconName="people"
              iconColor="#3B82F6"
              trend={DASHBOARD_STATS.totalUsers.trend}
              trendValue={DASHBOARD_STATS.totalUsers.trendValue}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push("/admin/users");
              }}
            />
            <StatCard
              delay={250}
              title="Reports"
              value={DASHBOARD_STATS.reports.value}
              label={DASHBOARD_STATS.reports.label}
              iconName="document-text"
              iconColor="#F59E0B"
              trend={DASHBOARD_STATS.reports.trend}
              trendValue={DASHBOARD_STATS.reports.trendValue}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Reports pressed");
              }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <QuickActions
          actions={QUICK_ACTIONS}
          onActionPress={handleQuickActionPress}
        />

        {/* Recent Activity */}
        <RecentActivity
          activities={RECENT_ACTIVITIES}
          onViewAll={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log("View all activity");
          }}
        />
      </ScrollView>

      {/* Profile Menu Dropdown */}
      <ProfileMenu
        isVisible={showProfileMenu}
        onClose={() => setShowProfileMenu(false)}
        topPosition={headerHeight > 0 ? headerHeight + 8 : 180}
        profileInfo={ADMIN_PROFILE}
        onProfilePress={() => console.log("Profile clicked")}
        onSettingsPress={() => console.log("Settings clicked")}
        onLogoutPress={() => router.back()}
      />

      {/* Notification Drawer */}
      <NotificationsDrawer
        isVisible={showNotifications}
        onClose={() => setShowNotifications(false)}
        topPosition={headerHeight > 0 ? headerHeight + 8 : 180}
        notifications={NOTIFICATIONS}
        onNotificationPress={handleNotificationPress}
      />

      {/* Bottom navigation */}
      <AdminBottomNav insetBottom={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  backgroundGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  headerActionButton: {
    position: "relative",
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  headerProfileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  imagePlaceholder: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#235CF8",
    zIndex: Z_INDEX.HEADER_ACTIONS + 1,
    elevation: Z_INDEX.HEADER_ACTIONS + 1,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  headerContainer: {
    position: "relative",
  },
  headerActionsRow: {
    position: "absolute",
    top: 0,
    right: width < 375 ? 16 : 20,
    flexDirection: "row",
    alignItems: "center",
    gap: width < 375 ? 8 : 12,
    paddingTop: 0,
    zIndex: Z_INDEX.HEADER_ACTIONS,
    elevation: Z_INDEX.HEADER_ACTIONS,
    minHeight: 44,
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginTop: 8,
    marginBottom: spacing.section + 4,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  timeFiltersContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.horizontal,
    marginTop: 16,
    marginBottom: 24,
    gap: spacing.gap + 2,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
