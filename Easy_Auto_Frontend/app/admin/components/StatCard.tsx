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

interface StatCardProps {
  delay: number;
  title: string;
  value: string;
  label: string;
  iconName: any;
  iconColor: string;
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
          colors={[`${iconColor}35`, `${iconColor}20`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconContainer}
        >
          <Ionicons name={iconName} size={22} color={iconColor} />
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
              color={
                trend === "up"
                  ? "#10B981"
                  : trend === "down"
                  ? "#EF4444"
                  : "#6B7280"
              }
            />
            <Text
              style={[
                styles.trendText,
                trend === "up" && styles.trendTextUp,
                trend === "down" && styles.trendTextDown,
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
          <LinearGradient
            colors={[iconColor, iconColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientOverlay}
          />
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
      <LinearGradient
        colors={[iconColor, iconColor]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      />
      {CardContent}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
    width: "48%",
    borderWidth: 0,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.04,
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
    color: "#4B5563",
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
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
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
});
