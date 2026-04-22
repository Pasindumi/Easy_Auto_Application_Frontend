import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect, useState, memo } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import Loading from "../ui/Loading";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");

interface RecommendedCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const RecommendedCars: React.FC<RecommendedCarsProps> = memo(({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAds = async () => {
        setLoading(true);
        try {
            // Fetching active ads. Limiting to 10 for "Recommended"
            const res: any = await api.get('/api/cars/recommended');
            if (res.success) {
                setAds(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching recommended ads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                    <Text style={styles.title}>Recommended For You</Text>
                    <Text style={styles.subtitle}>Curated based on your interests</Text>
                </View>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        fetchAds();
                    }}
                >
                    <Ionicons name="refresh" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Loading size="small" />
                </View>
            ) : ads.length === 0 ? (
                <View style={{ paddingVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.text.muted, fontSize: 14 }}>No recommended cars at this time.</Text>
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={190 + 16}
                >
                    {ads.map((car, index) => {
                        // CarDetails can be an object (list endpoint) or array (some Supabase versions)
                        const details = Array.isArray(car.CarDetails) ? car.CarDetails?.[0] : car.CarDetails;
                        const imageUrl = car.AdImage?.[0]?.image_url;
                        const brand = details?.brand || "";
                        const model = details?.model || "";
                        const title = car.title || `${brand} ${model}`;

                        return (
                            <TouchableOpacity
                                key={`recommended-${car.id}-${index}`}
                                style={styles.card}
                                activeOpacity={0.9}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(`/cars/${car.id}` as any);
                                }}
                            >
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                        style={styles.image}
                                        contentFit="cover"
                                        transition={400}
                                        cachePolicy="memory-disk"
                                    />
                                    <View style={styles.priceTag}>
                                        <Text style={styles.priceText}>{formatPrice(car.price)}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.likeButton}>
                                        <Ionicons name="heart-outline" size={14} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                                    <Text style={styles.cardSubTitle} numberOfLines={1}>
                                        {details?.model} {details?.year}
                                    </Text>
                                    <View style={styles.locationRow}>
                                        <Ionicons name="location-outline" size={12} color={COLORS.text.muted} />
                                        <Text style={styles.locationText} numberOfLines={1}>{car.location?.split(",")[0] || "Sri Lanka"}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </Animated.View>
    );
});

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
        fontWeight: "800", // Extra bold
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    refreshButton: {
        padding: 8,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 12,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20, // Space for shadow
        gap: 16,
    },
    card: {
        width: 190,
        backgroundColor: COLORS.white,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: COLORS.border,
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
    likeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
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
});

export default RecommendedCars;
