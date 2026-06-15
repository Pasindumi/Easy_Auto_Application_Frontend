import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '@/constants/Colors';

interface PackagePlanCardProps {
    title: string;
    days: number;
    price: number;
    perDay: string;
    features: string[];
    themeColor: string;
    backgroundColor: string;
    isPopular?: boolean;
    onSelect?: () => void;
    id?: number | string;
    adId?: string;
    btnText?: string;
}

const PackagePlanCard: React.FC<PackagePlanCardProps> = ({
    title,
    days,
    price,
    perDay,
    features,
    themeColor,
    backgroundColor,
    isPopular,
    onSelect,
    id,
    adId,
    btnText,
}) => {
    const router = useRouter();

    const handleSelect = () => {
        if (onSelect) {
            onSelect();
        } else {
            if (id) {
                router.push({ 
                    pathname: '/packages/[id]', 
                    params: { id, adId: adId || '' } 
                });
            } else {
                router.push({ 
                    pathname: '/payments/invoice', 
                    params: { 
                        plan: title, 
                        price: price, 
                        days: days, 
                        packageId: id,
                        adId: adId || ''
                    } 
                });
            }
        }
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={handleSelect}
            activeOpacity={0.86}
        >
            <View style={[styles.innerCard, { backgroundColor }]}>
                <View style={[styles.accentLine, { backgroundColor: themeColor }]} />
                <View style={styles.cardHeader}>
                    <View style={styles.titleBlock}>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <View style={[styles.daysBadge, { backgroundColor: themeColor + '10' }]}>
                            <Ionicons name="time-outline" size={12} color={themeColor} />
                            <Text style={[styles.daysText, { color: themeColor }]}>{days} days</Text>
                        </View>
                    </View>
                    {isPopular && (
                        <View style={styles.popularBadge}>
                            <Ionicons name="star-outline" size={11} color={COLORS.status.warning} />
                            <Text style={styles.popularText}>Most Popular</Text>
                        </View>
                    )}
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Package price</Text>
                    <View style={styles.priceRow}>
                        <Text style={styles.currency}>LKR</Text>
                        <Text style={styles.price}>{price.toLocaleString()}</Text>
                    </View>
                    {!!perDay && <Text style={styles.perDay}>{perDay}</Text>}
                </View>

                <View style={styles.featuresList}>
                    {features.slice(0, 4).map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={[styles.checkContainer, { borderColor: themeColor + '55' }]}>
                                <Ionicons name="checkmark" size={11} color={themeColor} />
                            </View>
                            <Text style={styles.featureText} numberOfLines={2}>{feature}</Text>
                        </View>
                    ))}
                    {features.length > 4 && (
                        <Text style={styles.moreText}>+{features.length - 4} more features</Text>
                    )}
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.footerHint}>Review details before payment</Text>
                    <View style={[styles.selectButton, { backgroundColor: themeColor }]}>
                        <Text style={styles.selectText}>{btnText || "Select Plan"}</Text>
                        <Ionicons name="arrow-forward" size={15} color="#fff" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.white,
        overflow: 'hidden',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    innerCard: {
        padding: 16,
        position: 'relative',
    },
    accentLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    titleBlock: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.text.primary,
        marginBottom: 8,
        lineHeight: 22,
        textTransform: 'capitalize',
    },
    daysBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 999,
    },
    daysText: {
        fontSize: 12,
        fontWeight: '500',
    },
    popularBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: COLORS.status.warning + '12',
        borderWidth: 1,
        borderColor: COLORS.status.warning + '30',
    },
    popularText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#92400E',
    },
    priceContainer: {
        paddingVertical: 14,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLORS.divider,
        marginBottom: 16,
    },
    priceLabel: {
        fontSize: 12,
        color: COLORS.text.muted,
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    currency: {
        fontSize: 13,
        fontWeight: '500',
        color: COLORS.text.muted,
    },
    price: {
        fontSize: 28,
        fontWeight: '600',
        color: COLORS.text.primary,
    },
    perDay: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '400',
        marginTop: 2,
    },
    featuresList: {
        gap: 10,
        marginBottom: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    checkContainer: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginTop: 1,
    },
    featureText: {
        fontSize: 14,
        color: COLORS.text.secondary,
        fontWeight: '400',
        flex: 1,
        lineHeight: 19,
    },
    moreText: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '400',
        marginLeft: 30,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    footerHint: {
        flex: 1,
        fontSize: 12,
        color: COLORS.text.muted,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
        gap: 7,
    },
    selectText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default PackagePlanCard;
