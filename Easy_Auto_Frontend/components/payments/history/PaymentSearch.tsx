import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface PaymentSearchProps {
    value: string;
    onChangeText: (text: string) => void;
}

const PaymentSearch: React.FC<PaymentSearchProps> = ({ value, onChangeText }) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color={COLORS.text.placeholder} />
                <TextInput
                    placeholder="Search by plan or status..."
                    placeholderTextColor={COLORS.text.placeholder}
                    style={styles.searchInput}
                    value={value}
                    onChangeText={onChangeText}
                />
                {value.length > 0 && (
                    <Ionicons 
                        name="close-circle" 
                        size={18} 
                        color={COLORS.text.muted} 
                        onPress={() => onChangeText('')}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 8,
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    searchInput: { 
        flex: 1, 
        paddingHorizontal: 10,
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
});

export default PaymentSearch;
