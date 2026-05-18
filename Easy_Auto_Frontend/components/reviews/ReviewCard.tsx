import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import StarRating from './StarRating';

interface ReviewCardProps {
    review: {
        id: string;
        rating: number;
        comment: string;
        created_at: string;
        user?: {
            name: string;
        };
    };
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {review.user?.name?.charAt(0).toUpperCase() || "U"}
                        </Text>
                    </View>
                    <View>
                        <Text style={styles.userName}>{review.user?.name || "Anonymous"}</Text>
                        <Text style={styles.date}>{formatDate(review.created_at)}</Text>
                    </View>
                </View>
                <StarRating rating={review.rating} size={16} disabled />
            </View>
            {review.comment && <Text style={styles.comment}>{review.comment}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 5,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    userName: {
        fontWeight: '600',
        color: COLORS.text.primary,
        fontSize: 14,
    },
    date: {
        fontSize: 12,
        color: COLORS.text.muted,
    },
    comment: {
        color: COLORS.text.secondary,
        fontSize: 14,
        lineHeight: 20,
    },
});
