import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { typography } from "../../theme";

interface PaymentItem {
    id: string;
    date: string;
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
        <View style={styles.card}>
            <View style={styles.historyHeader}>
                <Text style={styles.sectionTitle}>Payment History</Text>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            {payments.map((item, index) => (
                <View key={item.id}>
                    <View style={styles.paymentRow}>
                        <View style={styles.paymentLeft}>
                            <View style={styles.paymentIconContainer}>
                                <Ionicons name="receipt-outline" size={20} color="#235CF8" />
                            </View>
                            <View style={styles.paymentInfo}>
                                <Text style={styles.paymentTitle}>Premium Plan - Monthly</Text>
                                <View style={styles.paymentDateRow}>
                                    <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                                    <Text style={styles.paymentDate}>{item.date}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.paymentRight}>
                            <View style={styles.paymentAmountContainer}>
                                <Text style={styles.paymentPrice}>$29.99</Text>
                                <View style={styles.statusBadge}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.completed}>Completed</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.downloadIcon}
                                onPress={() => onDownload(item.id)}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name="download-outline"
                                    size={18}
                                    color="#235CF8"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {index < payments.length - 1 && <View style={styles.paymentDivider} />}
                </View>
            ))}

            {/* Download All */}
            <TouchableOpacity
                style={styles.downloadAll}
                onPress={onDownloadAll}
                activeOpacity={0.7}
            >
                <Ionicons name="download-outline" size={18} color="#235CF8" />
                <Text style={styles.downloadText}>Download All Invoices</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 18,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    sectionTitle: {
        ...typography.subheading,
        fontSize: 15,
    },
    viewAll: {
        color: '#235CF8',
        fontWeight: '600',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    paymentIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EBF4FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        ...typography.subheading,
        fontSize: 14,
        marginBottom: 4,
    },
    paymentDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    paymentDate: {
        ...typography.caption,
        fontWeight: '500',
    },
    paymentDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 52,
    },
    paymentRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentAmountContainer: {
        alignItems: 'flex-end',
    },
    paymentPrice: {
        fontWeight: '700',
        fontSize: 15,
        color: '#111827',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    completed: {
        fontSize: 11,
        color: '#10B981',
        fontWeight: '600',
    },
    downloadIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#EBF4FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    downloadAll: {
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 12,
        gap: 8,
        backgroundColor: '#F9FAFB',
    },
    downloadText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#235CF8',
    },
});

export default PaymentHistorySection;
