// components/SearchBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder = "Search listings..." }: Props) {
  return (
    <View style={styles.searchWrapper}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// Search styles (kept exactly as provided)
const styles = StyleSheet.create({
  searchWrapper: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
});
