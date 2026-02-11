import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export type SortOption = "date" | "views" | "price";

interface SortBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
}

const SORT_OPTIONS = [
  { key: "date" as const, label: "Date Posted", icon: "calendar-outline" },
  { key: "views" as const, label: "Most Viewed", icon: "eye-outline" },
  { key: "price" as const, label: "Price (High to Low)", icon: "cash-outline" },
];

export default function SortBottomSheet({
  visible,
  onClose,
  sortBy,
  onSortChange,
}: SortBottomSheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Sort By</Text>
          {SORT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.option,
                sortBy === option.key && styles.optionActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onSortChange(option.key);
                onClose();
              }}
            >
              <Ionicons
                name={option.icon as any}
                size={20}
                color={sortBy === option.key ? "#235CF8" : "#6B7280"}
              />
              <Text
                style={[
                  styles.optionText,
                  sortBy === option.key && styles.optionTextActive,
                ]}
              >
                {option.label}
              </Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={20} color="#235CF8" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "85%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    marginBottom: 8,
  },
  optionActive: {
    backgroundColor: "#EEF2FF",
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
  },
  optionTextActive: {
    color: "#235CF8",
    fontWeight: "600",
  },
});
