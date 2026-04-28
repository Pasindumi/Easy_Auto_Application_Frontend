import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import COLORS from "@/constants/Colors";

interface MarketInsightsBannerProps { fadeAnim: Animated.Value }

const PILLARS = [
    { icon: "shield-checkmark-outline" as const, title: "Verified Sellers",  desc: "All dealers are KYC verified",    color: COLORS.primary, bg: "#EEF2FF" },
    { icon: "flash-outline"            as const, title: "Instant Listing",   desc: "Sell your car in minutes",         color: "#475569",      bg: "#F1F5F9" },
    { icon: "lock-closed-outline"      as const, title: "Safe Payments",     desc: "100% secure transactions",         color: COLORS.primary, bg: "#EEF2FF" },
    { icon: "headset-outline"          as const, title: "24/7 Support",      desc: "Always here to help you",          color: "#475569",      bg: "#F1F5F9" },
    { icon: "ribbon-outline"           as const, title: "Best Price",        desc: "Competitive market pricing",       color: COLORS.primary, bg: "#EEF2FF" },
    { icon: "people-outline"           as const, title: "50k+ Community",    desc: "Active buyers & sellers",          color: "#475569",      bg: "#F1F5F9" },
];

const MarketInsightsBanner: React.FC<MarketInsightsBannerProps> = ({ fadeAnim }) => (
    <Animated.View style={[styles.outer, { opacity: fadeAnim }]}>
        {/* Header with gradient */}
        <LinearGradient
            colors={["#235CF8", "#1346C8"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.gradientHeader}
        >
            <View style={styles.decorBlob} />
            <View style={styles.badge}>
                <Ionicons name="shield-checkmark" size={12} color="#FCD34D" />
                <Text style={styles.badgeTxt}>TRUSTED PLATFORM</Text>
            </View>
            <Text style={styles.heading}>Why EasyAuto?</Text>
            <Text style={styles.headingSub}>
                Sri Lanka's most trusted car marketplace with verified listings and secure deals.
            </Text>
        </LinearGradient>

        {/* 2-column grid of pillars */}
        <View style={styles.grid}>
            {PILLARS.map((p, i) => (
                <View key={i} style={styles.pillar}>
                    <View style={[styles.pillarIcon, { backgroundColor: p.bg }]}>
                        <Ionicons name={p.icon} size={20} color={p.color} />
                    </View>
                    <Text style={styles.pillarTitle}>{p.title}</Text>
                    <Text style={styles.pillarDesc}>{p.desc}</Text>
                </View>
            ))}
        </View>

        {/* Footer trust strip */}
        <View style={styles.trustStrip}>
            <Ionicons name="ribbon-outline" size={14} color={COLORS.primary} />
            <Text style={styles.trustTxt}>ISO 9001:2015 Certified Marketplace · Sri Lanka 🇱🇰</Text>
        </View>
    </Animated.View>
);

const styles = StyleSheet.create({
    outer: {
        backgroundColor: "#fff",
        overflow: "hidden",
    },

    // Header
    gradientHeader: {
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 32,
        overflow: "hidden",
    },
    decorBlob: {
        position: "absolute", width: 200, height: 200, borderRadius: 100,
        backgroundColor: "rgba(255,255,255,0.06)", top: -80, right: -60,
    },
    badge: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignSelf: "flex-start",
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5,
        marginBottom: 14,
    },
    badgeTxt: {
        color: "#FCD34D", fontSize: 10, fontWeight: "800", letterSpacing: 1,
    },
    heading: {
        fontSize: 26, fontWeight: "800", color: "#fff",
        letterSpacing: -0.5, marginBottom: 8,
    },
    headingSub: {
        fontSize: 14, color: "rgba(255,255,255,0.75)",
        fontWeight: "500", lineHeight: 20,
    },

    // Grid
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        gap: 12,
    },
    pillar: {
        width: "47%",
        backgroundColor: "#F8FAFF",
        borderRadius: 5,
        padding: 12,
        borderWidth: 1,
        borderColor: "#DBEAFE",
        gap: 8,
    },
    pillarIcon: {
        width: 44, height: 44, borderRadius: 5,
        alignItems: "center", justifyContent: "center",
    },
    pillarTitle: {
        fontSize: 14, fontWeight: "700", color: "#1E293B", letterSpacing: -0.2,
    },
    pillarDesc: {
        fontSize: 12, color: "#94A3B8", fontWeight: "500", lineHeight: 16,
    },

    // Footer
    trustStrip: {
        flexDirection: "row", alignItems: "center", justifyContent: "center",
        gap: 6,
        paddingVertical: 14,
        borderTopWidth: 1, borderTopColor: "#F1F5F9",
    },
    trustTxt: {
        fontSize: 11, color: "#64748B", fontWeight: "600",
    },
});

export default MarketInsightsBanner;
