import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { OrderItem } from '../../../types/payment.types';
import { COLORS } from '@/constants/Colors';

interface Props {
    items: OrderItem[];
    total: number;
}

const OrderItemsSection: React.FC<Props> = ({ items, total }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Order Summary</Text>
            
            <View style={styles.billCard}>
                {items.map((item, idx) => (
                    <View key={idx} style={styles.itemRow}>
                        <Text style={[styles.itemLabel, item.price < 0 && { color: '#64748b' }]}>
                            {item.label}
                        </Text>
                        <Text style={[styles.itemPrice, item.price < 0 && styles.discountText]}>
                            {item.price < 0 
                                ? `- LKR ${Math.abs(item.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                                : `LKR ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </Text>
                    </View>
                ))}
                
                <View style={styles.divider} />
                
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Payable</Text>
                    <View style={styles.totalPriceBadge}>
                        <Text style={styles.totalPrice}>LKR {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    header: { 
        fontSize: 15,
        fontWeight: '700', 
        color: '#1e293b', 
        marginBottom: 12,
        marginLeft: 4,
    },
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    itemRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 8,
    },
    itemLabel: { 
        color: '#475569', 
        fontSize: 14,
        fontWeight: '500', 
    },
    itemPrice: { 
        color: '#1e293b', 
        fontSize: 14,
        fontWeight: '600',
    },
    discountText: {
        color: '#10b981',
        fontWeight: '700',
    },
    divider: { 
        height: 1, 
        backgroundColor: '#f1f5f9', 
        marginVertical: 12,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    totalRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 4,
    },
    totalLabel: { 
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    totalPriceBadge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    totalPrice: { 
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.primary,
    },
});

export default OrderItemsSection;
