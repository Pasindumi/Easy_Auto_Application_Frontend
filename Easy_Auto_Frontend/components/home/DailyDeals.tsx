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
                styles.dailyDealsContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.dailyDealsHeader}>
                <View>
                    <Text style={styles.dailyDealsTitle}>Daily Deals</Text>
                    <Text style={styles.dailyDealsSubtitle}>Limited time offers</Text>
                </View>
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownLabel}>Ends in:</Text>
                    <View style={styles.countdownTimer}>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>
                                {String(timeLeft.hours).padStart(2, "0")}
                            </Text>
                            <Text style={styles.countdownUnit}>H</Text>
                        </View>
                        <Text style={styles.countdownSeparator}>:</Text>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>
                                {String(timeLeft.minutes).padStart(2, "0")}
                            </Text>
                            <Text style={styles.countdownUnit}>M</Text>
                        </View>
                        <Text style={styles.countdownSeparator}>:</Text>
                        <View style={styles.countdownItem}>
                            <Text style={styles.countdownValue}>
                                {String(timeLeft.seconds).padStart(2, "0")}
                            </Text>
                            <Text style={styles.countdownUnit}>S</Text>
                        </View>
                    </View>
                </View>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.dailyDealsScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {DAILY_DEALS.map((deal) => (
                    <TouchableOpacity
                        key={`deal-${deal.id}`}
                        style={styles.dailyDealCard}
                    >
                        <Image
                            source={{ uri: deal.image }}
                            style={styles.dailyDealImage}
                            contentFit="cover"
                        />
                        <View style={styles.dailyDealBadge}>
                            <Text style={styles.dailyDealBadgeText}>{deal.discount}</Text>
                        </View>
                        <View style={styles.dailyDealInfo}>
                            <Text style={styles.dailyDealName}>{deal.name}</Text>
                            <View style={styles.dailyDealPriceRow}>
                                <Text style={styles.dailyDealOriginalPrice}>
                                    {deal.originalPrice}
                                </Text>
                                <Text style={styles.dailyDealPrice}>{deal.dealPrice}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    dailyDealsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 32,
        backgroundColor: "#FFF5F5",
        marginBottom: 12,
    },
    dailyDealsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    dailyDealsTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    dailyDealsSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
    countdownContainer: {
        alignItems: "flex-end",
    },
    countdownLabel: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "600",
        marginBottom: 6,
        textTransform: "uppercase",
    },
    countdownTimer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    countdownItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
        minWidth: 40,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    countdownValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#FF4444",
    },
    countdownUnit: {
        fontSize: 9,
        fontWeight: "600",
        color: "#9CA3AF",
        marginTop: 2,
    },
    countdownSeparator: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FF4444",
    },
    dailyDealsScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    dailyDealCard: {
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
    dailyDealImage: {
        width: "100%",
        height: 110,
    },
    dailyDealBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#FF4444",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
    },
    dailyDealBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#FFFFFF",
    },
    dailyDealInfo: {
        padding: 12,
        minHeight: 80,
        justifyContent: "space-between",
    },
    dailyDealName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 8,
        lineHeight: 20,
    },
    dailyDealPriceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: "auto",
        gap: 8,
    },
    dailyDealOriginalPrice: {
        fontSize: 13,
        color: "#9CA3AF",
        textDecorationLine: "line-through",
        fontWeight: "500",
    },
    dailyDealPrice: {
        fontSize: 18,
        fontWeight: "700",
        color: "#FF4444",
    },
});
