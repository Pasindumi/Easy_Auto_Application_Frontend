import React, { useState, useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ImageBackground,
} from "react-native";
import { api } from "@/utils/api";
import { Image } from "expo-image";

import { useRouter } from "expo-router";

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

    // Auto-scroll logic
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
        }, 5000);

        return () => clearInterval(interval);
    }, [discounts]);

    const handlePress = (item: any) => {
        router.push(`/discounts/${item.id}`);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.card, { backgroundColor: item.color_theme || "#235CF8" }]}
            onPress={() => handlePress(item)}
        >
            {item.offer_image_url && (
                <Image
                    source={{ uri: item.offer_image_url }}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                />
            )}
            <View style={[styles.cardContent, item.offer_image_url && styles.overlay]}>
                <View style={styles.leftContent}>
                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.subtitle}>
                        {item.discount_type === 'PERCENTAGE' ? `${item.value}% OFF` : `$${item.value} OFF`}
                    </Text>
                    {(item.start_date || item.end_date) && (
                        <View style={styles.validityContainer}>
                            <Text style={styles.validityText}>
                                {item.start_date ? formatDate(item.start_date) : ""} - {item.end_date ? formatDate(item.end_date) : ""}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.rightContent}>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => handlePress(item)}
                    >
                        <Text style={[styles.shopButtonText, { color: item.color_theme || "#235CF8" }]}>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Decorative background circle */}
            {!item.offer_image_url && <View style={styles.decorativeCircle} />}
        </TouchableOpacity>
    );

    if (loading) return null;
    if (discounts.length === 0) return null;

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
                contentContainerStyle={styles.scrollContent}
                getItemLayout={(_, index) => ({
                    length: CARD_WIDTH + 12,
                    offset: (CARD_WIDTH + 12) * index,
                    index,
                })}
            />

            {/* Pagination Dots */}
            {discounts.length > 1 && (
                <View style={styles.pagination}>
                    {discounts.map((_, index) => (
                        <View
                            key={`dot-${index}`}
                            style={[
                                styles.dot,
                                currentIndex === index && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_WIDTH,
        height: 120,
        borderRadius: 20,
        marginRight: 12,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    cardContent: {
        flex: 1,
        flexDirection: "row",
        padding: 16,
        zIndex: 2,
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.35)',
        borderRadius: 20,
    },
    leftContent: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    validityContainer: {
        marginTop: 8,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: "flex-start",
    },
    validityText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },
    title: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "900",
        letterSpacing: -0.5,
    },
    subtitle: {
        color: "#FFFFFF",
        fontSize: 12,
        opacity: 0.9,
        fontWeight: "600",
    },
    rightContent: {
        alignItems: "center",
        justifyContent: "center",
    },
    shopButton: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 2,
    },
    shopButtonText: {
        fontSize: 14,
        fontWeight: "800",
    },
    decorativeCircle: {
        position: "absolute",
        right: -30,
        bottom: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        zIndex: 1,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 12,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#E5E7EB",
    },
    activeDot: {
        width: 16,
        backgroundColor: "#235CF8",
    },
});

export default FlashSale;
