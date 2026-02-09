import Header from '@/components/Header';
import COLORS from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function PaymentDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, date, amount, plan, status, card, type } = params;

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={{ flex: 1 }}>
                <Header showBack={true} />

                <View style={headerSectionStyles.headerWrap}>
                    <View style={headerSectionStyles.header}>
                        <View style={headerSectionStyles.headerLeft}>
                            <Ionicons name="receipt-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
                            <Text style={headerSectionStyles.headerTitle}>Payment Detail</Text>
                        </View>
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.card}>
                        <View style={styles.statusRow}>
                            <Text style={styles.label}>Status</Text>
                            <View style={[
                                styles.statusBadge,
                                status === 'Successful' ? styles.statusSuccess :
                                    status === 'Failed' ? styles.statusFailed : styles.statusPending
                            ]}>
                                <Text style={[
                                    styles.statusText,
                                    status === 'Successful' ? styles.textSuccess :
                                        status === 'Failed' ? styles.textFailed : styles.textPending
                                ]}>{status}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Transaction ID</Text>
                            <Text style={styles.value}>{id}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{date}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Amount</Text>
                            <Text style={styles.amountValue}>{amount}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Text style={styles.label}>Plan / Item</Text>
                            <Text style={styles.value}>{plan}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Type</Text>
                            <Text style={styles.value}>{type}</Text>
                        </View>

                        <View style={styles.row}>
                            <Text style={styles.label}>Payment Method</Text>
                            <Text style={styles.value}>{card}</Text>
                        </View>

                    </View>

                    <TouchableOpacity style={styles.downloadButton} activeOpacity={0.8}>
                        <Ionicons name="download-outline" size={20} color={COLORS.white} />
                        <Text style={styles.downloadText}>Download Receipt</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: 16,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.divider,
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.text.muted,
        fontWeight: '500',
    },
    value: {
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: '600',
    },
    amountValue: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.divider,
        marginVertical: 16,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusSuccess: {
        backgroundColor: '#DCFCE7',
    },
    statusFailed: {
        backgroundColor: '#FEE2E2',
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    textSuccess: {
        color: '#166534',
    },
    textFailed: {
        color: '#991B1B',
    },
    textPending: {
        color: '#92400E',
    },
    downloadButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 14,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    downloadText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 15,
    },
});
