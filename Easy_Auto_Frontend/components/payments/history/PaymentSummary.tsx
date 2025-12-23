import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaymentSummaryData } from '../../../types/payment.types';

interface PaymentSummaryProps {
    data: PaymentSummaryData;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({ data }) => {
    return (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Payments</Text>
                <Text style={styles.summaryValue}>{String(data.totalPayments).padStart(2, '0')}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Successful</Text>
                <Text style={styles.summaryValue}>{String(data.successful).padStart(2, '0')}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Failed</Text>
                <Text style={styles.summaryValue}>{String(data.failed).padStart(2, '0')}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Refunded</Text>
                <Text style={styles.summaryValue}>{String(data.refunded).padStart(2, '0')}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
                <Text style={styles.totalSpent}>Total Spent</Text>
                <Text style={styles.totalAmount}>{data.totalSpent}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    summaryCard: {
        backgroundColor: '#DDEAFF',
        margin: 16,
        padding: 18,
        borderRadius: 14,
    },
    summaryTitle: { fontWeight: '700', marginBottom: 12 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    summaryLabel: { color: '#555' },
    summaryValue: { fontWeight: '700' },
    divider: {
        height: 1,
        backgroundColor: '#AAC3EA',
        marginVertical: 10,
    },
    totalSpent: { fontWeight: '700' },
    totalAmount: { fontWeight: '800' },
});

export default PaymentSummary;
