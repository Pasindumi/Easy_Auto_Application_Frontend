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
};

export default function Header({ showBack = true, title, iconName, rightElement }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <RNStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      )}

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerRow}>
          {/* Left Side: Back Button + Title Pill */}
          <View style={styles.leftContent}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/"); // Always navigate to home on back press
              }}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              {showBack ? (
                <Ionicons name="arrow-back" size={26} color="#fff" />
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

          {/* Right Side: Logo + Optional Element */}
          <View style={styles.rightContent}>
            {rightElement && (
              <View style={styles.rightElementContainer}>
                {rightElement}
              </View>
            )}
            <Image
              source={require("../assets/applogonew.png")}
              resizeMode="contain"
              style={styles.logoImg}
            />
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
    height: HEADER_HEIGHT,
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  safeArea: {
    flex: 1,
    paddingTop: 8, // More compact padding for the shorter height
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.4, // More space for the title pill
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1.6, // Balanced with the massive logo
  },
  backButton: {
    width: 38,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  logoImg: {
    width: 200, // Slightly reduced to fit the shorter height better
    height: 60,
    marginRight: -25, // Moved further to the right edge
  },
  rightElementContainer: {
    marginRight: 8,
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 14, // Slightly smaller to guarantee fit
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  titleContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 14, // Tighter padding to save space
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerWrap: { backgroundColor: '#F9FAFB' },
});
