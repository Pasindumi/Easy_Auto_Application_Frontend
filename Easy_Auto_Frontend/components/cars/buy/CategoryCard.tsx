import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CarCategory } from '../../../types/buy-car.types';

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
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    categoryCardActive: {
        borderColor: '#235CF8',
        backgroundColor: '#F0F4FF',
    },
    categoryIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    categoryIconContainerActive: {
        backgroundColor: '#E3F2FD',
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    categoryLabelActive: {
        color: '#235CF8',
        fontWeight: '700',
    },
});

export default CategoryCard;
