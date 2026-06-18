// components/SearchBar.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  backgroundColor?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search listings...",
  backgroundColor
}: Props) {
  const { colors, isDarkMode } = useTheme();
  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  const finalBackgroundColor = backgroundColor || (isDarkMode ? colors.backgroundSecondary : "#E0F2FE");

  return (
    <View style={themeStyles.searchWrapper}>
      <View style={[themeStyles.searchContainer, { backgroundColor: finalBackgroundColor }]}>
        <Ionicons name="search-outline" size={18} color={isDarkMode ? colors.text.muted : "#9CA3AF"} />
        <TextInput
          style={themeStyles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? colors.text.muted : "#9CA3AF"}
          value={value}
          onChangeText={onChange}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChange("")}>
            <Ionicons name="close-circle" size={18} color={isDarkMode ? colors.text.muted : "#9CA3AF"} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  searchWrapper: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 10 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: "500",
  },
});

