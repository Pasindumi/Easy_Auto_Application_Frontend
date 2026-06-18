import React, { useMemo } from "react";
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import SectionHeader from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

interface BudgetRangeSectionProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const RANGES = [
    { label: "Under 5M", sub: "Budget", max: 5000000, colors: ["#059669", "#10B981"] as [string, string], icon: "wallet" as const },
    { label: "5M – 10M", sub: "Mid", min: 5000000, max: 10000000, colors: ["#1A4BCE", "#3B72FF"] as [string, string], icon: "car-sport" as const },
    { label: "10M – 20M", sub: "Premium", min: 10000000, max: 20000000, colors: ["#7C3AED", "#8B5CF6"] as [string, string], icon: "star" as const },
    { label: "Above 20M", sub: "Luxury", min: 20000000, colors: ["#D97706", "#F59E0B"] as [string, string], icon: "diamond" as const },
];

const BudgetRangeSection: React.FC<BudgetRangeSectionProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View style={[themeStyles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader title="Shop by Budget" subtitle="Find listings within your range" />
            <ScrollView
                horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={themeStyles.scroll} decelerationRate="fast"
            >
                {RANGES.map((r, i) => (
                    <TouchableOpacity
                        key={i} activeOpacity={0.85}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            router.push({ pathname: "/(tabs)/search", params: { minPrice: r.min?.toString() ?? "0", maxPrice: r.max?.toString() ?? "" } } as any);
                        }}
                    >
                        <LinearGradient colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : r.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={themeStyles.card}>
                            <View style={themeStyles.iconBox}>
                                <Ionicons name={r.icon} size={22} color={isDarkMode ? colors.primary : "#fff"} />
                            </View>
                            <Text style={themeStyles.label}>{r.label}</Text>
                            <Text style={themeStyles.sub}>{r.sub}</Text>
                            <Ionicons name="arrow-forward-circle" size={20} color={isDarkMode ? colors.text.muted : "rgba(255,255,255,0.7)"} style={themeStyles.arrow} />
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: { backgroundColor: isDarkMode ? colors.background : "#F8FAFF" },
    scroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
    card: {
        width: 138,
        height: 128,
        borderRadius: 22,
        padding: 16,
        justifyContent: "space-between",
        shadowColor: isDarkMode ? colors.primary : "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 7,
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: colors.border,
    },
    iconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
    label: { color: colors.text.primary, fontSize: 14, fontWeight: "800", letterSpacing: -0.3 },
    sub: { color: colors.text.muted, fontSize: 11, fontWeight: "600", marginTop: -8 },
    arrow: { alignSelf: "flex-end", marginTop: -6 },
});

export default BudgetRangeSection;
