// components/InputField.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "./theme";

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>["name"];
  placeholder?: string;
  label?: string;
  value: string;
  onChange: (t: string) => void;
  secure?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  onIconPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  inputStyle?: object; // Allow custom styling for the input
};

export default function InputField({
  icon,
  placeholder,
  label,
  value,
  onChange,
  secure,
  keyboardType = "default",
  onIconPress,
  multiline,
  numberOfLines,
  inputStyle,
}: Props) {
  const derivedLabel = label;

  return (
    <View style={styles.container}>
      {/* Label */}
      {derivedLabel ? <Text style={styles.label}>{derivedLabel}</Text> : null}

      {/* Field with Shadow */}
      <View style={[
        styles.inputRow,
        styles.shadow,
        multiline ? { alignItems: 'flex-start' } : undefined
      ]}>
        {icon ? <Ionicons name={icon} size={20} style={[styles.icon, multiline ? { marginTop: 12 } : undefined]} /> : null}

        <TextInput
          style={[
            styles.input,
            icon ? { paddingLeft: 8 } : undefined,
            multiline ? { height: 100, textAlignVertical: 'top', paddingTop: 8 } : undefined,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChange}
          secureTextEntry={!!secure}
          keyboardType={keyboardType}
          autoCapitalize={
            keyboardType === "email-address" ? "none" : "sentences"
          }
          autoCorrect={false}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />

        {onIconPress ? (
          <TouchableOpacity
            onPress={onIconPress}
            style={styles.rightIconTouchable}
          >
            <Ionicons name="eye" size={18} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },

  label: {
    color: "#767575ff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.bgLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: Platform.OS === "ios" ? 44 : 42,
    paddingVertical: 2,
    backgroundColor: colors.white,
  },

  // ⭐ Shadow added here
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5, // Android
  },

  icon: {
    marginRight: 8,
    color: colors.darkblue,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#888888ff",
    paddingVertical: 0,
  },

  rightIconTouchable: {
    marginLeft: 8,
    padding: 4,
  },
});
