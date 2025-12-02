import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useNavigation } from "expo-router";
import * as React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import ProfileHeader from "@/components/ProfileHeader";

const { width } = Dimensions.get("window");

// Calculate responsive spacing values
const spacing = {
  horizontal: width < 375 ? 16 : 20,
  vertical: width < 375 ? 12 : 16,
  gap: width < 375 ? 8 : 12,
  section: width < 375 ? 20 : 24,
  card: width < 375 ? 12 : 16,
};

// Create styles with responsive spacing (defined before components to avoid reference errors)
const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  headerActionButton: {
    position: "relative",
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2.5,
    borderColor: "#1E4ED8",
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    minHeight: 44,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "500",
  },
  searchClearButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  adminHeaderExtras: {
    backgroundColor: "#235CF8",
    paddingHorizontal: spacing.horizontal,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  adminActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },
  statsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginTop: 0,
    marginBottom: spacing.section,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
    width: "48%",
  },
  statCardContent: {
    padding: 16,
    minHeight: 130,
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  statCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    flex: 1,
    flexShrink: 1,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 4,
    flexShrink: 1,
  },
  statCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  statCardLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    flex: 1,
    flexShrink: 1,
    marginRight: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    minWidth: 50,
  },
  trendUp: {},
  trendDown: {},
  trendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  trendTextUp: {
    color: "#10B981",
  },
  trendTextDown: {
    color: "#EF4444",
  },
  timeFiltersContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.horizontal,
    marginTop: 8,
    marginBottom: 16,
    gap: spacing.gap,
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  timeFilterButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  timeFilterButtonActive: {
    backgroundColor: "#235CF8",
    borderColor: "#235CF8",
  },
  timeFilterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  timeFilterTextActive: {
    color: "#FFFFFF",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: spacing.section,
    paddingHorizontal: spacing.horizontal,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: 1,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: spacing.horizontal,
    marginBottom: spacing.section,
    gap: spacing.gap,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
    minHeight: 44,
    minWidth: 70,
  },
  tabButtonActive: {
    backgroundColor: "#DBEAFE",
    borderColor: "#3B82F6",
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
  },
  tabButtonTextActive: {
    color: "#3B82F6",
    fontWeight: "700",
  },
  tabBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginTop: 0,
    marginBottom: spacing.section,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  quickActionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
    minHeight: 72,
  },
  quickActionIconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    flexShrink: 0,
  },
  quickActionContent: {
    flex: 1,
    marginRight: 8,
  },
  quickActionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
  },
  quickActionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  quickActionBadge: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  quickActionBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  recentActivityContainer: {
    paddingHorizontal: spacing.horizontal,
    marginTop: 0,
    marginBottom: spacing.section,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#235CF8",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  activityIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.gap + 2,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  profileMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  profileMenuContainer: {
    position: "absolute",
    right: 20,
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  profileMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  profileMenuImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  profileMenuInfo: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  profileMenuEmail: {
    fontSize: 13,
    color: "#6B7280",
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  profileMenuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
  },
  notificationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  notificationDrawer: {
    position: "absolute",
    right: 20,
    width: 320,
    maxHeight: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  notificationCloseButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  notificationList: {
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  notificationItemUnread: {
    backgroundColor: "#F0F9FF",
  },
  notificationItemContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  notificationItemTime: {
    fontSize: 12,
    color: "#6B7280",
  },
  notificationItemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#235CF8",
    marginLeft: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    paddingTop: 8,
    zIndex: 100,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minHeight: 56,
  },
  bottomNavItemActive: {
    backgroundColor: "rgba(35, 92, 248, 0.05)",
  },
  bottomNavLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },
  bottomNavLabelActive: {
    color: "#235CF8",
    fontWeight: "600",
  },
});

