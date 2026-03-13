import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PaymentSeller } from '../../../types/payment.types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface Props {
    seller: PaymentSeller;
}

const SellerInfoSection: React.FC<Props> = ({ seller }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Seller Information</Text>
            
            <View style={styles.profileCard}>
                <View style={styles.profileRow}>
                    <View style={styles.avatarIcon}>
                        <Ionicons name="person" size={20} color={COLORS.primary} />
                    </View>
                    <View>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{seller.name}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoGrid}>
                    <View style={styles.gridItem}>
                        <Ionicons name="call-outline" size={16} color={COLORS.text.muted} />
                        <Text style={styles.gridValue}>{seller.contact}</Text>
                    </View>
                    
                    <View style={styles.gridItem}>
                        <Ionicons name="mail-outline" size={16} color={COLORS.text.muted} />
                        <Text style={styles.gridValue}>{seller.email}</Text>
                    </View>
                </View>

                <View style={[styles.gridItem, { marginTop: 8 }]}>
                    <Ionicons name="location-outline" size={16} color={COLORS.text.muted} />
                    <Text style={styles.gridValue}>{seller.address}</Text>
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
    profileCard: {
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
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoLabel: {
        color: COLORS.text.muted,
        fontSize: 11,
        fontWeight: '500',
        marginBottom: 1,
    },
    infoValue: {
        color: '#1e293b',
        fontSize: 15,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    gridValue: {
        color: '#475569',
        fontSize: 13,
    }
});

export default SellerInfoSection;
