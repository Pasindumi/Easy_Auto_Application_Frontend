import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useMemo } from "react";
import { Animated, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { api } from "@/utils/api";
import SectionHeader from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

interface ValuePropsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const ValueProps: React.FC<ValuePropsProps> = ({ fadeAnim, slideAnim }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { colors, isDarkMode } = useTheme();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get<any>("/api/stats");
            if (res.success) {
                setStats(res.data);
            }
        } catch (error) {
            console.error("Error fetching app stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const STAT_ITEMS = [
        {
            value: stats ? (stats.listings >= 1000 ? `${(stats.listings / 1000).toFixed(1)}k+` : stats.listings) : "0",
            label: "Listings",
            icon: "car-outline" as const,
            color: colors.primary,
            bg: isDarkMode ? "rgba(255,255,255,0.05)" : "#EEF2FF"
        },
        {
            value: stats ? (stats.dealers >= 1000 ? `${(stats.dealers / 1000).toFixed(1)}k+` : stats.dealers) : "0",
            label: "Dealers",
            icon: "business-outline" as const,
            color: isDarkMode ? colors.text.muted : "#475569",
            bg: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9"
        },
        {
            value: stats ? (stats.rating ? `${stats.rating}★` : "No rating") : "N/A",
            label: "Rating",
            icon: "star-outline" as const,
            color: colors.primary,
            bg: isDarkMode ? "rgba(255,255,255,0.05)" : "#EEF2FF"
        },
        {
            value: stats ? (stats.users >= 1000 ? `${(stats.users / 1000).toFixed(1)}k+` : stats.users) : "0",
            label: "Users",
            icon: "people-outline" as const,
            color: isDarkMode ? colors.text.muted : "#475569",
            bg: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9"
        },
    ];

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View style={[themeStyles.wrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="EasyAuto by the Numbers"
                subtitle="Trusted by thousands across Sri Lanka"
            />
            <View style={themeStyles.row}>
                {STAT_ITEMS.map((s, i) => (
                    <View key={i} style={themeStyles.card}>
                        <View style={[themeStyles.iconWrap, { backgroundColor: s.bg }]}>
                            {loading && !stats ? (
                                <ActivityIndicator size="small" color={s.color} />
                            ) : (
                                <Ionicons name={s.icon} size={20} color={s.color} />
                            )}
                        </View>
                        <Text
                            style={[themeStyles.val, { color: s.color, fontSize: s.value.toString().length > 5 ? 12 : 16 }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {s.value}
                        </Text>
                        <Text style={themeStyles.lbl}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    wrap: {
        backgroundColor: "transparent",
        paddingVertical: 0,
    },
    row: {
        flexDirection: "row",
        gap: 8,
        paddingHorizontal: 20,
    },
    card: {
        flex: 1,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 5,
        alignItems: "center",
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#DBEAFE",
        gap: 4,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    val: {
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: -0.3,
    },
    lbl: {
        fontSize: 10,
        fontWeight: "600",
        color: colors.text.muted,
    },
});

export default ValueProps;
