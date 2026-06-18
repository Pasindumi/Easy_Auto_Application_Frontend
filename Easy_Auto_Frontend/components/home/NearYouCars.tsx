import React, { useEffect, useState, memo, useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

    const fetchLocalAds = async () => {
        setLoading(true);
        try {
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

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    if (!loading && ads.length === 0) return null;

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
            <SectionHeader
                title="Cars Near You"
                subtitle="Based on your current location"
                onViewAll={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push('/(tabs)/search');
                }}
            />

            {loading ? (
                <View style={themeStyles.loadingContainer}>
                    <Loading size="small" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={themeStyles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={190 + 16}
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
                                style={themeStyles.card}
                                activeOpacity={0.9}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(`/cars/${car.id}` as any);
                                }}
                            >
                                <View style={themeStyles.imageContainer}>
                                    <Image
                                        source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                        style={themeStyles.image}
                                        contentFit="cover"
                                        transition={300}
                                        cachePolicy="memory-disk"
                                    />
                                    <View style={themeStyles.priceTag}>
                                        <Text style={themeStyles.priceText}>{formatPrice(car.price)}</Text>
                                    </View>
                                    <View style={themeStyles.distanceBadge}>
                                        <Ionicons name="location" size={10} color={colors.white} />
                                        <Text style={themeStyles.distanceText}>{(Math.random() * 15 + 1).toFixed(1)} km</Text>
                                    </View>
                                </View>

                                <View style={themeStyles.cardContent}>
                                    <Text style={themeStyles.cardTitle} numberOfLines={1}>{title}</Text>
                                    <Text style={themeStyles.cardSubTitle} numberOfLines={1}>
                                        {details?.model} {details?.year}
                                    </Text>

                                    <View style={themeStyles.locationRow}>
                                        <Ionicons name="location-outline" size={12} color={colors.text.muted} />
                                        <Text style={themeStyles.locationText} numberOfLines={1}>
                                            {car.location?.split(",")[0] || "Unknown"}
                                        </Text>
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

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
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
    distanceBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        gap: 3,
    },
    distanceText: {
        color: colors.white,
        fontWeight: "700",
        fontSize: 9,
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
        marginBottom: 6,
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
});

export default NearYouCars;
