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

interface Activity {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}

interface RecentActivityProps {
  activities: Activity[];
  onViewAll: () => void;
}

const ActivityItem = ({
  icon,
  title,
  description,
  time,
  color,
  delay,
}: Activity & { delay: number }) => {
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

  // Determine border color based on activity type - unified to theme blues
  const getBorderColor = () => {
    return color || COLORS.admin.primary;
  };

  return (
    <Animated.View
      style={[
        styles.activityItem,
        {
          borderLeftColor: getBorderColor(),
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={[`${color}08`, `${color}03`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityItemGradient}
      />
      <LinearGradient
        colors={[`${color}25`, `${color}15`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.activityIconContainer}
      >
        <Ionicons name={icon as any} size={22} color={color} />
      </LinearGradient>
      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activityDescription}>{description}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </Animated.View>
  );
};

export default function RecentActivity({
  activities,
  onViewAll,
}: RecentActivityProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onViewAll();
          }}
        >
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      {activities.map((activity, index) => (
        <ActivityItem
          key={activity.id}
          {...activity}
          delay={700 + index * 50}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.admin.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.admin.primary,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.admin.surface,
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    shadowColor: COLORS.admin.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.admin.primary,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.admin.text,
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  activityDescription: {
    fontSize: 13,
    color: COLORS.admin.text,
    opacity: 0.7,
    marginBottom: 4,
    lineHeight: 18,
  },
  activityTime: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    lineHeight: 14,
  },
});
