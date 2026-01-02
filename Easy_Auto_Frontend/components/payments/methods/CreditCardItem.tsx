import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CreditCard } from '../../../types/payment.types';

interface CreditCardItemProps {
    card: CreditCard;
    isSelected: boolean;
    onPress: (id: string) => void;
}

const CreditCardItem: React.FC<CreditCardItemProps> = ({ card, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={() => onPress(card.id)}
            style={[
                styles.creditCard,
                { backgroundColor: card.backgroundColor },
                isSelected && styles.methodItemActive,
            ]}
        >
            <View style={styles.cardRow}>
                <Text style={styles.cardTitle}>{card.type}</Text>
                <Text style={styles.cardNumber}>{card.number}</Text>
            </View>

            <View style={styles.cardRowBottom}>
                <Text style={styles.cardName}>{card.holderName}</Text>

                <View style={styles.cardRight}>
                    <Image
                        source={card.icon}
                        style={styles.cardIcon}
                    />
                    <Text style={styles.cardDate}>{card.expiryDate}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    creditCard: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    cardRowBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    cardName: {
        color: '#fff',
        fontSize: 12,
    },
    cardRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardIcon: {
        width: 30,
        height: 20,
        resizeMode: 'contain',
        marginRight: 6,
    },
    cardDate: {
        color: '#fff',
        fontSize: 12,
    },
    methodItemActive: {
        borderWidth: 2,
        borderColor: '#235CF8',
    },
});

export default CreditCardItem;
