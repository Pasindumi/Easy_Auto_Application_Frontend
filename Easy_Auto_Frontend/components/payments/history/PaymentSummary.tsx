import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaymentSummaryData } from '../../../types/payment.types';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface PaymentSummaryProps {
    data: PaymentSummaryData;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ data }) => {
    return (
        <View style={styles.container}>
            <View style={styles.summaryCard}>
                <View style={styles.header}>
                    <Ionicons name="analytics" size={20} color={COLORS.primary} />
                    <Text style={styles.summaryTitle}>Analytics Overview</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Total Ads</Text>
                        <Text style={styles.statValue}>{String(data.totalPayments).padStart(2, '0')}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#059669' }]}>Success</Text>
                        <Text style={[styles.statValue, { color: '#059669' }]}>{String(data.successful).padStart(2, '0')}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#dc2626' }]}>Failed</Text>
                        <Text style={[styles.statValue, { color: '#dc2626' }]}>{String(data.failed).padStart(2, '0')}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <Text style={styles.totalSpentLabel}>Lifetime Investment</Text>
                    <Text style={styles.totalSpentValue}>{data.totalSpent}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#235CF8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
    },
    summaryTitle: { 
        fontSize: 16,
        fontWeight: '700', 
        color: '#1e293b',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: { 
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '600',
        marginBottom: 4,
    },
    statValue: { 
        fontSize: 20,
        fontWeight: '800', 
        color: '#1e293b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalSpentLabel: { 
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    totalSpentValue: { 
        fontSize: 20,
        fontWeight: '900',
        color: COLORS.primary,
    },
});

export default PaymentSummary;
