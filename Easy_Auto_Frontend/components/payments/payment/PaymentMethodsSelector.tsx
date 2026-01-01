import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    onSelectMethod: () => void;
}

const PaymentMethodsSelector: React.FC<Props> = ({ onSelectMethod }) => {
    return (
        <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Payment Method</Text>
            <TouchableOpacity style={styles.methodItem} onPress={onSelectMethod}>
                <Text style={styles.methodText}>Credit/Debit card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodItem}>
                <Text style={styles.methodText}>Apple Pay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.methodItem}>
                <Text style={styles.methodText}>Paypal</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    sectionHeader: { fontWeight: '700', color: '#1f2937', marginBottom: 8 },
    methodItem: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 12, paddingHorizontal: 12, marginTop: 8 },
    methodText: { color: '#111827', fontWeight: '600' },
});

export default PaymentMethodsSelector;
