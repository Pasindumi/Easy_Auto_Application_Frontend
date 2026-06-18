import React, { useEffect, useState, memo, useMemo } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

interface PriceDropAlertProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const PriceDropAlert: React.FC<PriceDropAlertProps> = memo(({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();
    const [alertCar, setAlertCar] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchPriceDrop = async () => {
        setLoading(true);
        try {
            const res: any = await api.get('/api/cars?limit=1&sort=updated_at');
            if (res.success && res.data?.length > 0) {
                const car = res.data[0];
                const dropAmount = Math.floor(car.price * 0.05);
                setAlertCar({ ...car, originalPrice: car.price + dropAmount, priceDrop: dropAmount });
            }
        } catch (error) {
            console.error("Error fetching price drop:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPriceDrop();
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

    if (loading || !alertCar) return null;

    const details = Array.isArray(alertCar.CarDetails) ? alertCar.CarDetails?.[0] : alertCar.CarDetails;
    const imageUrl = alertCar.AdImage?.[0]?.image_url;
    const brand = details?.brand || "";
    const model = details?.model || "";
    const title = alertCar.title || `${brand} ${model}`;

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
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/cars/${alertCar.id}` as any);
                }}
            >
                <View style={themeStyles.card}>
                    <View style={themeStyles.headerRow}>
                        <View style={themeStyles.badge}>
                            <Ionicons name="trending-down" size={14} color="#DC2626" />
                            <Text style={themeStyles.badgeText}>Price Drop Alert</Text>
                        </View>
                        <Text style={themeStyles.timeText}>Just now</Text>
                    </View>

                    <View style={themeStyles.contentRow}>
                        <View style={themeStyles.imageContainer}>
                            <Image
                                source={imageUrl ? { uri: imageUrl } : require('@/assets/images/car.jpg')}
                                style={themeStyles.image}
                                contentFit="cover"
                                transition={300}
                                cachePolicy="memory-disk"
                            />
                        </View>

                        <View style={themeStyles.detailsContainer}>
                            <Text style={themeStyles.title} numberOfLines={2}>{title}</Text>

                            <View style={themeStyles.priceContainer}>
                                <Text style={themeStyles.originalPrice}>{formatPrice(alertCar.originalPrice)}</Text>
                                <View style={themeStyles.newPriceRow}>
                                    <Text style={themeStyles.newPrice}>{formatPrice(alertCar.price)}</Text>
                                    <View style={themeStyles.dropPill}>
                                        <Text style={themeStyles.dropText}>↓ {formatPrice(alertCar.priceDrop)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
});

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    card: {
        borderRadius: 10,
        padding: 16,
        backgroundColor: isDarkMode ? colors.backgroundSecondary : '#FEF2F2',
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : '#FECACA',
        shadowColor: isDarkMode ? colors.primary : '#DC2626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: isDarkMode ? "rgba(220, 38, 38, 0.1)" : '#FEE2E2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        gap: 6,
    },
    badgeText: {
        color: '#DC2626',
        fontSize: 12,
        fontWeight: '700',
    },
    timeText: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '500',
    },
    contentRow: {
        flexDirection: 'row',
        gap: 16,
    },
    imageContainer: {
        width: 100,
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 8,
    },
    priceContainer: {
        gap: 2,
    },
    originalPrice: {
        fontSize: 12,
        color: colors.text.muted,
        textDecorationLine: 'line-through',
        fontWeight: '500',
    },
    newPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    newPrice: {
        fontSize: 18,
        fontWeight: '800',
        color: '#DC2626',
    },
    dropPill: {
        backgroundColor: '#DC2626',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    dropText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default PriceDropAlert;
