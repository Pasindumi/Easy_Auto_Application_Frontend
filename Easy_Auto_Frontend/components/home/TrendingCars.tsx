import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface TrendingCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    trendingCategory: string;
    setTrendingCategory: (category: string) => void;
}

import { CATEGORIES, TRENDING_CARS } from "@/app/dummydata/homedummydata";

const TrendingCars: React.FC<TrendingCarsProps> = ({
    fadeAnim,
    slideAnim,
    trendingCategory,
    setTrendingCategory,
}) => {
    return (
        <Animated.View
            style={[
                styles.section,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>Trending Cars</Text>
                    <Text style={styles.sectionSubtitle}>Most popular this week</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewAllButtonSmall}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                >
                    <Text style={styles.viewAllButtonTextSmall}>View All</Text>
                    <MaterialIcons name="arrow-forward" size={16} color="#235CF8" />
                </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryTabsScroll}
                contentContainerStyle={styles.categoryTabsContainer}
            >
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={`category-${category.name}`}
                        style={[
                            styles.categoryTab,
                            trendingCategory === category.name && styles.categoryTabActive,
                        ]}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setTrendingCategory(category.name);
                        }}
                    >
                        <Text
                            style={[
                                styles.categoryTabText,
                                trendingCategory === category.name &&
                                styles.categoryTabTextActive,
                            ]}
                        >
                            {category.name}
                        </Text>
                        {category.count > 0 && (
                            <View
                                style={[
                                    styles.categoryCountBadge,
                                    trendingCategory === category.name &&
                                    styles.categoryCountBadgeActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.categoryCountText,
                                        trendingCategory === category.name &&
                                        styles.categoryCountTextActive,
                                    ]}
                                >
                                    {category.count}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {TRENDING_CARS.map((car) => (
                    <TouchableOpacity
                        key={`trending-${car.id}`}
                        style={styles.trendingCarCard}
                        activeOpacity={0.95}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <View style={styles.trendingImageWrapper}>
                            <Image
                                source={{ uri: car.image }}
                                style={styles.trendingCarImage}
                                contentFit="cover"
                                transition={300}
                                placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgRj" }}
                                cachePolicy="memory-disk"
                                priority="high"
                                recyclingKey={`trending-${car.id}`}
                            />
                            {/* Status Badge */}
                            <View
                                style={[
                                    styles.trendingStatusBadge,
                                    car.status === "Hot Deal" && styles.statusBadgeHot,
                                    car.status === "Certified" && styles.statusBadgeCertified,
                                    car.status === "New" && styles.statusBadgeNew,
                                ]}
                            >
                                <Text style={styles.statusBadgeText}>{car.status}</Text>
                            </View>
                        </View>
                        {/* Car Info */}
                        <View style={styles.trendingCarInfo}>
                            <Text style={styles.trendingCarName}>
                                {car.model} {car.year && `(${car.year})`}
                            </Text>
                            <View style={styles.trendingCarPriceRow}>
                                <Text style={styles.trendingCarPrice}>{car.price}</Text>
                                <Text style={styles.trendingCarLocation}>
                                    {car.location.split(",")[0]}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    section: {
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
    sectionTitleContainer: {
        gap: 4,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 13,
        color: "#6B7280",
        fontWeight: "500",
    },
    viewAllButtonSmall: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    viewAllButtonTextSmall: {
        fontSize: 13,
        fontWeight: "600",
        color: "#235CF8",
    },
    categoryTabsScroll: {
        marginBottom: 20,
    },
    categoryTabsContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    categoryTab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        gap: 8,
    },
    categoryTabActive: {
        backgroundColor: "#EEF2FF",
        borderColor: "#235CF8",
    },
    categoryTabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
    },
    categoryTabTextActive: {
        color: "#235CF8",
    },
    categoryCountBadge: {
        backgroundColor: "#E5E7EB",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryCountBadgeActive: {
        backgroundColor: "#235CF8",
    },
    categoryCountText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#4B5563",
    },
    categoryCountTextActive: {
        color: "#FFFFFF",
    },
    horizontalScroll: {
        paddingHorizontal: 20,
    },
    trendingCarCard: {
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
    trendingImageWrapper: {
        position: "relative",
        width: "100%",
        height: 110,
        overflow: "hidden",
    },
    trendingCarImage: {
        width: "100%",
        height: "100%",
    },
    trendingStatusBadge: {
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
    trendingCarInfo: {
        padding: 12,
        gap: 4,
        alignItems: "flex-start",
    },
    trendingCarName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.2,
        textAlign: "left",
    },
    trendingCarPriceRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
    },
    trendingCarPrice: {
        fontSize: 15,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: -0.2,
        textAlign: "left",
    },
    trendingCarLocation: {
        fontSize: 11,
        color: "#6B7280",
        fontWeight: "500",
        textAlign: "left",
    },
});

export default TrendingCars;
