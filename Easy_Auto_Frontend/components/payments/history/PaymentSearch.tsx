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
                <Ionicons name="search-outline" size={20} color={'#9CA3AF'} />
                <TextInput
                    placeholder="Search by plan or status..."
                    placeholderTextColor={'#9CA3AF'}
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
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchBox: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        height: 52,
        alignItems: 'center',
        paddingHorizontal: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    searchInput: { 
        flex: 1, 
        paddingHorizontal: 12,
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '500',
    },
});

export default PaymentSearch;
