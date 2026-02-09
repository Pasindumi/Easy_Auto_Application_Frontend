import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import COLORS from '@/constants/Colors';
import StarRating from './StarRating';
import { api } from '@/utils/api';

interface ReviewFormProps {
    adId: string;
    onSuccess: () => void;
}

export default function ReviewForm({ adId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) {
            Alert.alert("Error", "Please select a star rating.");
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<{ success: boolean; message: string }>('/api/reviews', {
                ad_id: adId,
                rating,
                comment
            });

            if (response.success) {
                Alert.alert("Success", "Review submitted successfully!");
                setRating(0);
                setComment('');
                onSuccess();
            } else {
                Alert.alert("Error", response.message || "Failed to submit review.");
            }
        } catch (error: any) {
            console.error("Submit review error:", error);
            if (error.status === 401) {
                Alert.alert("Auth Required", "Please login to submit a review.");
            } else {
                Alert.alert("Error", error.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Write a Review</Text>

            <View style={styles.ratingContainer}>
                <Text style={styles.label}>Your Rating:</Text>
                <StarRating rating={rating} onRatingChange={setRating} size={32} />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Your Comment:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Share your experience..."
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity
                style={[styles.submitButton, (loading || rating === 0) && styles.disabledButton]}
                onPress={handleSubmit}
                disabled={loading || rating === 0}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Review</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 16,
    },
    ratingContainer: {
        marginBottom: 16,
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text.secondary,
        marginBottom: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.divider,
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: COLORS.text.primary,
        minHeight: 100,
        backgroundColor: '#FAFAFA',
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: COLORS.text.muted,
        opacity: 0.7,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
