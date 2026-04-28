import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, View, TextInputProps } from 'react-native';
import COLORS from '@/constants/Colors';

interface Props extends TextInputProps {
    label: string;
    iconName?: keyof typeof Ionicons.glyphMap;
}

const CustomTextInput: React.FC<Props> = ({ label, iconName, style, ...props }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                {iconName && (
                    <Ionicons name={iconName} size={20} color={COLORS.text.muted} style={styles.icon} />
                )}
                <TextInput
                    style={[styles.input, style]}
                    placeholderTextColor={COLORS.text.placeholder}
                    {...props}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        height: 50,
        paddingHorizontal: 16,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text.primary,
        height: '100%',
    },
});

export default CustomTextInput;
