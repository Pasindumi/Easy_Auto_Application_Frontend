import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Payment } from '../../../types/payment.types';
import { COLORS } from '@/constants/Colors';

interface PaymentCardProps {
    item: Payment;
    onPress: (item: Payment) => void;
}

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
    Successful: { color: '#059669', bg: '#ecfdf5', icon: 'checkmark-circle' },
    Failed: { color: '#dc2626', bg: '#fef2f2', icon: 'close-circle' },
    Refunded: { color: '#d97706', bg: '#fffbeb', icon: 'refresh-circle' },
};

const PaymentCard: React.FC<PaymentCardProps> = ({ item, onPress }) => {
    const config = statusConfig[item.status] || statusConfig.Successful;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(item)}
            style={styles.container}
        >
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                        <Ionicons name={config.icon} size={12} color={config.color} />
                        <Text style={[styles.statusText, { color: config.color }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <View style={styles.mainInfo}>
                        <Text style={styles.planName}>{item.plan}</Text>
                        <View style={styles.dateRow}>
                            <Ionicons name="calendar-outline" size={14} color={COLORS.text.muted} />
                            <Text style={styles.dateText}>{item.date}</Text>
                        </View>
                    </View>
                    <View style={styles.priceInfo}>
                        <Text style={styles.amount}>{item.amount}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <View style={styles.methodRow}>
                        <Ionicons name="card-outline" size={16} color={COLORS.text.muted} />
                        <Text style={styles.methodText}>{item.card}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.text.placeholder} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '700',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    mainInfo: {
        flex: 1,
    },
    planName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.text.muted,
    },
    priceInfo: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    methodText: {
        fontSize: 13,
        color: COLORS.text.secondary,
        fontWeight: '500',
    },
});

export default PaymentCard;
