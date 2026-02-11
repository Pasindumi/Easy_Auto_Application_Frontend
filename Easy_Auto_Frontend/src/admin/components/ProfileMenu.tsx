import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface ProfileMenuProps {
  isVisible: boolean;
  onClose: () => void;
  topPosition: number;
  profileInfo: {
    name: string;
    email: string;
    imageUrl: string;
  };
  onProfilePress: () => void;
  onSettingsPress: () => void;
  onLogoutPress: () => void;
}

export default function ProfileMenu({
  isVisible,
  onClose,
  topPosition,
  profileInfo,
  onProfilePress,
  onSettingsPress,
  onLogoutPress,
}: ProfileMenuProps) {
  if (!isVisible) return null;

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={[styles.container, { top: topPosition }]}>
        <View style={styles.header}>
          <LinearGradient
            colors={["rgba(35, 92, 248, 0.08)", "rgba(35, 92, 248, 0.02)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          />
          <View style={{ position: "relative" }}>
            <Image source={{ uri: profileInfo.imageUrl }} style={styles.image} />
            <View style={styles.onlineIndicator} />
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{profileInfo.name}</Text>
            <Text style={styles.email}>{profileInfo.email}</Text>
          </View>
        </View>

        <View style={styles.divider}>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerGradient}
          />
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
            onProfilePress();
          }}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["rgba(35, 92, 248, 0.1)", "rgba(35, 92, 248, 0.05)"]}
            style={styles.iconContainer}
          >
            <Ionicons name="person" size={20} color="#235CF8" />
          </LinearGradient>
          <Text style={styles.menuItemText}>Profile</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onClose();
            onSettingsPress();
          }}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["rgba(35, 92, 248, 0.1)", "rgba(35, 92, 248, 0.05)"]}
            style={styles.iconContainer}
          >
            <Ionicons name="settings" size={20} color="#235CF8" />
          </LinearGradient>
          <Text style={styles.menuItemText}>Settings</Text>
          <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.divider}>
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)", "rgba(0, 0, 0, 0)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerGradient}
          />
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onClose();
            onLogoutPress();
          }}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={["rgba(239, 68, 68, 0.1)", "rgba(239, 68, 68, 0.05)"]}
            style={styles.iconContainer}
          >
            <Ionicons name="log-out" size={20} color="#EF4444" />
          </LinearGradient>
          <Text style={[styles.menuItemText, { color: "#EF4444" }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 2000,
    elevation: 2000,
  },
  container: {
    position: "absolute",
    right: 20,
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 14,
    overflow: "hidden",
    borderWidth: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 14,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#235CF8",
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  email: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: "hidden",
  },
  dividerGradient: {
    height: 1,
    opacity: 0.15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
    borderRadius: 14,
    marginHorizontal: 10,
    marginVertical: 3,
    overflow: "hidden",
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    letterSpacing: -0.1,
  },
});
