import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface QuickSellBannerProps {
    fadeAnim: Animated.Value;
}

const STEPS = [
    { icon: "camera-outline" as const, label: "Add Photos" },
    { icon: "create-outline" as const, label: "Set Details" },
    { icon: "checkmark-circle" as const, label: "Go Live!" },
];

const QuickSellBanner: React.FC<QuickSellBannerProps> = ({ fadeAnim }) => {
    const router = useRouter();
    const { colors, isDarkMode } = useTheme();

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View style={[themeStyles.outer, { opacity: fadeAnim }]}>
            <LinearGradient
                colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : ["#059669", "#047857"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={themeStyles.card}
            >
                <View style={themeStyles.blob1} />
                <View style={themeStyles.blob2} />

                <View style={themeStyles.row}>
                    <View style={themeStyles.left}>
                        <View style={themeStyles.tagPill}>
                            <Ionicons name="flash" size={11} color={isDarkMode ? colors.primary : "#fff"} />
                            <Text style={themeStyles.tagTxt}>FREE LISTING</Text>
                        </View>
                        <Text style={themeStyles.heading}>Sell Your Car{"\n"}in 3 Easy Steps</Text>
                        <Text style={themeStyles.sub}>Post your ad free and reach 50k+ buyers</Text>

                        <TouchableOpacity
                            style={themeStyles.cta}
                            activeOpacity={0.85}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                router.push("/cars/select-type" as any);
                            }}
                        >
                            <Text style={themeStyles.ctaTxt}>Sell Now</Text>
                            <Ionicons name="arrow-forward" size={14} color={isDarkMode ? colors.white : "#059669"} />
                        </TouchableOpacity>
                    </View>

                    <View style={themeStyles.steps}>
                        {STEPS.map((s, i) => (
                            <View key={i} style={themeStyles.step}>
                                <View style={themeStyles.stepIcon}>
                                    <Ionicons name={s.icon} size={16} color={isDarkMode ? colors.primary : "#fff"} />
                                </View>
                                <Text style={themeStyles.stepLabel}>{s.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    outer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? colors.border : "#F1F5F9",
    },
    card: {
        borderRadius: 10,
        padding: 20,
        overflow: "hidden",
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: colors.border,
    },
    blob1: {
        position: "absolute", top: -40, right: -40,
        width: 130, height: 130, borderRadius: 65,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.08)",
    },
    blob2: {
        position: "absolute", bottom: -30, left: 60,
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },
    left: { flex: 1 },
    tagPill: {
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)",
        alignSelf: "flex-start",
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
        marginBottom: 10,
    },
    tagTxt: { color: isDarkMode ? colors.text.primary : "#fff", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
    heading: {
        fontSize: 20, fontWeight: "800", color: isDarkMode ? colors.text.primary : "#fff",
        letterSpacing: -0.4, lineHeight: 26, marginBottom: 6,
    },
    sub: {
        fontSize: 12, color: isDarkMode ? colors.text.muted : "rgba(255,255,255,0.75)",
        fontWeight: "500", lineHeight: 16, marginBottom: 16,
    },
    cta: {
        flexDirection: "row", alignItems: "center", gap: 6,
        backgroundColor: isDarkMode ? colors.primary : "#fff",
        alignSelf: "flex-start",
        paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10,
    },
    ctaTxt: { color: isDarkMode ? colors.white : "#059669", fontWeight: "800", fontSize: 13 },

    steps: { gap: 10 },
    step: { flexDirection: "row", alignItems: "center", gap: 8 },
    stepIcon: {
        width: 30, height: 30, borderRadius: 10,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.2)",
        alignItems: "center", justifyContent: "center",
    },
    stepLabel: { fontSize: 12, fontWeight: "600", color: isDarkMode ? colors.text.primary : "rgba(255,255,255,0.9)" },
});

export default QuickSellBanner;
