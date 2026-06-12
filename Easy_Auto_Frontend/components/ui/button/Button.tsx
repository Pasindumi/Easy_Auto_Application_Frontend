import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle, Platform, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "@/constants/Colors";

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  gradient?: string[];
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  disabled?: boolean;
  loading?: boolean;
};

export default function Button({
  title,
  onPress,
  backgroundColor = COLORS.primary,
  gradient = COLORS.gradients.primary,
  style,
  textStyle,
  activeOpacity = 0.7,
  disabled = false,
  loading = false,
}: Props) {
  const Loading = require("../../ui/Loading").default;

  const ButtonContent = loading ? (
    <Loading size="small" />
  ) : (
    <Text style={[styles.text, textStyle, (disabled || loading) && { color: COLORS.text.muted }]}>
      {title}
    </Text>
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !gradient && { backgroundColor: (disabled || loading) ? COLORS.divider : backgroundColor },
        style
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}
    >
      {gradient && !disabled && !loading ? (
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {ButtonContent}
        </LinearGradient>
      ) : (
        <View style={[styles.gradient, { backgroundColor: (disabled || loading) ? COLORS.divider : backgroundColor }]}>
          {ButtonContent}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: 8,
  },
  gradient: {
    paddingVertical: 12, // Packed height
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  text: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
