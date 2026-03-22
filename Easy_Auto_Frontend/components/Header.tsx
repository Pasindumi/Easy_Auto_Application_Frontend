// components/Header.tsx
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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

export const HEADER_HEIGHT = 110; 

type Props = {
  showBack?: boolean;
  title?: string;
  leftElement?: React.ReactNode;
  centerElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  isFlat?: boolean;
};

export default function Header({ 
  showBack = true, 
  title, 
  leftElement,
  centerElement,
  rightElement,
  isFlat = false
}: Props) {
  const router = useRouter();

  return (
    <View style={[styles.container, isFlat && styles.flatContainer]}>
      {Platform.OS === "android" && (
        <RNStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      )}

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerRow}>
          {/* Left: Element or Back Button & Title */}
          <View style={[styles.leftContent, centerElement ? { flex: 1.5 } : { flex: 2.5 }]}>
            {leftElement ? (
              leftElement
            ) : (
              <View style={styles.backTitleRow}>
                {showBack && (
                  <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                  </TouchableOpacity>
                )}
                {title && !centerElement && (
                  <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Center: Specialized Element (e.g. Search Bar) */}
          {centerElement && (
            <View style={styles.centerContent}>
              {centerElement}
            </View>
          )}

          {/* Right: Right Element & Logo */}
          <View style={[styles.rightContent, centerElement ? { flex: 1 } : { flex: 1.5 }]}>
            {rightElement && (
              <View style={styles.rightElementContainer}>
                {rightElement}
              </View>
            )}
            <Image
              source={require("@/assets/logoHome.png")}
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
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    zIndex: 100,
  },
  flatContainer: {
    height: 90, // Significantly more compact
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    elevation: 4,
    shadowRadius: 5,
    shadowOpacity: 0.1,
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
    height: 64,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4,
  },
  backTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerContent: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoImg: {
    width: 75,
    height: 18,
    opacity: 0.95,
  },
  rightElementContainer: {
    justifyContent: 'center',
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  titleContainer: {
    marginLeft: 2,
  },
});
