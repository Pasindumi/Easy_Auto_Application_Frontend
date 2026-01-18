import React from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { colors } from "../../theme";

type Props = {
  title: string;
  onPress: () => void;
  backgroundColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  disabled?: boolean;
};

export default function Button({
  title,
  onPress,
  backgroundColor = colors.primary,
  style,
  textStyle,
  activeOpacity = 0.8,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? colors.divider : backgroundColor },
        style
      ]}
      onPress={onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle, disabled && { color: colors.textGray }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  text: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 16,
  },
});
