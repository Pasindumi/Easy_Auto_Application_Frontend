/**
 * LoanCalculatorTeaser – EMI estimator strip
 * Trending in: AutoTrader, CarGurus, Cars24
 */
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";

interface LoanCalculatorTeaserProps {
    fadeAnim: Animated.Value;
}

const PRICES = [
    { label: "LKR 1M",  value: 1_000_000  },
    { label: "LKR 2.5M",value: 2_500_000  },
    { label: "LKR 5M",  value: 5_000_000  },
    { label: "LKR 10M", value: 10_000_000 },
];

const RATE   = 0.12;  // 12% annual
const MONTHS = 60;    // 5-year term

function calcEMI(P: number) {
    const r = RATE / 12;
    return Math.round((P * r * Math.pow(1 + r, MONTHS)) / (Math.pow(1 + r, MONTHS) - 1));
}

function fmt(n: number) {
    return `LKR ${n.toLocaleString()}`;
}

const LoanCalculatorTeaser: React.FC<LoanCalculatorTeaserProps> = ({ fadeAnim }) => {
    const router  = useRouter();
    const [sel, setSel] = useState(0);
    const emi = calcEMI(PRICES[sel].value);

    return (
        <Animated.View style={[styles.outer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>💰 Loan Calculator</Text>
                    <Text style={styles.sub}>Estimate your monthly repayment</Text>
                </View>
                <TouchableOpacity
                    style={styles.detailBtn}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/tools/loan-calculator" as any);
                    }}
                >
                    <Text style={styles.detailBtnTxt}>Full Calc</Text>
                    <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Price selector */}
            <View style={styles.priceRow}>
                {PRICES.map((p, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.priceChip, i === sel && styles.priceChipActive]}
                        onPress={() => { Haptics.selectionAsync(); setSel(i); }}
                    >
                        <Text style={[styles.priceChipTxt, i === sel && styles.priceChipTxtActive]}>
                            {p.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Result card */}
            <LinearGradient
                colors={[COLORS.primary, "#1346C8"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.resultCard}
            >
                <View style={styles.resultLeft}>
                    <Text style={styles.resultLabel}>Est. Monthly Payment</Text>
                    <Text style={styles.resultEMI}>{fmt(emi)}</Text>
                    <Text style={styles.resultNote}>@ 12% p.a. · 60 months</Text>
                </View>

                <View style={styles.resultRight}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoVal}>{fmt(PRICES[sel].value)}</Text>
                        <Text style={styles.infoLbl}>Car Price</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.infoItem}>
                        <Text style={styles.infoVal}>{fmt(emi * MONTHS)}</Text>
                        <Text style={styles.infoLbl}>Total Pay</Text>
                    </View>
                </View>
            </LinearGradient>

            <Text style={styles.disclaimer}>* Estimate only. Contact a bank for exact rates.</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outer: {
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        paddingVertical: 22,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    header: {
        flexDirection: "row", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: 14,
    },
    title: { fontSize: 18, fontWeight: "800", color: "#0F172A", letterSpacing: -0.4 },
    sub:   { fontSize: 13, color: "#94A3B8", fontWeight: "500", marginTop: 2 },
    detailBtn: {
        flexDirection: "row", alignItems: "center", gap: 2,
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        marginTop: 4,
    },
    detailBtnTxt: { fontSize: 12, fontWeight: "700", color: COLORS.primary },

    priceRow: {
        flexDirection: "row", gap: 8, marginBottom: 14,
    },
    priceChip: {
        flex: 1, paddingVertical: 8, borderRadius: 10,
        backgroundColor: "#F8FAFF", borderWidth: 1, borderColor: "#F1F5F9",
        alignItems: "center",
    },
    priceChipActive: {
        backgroundColor: COLORS.primary, borderColor: COLORS.primary,
    },
    priceChipTxt:       { fontSize: 11, fontWeight: "700", color: "#64748B" },
    priceChipTxtActive: { color: "#fff" },

    resultCard: {
        borderRadius: 18, padding: 18,
        flexDirection: "row", alignItems: "center", gap: 16,
        marginBottom: 10,
    },
    resultLeft: { flex: 1 },
    resultLabel: { fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: "600", marginBottom: 4 },
    resultEMI:   { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 4 },
    resultNote:  { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "500" },

    resultRight: {
        flexDirection: "row", alignItems: "center", gap: 12,
    },
    infoItem: { alignItems: "center" },
    infoVal:  { fontSize: 13, fontWeight: "800", color: "#fff", letterSpacing: -0.2 },
    infoLbl:  { fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: "500", marginTop: 2 },
    divider:  { width: 1, height: 28, backgroundColor: "rgba(255,255,255,0.25)" },

    disclaimer: { fontSize: 10, color: "#94A3B8", fontWeight: "500", textAlign: "center" },
});

export default LoanCalculatorTeaser;
