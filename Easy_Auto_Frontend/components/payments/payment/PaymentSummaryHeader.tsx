import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PaymentDetailSummary } from '../../../types/payment.types';

interface Props {
    summary: PaymentDetailSummary;
}

const PaymentSummaryHeader: React.FC<Props> = ({ summary }) => {
    return (
        <View>
            <View style={styles.topRow}>
                <Image
                    source={typeof summary.coverImage === 'string' ? { uri: summary.coverImage } : summary.coverImage}
                    style={styles.thumb}
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{summary.title}</Text>
                    <Text style={styles.price}>{summary.price}</Text>
                </View>
            </View>

            <View style={styles.sectionBox}>
                <Text style={styles.metaText}>Date: {summary.date}</Text>
                <Text style={styles.metaText}>Settle Pending (expected payout : {summary.payout})</Text>
                <Text style={styles.metaText}>Invoice : {summary.invoice}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    topRow: { flexDirection: 'row', gap: 12 },
    thumb: { width: 72, height: 72, borderRadius: 8 },
    title: { fontWeight: '700' },
    price: { color: '#2563eb', fontWeight: '700' },
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    metaText: { color: '#374151', fontSize: 12, marginBottom: 2 },
});

export default PaymentSummaryHeader;
