import { DAILY_DEALS } from "@/constants/dummydata/homedummydata";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface DailyDealsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

export default function DailyDeals({ fadeAnim, slideAnim }: DailyDealsProps) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 5,
        minutes: 23,
        seconds: 45,
    });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
                <View style={styles.headerTextContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Daily Deals</Text>
                        <View style={styles.fireIconContainer}>
                             <Ionicons name="flame" size={18} color="#FF4444" />
                        </View>
                    </View>
                    <Text style={styles.subtitle}>Limited time offers ending soon</Text>
                </View>
                
                <View style={styles.timerContainer}>
                    <View style={styles.timerBlock}>
                        <Text style={styles.timerValue}>{String(timeLeft.hours).padStart(2, "0")}</Text>
                        <Text style={styles.timerLabel}>Hr</Text>
                    </View>
                    <Text style={styles.timerSeparator}>:</Text>
                    <View style={styles.timerBlock}>
                        <Text style={styles.timerValue}>{String(timeLeft.minutes).padStart(2, "0")}</Text>
                        <Text style={styles.timerLabel}>Min</Text>
                    </View>
                    <Text style={styles.timerSeparator}>:</Text>
                    <View style={styles.timerBlock}>
                        <Text style={styles.timerValue}>{String(timeLeft.seconds).padStart(2, "0")}</Text>
                        <Text style={styles.timerLabel}>Sec</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={200}
            >
                {DAILY_DEALS.map((deal) => (
                    <TouchableOpacity
                        key={`deal-${deal.id}`}
                        style={styles.card}
                        activeOpacity={0.9}
                    >
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: deal.image }}
                                style={styles.image}
                                contentFit="cover"
                                transition={300}
                            />
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{deal.discount}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle} numberOfLines={2}>{deal.name}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.dealPrice}>{deal.dealPrice}</Text>
                                <Text style={styles.originalPrice}>{deal.originalPrice}</Text>
                            </View>
                            
                            <View style={styles.progressBarContainer}>
                                <View style={styles.progressBarBackground}>
                                    <View style={[styles.progressBarFill, { width: '75%' }]} />
                                </View>
                                <Text style={styles.stockText}>5 left</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingVertical: 16,
        backgroundColor: '#FFF0F0', // Very light red background for urgency
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    headerTextContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    fireIconContainer: {
        backgroundColor: '#FFE5E5',
        padding: 4,
        borderRadius: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted, // Muted text or red-ish?
        marginTop: 2,
        fontWeight: "500",
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timerBlock: {
        backgroundColor: "#FF4444",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        minWidth: 42,
        alignItems: "center",
    },
    timerValue: {
        fontSize: 16,
        fontWeight: "800", // Extra bold
        color: COLORS.white,
        fontVariant: ['tabular-nums'],
    },
    timerLabel: {
        fontSize: 9,
        fontWeight: "600",
        color: 'rgba(255,255,255,0.8)',
        marginTop: 0,
    },
    timerSeparator: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FF4444",
        marginBottom: 10, // Align with numbers
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: 180,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.1)', // Subtle red border
    },
    imageContainer: {
        height: 120,
        width: "100%",
        position: 'relative',
    },
    image: {
        width: "100%",
        height: "100%",
    },
    discountBadge: {
        position: "absolute",
        top: 8,
        left: 8,
        backgroundColor: "#FF4444",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    discountText: {
        fontSize: 11,
        fontWeight: "800",
        color: COLORS.white,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 8,
        height: 40, // Fixed height for 2 lines
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
        gap: 6,
        marginBottom: 12,
    },
    dealPrice: {
        fontSize: 16,
        fontWeight: "800",
        color: "#FF4444",
    },
    originalPrice: {
        fontSize: 12,
        color: COLORS.text.muted,
        textDecorationLine: "line-through",
        fontWeight: "500",
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBarBackground: {
        flex: 1,
        height: 6,
        backgroundColor: '#FFE5E5',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FF4444',
        borderRadius: 3,
    },
    stockText: {
        fontSize: 10,
        fontWeight: "600",
        color: '#FF4444',
    },
});
