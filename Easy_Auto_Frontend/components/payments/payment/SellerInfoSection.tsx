import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaymentSeller } from '../../../types/payment.types';

interface Props {
    seller: PaymentSeller;
}

const SellerInfoSection: React.FC<Props> = ({ seller }) => {
    return (
        <View style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>Seller Information</Text>
            <Text style={styles.metaText}>Seller: {seller.name}</Text>
            <Text style={styles.metaText}>Contact: {seller.contact}</Text>
            <Text style={styles.metaText}>Address: {seller.address}</Text>
            <Text style={styles.metaText}>Email: {seller.email}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionBox: { marginTop: 12, backgroundColor: '#f3f4ff', borderRadius: 10, borderWidth: 1, borderColor: '#e0e7ff', padding: 12 },
    sectionHeader: { fontWeight: '700', color: '#1f2937', marginBottom: 8 },
    metaText: { color: '#374151', fontSize: 12, marginBottom: 2 },
});

export default SellerInfoSection;
