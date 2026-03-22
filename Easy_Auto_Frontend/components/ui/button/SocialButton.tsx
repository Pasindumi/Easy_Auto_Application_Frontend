import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
  const Loading = require("../Loading").default;
  const isIconOnly = !text;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn, 
        isIconOnly ? styles.btnIconOnly : styles.btnWithText,
        (disabled || loading) && styles.btnDisabled
      ]}
      activeOpacity={0.7}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loading size="small" />
      ) : (
        <>
          {!isIconOnly ? (
            <View style={styles.iconContainer}>
              <Ionicons name={icon} size={20} color={iconColor ?? COLORS.text.primary} />
            </View>
          ) : (
            <Ionicons name={icon} size={24} color={iconColor ?? COLORS.text.primary} />
          )}
          {text && <Text style={[styles.text, (disabled || loading) && styles.textDisabled]}>{text}</Text>}
          {!isIconOnly && <View style={{ width: 24 }} />}
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
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border || '#E2E8F0',
    shadowColor: COLORS.shadow || '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  btnWithText: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    borderRadius: 14,
  },
  btnIconOnly: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  btnDisabled: {
    opacity: 0.5,
    backgroundColor: COLORS.backgroundMuted || '#F1F5F9',
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: "700",
    fontSize: 15,
    color: COLORS.text.primary || '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  textDisabled: {
    color: COLORS.text.muted || '#64748B',
  },
});
