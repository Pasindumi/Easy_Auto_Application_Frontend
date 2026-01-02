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

export const HEADER_HEIGHT = 120;  // small header

type Props = {
  showBack?: boolean;
  title?: string;
};

export default function Header({ showBack = true, title }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {Platform.OS === "android" && (
        <RNStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
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
    backgroundColor: COLORS.primary,
    width: "100%",
    height: HEADER_HEIGHT,
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


   headerWrap: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
   headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
