import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderItem } from '../../../types/payment.types';

interface Props {
    items: OrderItem[];
    total: number;
}

const OrderItemsSection: React.FC<Props> = ({ items, total }) => {
    return (
        <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Order Items</Text>
            {items.map((item, idx) => (
                <View key={idx} style={styles.row}>
                    <Text style={styles.itemLabel}>{item.label}</Text>
                    <Text style={[styles.itemPrice, item.price < 0 && { color: '#ef4444' }]}>
                        {item.price < 0 ? `- LKR ${Math.abs(item.price).toFixed(2)}` : `LKR ${item.price.toFixed(2)}`}
                    </Text>
                </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={[styles.itemLabel, { fontWeight: '700' }]}>Total</Text>
                <Text style={[styles.itemPrice, { fontWeight: '700' }]}>LKR {total.toFixed(2)}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    sectionHeader: { fontWeight: '700', color: '#1f2937', marginBottom: 8 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
    itemLabel: { color: '#111827', fontSize: 12 },
    itemPrice: { color: '#111827', fontSize: 12 },
    divider: { height: 1, backgroundColor: '#e5e7eb', marginTop: 8 },
});

export default OrderItemsSection;
