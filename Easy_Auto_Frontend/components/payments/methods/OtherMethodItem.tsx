import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { PaymentMethod } from '../../../types/payment.types';

interface OtherMethodItemProps {
    method: PaymentMethod;
    isSelected: boolean;
    onPress: (id: string) => void;
}

const OtherMethodItem: React.FC<OtherMethodItemProps> = ({ method, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(method.id)}
            style={[
                styles.otherItem,
                isSelected && styles.methodItemActive,
            ]}
        >
            <Image
                source={method.icon}
                style={styles.otherIcon}
            />
            <Text style={styles.otherText}>{method.name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    otherItem: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    otherIcon: {
        width: 26,
        height: 26,
        resizeMode: 'contain',
        marginRight: 12,
    },
    otherText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111',
    },
    methodItemActive: {
        borderWidth: 2,
        borderColor: '#235CF8',
    },
});

export default OtherMethodItem;
