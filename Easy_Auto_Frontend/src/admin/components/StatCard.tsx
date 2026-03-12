import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "@/constants/Colors";

interface StatCardProps {
  delay: number;
  title: string;
  value: string;
  label: string;
  iconName: any;
  iconColor?: string; // Optional now as we use theme colors
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  onPress?: () => void;
}

export default function StatCard({
  delay,
  title,
  value,
  label,
  iconName,
  iconColor,
  trend,
  trendValue,
  onPress,
}: StatCardProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const pressScale = React.useRef(new Animated.Value(1)).current;

  // Use admin theme primary if iconColor not provided
  const themeColor = iconColor || COLORS.admin.primary;

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
    <View style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>
        <LinearGradient
          colors={[COLORS.admin.border, COLORS.admin.background]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={iconName} size={22} color={COLORS.admin.primary} />
        </LinearGradient>
      </View>
      <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
        {value}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.label} numberOfLines={1} ellipsizeMode="tail">
          {label}
        </Text>
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            <Ionicons
              name={
                trend === "up"
                  ? "trending-up"
                  : trend === "down"
                    ? "trending-down"
                    : "remove"
              }
              size={12}
              color={COLORS.admin.primary}
            />
            <Text
              style={[
                styles.trendText,
                { color: COLORS.admin.primary }
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
        style={styles.card}
      >
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
                { scale: pressScale },
              ],
            },
          ]}
        >
          <View style={styles.gradientOverlay} />
          {CardContent}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.gradientOverlay} />
      {CardContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.admin.surface,
    borderRadius: 20,
    shadowColor: COLORS.admin.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    width: "48%",
    borderWidth: 1,
    borderColor: COLORS.admin.border,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.admin.primary,
    opacity: 0.02,
  },
  content: {
    padding: 22,
    minHeight: 145,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.admin.text,
    opacity: 0.7,
    flex: 1,
    flexShrink: 1,
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.admin.border,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.admin.text,
    marginBottom: 8,
    flexShrink: 1,
    lineHeight: 34,
    letterSpacing: -0.7,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.admin.text,
    opacity: 0.5,
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
    backgroundColor: COLORS.admin.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
