// components/InputField.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors } from "./theme";

type Props = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  placeholder?: string;
  value: string;
  onChange: (t: string) => void;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

export default function InputField({
  icon,
  placeholder,
  value,
  onChange,
  secure = false,
  keyboardType = "default",
  autoCapitalize = "none",
}: Props) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.primary} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboardType}
        style={styles.input}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.bgLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: colors.white,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, height: 36 },
});
