import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Payment } from '../../../types/payment.types';

interface PaymentCardProps {
    item: Payment;
    onPress: (item: Payment) => void;
}

const statusColors: Record<string, string> = {
    Successful: '#34C759',
    Failed: '#FF3B30',
    Refunded: '#FFCC00',
};

const PaymentCard: React.FC<PaymentCardProps> = ({ item, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onPress(item)}
        >
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color="#666"
                            style={{ marginRight: 4 }}
                        />
                        <Text style={styles.date}>{item.date}</Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: statusColors[item.status] + '33' },
                        ]}
                    >
                        <Ionicons
                            name={
                                item.status === 'Successful'
                                    ? 'checkmark-circle'
                                    : item.status === 'Failed'
                                        ? 'close-circle'
                                        : 'refresh-circle'
                            }
                            size={14}
                            color={statusColors[item.status]}
                            style={{ marginRight: 4 }}
                        />
                        <Text
                            style={[
                                styles.statusText,
                                { color: statusColors[item.status] },
                            ]}
                        >
                            {item.status}
                        </Text>
                    </View>
                </View>

                <Text style={styles.plan}>
                    {item.plan} <Text style={styles.monthly}>({item.type})</Text>
                </Text>

                <Text style={styles.amount}>{item.amount}</Text>

                <View style={styles.cardFooter}>
                    <Ionicons name="card-outline" size={16} color="#666" />
                    <Text style={styles.cardNumber}>{item.card}</Text>

                    <TouchableOpacity>
                        <Ionicons name="download-outline" size={18} color="#111" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 18,
        borderRadius: 14,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    date: { fontSize: 12, color: '#666' },
    statusBadge: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    statusText: { fontSize: 12, fontWeight: '600' },
    plan: { fontSize: 16, fontWeight: '700', marginTop: 10 },
    monthly: { fontSize: 12, color: '#666' },
    amount: { fontSize: 18, fontWeight: '700', marginTop: 6 },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    cardNumber: {
        flex: 1,
        marginLeft: 8,
        color: '#666',
    },
});

export default PaymentCard;
