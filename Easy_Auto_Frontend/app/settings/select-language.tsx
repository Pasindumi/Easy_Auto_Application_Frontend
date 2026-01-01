import Header from "../../components/Header";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SelectLanguage() {
  const [selected, setSelected] = useState("en");
  const router = useRouter();

  const languages = [
    {
      code: "si",
      name: "Sinhala",
      native: "සිංහල",
      icon: "translate",
      color: "#F97316",
    },
    {
      code: "ta",
      name: "Tamil",
      native: "தமிழ்",
      icon: "chat-processing",
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
    // Navigate to home page after selection
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#F8FAFC", "#EFF6FF", "#DBEAFE"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <Header />

        <Animated.View
          entering={FadeInDown.duration(600)}
          style={localStyles.headerWrap}
        >
          <View style={localStyles.header}>
            <View style={localStyles.headerLeft}>
              <View style={localStyles.accentBar} />
              <View>
                <Text style={localStyles.headerTitle}>Language</Text>
                <Text style={localStyles.headerSubtitle}>Choose your preference</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.content}>
          <Animated.Text
            entering={FadeInDown.delay(200).duration(600)}
            style={styles.topText}
          >
            Select your preferred language to continue
          </Animated.Text>

          <View style={styles.langGrid}>
            {languages.map((lang, index) => (
              <LanguageCard
                key={lang.code}
                lang={lang}
                index={index}
                isSelected={selected === lang.code}
                onSelect={() => setSelected(lang.code)}
              />
            ))}
          </View>

          <Animated.View entering={FadeInDown.delay(600).duration(600)}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { transform: [{ scale: 0.98 }] }
              ]}
              onPress={handleSave}
            >
              <LinearGradient
                colors={["#2563EB", "#1D4ED8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtnGradient}
              >
                <Text style={styles.saveText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

function LanguageCard({ lang, index, isSelected, onSelect }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isSelected ? 1.02 : 1) }],
    borderColor: isSelected ? "#2563EB" : "#E2E8F0",
    backgroundColor: "#FFFFFF",
  }));

  return (
    <AnimatedPressable
      entering={FadeInRight.delay(300 + index * 100).duration(600)}
      onPress={onSelect}
      style={[styles.langCard, animatedStyle]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: lang.color + "15" },
        ]}
      >
        <MaterialCommunityIcons
          name={lang.icon as any}
          size={22}
          color={lang.color}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.langName}>
          {lang.name}
        </Text>
        <Text style={styles.langNative}>{lang.native}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  topText: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 32,
    fontWeight: "500",
    textAlign: "center",
  },
  langGrid: {
    gap: 16,
    marginBottom: 40,
  },
  langCard: {
    padding: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  langName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  langNative: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 1,
  },
  saveBtn: {
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#2563EB",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 8,
  },
  saveBtnGradient: {
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});

const localStyles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  accentBar: {
    width: 4,
    height: 32,
    backgroundColor: "#2563EB",
    borderRadius: 2,
    marginRight: 12,
  },
  headerTitle: {
    color: "#1E293B",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
    marginTop: -2,
  },
});
