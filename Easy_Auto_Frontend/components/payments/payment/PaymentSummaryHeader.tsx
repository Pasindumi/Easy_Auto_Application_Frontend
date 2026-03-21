import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { PaymentDetailSummary } from '../../../types/payment.types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

interface Props {
    summary: PaymentDetailSummary;
}

const PaymentSummaryHeader: React.FC<Props> = ({ summary }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.imageContainer}>
                    <Image
                        source={typeof summary.coverImage === 'string' ? { uri: summary.coverImage } : summary.coverImage}
                        style={styles.thumb}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.titleInfo}>
                    <Text style={styles.title} numberOfLines={2}>{summary.title}</Text>
                    <Text style={styles.priceText}>{summary.price}</Text>
                </View>
            </View>

            <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={16} color={COLORS.text.muted} />
                    <View>
                        <Text style={styles.metaLabel}>Order Date</Text>
                        <Text style={styles.metaValue}>{summary.date}</Text>
                    </View>
                </View>

                <View style={styles.metaItem}>
                    <Ionicons name="receipt-outline" size={16} color={COLORS.text.muted} />
                    <View>
                        <Text style={styles.metaLabel}>Invoice No</Text>
                        <Text style={styles.metaValue}>{summary.invoice}</Text>
                    </View>
                </View>

                {summary.expiryDate && (
                    <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={16} color={COLORS.status.danger} />
                        <View>
                            <Text style={[styles.metaLabel, { color: COLORS.status.danger }]}>Expires On</Text>
                            <Text style={[styles.metaValue, { color: COLORS.status.danger }]}>{summary.expiryDate}</Text>
                        </View>
                    </View>
                )}

                <View style={[styles.metaItem, { borderBottomWidth: 0 }]}>
                    <Ionicons name="wallet-outline" size={16} color={COLORS.text.muted} />
                    <View>
                        <Text style={styles.metaLabel}>Payout Expected</Text>
                        <Text style={styles.metaValue}>{summary.payout}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    topRow: { 
        flexDirection: 'row', 
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    thumb: { 
        width: 80, 
        height: 80, 
        borderRadius: 12,
        backgroundColor: '#f1f5f9'
    },
    titleInfo: { 
        flex: 1,
        marginLeft: 16,
    },
    title: { 
        fontSize: 18,
        fontWeight: '700', 
        color: '#1e293b',
        lineHeight: 24,
        marginBottom: 4,
    },
    priceText: { 
        fontSize: 20,
        color: COLORS.primary, 
        fontWeight: '800' 
    },
    metaGrid: { 
        backgroundColor: '#f8fafc', 
        borderRadius: 16, 
        padding: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    metaLabel: { 
        color: COLORS.gray[500], 
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 1,
    },
    metaValue: { 
        color: '#334155', 
        fontSize: 13, 
        fontWeight: '600' 
    },
});

export default PaymentSummaryHeader;
