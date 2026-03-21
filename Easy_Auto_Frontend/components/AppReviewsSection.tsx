import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Image, Alert } from 'react-native';
import Loading from './ui/Loading';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import api from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface Review {
    id: string;
    rating: number;
    comment: string;
    reply?: string;
    reply_at?: string;
    created_at: string;
    user: {
        name: string;
    };
}

const AppReviewsSection = () => {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0, breakdown: {} as Record<string, number> });
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Positive, Critical, 5, 4, 3, 2, 1
    const [modalVisible, setModalVisible] = useState(false);

    // Add Review State
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
        fetchStats();
    }, []);

    const fetchReviews = async () => {
        try {
            const response: any = await api.get('/api/app-reviews');
            if (response.success) {
                setReviews(response.data);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response: any = await api.get('/api/app-reviews/stats');
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleAddReview = async () => {
        if (!comment.trim()) {
            Alert.alert("Error", "Please write a comment.");
            return;
        }

        setSubmitting(true);
        try {
            const response: any = await api.post('/api/app-reviews', { rating, comment });
            if (response.success) {
                Alert.alert("Success", "Thank you for your review!");
                setModalVisible(false);
                setComment('');
                setRating(5);
                fetchReviews();
                fetchStats();
            } else {
                Alert.alert("Error", response.message || "Failed to submit review.");
            }
        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong.");
        } finally {
            setSubmitting(false);
        }
    };

    const getFilteredReviews = () => {
        let filtered = reviews;
        if (filter === 'Positive') {
            filtered = reviews.filter(r => r.rating >= 4);
        } else if (filter === 'Critical') {
            filtered = reviews.filter(r => r.rating <= 3);
        } else if (filter !== 'All') {
            filtered = reviews.filter(r => r.rating === parseInt(filter));
        }
        return filtered;
    };

    const renderReviewItem = ({ item }: { item: Review }) => (
        <View style={styles.reviewCard}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: getRandomColor(item.user?.name) }]}>
                        <Text style={styles.avatarText}>{item.user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                    </View>
                    <View style={styles.userMeta}>
                        <Text style={styles.userName}>{item.user?.name || 'Anonymous'}</Text>
                        <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                    </View>
                </View>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={10} color="#FFF" />
                    <Text style={styles.ratingBadgeText}>{item.rating}.0</Text>
                </View>
            </View>

            <Text style={styles.reviewText}>{item.comment}</Text>

            {item.reply && (
                <View style={styles.developerResponse}>
                    <View style={styles.responseHeader}>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={12} color={COLORS.primary} />
                            <Text style={styles.developerName}>Admin Response</Text>
                        </View>
                        <Text style={styles.responseDate}>{item.reply_at ? new Date(item.reply_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}</Text>
                    </View>
                    <Text style={styles.responseText}>{item.reply}</Text>
                </View>
            )}
        </View>
    );

    const FilterChip = ({ title, value }: { title: string; value: string }) => (
        <TouchableOpacity
            style={[styles.filterChip, filter === value && styles.filterChipActive]}
            onPress={() => setFilter(value)}
        >
            <Text style={[styles.filterChipText, filter === value && styles.filterChipTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    // Only show first 3 reviews in preview
    const displayedReviews = getFilteredReviews().slice(0, 3);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Ratings & Reviews</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Text style={styles.writeReviewText}>Write a Review</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.ratingLeft}>
                    <Text style={styles.ratingNumber}>{stats.averageRating}</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Ionicons
                                key={star}
                                name={star <= Math.round(stats.averageRating) ? "star" : "star-outline"}
                                size={14}
                                color="#FFD700"
                            />
                        ))}
                    </View>
                    <Text style={styles.totalReviews}>{stats.totalReviews} ratings</Text>
                </View>
                <View style={styles.ratingRight}>
                    {[5, 4, 3, 2, 1].map(stars => {
                        const count = stats.breakdown[stars] || 0;
                        const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                        return (
                            <View key={stars} style={styles.barRow}>
                                <Text style={styles.starLabel}>{stars}</Text>
                                <View style={styles.barTrack}>
                                    <View style={[styles.barFill, { width: `${percentage}%` }]} />
                                </View>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={styles.filtersScroll}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[
                        { title: 'All', value: 'All' },
                        { title: 'Positive', value: 'Positive' },
                        { title: 'Critical', value: 'Critical' },
                        { title: '5 ★', value: '5' },
                    ]}
                    renderItem={({ item }) => <FilterChip title={item.title} value={item.value} />}
                    keyExtractor={item => item.value}
                    contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
                />
            </View>

            {loading ? (
                <Loading size="small" style={{ marginTop: 20 }} />
            ) : (
                <>
                    {displayedReviews.map((item, index) => (
                        <View key={item.id || index}>
                            {renderReviewItem({ item })}
                        </View>
                    ))}

                    <TouchableOpacity
                        style={styles.viewAllButton}
                        onPress={() => router.push('/reviews' as any)}
                    >
                        <Text style={styles.viewAllText}>View All Reviews</Text>
                        <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                </>
            )}

            {/* Write Review Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Write a Review</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>How was your experience?</Text>

                        <View style={styles.starSelection}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <Ionicons
                                        name={star <= rating ? "star" : "star-outline"}
                                        size={40}
                                        color="#FFD700"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TextInput
                            style={styles.input}
                            placeholder="Tell us what you liked or how we can improve..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            value={comment}
                            onChangeText={setComment}
                            textAlignVertical="top"
                        />

                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleAddReview}
                            disabled={submitting}
                        >
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.primaryDark]}
                                style={styles.gradientButton}
                            >
                                {submitting ? (
                                    <Loading size="small" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Review</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const getRandomColor = (name: string) => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1'];
    if (!name) return '#9CA3AF';
    return colors[name.length % colors.length];
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    writeReviewText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    summaryCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    ratingLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
        paddingRight: 20,
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
    ratingNumber: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.text.primary,
    },
    starsRow: {
        flexDirection: 'row',
        marginVertical: 4,
    },
    totalReviews: {
        fontSize: 11,
        color: COLORS.text.secondary,
    },
    ratingRight: {
        flex: 1,
        justifyContent: 'center',
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    starLabel: {
        fontSize: 10,
        color: COLORS.text.secondary,
        width: 10,
        fontWeight: '600',
        marginRight: 8,
    },
    barTrack: {
        flex: 1,
        height: 5,
        backgroundColor: '#F3F4F6',
        borderRadius: 3,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 3,
    },
    filtersScroll: {
        marginBottom: 16,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    filterChipTextActive: {
        color: '#fff',
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
        elevation: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    userMeta: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    reviewDate: {
        fontSize: 10,
        color: COLORS.text.muted,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        gap: 2,
    },
    ratingBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 14,
        color: COLORS.text.gray,
        lineHeight: 20,
    },
    developerResponse: {
        marginTop: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.primary,
    },
    responseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    developerName: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    responseDate: {
        fontSize: 10,
        color: COLORS.text.muted,
    },
    responseText: {
        fontSize: 12,
        color: COLORS.text.secondary,
        lineHeight: 18,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 8,
        backgroundColor: '#F0F9FF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primaryFaint,
    },
    viewAllText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    closeBtn: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 20,
    },
    starSelection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 100,
        marginBottom: 20,
        color: COLORS.text.primary,
    },
    submitButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default AppReviewsSection;
