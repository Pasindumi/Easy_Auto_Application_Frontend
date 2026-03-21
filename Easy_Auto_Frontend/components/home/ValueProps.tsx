import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ValuePropsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const STATS = [
    { value: "10k+", label: "Listings",  icon: "car-outline"      as const, color: "#235CF8", bg: "#EEF2FF" },
    { value: "500+", label: "Dealers",   icon: "business-outline" as const, color: "#10B981", bg: "#ECFDF5" },
    { value: "4.8★", label: "Rating",    icon: "star"             as const, color: "#F59E0B", bg: "#FFFBEB" },
    { value: "50k+", label: "Users",     icon: "people"           as const, color: "#7C3AED", bg: "#F5F3FF" },
];

const ValueProps: React.FC<ValuePropsProps> = ({ fadeAnim, slideAnim }) => (
    <Animated.View style={[styles.wrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.header}>
            <Text style={styles.title}>EasyAuto by the Numbers</Text>
            <Text style={styles.sub}>Trusted by thousands across Sri Lanka</Text>
        </View>
        <View style={styles.row}>
            {STATS.map((s, i) => (
                <View key={i} style={styles.card}>
                    <View style={[styles.iconWrap, { backgroundColor: s.bg }]}>
                        <Ionicons name={s.icon} size={20} color={s.color} />
                    </View>
                    <Text style={[styles.val, { color: s.color }]}>{s.value}</Text>
                    <Text style={styles.lbl}>{s.label}</Text>
                </View>
            ))}
        </View>
    </Animated.View>
);

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
