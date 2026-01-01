import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface PaymentSearchProps {
    value: string;
    onChangeText: (text: string) => void;
}

const PaymentSearch: React.FC<PaymentSearchProps> = ({ value, onChangeText }) => {
    return (
        <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#A0A4A8" style={{ marginLeft: 10 }} />
            <TextInput
                placeholder="Search transactions"
                placeholderTextColor="#A0A4A8"
                style={styles.searchInput}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        margin: 16,
        borderRadius: 12,
        height: 46,
        alignItems: 'center',
        paddingRight: 10,
    },
    searchInput: { flex: 1, paddingHorizontal: 10 },
});

export default PaymentSearch;
