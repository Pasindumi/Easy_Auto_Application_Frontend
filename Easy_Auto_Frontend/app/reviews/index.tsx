
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, TextInput, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import api from '@/utils/api';
import { LinearGradient } from 'expo-linear-gradient';

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

const ReviewsPage = () => {
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
            alert("Please write a comment.");
            return;
        }

        setSubmitting(true);
        try {
            const response: any = await api.post('/api/app-reviews', { rating, comment });
            if (response.success) {
                alert("Thank you for your review!");
                setModalVisible(false);
                setComment('');
                setRating(5);
                fetchReviews();
                fetchStats();
            } else {
                alert(response.message || "Failed to submit review.");
            }
        } catch (error: any) {
            alert(error.message || "Something went wrong.");
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
                        <Text style={styles.userName}>{item.user?.name || 'Anonymous User'}</Text>
                        <Text style={styles.reviewDate}>{new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                    </View>
                </View>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFF" />
                    <Text style={styles.ratingBadgeText}>{item.rating}.0</Text>
                </View>
            </View>

            <Text style={styles.reviewText}>{item.comment}</Text>

            {item.reply && (
                <View style={styles.developerResponse}>
                    <View style={styles.responseHeader}>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
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

    const renderHeader = () => (
        <View style={styles.listHeader}>
            {/* Overall Rating Card */}
            <View style={styles.overallRatingCard}>
                <View style={styles.ratingLeft}>
                    <Text style={styles.bigRating}>{stats.averageRating}</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Ionicons
                                key={star}
                                name={star <= Math.round(stats.averageRating) ? "star" : "star-outline"}
                                size={18}
                                color="#FFD700"
                            />
                        ))}
                    </View>
                    <Text style={styles.totalCount}>{stats.totalReviews} ratings</Text>
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

            {/* Filters */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[
                    { title: 'All', value: 'All' },
                    { title: 'Positive', value: 'Positive' },
                    { title: 'Critical', value: 'Critical' },
                    { title: '5 ★', value: '5' },
                    { title: '4 ★', value: '4' },
                    { title: '3 ★', value: '3' },
                    { title: '2 ★', value: '2' },
                    { title: '1 ★', value: '1' },
                ]}
                renderItem={({ item }) => <FilterChip title={item.title} value={item.value} />}
                keyExtractor={item => item.value}
                contentContainerStyle={styles.filterList}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Stack.Screen options={{
                headerShown: true,
                title: "Reviews",
                headerShadowVisible: false,
                headerStyle: { backgroundColor: '#fff' },
                headerTitleStyle: { fontWeight: 'bold' },
                headerRight: () => (
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerBtn}>
                        <Text style={styles.headerBtnText}>Write a Review</Text>
                    </TouchableOpacity>
                )
            }} />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={getFilteredReviews()}
                    renderItem={renderReviewItem}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubble-ellipses-outline" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyText}>No reviews found matching your filter.</Text>
                        </View>
                    }
                />
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
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitButtonText}>Submit Review</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const getRandomColor = (name: string) => {
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899'];
    if (!name) return '#9CA3AF';
    const index = name.length % colors.length;
    return colors[index];
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 24,
    },
    listHeader: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#F9FAFB',
    },
    overallRatingCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    ratingLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 24,
        paddingRight: 24,
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
    bigRating: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.text.primary,
        lineHeight: 56,
    },
    starsRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    totalCount: {
        fontSize: 12,
        color: COLORS.text.secondary,
        fontWeight: '500',
    },
    ratingRight: {
        flex: 1,
        justifyContent: 'center',
    },
    barRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    starLabel: {
        fontSize: 12,
        color: COLORS.text.secondary,
        width: 12,
        fontWeight: '600',
        marginRight: 8,
    },
    barTrack: {
        flex: 1,
        height: 6,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    filterList: {
        gap: 8,
        paddingBottom: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 0,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.text.secondary,
    },
    filterChipTextActive: {
        color: '#fff',
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    userMeta: {
        justifyContent: 'center',
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    reviewDate: {
        fontSize: 11,
        color: COLORS.text.muted,
        marginTop: 2,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    ratingBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 15,
        color: COLORS.text.gray,
        lineHeight: 22,
    },
    developerResponse: {
        marginTop: 16,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
    },
    responseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    developerName: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.text.primary,
    },
    responseDate: {
        fontSize: 11,
        color: COLORS.text.muted,
    },
    responseText: {
        fontSize: 14,
        color: COLORS.text.secondary,
        lineHeight: 20,
    },
    headerBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    headerBtnText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        marginTop: 12,
        color: COLORS.text.muted,
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text.primary,
    },
    closeBtn: {
        padding: 4,
    },
    modalSubtitle: {
        fontSize: 14,
        color: COLORS.text.secondary,
        marginBottom: 24,
    },
    starSelection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        fontSize: 16,
        minHeight: 120,
        marginBottom: 24,
        color: COLORS.text.primary,
    },
    submitButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
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

export default ReviewsPage;
