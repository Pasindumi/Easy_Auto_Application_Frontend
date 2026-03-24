import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { api } from "@/utils/api";

interface ValuePropsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const ValueProps: React.FC<ValuePropsProps> = ({ fadeAnim, slideAnim }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
            color: "#235CF8",
            bg: "#EEF2FF"
        },
        {
            value: stats ? (stats.dealers >= 1000 ? `${(stats.dealers / 1000).toFixed(1)}k+` : stats.dealers) : "0",
            label: "Dealers",
            icon: "business-outline" as const,
            color: "#10B981",
            bg: "#ECFDF5"
        },
        {
            value: stats ? (stats.rating ? `${stats.rating}★` : "No rating") : "N/A",
            label: "Rating",
            icon: "star" as const,
            color: "#F59E0B",
            bg: "#FFFBEB"
        },
        {
            value: stats ? (stats.users >= 1000 ? `${(stats.users / 1000).toFixed(1)}k+` : stats.users) : "0",
            label: "Users",
            icon: "people" as const,
            color: "#7C3AED",
            bg: "#F5F3FF"
        },
    ];

    return (
        <Animated.View style={[styles.wrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.header}>
                <Text style={styles.title}>EasyAuto by the Numbers</Text>
                <Text style={styles.sub}>Trusted by thousands across Sri Lanka</Text>
            </View>
            <View style={styles.row}>
                {STAT_ITEMS.map((s, i) => (
                    <View key={i} style={styles.card}>
                        <View style={[styles.iconWrap, { backgroundColor: s.bg }]}>
                            {loading && !stats ? (
                                <ActivityIndicator size="small" color={s.color} />
                            ) : (
                                <Ionicons name={s.icon} size={20} color={s.color} />
                            )}
                        </View>
                        <Text
                            style={[styles.val, { color: s.color, fontSize: s.value.toString().length > 5 ? 12 : 16 }]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {s.value}
                        </Text>
                        <Text style={styles.lbl}>{s.label}</Text>
                    </View>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#fff",
        paddingVertical: 24,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: -0.4,
    },
    sub: {
        fontSize: 13,
        color: "#94A3B8",
        fontWeight: "500",
        marginTop: 2,
    },
    row: {
        flexDirection: "row",
        gap: 10,
    },
    card: {
        flex: 1,
        backgroundColor: "#F8FAFF",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        gap: 6,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
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
        color: "#94A3B8",
    },
});

export default ValueProps;
