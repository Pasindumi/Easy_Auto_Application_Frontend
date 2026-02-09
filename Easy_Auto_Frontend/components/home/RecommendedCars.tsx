import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";

interface RecommendedCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const RecommendedCars: React.FC<RecommendedCarsProps> = ({
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
            const res: any = await api.get('/api/cars?status=ACTIVE&limit=10');
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

    if (!loading && ads.length === 0) return null; // Don't show section if no ads

    return (
        <Animated.View
            style={[
                styles.sectionWhite,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <View style={styles.recommendedHeader}>
                    <Text style={styles.sectionTitle}>Recommended For You</Text>
                    <Text style={styles.recommendedSubtitle}>
                        Based on available listings
                    </Text>
                </View>
                <TouchableOpacity style={styles.refreshButton} onPress={fetchAds}>
                    <MaterialIcons name="refresh" size={18} color="#235CF8" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ padding: 20 }}>
                    <ActivityIndicator color="#235CF8" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.horizontalScroll}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    {ads.map((car) => {
                        const imageUrl = car.AdImage?.[0]?.image_url;
                        const brand = car.CarDetails?.brand || "";
                        const model = car.CarDetails?.model || "";
                        const title = car.title || `${brand} ${model}`;

                        return (
                            <TouchableOpacity
                                key={`recommended-${car.id}`}
                                style={styles.recommendedCarCard}
                                activeOpacity={0.95}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(`/cars/${car.id}`);
                                }}
                            >
                                <View style={styles.recommendedImageWrapper}>
                                    <Image
                                        source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                        style={styles.recommendedCarImage}
                                        contentFit="cover"
                                        transition={300}
                                        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgRj" }}
                                        cachePolicy="memory-disk"
                                    />
                                    {/* Status Badge - Condition */}
                                    {car.CarDetails?.condition && (
                                        <View
                                            style={[
                                                styles.recommendedStatusBadge,
                                                styles.statusBadgeNew, // Default blue
                                            ]}
                                        >
                                            <Text style={styles.statusBadgeText}>{car.CarDetails.condition}</Text>
                                        </View>
                                    )}
                                </View>
                                {/* Car Info */}
                                <View style={styles.recommendedCarInfo}>
                                    <Text style={styles.recommendedCarName} numberOfLines={1}>{title}</Text>
                                    <View style={styles.recommendedCarPriceRow}>
                                        <Text style={styles.recommendedCarPrice}>{formatPrice(car.price)}</Text>
                                        <Text style={styles.recommendedCarDistance} numberOfLines={1}>
                                            {car.location}
                                        </Text>
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
    sectionWhite: {
        paddingVertical: 20,
        paddingBottom: 32,
        backgroundColor: "#FFFFFF",
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    recommendedHeader: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.4,
    },
    recommendedSubtitle: {
        fontSize: 12,
        color: "#6B7280",
        fontWeight: "500",
        marginTop: 2,
    },
    refreshButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "#EBF4FF",
    },
    horizontalScroll: {
        paddingHorizontal: 20,
    },
    recommendedCarCard: {
        width: 150,
        marginRight: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    recommendedImageWrapper: {
        position: "relative",
        width: "100%",
        height: 110,
        overflow: "hidden",
    },
    recommendedCarImage: {
        width: "100%",
        height: "100%",
    },
    recommendedStatusBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 3,
    },
    statusBadgeHot: {
        backgroundColor: "#FF6B35",
    },
    statusBadgeCertified: {
        backgroundColor: "#10B981",
    },
    statusBadgeNew: {
        backgroundColor: "#235CF8",
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
    recommendedCarInfo: {
        padding: 12,
        gap: 4,
        alignItems: "flex-start",
    },
    recommendedCarName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.2,
        textAlign: "left",
    },
    recommendedCarPriceRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
    },
    recommendedCarPrice: {
        fontSize: 15,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: -0.2,
        textAlign: "left",
    },
    recommendedCarDistance: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "left",
    },
});

export default RecommendedCars;