// Enhanced Stat Card with Trends
const StatCard = ({
  delay,
  title,
  value,
  label,
  iconName,
  iconColor,
  trend,
  trendValue,
  onPress,
}: {
  delay: number;
  title: string;
  value: string;
  label: string;
  iconName: any;
  iconColor: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  onPress?: () => void;
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const pressScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, delay]);

  const handlePressIn = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(pressScale, {
        toValue: 0.97,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const CardContent = (
    <View style={adminStyles.statCardContent}>
      <View style={adminStyles.statCardHeader}>
        <Text style={adminStyles.statCardTitle} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <View style={[adminStyles.statIconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
      </View>
      <Text style={adminStyles.statCardValue} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </Text>
      <View style={adminStyles.statCardFooter}>
        <Text style={adminStyles.statCardLabel} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
        {trend && trendValue && (
          <View
            style={[
              adminStyles.trendContainer,
              trend === "up" && adminStyles.trendUp,
              trend === "down" && adminStyles.trendDown,
            ]}
          >
            <Ionicons
              name={trend === "up" ? "trending-up" : trend === "down" ? "trending-down" : "remove"}
              size={12}
              color={trend === "up" ? "#10B981" : trend === "down" ? "#EF4444" : "#6B7280"}
            />
            <Text
              style={[
                adminStyles.trendText,
                trend === "up" && adminStyles.trendTextUp,
                trend === "down" && adminStyles.trendTextDown,
              ]}
              numberOfLines={1}
            >
              {trendValue}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={adminStyles.statCard}
      >
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }, { scale: pressScale }],
            },
          ]}
        >
          {CardContent}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        adminStyles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      {CardContent}
    </Animated.View>
  );
};

