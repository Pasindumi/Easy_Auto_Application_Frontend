import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BuyCarItem } from '../../../types/buy-car.types';

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
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    carImageContainer: {
        position: 'relative',
        width: '100%',
        height: 140,
    },
    carCardImage: {
        width: '100%',
        height: '100%',
    },
    yearBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(35, 92, 248, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    yearBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    favoriteButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    carCardBody: {
        padding: 14,
    },
    carTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    carMetaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 10,
    },
    carMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        flex: 1,
    },
    carMetaText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        flex: 1,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#235CF8',
    },
});

export default BuyCarCard;
