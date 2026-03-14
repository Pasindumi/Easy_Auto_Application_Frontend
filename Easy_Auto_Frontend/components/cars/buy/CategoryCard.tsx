import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CarCategory } from '../../../types/buy-car.types';
import COLORS from '@/constants/Colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface CategoryCardProps {
    item: CarCategory;
    isActive: boolean;
    onPress: (key: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item, isActive, onPress }) => {
    return (
        <TouchableOpacity
            style={[styles.categoryCard, isActive && styles.categoryCardActive]}
            onPress={() => onPress(item.key)}
            activeOpacity={0.7}
        >
            <View style={[styles.categoryIconContainer, isActive && styles.categoryIconContainerActive]}>
                <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={isActive ? '#235CF8' : '#9CA3AF'}
                />
            </View>
            <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    categoryCard: {
        width: (SCREEN_WIDTH - 32 - 24) / 3,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        shadowColor: COLORS.shadowPremium || '#235CF8',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    categoryCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        shadowOpacity: 0.12,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    categoryIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 15,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    categoryIconContainerActive: {
        backgroundColor: COLORS.primaryLight,
        borderColor: 'rgba(35, 92, 248, 0.1)',
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.text.muted,
        textAlign: 'center',
    },
    categoryLabelActive: {
        color: COLORS.primary,
        fontWeight: '800',
    },
});

export default CategoryCard;
