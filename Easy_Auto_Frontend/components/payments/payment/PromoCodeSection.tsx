import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    onApply: (code: string) => void;
}

const PromoCodeSection: React.FC<Props> = ({ onApply }) => {
    const [code, setCode] = useState('');

    return (
        <View style={styles.sectionBox}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                    style={styles.promoField}
                    placeholder="Enter Promo Code"
                    value={code}
                    onChangeText={setCode}
                />
                <TouchableOpacity style={styles.applyBtn} onPress={() => onApply(code)}>
                    <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    promoField: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 10 },
    applyBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center' },
    applyText: { color: '#fff', fontWeight: '700' },
});

export default PromoCodeSection;

