
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import COLORS from '@/constants/Colors';
import api from '@/utils/api';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: {
        name: string;
    };
}

const HomeReviewsSlider = () => {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopReviews();
    }, []);

    const fetchTopReviews = async () => {
        try {
            // Fetch reviews (ideally filtered by top rating from backend, but doing client side filter for now if needed)
            const response: any = await api.get('/api/app-reviews?rating=5');
            if (response.success) {
                // Take top 5 recent 5-star reviews
                setReviews(response.data.slice(0, 5));
            }
        } catch (error) {
            console.error("Error fetching home reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || reviews.length === 0) return null;

    const renderItem = ({ item }: { item: Review }) => (
        <View style={styles.card}>
            <View style={styles.quoteIcon}>
                <Ionicons name="sparkles" size={16} color={COLORS.primary} />
            </View>

            <View style={styles.cardHeader}>
                <View style={[styles.avatar, { backgroundColor: getRandomColor(item.user?.name) }]}>
                    <Text style={styles.avatarText}>{item.user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
                </View>
                <View>
                    <Text style={styles.userName} numberOfLines={1}>{item.user?.name || 'Happy User'}</Text>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <Ionicons key={star} name="star" size={10} color="#FFD700" />
                        ))}
                    </View>
                </View>
            </View>

            <Text style={styles.comment} numberOfLines={3}>
                "{item.comment}"
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>What Our Users Say</Text>
                    <Text style={styles.subtitle}>Trusted by thousands of users</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/reviews')}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 16}
                decelerationRate="fast"
                contentContainerStyle={styles.listContent}
                keyExtractor={(item, index) => item.id || index.toString()}
            />
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
        marginVertical: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.text.primary,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.text.secondary,
        marginTop: 2,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    listContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    quoteIcon: {
        position: 'absolute',
        top: 20,
        right: 20,
        opacity: 0.5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    ratingRow: {
        flexDirection: 'row',
        gap: 2,
    },
    comment: {
        fontSize: 14,
        color: COLORS.text.secondary,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});

export default HomeReviewsSlider;
