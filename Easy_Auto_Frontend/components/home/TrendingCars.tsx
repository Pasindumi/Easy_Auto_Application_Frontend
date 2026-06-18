import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useState, useEffect, useMemo } from "react";
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
import Loading from "../ui/Loading";
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

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
    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View
            style={[
                themeStyles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={themeStyles.header}>
                <View style={themeStyles.titleContainer}>
                    <Text style={themeStyles.title}>{t("home_screen.trending", "Trending Ads 🔥")}</Text>
                    <Text style={themeStyles.subtitle}>Most popular this week</Text>
                </View>
            </View>

            {loading ? (
                <View style={[themeStyles.cardsContainer, { paddingVertical: 30, justifyContent: 'center', alignItems: 'center', width: '100%' }]}>
                    <Loading size="small" />
                </View>
            ) : displayAds.length === 0 ? (
                <View style={[themeStyles.cardsContainer, { paddingVertical: 30, justifyContent: 'center', alignItems: 'center', width: '100%' }]}>
                    <Text style={{ color: colors.text.muted, fontSize: 14 }}>No trending ads found right now.</Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={themeStyles.cardsContainer}
                    decelerationRate="fast"
                    snapToInterval={190 + 16}
                >
                    {displayAds.map((ad, index) => (
                        <TouchableOpacity
                            key={`trending-${ad.id}-${index}`}
                            style={themeStyles.card}
                            activeOpacity={0.9}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push(`/cars/${ad.id}`);
                            }}
                        >
                            <View style={themeStyles.imageContainer}>
                                <Image
                                    source={{ uri: ad.AdImage?.[0]?.image_url || "https://placehold.co/600x400/png" }}
                                    style={themeStyles.image}
                                    contentFit="cover"
                                    transition={300}
                                    cachePolicy="memory-disk"
                                />
                                <View style={themeStyles.reviewBadge}>
                                    <Ionicons name="star" size={10} color="#FFD700" />
                                    <Text style={themeStyles.reviewText}>
                                        {ad.review_count || 0} Reviews
                                    </Text>
                                </View>

                                <View style={themeStyles.priceTag}>
                                    <Text style={themeStyles.priceText}>
                                        {new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(ad.price)}
                                    </Text>
                                </View>
                            </View>

                            <View style={themeStyles.cardContent}>
                                <Text style={themeStyles.cardTitle} numberOfLines={1}>
                                    {ad.title}
                                </Text>
                                <Text style={themeStyles.cardSubTitle} numberOfLines={1}>
                                    {ad.CarDetails?.model} {ad.CarDetails?.year}
                                </Text>

                                <View style={themeStyles.detailsRow}>
                                    <View style={themeStyles.locationRow}>
                                        <Ionicons name="location-outline" size={14} color={colors.text.muted} />
                                        <Text style={themeStyles.locationText} numberOfLines={1}>
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

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: colors.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: colors.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    cardsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 190,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : '#DBEAFE',
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
        color: colors.white,
        fontWeight: "700",
        fontSize: 11,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.text.primary,
        marginBottom: 4,
    },
    cardSubTitle: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: "500",
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
        gap: 3,
    },
    locationText: {
        fontSize: 11,
        color: colors.text.muted,
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
