import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import COLORS from "@/constants/Colors";

interface TrendingCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    trendingCategory: string;
    setTrendingCategory: (category: string) => void;
}

const TrendingCars: React.FC<TrendingCarsProps> = ({
    fadeAnim,
    slideAnim,
    trendingCategory,
    setTrendingCategory,
}) => {
    const router = useRouter();
    const { t } = useTranslation();
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

    const displayAds = trendingAds.length > 0 ? trendingAds : [];

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
                    <Text style={styles.title}>{t("home_screen.trending", "Trending Ads 🔥")}</Text>
                    <Text style={styles.subtitle}>Most popular this week</Text>
                </View>
            </View>

            {displayAds.length === 0 ? (
                <View style={[styles.cardsContainer, { paddingVertical: 30, justifyContent: 'center', alignItems: 'center', width: '100%' }]}>
                    <Text style={{ color: COLORS.text.muted, fontSize: 14 }}>No trending ads found right now.</Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsContainer}
                    decelerationRate="fast"
                    snapToInterval={190 + 16}
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
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    cardsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 190,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 110,
        width: "100%",
        position: 'relative',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    priceTag: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    priceText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 11,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    cardSubTitle: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: "500",
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    locationText: {
        fontSize: 11,
        color: COLORS.text.muted,
        fontWeight: "500",
        flex: 1,
    },
    reviewBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    reviewText: {
        color: '#fff',
        fontSize: 9,
        fontWeight: 'bold',
    },
});

export default TrendingCars;
