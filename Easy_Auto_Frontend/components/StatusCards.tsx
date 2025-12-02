// components/StatusCards.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "./listingStyles";

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
  return (
    <View style={styles.statusRow}>
      {CONFIG.map((c) => {
        const active = (selectedFilter === null && c.key === "all") || selectedFilter === c.key;
        const number =
          c.key === "all" ? counts.total : c.key === "Active" ? counts.active : c.key === "Draft" ? counts.draft : counts.paused;
        return (
          <TouchableOpacity
            key={c.key}
            style={[styles.statusCard, active && styles.statusCardActive]}
            onPress={() => onSelect(active ? null : (c.key as any))}
            activeOpacity={0.85}
          >
            <Ionicons name={c.icon as any} size={18} color={c.color} style={{ marginBottom: 4 }} />
            <Text style={[styles.statusCardNumber, active && styles.statusCardNumberActive]}>{String(number).padStart(2, "0")}</Text>
            <Text style={[styles.statusCardLabel, active && styles.statusCardLabelActive]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
