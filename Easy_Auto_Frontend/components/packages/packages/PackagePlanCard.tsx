import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
            activeOpacity={0.9}
        >
            <View style={[styles.innerCard, { backgroundColor }]}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.cardTitle}>{title}</Text>
                        <View style={styles.daysBadge}>
                            <Ionicons name="time-outline" size={12} color={themeColor} />
                            <Text style={[styles.daysText, { color: themeColor }]}>{days} Days Boost</Text>
                        </View>
                    </View>
                    {isPopular && (
                        <LinearGradient
                            colors={['#FFD84D', '#F59E0B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.popularBadge}
                        >
                            <Ionicons name="star" size={10} color="#fff" />
                            <Text style={styles.popularText}>Most Popular</Text>
                        </LinearGradient>
                    )}
                </View>

                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.currency}>Rs.</Text>
                        <Text style={styles.price}>{price.toLocaleString()}</Text>
                    </View>
                    <Text style={styles.perDay}>{perDay}</Text>
                </View>

                <View style={styles.featuresList}>
                    {features.slice(0, 3).map((feature, index) => (
                        <View key={index} style={styles.featureRow}>
                            <View style={[styles.checkContainer, { backgroundColor: themeColor + '20' }]}>
                                <Ionicons name="checkmark" size={12} color={themeColor} />
                            </View>
                            <Text style={styles.featureText} numberOfLines={1}>{feature}</Text>
                        </View>
                    ))}
                    {features.length > 3 && (
                        <Text style={styles.moreText}>+{features.length - 3} more exclusive features</Text>
                    )}
                </View>

                <View style={[styles.selectButton, { backgroundColor: themeColor }]}>
                    <Text style={styles.selectText}>{btnText || "Select Plan"}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        borderRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 4,
    },
    innerCard: {
        padding: 24,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1e293b',
        marginBottom: 4,
    },
    daysBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.6)',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    daysText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    popularBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    popularText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#fff',
        textTransform: 'uppercase',
    },
    priceContainer: {
        marginBottom: 24,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    currency: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    price: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0f172a',
    },
    perDay: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 2,
    },
    featuresList: {
        gap: 12,
        marginBottom: 24,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkContainer: {
        width: 22,
        height: 22,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureText: {
        fontSize: 14,
        color: '#475569',
        fontWeight: '600',
        flex: 1,
    },
    moreText: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        marginLeft: 34,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 18,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    selectText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
});

export default PackagePlanCard;
