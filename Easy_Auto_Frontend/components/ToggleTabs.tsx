// components/ToggleTabs.tsx
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "./theme";

type Tab = { key: string; label: string; onPress?: () => void };
export default function ToggleTabs({ left, right }: { left: Tab; right: Tab }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.tab, left.onPress ? styles.inactive : styles.active]} onPress={left.onPress}>
        <Text style={[styles.text, left.onPress ? styles.textPrimary : styles.textWhite]}>{left.label}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, right.onPress ? styles.active : styles.inactive]} onPress={right.onPress}>
        <Text style={[styles.text, right.onPress ? styles.textWhite : styles.textPrimary]}>{right.label}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignSelf: "center", marginTop: 12, borderRadius: 28, overflow: "hidden" },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  active: { backgroundColor: colors.primary },
  inactive: { backgroundColor: colors.bgLight },
  text: { fontWeight: "700", fontSize: 14 },
  textWhite: { color: colors.white },
  textPrimary: { color: colors.primary },
});
