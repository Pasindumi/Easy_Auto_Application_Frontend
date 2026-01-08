// components/SocialButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../../theme";

export default function SocialButton({
  icon,
  text,
  onPress,
  iconColor,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text: string;
  onPress?: () => void;
  iconColor?: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.btn, disabled && styles.btnDisabled]}
      disabled={disabled}
    >
      <Ionicons name={icon} size={18} color={iconColor ?? undefined} style={styles.icon} />
      <Text style={[styles.text, disabled && styles.textDisabled]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  btnDisabled: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
  },
  icon: { marginRight: 10 },
  text: { fontWeight: "700" },
  textDisabled: {
    color: "#999",
  },
});
