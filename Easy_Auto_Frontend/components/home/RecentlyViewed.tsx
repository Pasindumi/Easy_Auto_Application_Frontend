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

const { width } = Dimensions.get("window");

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
                // Since we don't have a real history API yet, we'll show "New Arrivals" or just active ads
                // The user asked to show active ads "like buy car section".
                const res: any = await api.get('/api/cars?status=ACTIVE&limit=10&page=2'); // Getting page 2 for variety
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

    if (!loading && ads.length === 0) return null;

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
                <Text style={styles.sectionTitle}>New Arrivals</Text>
                <TouchableOpacity onPress={() => router.push('/cars/buy-car')}>
                    <Text style={styles.seeAllLink}>See all</Text>
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
                                key={`recently-viewed-${car.id}`}
                                style={styles.recentlyViewedCard}
                                onPress={() => router.push(`/cars/${car.id}`)}
                            >
                                <Image
                                    source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                    style={styles.recentlyViewedImage}
                                    contentFit="cover"
                                />
                                <View style={styles.recentlyViewedInfo}>
                                    <Text style={styles.recentlyViewedName} numberOfLines={1}>{title}</Text>
                                    <Text style={styles.recentlyViewedPrice}>{formatPrice(car.price)}</Text>
                                    <Text style={styles.recentlyViewedTime} numberOfLines={1}>
                                        {car.location}
                                    </Text>
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
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.4,
    },
    seeAllLink: {
        fontSize: 14,
        color: "#235CF8",
        fontWeight: "600",
    },
    horizontalScroll: {
        paddingHorizontal: 20,
    },
    recentlyViewedCard: {
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
    recentlyViewedImage: {
        width: "100%",
        height: 100,
    },
    recentlyViewedInfo: {
        padding: 12,
        gap: 4,
        alignItems: "flex-start",
    },
    recentlyViewedName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        textAlign: "left",
    },
    recentlyViewedPrice: {
        fontSize: 15,
        fontWeight: "700",
        color: "#235CF8",
        textAlign: "left",
    },
    recentlyViewedTime: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "left",
    },
});

export default RecentlyViewed;
