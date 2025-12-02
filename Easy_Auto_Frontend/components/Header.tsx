// components/Header.tsx
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

export const HEADER_HEIGHT = 80;  // small header

type Props = {
  showBack?: boolean;
  title?: string;
};

export default function Header({ showBack = true, title }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <RNStatusBar backgroundColor="#1E60FF" barStyle="light-content" />
      )}

      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            {showBack ? (
              <Ionicons name="arrow-back" size={22} color="#fff" />
            ) : (
              <View style={{ width: 22 }} />
            )}
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.centerWrap}>
            {!title && (
              <Image
                source={require("@/assets/images/logo.png")}
                resizeMode="contain"
                style={styles.logoImg}
              />
            )}

            {title && <Text style={styles.title}>{title}</Text>}
          </View>

          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1E60FF",
    width: "100%",
    height: HEADER_HEIGHT,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: "hidden",
  },
  safeArea: {
    flex: 1,
    justifyContent: "center",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  centerWrap: {
    flex: 1,
    alignItems: "center",
  },
  logoImg: {
    width: 100,
    height: 32,
    marginTop: 0,   // ← moves logo upward
  },
  title: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
