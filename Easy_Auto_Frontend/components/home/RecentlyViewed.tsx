import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.6; // Wider cards for better visibility

interface RecentlyViewedProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            try {
                // Fetching active ads. Limiting to 10. 
                const res: any = await api.get('/api/cars?status=ACTIVE&limit=10&sort=created_at&order=desc');
                if (res.success) {
                    setAds(res.data || []);
                }
            } catch (error) {
                console.error("Error fetching recently viewed (active) ads:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAds();
    }, []);

    const formatPrice = (price: any) => {
        const val = Number(price) || 0;
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            maximumFractionDigits: 0,
            compactDisplay: "short",
            notation: "compact"
        }).format(val);
    };

    const handlePress = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/cars/${id}`);
    };

    if (!loading && ads.length === 0) return null;

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
                    <Text style={styles.title}>New Ads</Text>
                    <Text style={styles.subtitle}>Latest additions to our inventory</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/cars/buy-car');
                    }}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color={COLORS.primary} size="small" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + 16}
                >
                    {ads.map((car) => {
                        const imageUrl = car.AdImage?.[0]?.image_url;
                        const title = car.title || `${car.CarDetails?.brand || ''} ${car.CarDetails?.model || ''}`;

                        return (
                            <TouchableOpacity
                                key={`recently-viewed-${car.id}`}
                                style={styles.card}
                                activeOpacity={0.9}
                                onPress={() => handlePress(car.id)}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                        style={styles.image}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>New</Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                                    <Text style={styles.cardPrice}>{formatPrice(car.price)}</Text>

                                    <View style={styles.metaRow}>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="location-outline" size={12} color={COLORS.text.muted} />
                                            <Text style={styles.metaText} numberOfLines={1}>
                                                {car.location?.split(',')[0] || 'N/A'}
                                            </Text>
                                        </View>
                                        <View style={styles.metaDivider} />
                                        <View style={styles.metaItem}>
                                            <Ionicons name="speedometer-outline" size={12} color={COLORS.text.muted} />
                                            <Text style={styles.metaText}>
                                                {car.CarDetails?.mileage ? `${(Number(car.CarDetails.mileage) / 1000).toFixed(0)}k km` : 'N/A'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        backgroundColor: COLORS.background, // Ensure background consistency
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    viewAllText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "600",
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        overflow: "hidden",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    imageContainer: {
        height: 140,
        width: "100%",
        position: 'relative',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "700",
        textTransform: 'uppercase',
    },
    cardContent: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 6,
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background, // Slightly grey background for meta
        padding: 8,
        borderRadius: 10,
    },
    metaItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        justifyContent: 'center',
    },
    metaText: {
        fontSize: 11,
        color: COLORS.text.muted,
        fontWeight: "600",
    },
    metaDivider: {
        width: 1,
        height: 12,
        backgroundColor: COLORS.border,
        marginHorizontal: 4,
    },
});

export default RecentlyViewed;
