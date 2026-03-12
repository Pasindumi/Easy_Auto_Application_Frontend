// app/select-language.tsx
import Header from "../../components/Header";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import COLORS from "@/constants/Colors";

export default function SelectLanguage() {
  const [selected, setSelected] = useState("en");
  const router = useRouter();

  const saveScale = useSharedValue(1);

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const onPressIn = (sv: any) => {
    sv.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = (sv: any) => {
    sv.value = withSpring(1);
  };

  const languages = [
    {
      code: "si",
      name: "Sinhala",
      native: "සිංහල",
      icon: "web",
      color: "#F97316",
    },
    {
      code: "ta",
      name: "Tamil",
      native: "தமிழ்",
      icon: "translate",
      color: "#10B981",
    },
    {
      code: "en",
      name: "English",
      native: "English",
      icon: "earth",
      color: "#2563EB",
    },
  ];

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Header title="Select Language" showBack={true} />

      <View style={styles.headerSpacer} />

      <View style={styles.content}>
        <Text style={styles.sectionHeader}>PREFERENCE</Text>

        <View style={styles.panel}>
          {languages.map((lang, index) => {
            const rowScale = useSharedValue(1);
            const rowStyle = useAnimatedStyle(() => ({
              transform: [{ scale: rowScale.value }],
              backgroundColor: selected === lang.code ? '#F9FAFB' : COLORS.white,
            }));

            return (
              <Animated.View key={lang.code} style={rowStyle}>
                <TouchableOpacity
                  style={[
                    styles.langRow,
                    index === languages.length - 1 && { borderBottomWidth: 0 }
                  ]}
                  onPressIn={() => onPressIn(rowScale)}
                  onPressOut={() => onPressOut(rowScale)}
                  onPress={() => setSelected(lang.code)}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: lang.color + "15" },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={lang.icon as any}
                      size={24}
                      color={lang.color}
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.langName}>{lang.name}</Text>
                    <Text style={styles.langNative}>{lang.native}</Text>
                  </View>

                  {selected === lang.code && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={COLORS.primary}
                    />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View style={[styles.actionWrapper, saveButtonStyle]}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPressIn={() => onPressIn(saveScale)}
            onPressOut={() => onPressOut(saveScale)}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, '#1e3a8a']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons name="save" size={20} color="#fff" />
              <Text style={styles.saveText}>Confirm Language</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerSpacer: {
    height: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 16,
    fontSize: 12,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
  },
  panel: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  langName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  langNative: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: '600',
  },
  actionWrapper: {
    paddingHorizontal: 24,
    marginTop: 60,
  },
  saveBtn: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 12,
  },
  saveText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});