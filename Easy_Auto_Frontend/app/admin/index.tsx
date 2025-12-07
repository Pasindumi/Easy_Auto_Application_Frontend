import ProfileHeader from "@/components/ProfileHeader";
import { Z_INDEX } from "@/constants/zIndex";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    width: 44, // Minimum touch target size (WCAG 2.1 AA)
    height: 44,
    minWidth: 44, // Ensure minimum on all platforms
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
    paddingTop: 20, // Slightly reduced for better spacing
  },
  headerContainer: {
    position: "relative",
  },
  // Removed headerWrapper - no longer needed with simplified structure
  headerActionsRow: {
    position: "absolute",
    top: 0, // Will be adjusted dynamically based on ProfileHeader's safe area
    right: width < 375 ? 16 : 20, // Improved spacing to match header padding
    flexDirection: "row",
    alignItems: "center",
    gap: width < 375 ? 8 : 12, // Increased gap for better visual separation
    paddingTop: 0, // Removed - ProfileHeader already handles safe area
    zIndex: Z_INDEX.HEADER_ACTIONS,
    elevation: Z_INDEX.HEADER_ACTIONS, // Android elevation
    minHeight: 44, // Minimum touch target size
    justifyContent: "center",
  },
  statsContainer: {
    paddingHorizontal: spacing.horizontal,
    marginTop: 8, // Increased top margin
    marginBottom: spacing.section + 4, // More spacing
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20, // Increased for modern feel
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, // Enhanced shadow
    shadowRadius: 16, // Larger blur radius for softer shadow
    elevation: 4, // Increased for better depth
    overflow: "hidden",
    width: "48%",
    borderWidth: 0, // Removed border for cleaner look
  },
  statCardGradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04, // Subtle gradient overlay
  },
  statCardContent: {
    padding: 22, // More generous padding for premium feel
    minHeight: 145, // Slightly taller
  },
  statCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 8,
  },
  statCardTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563", // Slightly darker for better readability
    flex: 1,
    flexShrink: 1,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  statIconContainer: {
    width: 40, // Larger for better visual impact
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    // Gradient will be applied via LinearGradient component
  },
  statCardValue: {
    fontSize: 28, // Larger for more impact
    fontWeight: "800",
    color: "#111827", // Darker for better contrast
    marginBottom: 8,
    flexShrink: 1,
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  statCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    flex: 1,
    flexShrink: 1,
    marginRight: 4,
    lineHeight: 16,
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
    marginTop: 16, // Increased
    marginBottom: 24, // Increased
    gap: spacing.gap + 2, // More gap between buttons
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  timeFilterButton: {
    paddingVertical: 11,
    paddingHorizontal: 20, // More generous padding
    borderRadius: 25, // More pill-shaped
    backgroundColor: "#FFFFFF",
    borderWidth: 0, // Removed border for cleaner look
    minHeight: 44, // Taller for better touch target
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden", // For gradient overlay
  },
  timeFilterButtonGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  timeFilterButtonActive: {
    backgroundColor: "transparent", // Gradient will be used instead
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }], // Slightly larger when active
  },
  timeFilterText: {
    fontSize: 13, // Slightly larger
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    letterSpacing: 0.2,
  },
  timeFilterTextActive: {
    color: "#FFFFFF",
    fontWeight: "700", // Bolder when active
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
    fontSize: 24, // Larger for better hierarchy
    fontWeight: "800", // Bolder
    color: "#0F172A", // Even darker for more contrast
    marginBottom: 20,
    letterSpacing: -0.5,
    lineHeight: 30,
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
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
    lineHeight: 16,
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
    marginBottom: 18,
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
    borderRadius: 18, // More rounded
    padding: 20, // More generous padding
    marginBottom: 14, // More spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12, // Softer blur
    elevation: 3,
    borderLeftWidth: 3, // Colored left border for visual interest
    borderLeftColor: "transparent", // Will be set dynamically
    overflow: "hidden",
  },
  activityItemGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.03,
  },
  activityIconContainer: {
    width: 48, // Larger
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.gap + 4,
    flexShrink: 0,
    // Gradient will be applied via LinearGradient component
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700", // Bolder for better hierarchy
    color: "#111827", // Darker
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  activityDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    lineHeight: 14,
  },
  profileMenuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Lighter overlay for modern feel
    zIndex: Z_INDEX.OVERLAY,
  },
  profileMenuContainer: {
    position: "absolute",
    right: 20,
    width: 300, // Slightly wider
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // More rounded
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28, // Even softer shadow
    elevation: 14,
    overflow: "hidden",
    borderWidth: 0,
  },
  profileMenuGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  profileMenuHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20, // Increased padding
    gap: 14,
    backgroundColor: "transparent", // Gradient will be used
    overflow: "hidden",
  },
  profileMenuHeaderGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  profileMenuImage: {
    width: 56, // Larger
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#235CF8", // Brand color border
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileMenuInfo: {
    flex: 1,
  },
  profileMenuName: {
    fontSize: 17, // Larger
    fontWeight: "700", // Bolder
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  profileMenuEmail: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  profileMenuDivider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: "hidden",
  },
  profileMenuDividerGradient: {
    height: 1,
    opacity: 0.15,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18, // Increased padding
    gap: 14,
    borderRadius: 14, // More rounded for modern feel
    marginHorizontal: 10,
    marginVertical: 3,
    overflow: "hidden",
  },
  profileMenuItemPressed: {
    backgroundColor: "rgba(35, 92, 248, 0.05)",
    transform: [{ scale: 0.98 }],
  },
  profileMenuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600", // Bolder
    color: "#111827",
    letterSpacing: -0.1,
  },
  notificationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: Z_INDEX.OVERLAY,
  },
  notificationDrawer: {
    position: "absolute",
    right: 20,
    width: 340, // Slightly wider
    maxHeight: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 24, // More rounded
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28, // Even softer shadow
    elevation: 14,
    overflow: "hidden",
    borderWidth: 0,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20, // Increased padding
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.08)",
    backgroundColor: "transparent", // Gradient will be used
    overflow: "hidden",
  },
  notificationHeaderGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  notificationTitle: {
    fontSize: 20, // Larger
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  notificationCloseButton: {
    width: 36, // Larger
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.04)", // Softer background
    overflow: "hidden",
  },
  notificationCloseButtonPressed: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    transform: [{ scale: 0.95 }],
  },
  notificationList: {
    maxHeight: 420,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 18, // Increased padding
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.06)",
    position: "relative",
    overflow: "hidden",
  },
  notificationItemPressed: {
    backgroundColor: "rgba(35, 92, 248, 0.03)",
  },
  notificationItemUnread: {
    backgroundColor: "rgba(35, 92, 248, 0.04)", // Softer unread background
    borderLeftWidth: 3,
    borderLeftColor: "#235CF8", // Accent border
  },
  notificationItemContent: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  notificationItemTime: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  notificationItemDot: {
    width: 10, // Larger
    height: 10,
    borderRadius: 5,
    backgroundColor: "#235CF8",
    marginLeft: 12,
    marginTop: 4,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 2,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0, // Removed border
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    paddingTop: 10,
    zIndex: Z_INDEX.HEADER_ACTIONS,
    overflow: "hidden",
  },
  bottomNavGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minHeight: 56,
  },
  bottomNavItemActive: {
    backgroundColor: "transparent", // Gradient will be used
    borderRadius: 16,
    marginHorizontal: 4,
  },
  bottomNavActiveIndicator: {
    position: "absolute",
    top: 0,
    left: "50%",
    marginLeft: -20,
    width: 40,
    height: 3,
    borderRadius: 2,
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
/**
 * Animated Header Button Component
 * Provides scale animation and haptic feedback on press
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
      style={adminStyles.headerActionButton}
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
 * Provides subtle pulse animation for notification badges
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
      style={[
        adminStyles.notificationBadge,
        { transform: [{ scale: pulseAnim }] },
      ]}
    >
      <Text style={adminStyles.notificationBadgeText}>{count}</Text>
    </Animated.View>
  );
};


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
        <LinearGradient
          colors={[`${iconColor}35`, `${iconColor}20`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={adminStyles.statIconContainer}
        >
          <Ionicons name={iconName} size={22} color={iconColor} />
        </LinearGradient>
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
          <LinearGradient
            colors={[iconColor, iconColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={adminStyles.statCardGradientOverlay}
          />
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
      <LinearGradient
        colors={[iconColor, iconColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={adminStyles.statCardGradientOverlay}
      />
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
      {isActive ? (
        <LinearGradient
          colors={["#235CF8", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={adminStyles.timeFilterButtonGradient}
        />
      ) : (
        <LinearGradient
          colors={["#FFFFFF", "#F9FAFB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={adminStyles.timeFilterButtonGradient}
        />
      )}
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
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }], borderLeftColor: color },
      ]}
    >
      <LinearGradient
        colors={[`${color}08`, `${color}03`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={adminStyles.activityItemGradient}
      />
      <LinearGradient
        colors={[`${color}40`, `${color}25`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={adminStyles.activityIconContainer}
      >
        <Ionicons name={icon as any} size={22} color={color} />
      </LinearGradient>
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
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [activeNavTab, setActiveNavTab] = React.useState("Dashboard");
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [profileHeaderHeight, setProfileHeaderHeight] = React.useState(0);
  const [profileImageError, setProfileImageError] = React.useState(false);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const headerRef = React.useRef<View>(null);
  const profileHeaderRef = React.useRef<View>(null);

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
      <LinearGradient
        colors={["#F8F9FA", "#E8EAED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={adminStyles.backgroundGradient}
      />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Header using ProfileHeader component with integrated actions */}
      <View
        ref={headerRef}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          const totalHeight = height + insets.top;
          setHeaderHeight(totalHeight);
        }}
      >
        {/* Simplified header structure - ProfileHeader with actions positioned absolutely */}
        <View style={adminStyles.headerContainer}>
          <View
            ref={profileHeaderRef}
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              setProfileHeaderHeight(height);
            }}
          >
            <ProfileHeader title="Admin Dashboard" showProfileCard={false} />
          </View>
          
          {/* Header Actions Row - Positioned dynamically based on ProfileHeader height */}
          <View style={[adminStyles.headerActionsRow, { top: Math.max(insets.top, 20) }]}>
            <View style={{ position: "relative" }}>
              <AnimatedHeaderButton
                onPress={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                accessibilityLabel="Notifications"
                accessibilityHint="Opens notification drawer"
              >
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
              </AnimatedHeaderButton>
              <PulsingBadge count={3} />
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
                <View style={[adminStyles.headerProfileImage, adminStyles.imagePlaceholder]}>
                  <Ionicons name="person" size={20} color="rgba(255, 255, 255, 0.6)" />
                </View>
              )}
              {profileImageError ? (
                <View style={[adminStyles.headerProfileImage, adminStyles.imagePlaceholder]}>
                  <Ionicons name="person-circle" size={36} color="rgba(255, 255, 255, 0.8)" />
                </View>
              ) : (
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                  }}
                  style={[adminStyles.headerProfileImage, isImageLoading && { opacity: 0 }]}
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
                router.push("/admin/ads");
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
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.08)", "rgba(35, 92, 248, 0.02)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={adminStyles.profileMenuHeaderGradient}
              />
              <View style={{ position: "relative" }}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                  }}
                  style={adminStyles.profileMenuImage}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#10B981",
                    borderWidth: 2,
                    borderColor: "#FFFFFF",
                  }}
                />
              </View>
              <View style={adminStyles.profileMenuInfo}>
                <Text style={adminStyles.profileMenuName}>Sajid Admani</Text>
                <Text style={adminStyles.profileMenuEmail}>sajid@easyauto.com</Text>
              </View>
            </View>
            <View style={adminStyles.profileMenuDivider}>
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.profileMenuDividerGradient}
              />
            </View>
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfileMenu(false);
                console.log("Profile clicked");
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.1)", "rgba(35, 92, 248, 0.05)"]}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="person" size={20} color="#235CF8" />
              </LinearGradient>
              <Text style={adminStyles.profileMenuItemText}>Profile</Text>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowProfileMenu(false);
                console.log("Settings clicked");
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.1)", "rgba(35, 92, 248, 0.05)"]}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="settings" size={20} color="#235CF8" />
              </LinearGradient>
              <Text style={adminStyles.profileMenuItemText}>Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
            <View style={adminStyles.profileMenuDivider}>
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.profileMenuDividerGradient}
              />
            </View>
            <TouchableOpacity
              style={adminStyles.profileMenuItem}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setShowProfileMenu(false);
                router.back();
              }}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.05)"]}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="log-out" size={20} color="#EF4444" />
              </LinearGradient>
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
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.08)", "rgba(35, 92, 248, 0.02)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={adminStyles.notificationHeaderGradient}
              />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "rgba(35, 92, 248, 0.1)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="notifications" size={22} color="#235CF8" />
                </View>
                <Text style={adminStyles.notificationTitle}>Notifications</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowNotifications(false)}
                style={adminStyles.notificationCloseButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={adminStyles.notificationList} showsVerticalScrollIndicator={false}>
              {[
                { id: "1", title: "New user registered", time: "2 min ago", unread: true, icon: "person-add", color: "#235CF8" },
                { id: "2", title: "Payment received", time: "15 min ago", unread: true, icon: "cash", color: "#10B981" },
                { id: "3", title: "Listing reported", time: "1 hour ago", unread: false, icon: "alert-circle", color: "#F59E0B" },
              ].map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  style={[adminStyles.notificationItem, notif.unread && adminStyles.notificationItemUnread]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowNotifications(false);
                  }}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={[`${notif.color}15`, `${notif.color}05`]}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={notif.icon as any} size={22} color={notif.color} />
                  </LinearGradient>
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
        <LinearGradient
          colors={["#FFFFFF", "#FAFBFC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={adminStyles.bottomNavGradient}
        />
        <TouchableOpacity
          style={[adminStyles.bottomNavItem, activeNavTab === "Dashboard" && adminStyles.bottomNavItemActive]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setActiveNavTab("Dashboard");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Dashboard" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.bottomNavActiveIndicator}
              />
            </>
          )}
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
            router.push("/admin/ads");
          }}
          activeOpacity={0.7}
        >
          {activeNavTab === "Ads" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.bottomNavActiveIndicator}
              />
            </>
          )}
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
          {activeNavTab === "Users" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.bottomNavActiveIndicator}
              />
            </>
          )}
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
          {activeNavTab === "Analytics" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.bottomNavActiveIndicator}
              />
            </>
          )}
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
          {activeNavTab === "Settings" && (
            <>
              <LinearGradient
                colors={["rgba(35, 92, 248, 0.12)", "rgba(35, 92, 248, 0.06)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: 16 }}
              />
              <LinearGradient
                colors={["#235CF8", "#1E40AF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={adminStyles.bottomNavActiveIndicator}
              />
            </>
          )}
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
