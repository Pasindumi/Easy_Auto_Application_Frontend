import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ReviewCard from './ReviewCard';
import COLORS from '@/constants/Colors';

interface ReviewListProps {
    reviews: any[];
    loading?: boolean;
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
    if (loading) {
        return <Text style={styles.loadingText}>Loading reviews...</Text>;
    }

    if (!reviews || reviews.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    loadingText: {
        textAlign: 'center',
        padding: 20,
        color: COLORS.text.secondary,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.divider,
        borderStyle: 'dashed',
    },
    emptyText: {
        color: COLORS.text.muted,
        fontSize: 14,
    },
});
