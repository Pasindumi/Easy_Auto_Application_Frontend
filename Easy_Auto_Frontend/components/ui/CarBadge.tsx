import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";

export type BadgeType = "NEW" | "USED" | "FEATURED" | "HOT" | "VERIFIED" | "CERTIFIED" | "PRICE_DROP" | "RENTAL";

const BADGE_CONFIG: Record<BadgeType, {
    label: string;
    textColor: string;
    bg: string;
    icon?: keyof typeof Ionicons.glyphMap;
}> = {
    NEW:        { label: "New",        textColor: "#fff",     bg: COLORS.primary,       icon: "sparkles"               },
    USED:       { label: "Used",       textColor: "#374151",  bg: "#F3F4F6",            icon: undefined                },
    FEATURED:   { label: "Featured",   textColor: "#fff",     bg: "#7C3AED",            icon: "star"                   },
    HOT:        { label: "🔥 Hot",     textColor: "#fff",     bg: COLORS.status.danger, icon: undefined                },
    VERIFIED:   { label: "Verified",   textColor: "#fff",     bg: COLORS.status.success, icon: "shield-checkmark"      },
    CERTIFIED:  { label: "Certified",  textColor: "#fff",     bg: "#0891B2",            icon: "ribbon"                 },
    PRICE_DROP: { label: "Price Drop", textColor: "#fff",     bg: "#D97706",            icon: "trending-down"          },
    RENTAL:     { label: "Rental",     textColor: "#fff",     bg: "#059669",            icon: "key"                    },
};

interface CarBadgeProps {
    type: BadgeType;
    size?: "sm" | "md";
}

const CarBadge: React.FC<CarBadgeProps> = ({ type, size = "md" }) => {
    const cfg = BADGE_CONFIG[type];
    const isSmall = size === "sm";

    return (
        <View style={[styles.badge, { backgroundColor: cfg.bg }, isSmall && styles.badgeSm]}>
            {cfg.icon && (
                <Ionicons
                    name={cfg.icon}
                    size={isSmall ? 8 : 10}
                    color={cfg.textColor}
                    style={{ marginRight: 3 }}
                />
            )}
            <Text style={[styles.label, { color: cfg.textColor }, isSmall && styles.labelSm]}>
                {cfg.label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: "flex-start",
    },
    badgeSm: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    label: {
        fontSize: 10,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    labelSm: {
        fontSize: 8,
    },
});

export default CarBadge;
