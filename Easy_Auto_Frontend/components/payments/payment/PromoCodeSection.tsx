import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onApply: (code: string) => void;
}

const PromoCodeSection: React.FC<Props> = ({ onApply }) => {
    const [code, setCode] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Have a Promo Code?</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                    <Ionicons name="pricetag-outline" size={18} color={COLORS.text.placeholder} style={{ marginRight: 8 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter code here"
                        placeholderTextColor={COLORS.text.placeholder}
                        value={code}
                        onChangeText={setCode}
                        autoCapitalize="characters"
                    />
                </View>
                <TouchableOpacity 
                    style={[styles.applyBtn, !code && styles.applyBtnDisabled]} 
                    onPress={() => onApply(code)}
                    disabled={!code}
                >
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 12,
    },
    inputWrapper: { 
        flexDirection: 'row', 
        gap: 10,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        height: 48,
    },
    input: { 
        flex: 1, 
        color: '#1e293b',
        fontSize: 14,
        fontWeight: '500',
    },
    applyBtn: { 
        backgroundColor: COLORS.primary, 
        borderRadius: 10, 
        paddingHorizontal: 20, 
        justifyContent: 'center',
        height: 48,
    },
    applyBtnDisabled: {
        backgroundColor: COLORS.backgroundMuted,
    },
    applyText: { 
        color: '#fff', 
        fontWeight: '700',
        fontSize: 14,
    },
});

export default PromoCodeSection;

