import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RatingStarsProps {
    rating: number;       // 0 – 5, supports decimals
    reviewCount?: number;
    size?: number;
    showCount?: boolean;
    color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    reviewCount,
    size = 14,
    showCount = true,
    color = "#FCD34D",
}) => {
    const clampedRating = Math.min(5, Math.max(0, rating));
    const fullStars = Math.floor(clampedRating);
    const hasHalf = clampedRating - fullStars >= 0.4;

    return (
        <View style={styles.row}>
            {Array.from({ length: 5 }, (_, i) => {
                let iconName: "star" | "star-half" | "star-outline";
                if (i < fullStars) iconName = "star";
                else if (i === fullStars && hasHalf) iconName = "star-half";
                else iconName = "star-outline";

                return (
                    <Ionicons
                        key={i}
                        name={iconName}
                        size={size}
                        color={i < fullStars || (i === fullStars && hasHalf) ? color : "#D1D5DB"}
                    />
                );
            })}
            {showCount && reviewCount !== undefined && (
                <Text style={[styles.count, { fontSize: size * 0.8 }]}>
                    ({reviewCount.toLocaleString()})
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    count: {
        color: "#6B7280",
        fontWeight: "600",
        marginLeft: 4,
    },
});

export default RatingStars;
