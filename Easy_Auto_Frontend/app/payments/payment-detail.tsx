import Header from '@/components/Header';
import { COLORS } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform
} from 'react-native';

export default function PaymentDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, date, amount, plan, status, card, type, adId, rentalAdId, packageId, rawAmount } = params;
    const isPending = String(status).toLowerCase() === 'pending';

    const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
        Successful: { color: '#059669', bg: '#ecfdf5', icon: 'checkmark-circle' },
        Pending: { color: '#6366f1', bg: '#eef2ff', icon: 'time-outline' },
        Failed: { color: '#dc2626', bg: '#fef2f2', icon: 'close-circle' },
        Refunded: { color: '#d97706', bg: '#fffbeb', icon: 'refresh-circle' },
    };

    const config = statusConfig[String(status)] || statusConfig.Successful;

    const handleCompletePayment = () => {
        const targetParams: any = {
            amount: rawAmount as string || '2500',
            planName: plan as string || 'Standard Ad'
        };

        if (adId) {
            targetParams.adId = adId as string;
        } else if (packageId) {
            targetParams.packageId = packageId as string;
        } else if (rentalAdId) {
            targetParams.rentalAdId = rentalAdId as string;
        }

        router.push({
            pathname: "/payments/payment",
            params: targetParams
        });
    };

    return (
        <View style={styles.outerContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Payment Detail" />

            <SafeAreaView style={styles.safe}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.receiptContainer}>
                        <View style={styles.receiptHeader}>
                            <View style={[styles.statusIcon, { backgroundColor: config.bg }]}>
                                <Ionicons name={config.icon} size={32} color={config.color} />
                            </View>
                            <Text style={styles.statusLabel}>{status} Payment</Text>
                            <Text style={styles.amountText}>{amount}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.infoSection}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Transaction ID</Text>
                                <Text style={styles.value}>{id}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Payment Date</Text>
                                <Text style={styles.value}>{date}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Item Purchased</Text>
                                <Text style={styles.value}>{plan}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Transaction Type</Text>
                                <Text style={styles.value}>{type}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Payment Method</Text>
                                <View style={styles.methodRow}>
                                    <Ionicons name="card-outline" size={16} color={COLORS.text.muted} />
                                    <Text style={styles.value}>{card}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.footer}>
                            <Ionicons name="shield-checkmark" size={16} color={COLORS.status.success} />
                            <Text style={styles.footerText}>Securely processed by PayHere</Text>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        {isPending ? (
                            <TouchableOpacity style={styles.completeBtn} activeOpacity={0.8} onPress={handleCompletePayment}>
                                <Ionicons name="card-outline" size={20} color="#fff" />
                                <Text style={styles.completeBtnText}>Complete Payment</Text>
                            </TouchableOpacity>
                        ) : (
                            status === 'Successful' && (
                                <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
                                    <Ionicons name="download-outline" size={20} color="#fff" />
                                    <Text style={styles.downloadBtnText}>Download Receipt</Text>
                                </TouchableOpacity>
                            )
                        )}

                        <TouchableOpacity
                            style={styles.outlineBtn}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.outlineBtnText}>Back to History</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    safe: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    receiptContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 5,
    },
    receiptHeader: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    statusIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.muted,
        marginBottom: 8,
    },
    amountText: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1e293b',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 24,
        borderStyle: 'dashed',
        borderRadius: 1,
    },
    infoSection: {
        gap: 20,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    label: {
        fontSize: 13,
        color: COLORS.text.muted,
        fontWeight: '500',
        flex: 1,
    },
    value: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '700',
        flex: 1.5,
        textAlign: 'right',
    },
    methodRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1.5,
        justifyContent: 'flex-end',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
    },
    footerText: {
        fontSize: 11,
        color: COLORS.text.placeholder,
        fontWeight: '600',
    },
    actions: {
        marginTop: 24,
        gap: 12,
    },
    downloadBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    downloadBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    completeBtn: {
        backgroundColor: '#4F46E5', // Indigo for Complete Payment
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    completeBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    outlineBtn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    outlineBtnText: {
        color: COLORS.text.muted,
        fontSize: 14,
        fontWeight: '600',
    },
});
