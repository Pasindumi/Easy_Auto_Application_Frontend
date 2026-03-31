// components/Header.tsx
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HEADER_HEIGHT = 135; // Reduced from 175 for a more compact, sleeker profile

type Props = {
  showBack?: boolean;
  title?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  rightElement?: React.ReactNode;
  style?: any;
};

export default function Header({ showBack = true, title, iconName, rightElement, style }: Props) {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === "android" && (
        <RNStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      )}

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerRow}>
          {/* Left: Back Button & Title */}
          <View style={styles.leftContent}>
            <TouchableOpacity
              onPress={() => {
                router.back(); // Changed to standard back to prevent accidental home-only routing
              }}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              {showBack ? (
                <Ionicons name="chevron-back" size={26} color="#fff" />
              ) : (
                <View style={{ width: 0 }} />
              )}
            </TouchableOpacity>

            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
              </View>
            )}
          </View>

          {/* Center: Logo (Absolute Centered) */}
          <View pointerEvents="none" style={styles.centerLogoContainer}>
            <Image
              source={require("@/assets/logoHome.png")}
              resizeMode="contain"
              style={styles.logoImg}
            />
          </View>

          {/* Right: Right Element (Optional) */}
          <View style={styles.rightContent}>
            {rightElement ? (
              <View style={styles.rightElementContainer}>
                {rightElement}
              </View>
            ) : (
              <View style={{ width: 44 }} /> // Placeholder to maintain balance
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    width: "100%",
    height: 105,
    overflow: "hidden",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 60,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    maxWidth: '35%', // Limit title width to avoid center overlap
  },
  centerLogoContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    marginLeft: 20, // Shift logo slightly right to avoid long title overlap
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 10,
    maxWidth: '25%',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImg: {
    width: 100, // Slightly smaller for better fit
    height: 22,
  },
  rightElementContainer: {
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 14, // Slightly smaller for better fit
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  titleContainer: {
    marginLeft: 2,
  },
});
