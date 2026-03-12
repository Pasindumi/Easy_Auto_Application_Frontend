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

interface QuickAction {
  id: string;
  icon: string;
  label: string;
  description: string;
  badge?: number;
  action: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  onActionPress: (action: string) => void;
}

const QuickActionItem = ({
  label,
  icon,
  badge,
  description,
  delay,
  onPress,
}: QuickAction & { delay: number; onPress: () => void }) => {
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

  // Get color based on icon type - unified to theme blues
  const getIconColor = () => {
    return COLORS.admin.primary;
  };

  const iconColor = getIconColor();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        style={styles.item}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[COLORS.admin.background, COLORS.admin.border]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrapper}
        >
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
        <View style={styles.right}>
          {badge !== undefined && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {badge > 99 ? "99+" : badge}
              </Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={COLORS.admin.accent} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function QuickActions({
  actions,
  onActionPress,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      {actions.map((action, index) => (
        <QuickActionItem
          key={action.id}
          {...action}
          delay={300 + index * 50}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onActionPress(action.action);
          }}
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.admin.text,
    marginBottom: 20,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.admin.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.admin.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.admin.border,
    gap: 12,
    minHeight: 72,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    flexShrink: 0,
    borderWidth: 1,
    borderColor: COLORS.admin.border,
  },
  content: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.admin.text,
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  description: {
    fontSize: 12,
    color: COLORS.admin.text,
    opacity: 0.6,
    fontWeight: "400",
    lineHeight: 16,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  badge: {
    backgroundColor: COLORS.admin.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
});
