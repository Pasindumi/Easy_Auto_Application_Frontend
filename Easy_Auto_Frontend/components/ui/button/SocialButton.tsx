import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle, Platform, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import COLORS from "@/constants/Colors";

export default function SocialButton({
  icon,
  imageSource,
  text,
  onPress,
  iconColor,
  disabled,
  loading,
}: {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  imageSource?: ImageSource;
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
            {imageSource ? (
              <Image source={imageSource} style={styles.brandIcon} contentFit="contain" />
            ) : (
              icon && <Ionicons name={icon} size={24} color={iconColor ?? COLORS.text.primary} />
            )}
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
    borderRadius: 20, // More rounded/premium
    width: 56, // Adjusted to match the refined 24px icons
    height: 56,
    borderWidth: 1.5,
    borderColor: '#F1F5F9', // Very soft border
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIcon: {
    width: 24, // Even sleeker professional size
    height: 24,
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
