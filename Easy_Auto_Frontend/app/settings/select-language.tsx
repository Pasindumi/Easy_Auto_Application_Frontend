// app/settings/select-language.tsx
import Header from "../../components/Header";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import COLORS from "@/constants/Colors";

export default function SelectLanguage() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language || "en");
  const router = useRouter();

  useEffect(() => {
    setSelected(i18n.language || "en");
  }, [i18n.language]);

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
      code: "en",
      name: "English",
      native: "English",
      icon: "earth",
      color: "#2563EB",
      desc: "Set app language to English",
    },
    {
      code: "si",
      name: "Sinhala",
      native: "සිංහල",
      icon: "web",
      color: "#F97316",
      desc: "යෙදුමේ භාෂාව සිංහලට වෙනස් කරන්න",
    },
    {
      code: "ta",
      name: "Tamil",
      native: "தமிழ்",
      icon: "translate",
      color: "#10B981",
      desc: "பயன்பாட்டு மொழியை தமிழுக்கு மாற்றவும்",
    },
  ];

  const handleSave = () => {
    i18n.changeLanguage(selected);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('select_language.title', 'App Language')} showBack={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>{t('select_language.preference', 'Language Preference')}</Text>
          <Text style={styles.subTitle}>Select the language you want to use throughout the EasyAuto application.</Text>
        </View>

        <View style={styles.cardsContainer}>
          {languages.map((lang, index) => {
            const rowScale = useSharedValue(1);
            const isSelected = selected === lang.code;

            const rowStyle = useAnimatedStyle(() => ({
              transform: [{ scale: rowScale.value }],
            }));

            return (
              <Animated.View key={lang.code} style={rowStyle}>
                <TouchableOpacity
                  style={[
                    styles.langCard,
                    isSelected && styles.langCardSelected
                  ]}
                  onPressIn={() => onPressIn(rowScale)}
                  onPressOut={() => onPressOut(rowScale)}
                  onPress={() => setSelected(lang.code)}
                  activeOpacity={1}
                >
                  <View
                    style={[
                      styles.iconWrapper,
                      { backgroundColor: isSelected ? `${COLORS.primary}15` : '#F1F5F9' },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={lang.icon as any}
                      size={26}
                      color={isSelected ? COLORS.primary : "#64748B"}
                    />
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={[styles.langName, isSelected && styles.textSelected]}>
                      {lang.name}
                    </Text>
                    <View style={styles.nativeBadge}>
                      <Text style={styles.langNative}>{lang.native}</Text>
                    </View>
                    <Text style={styles.langDesc} numberOfLines={1}>{lang.desc}</Text>
                  </View>

                  <View style={[
                    styles.radioCircle,
                    isSelected && styles.radioCircleSelected
                  ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={styles.footer}>
        <Animated.View style={saveButtonStyle}>
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
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text style={styles.saveText}>{t('select_language.confirm', 'Apply Changes')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 150, // space for footer
    paddingHorizontal: 20,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  cardsContainer: {
    gap: 16,
  },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  langCardSelected: {
    borderColor: COLORS.primary,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  langName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 2,
  },
  textSelected: {
    color: COLORS.primary,
  },
  nativeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  langNative: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '700',
  },
  langDesc: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  radioCircleSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 64,
    paddingTop: 20,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  saveBtn: {
    height: 56,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});