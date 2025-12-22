import { Image } from "expo-image";
import React from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

interface RecentlyViewedProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

import { RECENTLY_VIEWED } from "@/app/dummydata/homedummydata";

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
    fadeAnim,
    slideAnim,
}) => {
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
                <Text style={styles.sectionTitle}>Recently Viewed</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllLink}>See all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {RECENTLY_VIEWED.map((car) => (
                    <TouchableOpacity
                        key={`recently-viewed-${car.id}`}
                        style={styles.recentlyViewedCard}
                    >
                        <Image
                            source={{ uri: car.image }}
                            style={styles.recentlyViewedImage}
                            contentFit="cover"
                        />
                        <View style={styles.recentlyViewedInfo}>
                            <Text style={styles.recentlyViewedName}>{car.name}</Text>
                            <Text style={styles.recentlyViewedPrice}>{car.price}</Text>
                            <Text style={styles.recentlyViewedTime}>{car.viewedAt}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
