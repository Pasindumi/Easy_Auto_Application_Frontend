import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "@/utils/api";
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

interface FlashSaleProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const FlashSale: React.FC<FlashSaleProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [discounts, setDiscounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors, isDarkMode } = useTheme();

    const fetchDiscounts = async () => {
        try {
            const data = await api.get<any[]>('/api/discounts/active');
            setDiscounts(data);
        } catch (error) {
            console.error("Failed to fetch discounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    useEffect(() => {
        if (discounts.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % discounts.length;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                return nextIndex;
            });
        }, 6000);

        return () => clearInterval(interval);
    }, [discounts]);

    const handlePress = (item: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/discounts/${item.id}` as any);
    };

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.95}
            style={[themeStyles.card, { backgroundColor: item.color_theme || colors.primary }]}
            onPress={() => handlePress(item)}
        >
            {item.offer_image_url ? (
                <>
                    <Image
                        source={{ uri: item.offer_image_url }}
                        style={StyleSheet.absoluteFillObject}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
                        style={StyleSheet.absoluteFillObject}
                    />
                </>
            ) : (
                <View style={themeStyles.decorativeCircle} />
            )}

            <View style={themeStyles.cardContent}>
                <View style={themeStyles.leftContent}>
                    <View style={themeStyles.badgeContainer}>
                        <Text style={themeStyles.badgeText}>FLASH SALE</Text>
                    </View>
                    <Text style={themeStyles.title} numberOfLines={1}>{item.name}</Text>
                    <Text style={themeStyles.discountValue}>
                        {item.discount_type === 'PERCENTAGE' ? `${item.value}% OFF` : `LKR ${item.value} OFF`}
                    </Text>
                    {(item.start_date || item.end_date) && (
                        <View style={themeStyles.validityContainer}>
                            <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.8)" />
                            <Text style={themeStyles.validityText}>
                                {item.start_date ? formatDate(item.start_date) : ""} - {item.end_date ? formatDate(item.end_date) : ""}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={themeStyles.rightContent}>
                    <View style={themeStyles.shopButton}>
                        <Ionicons name="arrow-forward" size={24} color={item.color_theme || colors.primary} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) return null;
    if (discounts.length === 0) return null;

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
            <FlatList
                ref={flatListRef}
                data={discounts}
                renderItem={renderItem}
                keyExtractor={(item) => `flash-sale-${item.id}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 12}
                decelerationRate="fast"
                contentContainerStyle={themeStyles.scrollContent}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + 12,
                    offset: (CARD_WIDTH + 12) * index,
                    index,
                })}
            />

            {discounts.length > 1 && (
                <View style={themeStyles.pagination}>
                    {discounts.map((_, index) => (
                        <View
                            key={`dot-${index}`}
                            style={[
                                themeStyles.dot,
                                currentIndex === index && themeStyles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: 160,
        borderRadius: 24,
        marginRight: 12,
        overflow: "hidden",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        padding: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftContent: {
        flex: 1,
        justifyContent: "center",
        gap: 6,
    },
    badgeContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    title: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    discountValue: {
        color: COLORS.white,
        fontSize: 28,
        fontWeight: "900",
        letterSpacing: -1,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    validityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    validityText: {
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
        fontWeight: "600",
    },
    rightContent: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 16,
    },
    shopButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    decorativeCircle: {
        position: "absolute",
        right: -40,
        bottom: -40,
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        zIndex: -1,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 16,
        gap: 8,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.border,
    },
    activeDot: {
        width: 20,
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
});

export default FlashSale;
