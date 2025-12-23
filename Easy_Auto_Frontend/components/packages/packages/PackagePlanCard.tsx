import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
}) => {
    const router = useRouter();

    const handleSelect = () => {
        if (onSelect) {
            onSelect();
        } else {
            router.push({
                pathname: "./payments/invoice",
                params: {
                    plan: title,
                    price: price,
                    days: days
                }
            });
        }
    };

    return (
        <View style={[styles.card, { backgroundColor }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{title}</Text>
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Text style={styles.popularText}>Most Popular</Text>
                    </View>
                )}
            </View>

            <Text style={styles.daysText}>{days} days boost</Text>

            <View style={styles.priceRow}>
                <Text style={styles.price}>${price}</Text>
                <Text style={styles.perDay}>{perDay}</Text>
            </View>

            {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                    <Ionicons name="checkmark-circle" size={16} color={themeColor} />
                    <Text style={styles.featureText}>{feature}</Text>
                </View>
            ))}

            <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelect}
            >
                <Text style={styles.selectText}>Select Plan</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 18,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    popularBadge: {
        backgroundColor: '#FFD84D',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    popularText: {
        fontSize: 10,
        fontWeight: '700',
    },
    daysText: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 8,
        marginBottom: 10,
        gap: 8,
    },
    price: {
        fontSize: 22,
        fontWeight: '800',
    },
    perDay: {
        fontSize: 12,
        color: '#666',
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    featureText: {
        marginLeft: 8,
        fontSize: 12,
    },
    selectButton: {
        backgroundColor: '#235CF8',
        marginTop: 16,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    selectText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default PackagePlanCard;
