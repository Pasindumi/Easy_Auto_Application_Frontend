import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    color?: string;
    disabled?: boolean;
}

export default function StarRating({
    rating,
    onRatingChange,
    size = 24,
    color = "#FFD700", // Gold color
    disabled = false
}: StarRatingProps) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <View style={styles.container}>
            {stars.map((star) => (
                <TouchableOpacity
                    key={star}
                    disabled={disabled || !onRatingChange}
                    onPress={() => onRatingChange && onRatingChange(star)}
                >
                    <Ionicons
                        name={star <= rating ? "star" : "star-outline"}
                        size={size}
                        color={star <= rating ? color : COLORS.text.muted}
                        style={styles.star}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        marginRight: 4,
    },
});
