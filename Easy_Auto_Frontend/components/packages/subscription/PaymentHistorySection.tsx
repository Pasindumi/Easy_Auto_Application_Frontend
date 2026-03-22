import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface PaymentItem {
    id: string;
    date: string;
    plan?: string;
    amount?: string;
    status?: string;
}

interface PaymentHistorySectionProps {
    payments: PaymentItem[];
    onDownload: (id: string) => void;
    onDownloadAll: () => void;
    onViewAll: () => void;
}

const PaymentHistorySection: React.FC<PaymentHistorySectionProps> = ({
    payments,
    onDownload,
    onDownloadAll,
    onViewAll,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Invoice History</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{payments.length}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.listCard}>
                {payments.length > 0 ? (
                    payments.slice(0, 3).map((item, index) => (
                        <View key={item.id}>
                            <TouchableOpacity 
                                style={styles.paymentRow}
                                activeOpacity={0.7}
                            >
                                <View style={styles.paymentLeft}>
                                    <View style={styles.iconBg}>
                                        <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.paymentInfo}>
                                        <Text style={styles.planName} numberOfLines={1}>{item.plan || "Ad Package"}</Text>
                                        <Text style={styles.date}>{item.date}</Text>
                                    </View>
                                </View>

                                <View style={styles.paymentRight}>
                                    <Text style={styles.amount}>{item.amount}</Text>
                                    <TouchableOpacity 
                                        style={styles.downloadBtn}
                                        onPress={() => onDownload(item.id)}
                                    >
                                        <Ionicons name="download-outline" size={16} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                            {index < Math.min(payments.length, 3) - 1 && <View style={styles.divider} />}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No recent payments</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.2,
    },
    badge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '800',
        color: COLORS.primary,
    },
    viewAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '800',
    },
    listCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 8,
        borderWidth: 1.5,
        borderColor: '#F1F5F9', // slightly visible border
        overflow: 'hidden',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paymentInfo: {
        flex: 1,
    },
    planName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 2,
    },
    date: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '500',
    },
    paymentRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    amount: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
    },
    downloadBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#eff6ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginHorizontal: 12,
    },
    emptyState: {
        paddingVertical: 36,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    }
});

export default PaymentHistorySection;
