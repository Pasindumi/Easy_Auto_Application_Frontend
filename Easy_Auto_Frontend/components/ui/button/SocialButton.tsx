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
            <Ionicons name={icon} size={22} color={iconColor ?? COLORS.text.primary} />
          </View>
          {text && <Text style={[styles.text, (disabled || loading) && styles.textDisabled]}>{text}</Text>}
          {text && <View style={{ width: 24 }} />}
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
    borderRadius: 16, // More rounded for premium feel
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: 64, // Standardized icon-only width
    height: 64, // Standardized icon-only height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  btnWithText: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  btnIconOnly: {
    // Shared with btn
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
