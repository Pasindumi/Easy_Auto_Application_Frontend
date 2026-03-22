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
            activeOpacity={0.8}
            onPress={() => onPress(item)}
            style={styles.container}
        >
            <View style={styles.card}>
                {/* Top Row: Date & Status Badge */}
                <View style={styles.header}>
                    <View style={styles.dateRow}>
                        <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                        <Ionicons name={config.icon} size={10} color={config.color} />
                        <Text style={[styles.statusText, { color: config.color }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Middle Row: Plan & Price */}
                <View style={styles.body}>
                    <Text style={styles.planName}>{item.plan} (Monthly)</Text>
                    <Text style={styles.amount}>{item.amount}</Text>
                </View>

                <View style={styles.divider} />

                {/* Bottom Row: Card info & Download */}
                <View style={styles.footer}>
                    <View style={styles.methodRow}>
                        <Ionicons name="card-outline" size={16} color="#64748B" />
                        <Text style={styles.methodText}>Visa **** **** {item.id.toString().slice(-4)}</Text>
                    </View>
                    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.6}>
                        <Ionicons name="download-outline" size={20} color="#1E293B" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 12,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 100, // Pill shape
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        width: '100%',
    },
    body: {
        paddingVertical: 16,
        gap: 4,
    },
    planName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        letterSpacing: -0.3,
    },
    amount: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    methodText: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    downloadBtn: {
        width: 32,
        height: 32,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
});

export default PaymentCard;
