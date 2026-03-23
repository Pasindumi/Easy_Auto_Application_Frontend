// components/SocialButton.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle, Platform, View } from "react-native";
import COLORS from "@/constants/Colors";

export default function SocialButton({
  icon,
  text,
  onPress,
  iconColor,
  disabled,
  loading,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  text?: string;
  onPress?: () => void;
  iconColor?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const isIconOnly = !text;

  const Loading = require("../Loading").default;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btn, (disabled || loading) && styles.btnDisabled]}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loading size="small" />
      ) : (
        <>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color={iconColor ?? COLORS.text.primary} />
          </View>
          <Text style={[styles.text, (disabled || loading) && styles.textDisabled]}>{text}</Text>
          <View style={{ width: 24 }} />
        </>
      )}
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
    borderColor: COLORS.border,
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
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  btnDisabled: {
    opacity: 0.5,
    backgroundColor: COLORS.backgroundMuted,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  icon: { marginRight: 10 },
  textDisabled: {
    color: COLORS.text.muted,
  },
});
