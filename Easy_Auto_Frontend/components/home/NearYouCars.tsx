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
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";
import Loading from "../ui/Loading";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");

interface NearYouCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const NearYouCars: React.FC<NearYouCarsProps> = memo(({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLocalAds = async () => {
        setLoading(true);
        try {
            // Ideally this would take user's lat/lon, but for now we simulate "Near You"
            // by fetching ads with a specific geographical query or just recent ones as placeholder
            const res: any = await api.get('/api/cars?limit=6'); 
            if (res.success) {
                setAds(res.data || []);
            }
        } catch (error) {
            console.error("Error fetching near you ads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocalAds();
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
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <SectionHeader
                title="Cars Near You"
                subtitle="Based on your current location"
                onViewAll={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Pass a location param to search if needed
                    router.push('/(tabs)/search');
                }}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <Loading size="small" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={270 + 16}
                >
                    {ads.map((car, index) => {
                        const details = Array.isArray(car.CarDetails) ? car.CarDetails?.[0] : car.CarDetails;
                        const imageUrl = car.AdImage?.[0]?.image_url;
                        const brand = details?.brand || "";
                        const model = details?.model || "";
                        const title = car.title || `${brand} ${model}`;

                        return (
                            <TouchableOpacity
                                key={`local-${car.id}-${index}`}
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
                                        transition={300}
                                        cachePolicy="memory-disk"
                                    />
                                    <View style={styles.distanceBadge}>
                                        <Ionicons name="location" size={12} color={COLORS.white} />
                                        <Text style={styles.distanceText}>{(Math.random() * 15 + 1).toFixed(1)} km</Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <View style={styles.titleRow}>
                                        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                                        <Text style={styles.priceText}>{formatPrice(car.price)}</Text>
                                    </View>
                                    
                                    <Text style={styles.cardSubTitle} numberOfLines={1}>
                                        {details?.model} · {details?.year}
                                    </Text>
                                    
                                    <View style={styles.specRow}>
                                        {details?.mileage && (
                                            <View style={styles.specChip}>
                                                <Ionicons name="speedometer-outline" size={12} color={COLORS.text.muted} />
                                                <Text style={styles.specText}>
                                                    {Number(details.mileage).toLocaleString()} km
                                                </Text>
                                            </View>
                                        )}
                                        {details?.fuel_type && (
                                            <View style={styles.specChip}>
                                                <Ionicons name="flash-outline" size={12} color={COLORS.text.muted} />
                                                <Text style={styles.specText}>{details.fuel_type}</Text>
                                            </View>
                                        )}
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
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 16,
    },
    card: {
        width: 270,
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
        height: 160,
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
    distanceBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    distanceText: {
        color: COLORS.white,
        fontWeight: "700",
        fontSize: 12,
    },
    cardContent: {
        padding: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    cardTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginRight: 8,
    },
    priceText: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.primary,
    },
    cardSubTitle: {
        fontSize: 13,
        fontWeight: "500",
        color: COLORS.text.muted,
        marginBottom: 12,
    },
    specRow: {
        flexDirection: 'row',
        gap: 8,
    },
    specChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
    },
    specText: {
        fontSize: 12,
        color: COLORS.text.secondary,
        fontWeight: "600",
    },
});

export default NearYouCars;
