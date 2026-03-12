import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import COLORS from "@/constants/Colors";

interface BulkActionBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onApprove: () => void;
  onReject: () => void;
  onDelete: () => void;
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onApprove,
  onReject,
  onDelete,
}: BulkActionBarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSelectAll();
          }}
          style={styles.selectAllButton}
        >
          <Ionicons
            name={allSelected ? "checkbox" : "square-outline"}
            size={20}
            color={COLORS.admin.primary}
          />
          <Text style={styles.text}>{selectedCount} selected</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.right}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onApprove();
          }}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={COLORS.admin.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onReject();
          }}
        >
          <Ionicons name="close-circle-outline" size={20} color={COLORS.admin.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onDelete();
          }}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.admin.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.admin.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.admin.border,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.admin.primary,
  },
  right: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.admin.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.admin.border,
  },
});
