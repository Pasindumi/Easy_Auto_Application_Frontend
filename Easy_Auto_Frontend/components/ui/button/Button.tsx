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
}: Props) {
  const ButtonContent = (
    <Text style={[styles.text, textStyle, disabled && { color: COLORS.text.muted }]}>
      {title}
    </Text>
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !gradient && { backgroundColor: disabled ? COLORS.divider : backgroundColor },
        style
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
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
