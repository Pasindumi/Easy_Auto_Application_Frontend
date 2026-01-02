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

export default function SelectLanguage() {
  const [selected, setSelected] = useState("en");
  const router = useRouter();

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
    // Navigate to home page after selection
    router.push('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <Header />
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <TouchableOpacity onPress={() => router.back()} style={headerSectionStyles.headerLeft}>
            {/* Added back functionality to header */}
            <Ionicons name="arrow-back" size={24} color="#235CF8" style={{ marginRight: 10 }} />
            <Ionicons name="language-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={headerSectionStyles.headerTitle}>Select Language</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.topText}>
          Choose your preferred language
        </Text>

        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langCard,
              selected === lang.code && {
                borderColor: "#2563EB",
                backgroundColor: "#EFF6FF",
              },
            ]}
            onPress={() => setSelected(lang.code)}
          >
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: lang.color + "20" },
              ]}
            >
              <MaterialCommunityIcons
                name={lang.icon as any}
                size={28}
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
                size={26}
                color="#2563EB"
              />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.saveText}>Save Language</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    height: 110,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  content: {
    padding: 20,
  },
  topText: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    fontWeight: "600",
  },
  langCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  langName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  langNative: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  saveBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});