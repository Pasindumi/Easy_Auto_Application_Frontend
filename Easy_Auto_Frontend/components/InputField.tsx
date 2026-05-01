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
  inputStyle?: object;
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

      <View style={[
        styles.inputRow,
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
            <Ionicons name={secure ? "eye" : "eye-off"} size={20} color="#94A3B8" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },

  label: {
    color: "#64748B", // Soft slate
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 4,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 5,
    paddingHorizontal: 16,
    minHeight: Platform.OS === "ios" ? 44 : 40,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
  },



  icon: {
    marginRight: 10,
    color: "#94A3B8", // Subtle icon color
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B", // Darker for better readability
    paddingVertical: 0,
    fontWeight: '500',
  },

  rightIconTouchable: {
    marginLeft: 8,
    padding: 6,
  },
});
