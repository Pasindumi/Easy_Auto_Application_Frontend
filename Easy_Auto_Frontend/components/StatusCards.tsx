import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  counts: { total: number; active: number; draft: number; paused: number };
  selectedFilter: "all" | "Active" | "Draft" | "Paused" | null;
  onSelect: (key: "all" | "Active" | "Draft" | "Paused" | null) => void;
};

const CONFIG = [
  { key: "all", label: "Total", icon: "layers-outline", color: "#3B82F6" },
  { key: "Active", label: "Active", icon: "checkmark-circle", color: "#10B981" },
  { key: "Draft", label: "Draft", icon: "document-text", color: "#FBBF24" },
  { key: "Paused", label: "Paused", icon: "pause-circle", color: "#EF4444" },
] as const;

export default function StatusCards({ counts, selectedFilter, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <View style={styles.statusRow}>
      {CONFIG.map((c) => {
        const active = (selectedFilter === null && c.key === "all") || selectedFilter === c.key;
        const number =
          c.key === "all"
            ? counts.total
            : c.key === "Active"
            ? counts.active
            : c.key === "Draft"
            ? counts.draft
            : counts.paused;

        const isHovered = hovered === c.key;

        return (
          <TouchableOpacity
            key={c.key}
            style={[
              styles.statusCard,
              active && { borderColor: c.color, borderWidth: 1.5, backgroundColor: "#F0F7FF" },
              isHovered && { borderColor: c.color, borderWidth: 1.5 },
            ]}
            onPress={() => onSelect(active ? null : (c.key as any))}
            activeOpacity={0.85}
            onPressIn={() => setHovered(c.key)}
            onPressOut={() => setHovered(null)}
          >
            <Ionicons name={c.icon as any} size={18} color={c.color} style={{ marginBottom: 4 }} />
            <Text style={[styles.statusCardNumber, active && { color: c.color }]}>{String(number).padStart(2, "0")}</Text>
            <Text style={[styles.statusCardLabel, active && { color: c.color }]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  statusRow: { flexDirection: "row", paddingHorizontal: 16, paddingBottom: 10 },
  statusCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginRight: 8,
    shadowColor: "#0044FFFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  statusCardLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.2,
  },
  statusCardNumber: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});
