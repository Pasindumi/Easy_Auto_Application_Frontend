import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";

interface TrendingCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    trendingCategory: string;
    setTrendingCategory: (category: string) => void;
}

import { CATEGORIES } from "@/constants/dummydata/homedummydata";
import COLORS from "@/constants/Colors";

const TrendingCars: React.FC<TrendingCarsProps> = ({
    fadeAnim,
    slideAnim,
    trendingCategory,
    setTrendingCategory,
}) => {
    const router = useRouter(); // Use router for navigation
    const [trendingAds, setTrendingAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrendingAds();
    }, []);

    const fetchTrendingAds = async () => {
        try {
            setLoading(true);
            const response: any = await api.get('/api/cars/trending');
            if (response.success && Array.isArray(response.data)) {
                setTrendingAds(response.data);
            }
        } catch (error) {
            console.error("Error fetching trending ads:", error);
        } finally {
            setLoading(false);
        }
    };

    // Use dummy data if no API data or while loading (optional, or just show skeleton)
    // For now, let's prefer API data, fall back to empty if none
    const displayAds = trendingAds.length > 0 ? trendingAds : [];

    if (!loading && displayAds.length === 0) {
        return null; // Hide section if no trending ads
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Trending Ads 🔥</Text>
                    <Text style={styles.subtitle}>Most popular this week</Text>
                </View>
                {/* 
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        // Navigate to all ads or filtered view
                        router.push('/(tabs)/explore');
                    }}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
                */}
            </View>

            {/* Category Tabs - Optional: Keep or Remove? User asked to "Update Trending Cars section to Trending Ads". 
                If the backend doesn't support category filtering for trending yet, maybe hide tabs or keep them if we want to filter CLIENT SIDE.
                For now, I will comment them out as the requirement implies a specific "Trending Ads" list based on reviews.
            */}
            {/* 
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsScroll}
                contentContainerStyle={styles.tabsContainer}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={`category-${category.name}`}
                        style={[
                            styles.tab,
                            trendingCategory === category.name && styles.tabActive,
                        ]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setTrendingCategory(category.name);
                        }}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                trendingCategory === category.name && styles.tabTextActive,
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.cardsContainer}
                decelerationRate="fast"
                snapToInterval={230 + 16}
            >
                {displayAds.map((ad, index) => (
                    <TouchableOpacity
                        key={`trending-${ad.id}-${index}`}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push(`/cars/${ad.id}`);
                        }}
                    >
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: ad.AdImage?.[0]?.image_url || "https://placehold.co/600x400/png" }}
                                style={styles.image}
                                contentFit="cover"
                                transition={300}
                                cachePolicy="memory-disk"
                            />

                            {/* Status Badge from Backend Logic if needed, or just Review Count badge */}
                            <View style={styles.reviewBadge}>
                                <Ionicons name="star" size={10} color="#FFD700" />
                                <Text style={styles.reviewText}>
                                    {ad.review_count || 0} Reviews
                                </Text>
                            </View>

                            <View style={styles.priceTag}>
                                <Text style={styles.priceText}>
                                    {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(ad.price)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {ad.title}
                            </Text>
                            <Text style={styles.cardSubTitle} numberOfLines={1}>
                                {ad.CarDetails?.model} {ad.CarDetails?.year}
                            </Text>

                            <View style={styles.detailsRow}>
                                <View style={styles.locationRow}>
                                    <Ionicons name="location-outline" size={14} color={COLORS.text.muted} />
                                    <Text style={styles.locationText} numberOfLines={1}>
                                        {ad.location?.split(",")[0] || "Unknown"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 8,
        marginBottom: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 4,
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.primary,
    },
    tabsScroll: {
        marginBottom: 20,
    },
    tabsContainer: {
        paddingHorizontal: 20,
        gap: 10,
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20, // Full rounded
        backgroundColor: COLORS.secondary,
        gap: 8,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.text.secondary,
    },
    tabTextActive: {
        color: COLORS.white,
    },
    badge: {
        backgroundColor: "rgba(0,0,0,0.05)",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
    },
    badgeActive: {
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    badgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.text.muted,
    },
    badgeTextActive: {
        color: COLORS.white,
    },
    cardsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 230,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    imageContainer: {
        height: 140,
        width: "100%",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: "hidden",
        position: 'relative',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    statusBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(10px)', // doesn't work on RN, but just logic
    },
    statusHot: { backgroundColor: COLORS.status.danger },
    statusCertified: { backgroundColor: COLORS.status.success },
    statusNew: { backgroundColor: COLORS.primary },
    statusText: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.white,
        textTransform: 'uppercase',
    },
    priceTag: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    priceText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 12,
    },
    cardContent: {
        padding: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: "500",
    },
    reviewBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backdropFilter: 'blur(10px)',
    },
    reviewText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardSubTitle: {
        fontSize: 12,
        color: COLORS.text.muted,
        marginTop: 2,
    },
});

export default TrendingCars;
