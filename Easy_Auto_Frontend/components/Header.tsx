// components/Header.tsx
import COLORS from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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
  const { isDarkMode, colors } = useTheme();
  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);
  const contentColor = isDarkMode ? colors.text.primary : "#fff";

  return (
    <View style={[themeStyles.container, style]}>
      <RNStatusBar
        backgroundColor={isDarkMode ? colors.backgroundSecondary : colors.primary}
        barStyle="light-content"
      />

      <SafeAreaView edges={["top"]} style={themeStyles.safeArea}>
        <View style={themeStyles.headerRow}>
          {/* Left: Back Button & Title */}
          <View style={themeStyles.leftContent}>
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              style={themeStyles.backButton}
              activeOpacity={0.7}
            >
              {showBack ? (
                <Ionicons name="chevron-back" size={26} color={contentColor} />
              ) : (
                <View style={{ width: 0 }} />
              )}
            </TouchableOpacity>

            {title && (
              <View style={themeStyles.titleContainer}>
                <Text style={themeStyles.title} numberOfLines={1}>{title}</Text>
              </View>
            )}
          </View>

          {/* Right: Right Element (Optional) or Logo */}
          <View style={themeStyles.rightContent}>
            {rightElement ? (
              <View style={themeStyles.rightElementContainer}>
                {rightElement}
              </View>
            ) : (
              <View pointerEvents="none" style={themeStyles.rightLogoContainer}>
                <Image
                  source={require("@/assets/logoHome.png")}
                  resizeMode="contain"
                  style={[themeStyles.logoImg, { tintColor: contentColor }]}
                />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isDarkMode ? colors.backgroundSecondary : colors.primary,
    width: "100%",
    height: Platform.OS === 'ios' ? 100 : 85,
    overflow: "hidden",
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderBottomWidth: isDarkMode ? 1 : 0,
    borderBottomColor: colors.border,
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
    flex: 1,
  },
  rightLogoContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 4,
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
    color: isDarkMode ? colors.text.primary : "#fff",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  titleContainer: {
    marginLeft: 2,
  },
});


