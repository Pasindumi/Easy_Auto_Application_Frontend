// components/SocialButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../theme";

export default function SocialButton({
  icon,
  text,
  onPress,
  iconColor,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text?: string;
  onPress?: () => void;
  iconColor?: string;
  disabled?: boolean;
}) {
  const isIconOnly = !text;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.btn, 
        isIconOnly ? styles.btnIconOnly : styles.btnWithText,
        disabled && styles.btnDisabled
      ]}
      disabled={disabled}
    >
      <Ionicons 
        name={icon} 
        size={isIconOnly ? 24 : 18} 
        color={iconColor ?? "#1e293b"} 
        style={!isIconOnly && styles.icon} 
      />
      {text && <Text style={[styles.text, disabled && styles.textDisabled]}>{text}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  btnWithText: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  btnIconOnly: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  btnDisabled: {
    opacity: 0.5,
    backgroundColor: "#f5f5f5",
  },
  icon: { marginRight: 10 },
  text: { fontWeight: "700", color: "#1e293b" },
  textDisabled: {
    color: "#999",
  },
});
