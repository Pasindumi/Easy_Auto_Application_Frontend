// app/select-language.tsx
import Header from "../../components/Header";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SelectLanguage() {
  const [selected, setSelected] = useState("en");
  const router = useRouter();

  const languages = [
    {
      code: "si",
      name: "Sinhala",
      native: "සිංහල",
      icon: "language",
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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      {/* Header */}
      <Header />
      <View style={localStyles.headerWrap}>
        <View style={localStyles.header}>
          <View style={localStyles.headerLeft}>
            <Ionicons name="language-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={localStyles.headerTitle}>Select Language</Text>
          </View>
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

        <TouchableOpacity style={styles.saveBtn}>
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
    backgroundColor: "#F4F6FA",
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

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F4F6FA' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
