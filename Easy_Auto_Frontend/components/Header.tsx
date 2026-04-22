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

          {/* Right: Right Element (Optional) or Logo */}
          <View style={styles.rightContent}>
            {rightElement ? (
              <View style={styles.rightElementContainer}>
                {rightElement}
              </View>
            ) : (
              <View pointerEvents="none" style={styles.rightLogoContainer}>
                <Image
                  source={require("@/assets/logoHome.png")}
                  resizeMode="contain"
                  style={styles.logoImg}
                />
              </View>
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
    height: 85, // reduced height to make it thinner
    overflow: "hidden",
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
    flex: 1, // allow title to take more space
  },
  rightLogoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4, // pull a little bit to the center
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImg: {
    width: 100, 
    height: 22,
  },
  rightElementContainer: {
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 16, // slightly larger standard heading
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  titleContainer: {
    marginLeft: 2,
  },
});
