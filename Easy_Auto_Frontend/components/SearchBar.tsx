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
  searchWrapper: { paddingHorizontal: 20, paddingTop: 0, paddingBottom: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",

    // Shadow for iOS
    shadowColor: "#0044ffff", // blue shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3, // slightly stronger
    shadowRadius: 5,

    // Shadow for Android
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    padding: 0,
    fontWeight: "400",
  },
});
