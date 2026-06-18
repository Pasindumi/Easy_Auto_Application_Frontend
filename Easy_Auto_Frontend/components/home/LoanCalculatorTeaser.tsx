import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState, useMemo } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

interface LoanCalculatorTeaserProps {
    fadeAnim: Animated.Value;
}

const PRICES = [
    { label: "LKR 1M", value: 1_000_000 },
    { label: "LKR 2.5M", value: 2_500_000 },
    { label: "LKR 5M", value: 5_000_000 },
    { label: "LKR 10M", value: 10_000_000 },
];

const RATE = 0.12;
const MONTHS = 60;

function calcEMI(P: number) {
    const r = RATE / 12;
    return Math.round((P * r * Math.pow(1 + r, MONTHS)) / (Math.pow(1 + r, MONTHS) - 1));
}

function fmt(n: number) {
    return `LKR ${n.toLocaleString()}`;
}

const LoanCalculatorTeaser: React.FC<LoanCalculatorTeaserProps> = ({ fadeAnim }) => {
    const router = useRouter();
    const [sel, setSel] = useState(0);
    const emi = calcEMI(PRICES[sel].value);
    const { colors, isDarkMode } = useTheme();

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View style={[themeStyles.outer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={themeStyles.header}>
                <View>
                    <Text style={themeStyles.title}>💰 Loan Calculator</Text>
                    <Text style={themeStyles.sub}>Estimate your monthly repayment</Text>
                </View>
                <TouchableOpacity
                    style={themeStyles.detailBtn}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/tools/loan-calculator" as any);
                    }}
                >
                    <Text style={themeStyles.detailBtnTxt}>Full Calc</Text>
                    <Ionicons name="chevron-forward" size={13} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Price selector */}
            <View style={themeStyles.priceRow}>
                {PRICES.map((p, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[themeStyles.priceChip, i === sel && themeStyles.priceChipActive]}
                        onPress={() => { Haptics.selectionAsync(); setSel(i); }}
                    >
                        <Text style={[themeStyles.priceChipTxt, i === sel && themeStyles.priceChipTxtActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Result card */}
            <LinearGradient
                colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : [colors.primary, "#1346C8"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={themeStyles.resultCard}
            >
                <View style={themeStyles.resultLeft}>
                    <Text style={themeStyles.resultLabel}>Est. Monthly Payment</Text>
                    <Text style={themeStyles.resultEMI}>{fmt(emi)}</Text>
                    <Text style={themeStyles.resultNote}>@ 12% p.a. · 60 months</Text>
                </View>

                <View style={themeStyles.resultRight}>
                    <View style={themeStyles.infoItem}>
                        <Text style={themeStyles.infoVal}>{fmt(PRICES[sel].value)}</Text>
                        <Text style={themeStyles.infoLbl}>Car Price</Text>
                    </View>
                    <View style={themeStyles.divider} />
                    <View style={themeStyles.infoItem}>
                        <Text style={themeStyles.infoVal}>{fmt(emi * MONTHS)}</Text>
                        <Text style={themeStyles.infoLbl}>Total Pay</Text>
                    </View>
                </View>
            </LinearGradient>

            <Text style={themeStyles.disclaimer}>* Estimate only. Contact a bank for exact rates.</Text>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    outer: {
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingVertical: 22,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? colors.border : "#F1F5F9",
    },
    header: {
        flexDirection: "row", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 14,
    },
    title: { fontSize: 18, fontWeight: "800", color: colors.text.primary, letterSpacing: -0.4 },
    sub: { fontSize: 13, color: colors.text.muted, fontWeight: "500", marginTop: 2 },
    detailBtn: {
        flexDirection: "row", alignItems: "center", gap: 2,
        backgroundColor: isDarkMode ? colors.backgroundSecondary : "#EEF2FF",
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
        marginTop: 4,
    },
    detailBtnTxt: { fontSize: 12, fontWeight: "700", color: colors.primary },

    priceRow: {
        flexDirection: "row", gap: 8, marginBottom: 14,
    },
    priceChip: {
        flex: 1, paddingVertical: 8, borderRadius: 10,
        backgroundColor: isDarkMode ? colors.backgroundSecondary : "#F8FAFF", borderWidth: 1, borderColor: isDarkMode ? colors.border : "#F1F5F9",
        alignItems: "center",
    },
    priceChipActive: {
        backgroundColor: colors.primary, borderColor: colors.primary,
    },
    priceChipTxt: { fontSize: 11, fontWeight: "700", color: colors.text.muted },
    priceChipTxtActive: { color: COLORS.white },

    resultCard: {
        borderRadius: 18, padding: 18,
        flexDirection: "row", alignItems: "center", gap: 16,
        marginBottom: 10,
        borderWidth: isDarkMode ? 1 : 0,
        borderColor: colors.border,
    },
    resultLeft: { flex: 1 },
    resultLabel: { fontSize: 11, color: isDarkMode ? colors.text.muted : "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: 4 },
    resultEMI: { fontSize: 24, fontWeight: "800", color: isDarkMode ? colors.text.primary : "#fff", letterSpacing: -0.5, marginBottom: 4 },
    resultNote: { fontSize: 10, color: isDarkMode ? colors.text.muted : "rgba(255,255,255,0.6)", fontWeight: "500" },

    resultRight: {
        flexDirection: "row", alignItems: "center", gap: 12,
    },
    infoItem: { alignItems: "center" },
    infoVal: { fontSize: 13, fontWeight: "800", color: isDarkMode ? colors.text.primary : "#fff", letterSpacing: -0.2 },
    infoLbl: { fontSize: 10, color: isDarkMode ? colors.text.muted : "rgba(255,255,255,0.65)", fontWeight: "500", marginTop: 2 },
    divider: { width: 1, height: 28, backgroundColor: isDarkMode ? colors.border : "rgba(255,255,255,0.25)" },

    disclaimer: { fontSize: 10, color: colors.text.muted, fontWeight: "500", textAlign: "center" },
});

export default LoanCalculatorTeaser;
