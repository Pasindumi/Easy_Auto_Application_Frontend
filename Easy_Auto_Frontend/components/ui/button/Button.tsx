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
<<<<<<< HEAD
  const ButtonContent = (
    <Text style={[styles.text, textStyle, disabled && { color: COLORS.text.muted }]}>
      {title}
    </Text>
  );
=======
  const Loading = require("../../ui/Loading").default;
>>>>>>> sachini_dev

  return (
    <TouchableOpacity
      style={[
        styles.button,
<<<<<<< HEAD
        !gradient && { backgroundColor: disabled ? COLORS.divider : backgroundColor },
=======
        { backgroundColor: (disabled || loading) ? colors.divider : backgroundColor },
>>>>>>> sachini_dev
        style
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled || loading}
    >
<<<<<<< HEAD
      {gradient && !disabled ? (
        <LinearGradient
          colors={gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {ButtonContent}
        </LinearGradient>
      ) : (
        <View style={[styles.gradient, { backgroundColor: disabled ? COLORS.divider : backgroundColor }]}>
          {ButtonContent}
        </View>
=======
      {loading ? (
        <Loading size="small" />
      ) : (
        <Text style={[styles.text, textStyle, (disabled || loading) && { color: colors.textGray }]}>{title}</Text>
>>>>>>> sachini_dev
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    overflow: "hidden",
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  gradient: {
    paddingVertical: 12,
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
