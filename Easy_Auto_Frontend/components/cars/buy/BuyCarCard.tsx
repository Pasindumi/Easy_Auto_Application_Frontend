import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BuyCarItem } from '../../../types/buy-car.types';
import COLORS from '@/constants/Colors';

interface BuyCarCardProps {
    item: BuyCarItem;
    width: number;
    isFavorite: boolean;
    onToggleFavorite: (id: string) => void;
    onPress: (item: BuyCarItem) => void;
}

const BuyCarCard: React.FC<BuyCarCardProps> = ({
    item,
    width,
    isFavorite,
    onToggleFavorite,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={[styles.carCard, { width }]}
            activeOpacity={0.8}
            onPress={() => onPress(item)}
        >
            <View style={styles.carImageContainer}>
                <Image
                    source={item.image}
                    style={styles.carCardImage}
                    resizeMode="cover"
                />
                <View style={styles.yearBadge}>
                    <Text style={styles.yearBadgeText}>{item.year}</Text>
                </View>
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isFavorite ? '#EF4444' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.carCardBody}>
                <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.carMetaRow}>
                    <View style={styles.carMetaItem}>
                        <Ionicons name="speedometer-outline" size={14} color="#6B7280" />
                        <Text style={styles.carMetaText}>{item.km}</Text>
                    </View>
                    <View style={styles.carMetaItem}>
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text style={styles.carMetaText} numberOfLines={1}>{item.location.split(',')[0]}</Text>
                    </View>
                </View>
                <Text style={styles.price}>{item.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    carCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: COLORS.shadowPremium || '#235CF8',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        borderWidth: 1,
        borderColor: 'rgba(229, 231, 235, 0.5)',
    },
    carImageContainer: {
        position: 'relative',
        width: '100%',
        height: 150,
    },
    carCardImage: {
        width: '100%',
        height: '100%',
    },
    yearBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(35, 92, 248, 0.85)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    yearBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    carCardBody: {
        padding: 16,
    },
    carTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 6,
        letterSpacing: -0.3,
    },
    carMetaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    carMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
    },
    carMetaText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
        flex: 1,
    },
    price: {
        fontSize: 19,
        fontWeight: '800',
        color: '#235CF8',
        letterSpacing: -0.5,
    },
});

export default BuyCarCard;
