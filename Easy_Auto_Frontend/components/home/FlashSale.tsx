import { FLASH_SALES } from "@/constants/dummydata/homedummydata";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

interface FlashSaleProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const FlashSale: React.FC<FlashSaleProps> = ({ fadeAnim, slideAnim }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % FLASH_SALES.length;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                return nextIndex;
            });
        }, 4000); // 4 seconds interval

        return () => clearInterval(interval);
    }, []);

    const renderItem = ({ item }: { item: typeof FLASH_SALES[0] }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
            style={[styles.card, { backgroundColor: item.color }]}
        >
            <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeIcon}>{item.icon}</Text>
                        <Text style={styles.badgeText}>FLASH SALE</Text>
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.rightContent}>
                    <View style={styles.timerContainer}>
                        <MaterialIcons name="timer" size={14} color="#FFFFFF" />
                        <Text style={styles.timerText}>{item.timer}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.shopButton}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                    >
                        <Text style={[styles.shopButtonText, { color: item.color }]}>Claim</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Decorative background circle */}
            <View style={styles.decorativeCircle} />
        </TouchableOpacity>
    );

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
                data={FLASH_SALES}
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
            <View style={styles.pagination}>
                {FLASH_SALES.map((_, index) => (
                    <View
                        key={`dot-${index}`}
                        style={[
                            styles.dot,
                            currentIndex === index && styles.activeDot,
                        ]}
                    />
                ))}
            </View>
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
    leftContent: {
        flex: 1,
        justifyContent: "center",
        gap: 4,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        marginBottom: 4,
    },
    badgeIcon: {
        fontSize: 12,
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
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
        gap: 10,
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    timerText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        fontFamily: "monospace",
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
