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
    onRowPress?: (item: any) => void;
}

const PaymentHistorySection: React.FC<PaymentHistorySectionProps> = ({
    payments,
    onDownload,
    onDownloadAll,
    onViewAll,
    onRowPress,
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
                                onPress={() => onRowPress?.(item)}
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

            {payments.length > 0 && (
                <TouchableOpacity
                    style={styles.downloadAllBtn}
                    onPress={onDownloadAll}
                    activeOpacity={0.8}
                >
                    <Ionicons name="cloud-download-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.downloadAllText}>Download All Invoices</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    badge: {
        backgroundColor: '#eff6ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.primary,
    },
    viewAll: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '700',
    },
    listCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
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
    downloadAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    downloadAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.primary,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.text.muted,
        fontWeight: '500',
    }
});

export default PaymentHistorySection;
