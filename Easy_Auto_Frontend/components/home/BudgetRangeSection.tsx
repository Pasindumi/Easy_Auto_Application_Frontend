import React from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import SectionHeader from "./SectionHeader";

interface BudgetRangeSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const RANGES = [
    { label: "Under 5M",   sub: "Budget",   max: 5000000,              colors: ["#059669","#10B981"] as [string,string], icon: "wallet"        as const },
    { label: "5M – 10M",   sub: "Mid",      min: 5000000, max: 10000000, colors: ["#1A4BCE","#3B72FF"] as [string,string], icon: "car-sport"     as const },
    { label: "10M – 20M",  sub: "Premium",  min: 10000000, max: 20000000,colors: ["#7C3AED","#8B5CF6"] as [string,string], icon: "star"          as const },
    { label: "Above 20M",  sub: "Luxury",   min: 20000000,               colors: ["#D97706","#F59E0B"] as [string,string], icon: "diamond"       as const },
];

const BudgetRangeSection: React.FC<BudgetRangeSectionProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader title="Shop by Budget" subtitle="Find listings within your range" />
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll} decelerationRate="fast"
            >
                {RANGES.map((r, i) => (
                    <TouchableOpacity
                        key={i} activeOpacity={0.85}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            router.push({ pathname: "/(tabs)/search", params: { minPrice: r.min?.toString() ?? "0", maxPrice: r.max?.toString() ?? "" } } as any);
                        }}
                    >
                        <LinearGradient colors={r.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
                            <View style={styles.iconBox}>
                                <Ionicons name={r.icon} size={22} color="#fff" />
                            </View>
                            <Text style={styles.label}>{r.label}</Text>
                            <Text style={styles.sub}>{r.sub}</Text>
                            <Ionicons name="arrow-forward-circle" size={20} color="rgba(255,255,255,0.7)" style={styles.arrow} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF" },
    scroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
    card: {
        width: 138,
        height: 128,
        borderRadius: 22,
        padding: 16,
        justifyContent: "space-between",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 7,
    },
    iconBox: { width: 38, height: 38, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
    label: { color: "#fff", fontSize: 14, fontWeight: "800", letterSpacing: -0.3 },
    sub: { color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: "600", marginTop: -8 },
    arrow: { alignSelf: "flex-end", marginTop: -6 },
});

export default BudgetRangeSection;
