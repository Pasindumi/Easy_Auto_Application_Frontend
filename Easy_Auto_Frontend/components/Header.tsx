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
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              }
            }}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            {showBack ? (
              <Ionicons name="arrow-back" size={22} color="#fff" />
            ) : (
              <View style={{ width: 22 }} />
            )}
          </TouchableOpacity>

          {/* Right Aligned Content */}
          <View style={styles.rightWrap}>
            {title ? (
              <Text style={styles.title}>{title}</Text>
            ) : (
              <Image
                source={require("../assets/applogonew.png")}
                resizeMode="contain"
                style={styles.logoImg}
              />
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
  rightWrap: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  logoImg: {
    width: 280,
    height: 80,
    marginRight: -10, // Pull it closer to the edge
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