// Tab Button Component
const TabButton = ({
  label,
  isActive,
  onPress,
  delay,
  badge,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
  delay: number;
  badge?: number;
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, delay]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
    <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
      <TouchableOpacity
        style={[adminStyles.tabButton, isActive && adminStyles.tabButtonActive]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Animated.Text
          style={[
            adminStyles.tabButtonText,
            isActive && adminStyles.tabButtonTextActive,
            { transform: [{ scale: scaleAnim }] },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.8}
        >
          {label}
        </Animated.Text>
        {badge && badge > 0 && (
          <View style={adminStyles.tabBadge}>
            <Text style={adminStyles.tabBadgeText}>{badge > 99 ? "99+" : badge}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Time Filter Button
const TimeFilterButton = ({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
      style={[adminStyles.timeFilterButton, isActive && adminStyles.timeFilterButtonActive]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.Text
        style={[
          adminStyles.timeFilterText,
          isActive && adminStyles.timeFilterTextActive,
          { transform: [{ scale: scaleAnim }] },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        minimumFontScale={0.85}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

// Quick Action Item Component
const QuickActionItem = ({
  label,
  delay,
  onPress,
  icon,
  badge,
  description,
}: {
  label: string;
  delay: number;
  onPress: () => void;
  icon: string;
  badge?: number;
  description?: string;
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
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
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={adminStyles.quickActionItem}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[adminStyles.quickActionIconWrapper, { backgroundColor: "#F0F9FF" }]}>
          <MaterialIcons name={icon as any} size={24} color="#235CF8" />
        </View>
        <View style={adminStyles.quickActionContent}>
          <Text style={adminStyles.quickActionText} numberOfLines={1} ellipsizeMode="tail">
            {label}
          </Text>
          {description && (
            <Text style={adminStyles.quickActionDescription} numberOfLines={1} ellipsizeMode="tail">
              {description}
            </Text>
          )}
        </View>
        <View style={adminStyles.quickActionRight}>
          {badge && badge > 0 && (
            <View style={adminStyles.quickActionBadge}>
              <Text style={adminStyles.quickActionBadgeText}>{badge > 99 ? "99+" : badge}</Text>
            </View>
          )}
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Recent Activity Item
const RecentActivityItem = ({
  icon,
  title,
  description,
  time,
  color,
  delay,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
  delay: number;
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, delay]);

  return (
    <Animated.View
      style={[
        adminStyles.activityItem,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={[adminStyles.activityIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={adminStyles.activityContent}>
        <Text style={adminStyles.activityTitle}>{title}</Text>
        <Text style={adminStyles.activityDescription}>{description}</Text>
        <Text style={adminStyles.activityTime}>{time}</Text>
      </View>
    </Animated.View>
  );
};

export default function AdminDashboard() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTimeFilter, setActiveTimeFilter] = React.useState("Month");
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [activeNavTab, setActiveNavTab] = React.useState("Dashboard");
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const headerRef = React.useRef<View>(null);

  // Ensure header is hidden
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      title: "",
    });
  }, [navigation]);

  const titleFade = React.useRef(new Animated.Value(0)).current;
  const titleSlide = React.useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(titleSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleFade, titleSlide]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const timeFilters = ["Today", "Week", "Month", "Year"];

  const recentActivities = [
    {
      id: "1",
      icon: "person-add",
      title: "New User Registered",
      description: "John Doe joined the platform",
      time: "2 min ago",
      color: "#235CF8",
    },
    {
      id: "2",
      icon: "car",
      title: "New Listing Added",
      description: "BMW X5 posted by Jane Smith",
      time: "15 min ago",
      color: "#10B981",
    },
    {
      id: "3",
      icon: "cash",
      title: "Payment Received",
      description: "Rs. 15,000 from Premium subscription",
      time: "1 hour ago",
      color: "#F59E0B",
    },
    {
      id: "4",
      icon: "alert-circle",
      title: "Reported Listing",
      description: "Listing ID #1234 needs review",
      time: "2 hours ago",
      color: "#EF4444",
    },
  ];

  return (
    <View style={adminStyles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header using ProfileHeader component */}
      <SafeAreaView edges={["top"]} style={{ backgroundColor: "#235CF8" }}>
        <View
          ref={headerRef}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            const totalHeight = height + insets.top;
            setHeaderHeight(totalHeight);
          }}
        >
          <ProfileHeader title="Admin Dashboard" showProfileCard={false} />
          
          {/* Admin-specific features below header */}
          <View style={adminStyles.adminHeaderExtras}>
            {/* Search Bar and Actions Row */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              {/* Back Button */}
              <TouchableOpacity
                style={adminStyles.backButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Search Bar */}
              <View style={[adminStyles.searchContainer, { flex: 1 }]}>
                <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.8)" style={adminStyles.searchIcon} />
                <TextInput
                  style={adminStyles.searchInput}
                  placeholder="Search users, ads, reports..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSearchQuery("");
                    }}
                    style={adminStyles.searchClearButton}
                  >
                    <Ionicons name="close-circle" size={20} color="rgba(255, 255, 255, 0.8)" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Admin Action Buttons */}
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={adminStyles.headerActionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                  <View style={adminStyles.notificationBadge}>
                    <Text style={adminStyles.notificationBadgeText}>3</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={adminStyles.headerActionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowProfileMenu(!showProfileMenu);
                    setShowNotifications(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                    }}
                    style={adminStyles.headerProfileImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={adminStyles.scrollView}
        contentContainerStyle={adminStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#235CF8" />}
      >
        {/* Time Filters */}
        <View style={adminStyles.timeFiltersContainer}>
          {timeFilters.map((filter) => (
            <TimeFilterButton
              key={filter}
              label={filter}
              isActive={activeTimeFilter === filter}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setActiveTimeFilter(filter);
              }}
            />
          ))}
        </View>

        {/* Stats Section */}
        <View style={adminStyles.statsContainer}>
          <View style={adminStyles.statsRow}>
            <StatCard
              delay={100}
              title="Total Ads"
              value="168"
              label="Active Listing"
              iconName="car"
              iconColor="#10B981"
              trend="up"
              trendValue="+12%"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Total Ads pressed");
              }}
            />
            <StatCard
              delay={150}
              title="Total Income"
              value="Rs. 765,370"
              label="This Month"
              iconName="bar-chart"
              iconColor="#EF4444"
              trend="up"
              trendValue="+8.5%"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Total Income pressed");
              }}
            />
          </View>
          <View style={adminStyles.statsRow}>
            <StatCard
              delay={200}
              title="Total Users"
              value="150"
              label="Registered"
              iconName="people"
              iconColor="#3B82F6"
              trend="up"
              trendValue="+5.2%"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Total Users pressed");
              }}
            />
            <StatCard
              delay={250}
              title="Reports"
              value="56"
              label="Pending"
              iconName="document-text"
              iconColor="#F59E0B"
              trend="down"
              trendValue="-3"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                console.log("Reports pressed");
              }}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={adminStyles.recentActivityContainer}>
          <View style={adminStyles.sectionHeader}>
            <Text style={adminStyles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                console.log("View all activity");
              }}
            >
              <Text style={adminStyles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentActivities.map((activity, index) => (
            <RecentActivityItem
              key={activity.id}
              icon={activity.icon}
              title={activity.title}
              description={activity.description}
              time={activity.time}
              color={activity.color}
              delay={700 + index * 50}
            />
          ))}
        </View>
      </ScrollView>

      {/* Profile Menu Dropdown */}
      {showProfileMenu && (
        <TouchableOpacity
          style={adminStyles.profileMenuOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={[adminStyles.profileMenuContainer, { top: headerHeight > 0 ? headerHeight + 8 : 180 }]}>
            <View style={adminStyles.profileMenuHeader}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                }}
                style={adminStyles.profileMenuImage}
              />
              <View style={adminStyles.profileMenuInfo}>
                <Text style={adminStyles.profileMenuName}>Sajid Admani</Text>
                <Text style={adminStyles.profileMenuEmail}>sajid@easyauto.com</Text>
              </View>
            </View>
            <View style={adminStyles.profileMenuDivider} />
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfileMenu(false);
                console.log("Profile clicked");
              }}
            >
              <Ionicons name="person-outline" size={20} color="#6B7280" />
              <Text style={adminStyles.profileMenuItemText}>Profile</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfileMenu(false);
                console.log("Settings clicked");
              }}
            >
              <Ionicons name="settings-outline" size={20} color="#6B7280" />
              <Text style={adminStyles.profileMenuItemText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={adminStyles.profileMenuDivider} />
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowProfileMenu(false);
                router.back();
              }}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[adminStyles.profileMenuItemText, { color: "#EF4444" }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Notification Drawer */}
      {showNotifications && (
        <TouchableOpacity
          style={adminStyles.notificationOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <View style={[adminStyles.notificationDrawer, { top: headerHeight > 0 ? headerHeight + 8 : 180 }]}>
            <View style={adminStyles.notificationHeader}>
              <Text style={adminStyles.notificationTitle}>Notifications</Text>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={adminStyles.notificationCloseButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={adminStyles.notificationList} showsVerticalScrollIndicator={false}>
              {[
                { id: "1", title: "New user registered", time: "2 min ago", unread: true },
                { id: "2", title: "Payment received", time: "15 min ago", unread: true },
                { id: "3", title: "Listing reported", time: "1 hour ago", unread: false },
              ].map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  style={[adminStyles.notificationItem, notif.unread && adminStyles.notificationItemUnread]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowNotifications(false);
                  }}
                >
                  <View style={adminStyles.notificationItemContent}>
                    <Text style={adminStyles.notificationItemTitle}>{notif.title}</Text>
                    <Text style={adminStyles.notificationItemTime}>{notif.time}</Text>
                  </View>
                  {notif.unread && <View style={adminStyles.notificationItemDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      )}

      {/* Bottom Navigation Bar */}
      <View style={[adminStyles.bottomNav, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Dashboard" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Dashboard");
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeNavTab === "Dashboard" ? "grid" : "grid-outline"}
            size={24}
            color={activeNavTab === "Dashboard" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              adminStyles.bottomNavLabel,
              activeNavTab === "Dashboard" && adminStyles.bottomNavLabelActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Ads" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Ads");
            console.log("Ads clicked");
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeNavTab === "Ads" ? "car" : "car-outline"}
            size={24}
            color={activeNavTab === "Ads" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[adminStyles.bottomNavLabel, activeNavTab === "Ads" && adminStyles.bottomNavLabelActive]}
          >
            Ads
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Users" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Users");
            console.log("Users clicked");
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeNavTab === "Users" ? "people" : "people-outline"}
            size={24}
            color={activeNavTab === "Users" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[adminStyles.bottomNavLabel, activeNavTab === "Users" && adminStyles.bottomNavLabelActive]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Analytics" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Analytics");
            console.log("Analytics clicked");
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeNavTab === "Analytics" ? "bar-chart" : "bar-chart-outline"}
            size={24}
            color={activeNavTab === "Analytics" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              adminStyles.bottomNavLabel,
              activeNavTab === "Analytics" && adminStyles.bottomNavLabelActive,
            ]}
          >
            Analytics
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Settings" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Settings");
            console.log("Settings clicked");
          }}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeNavTab === "Settings" ? "settings" : "settings-outline"}
            size={24}
            color={activeNavTab === "Settings" ? "#235CF8" : "#9CA3AF"}
          />
          <Text
            style={[
              adminStyles.bottomNavLabel,
              activeNavTab === "Settings" && adminStyles.bottomNavLabelActive,
            ]}
          >
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
