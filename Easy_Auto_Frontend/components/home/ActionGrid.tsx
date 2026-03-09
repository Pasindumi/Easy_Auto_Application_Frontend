import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CELL_W = (width - 40 - 12) / 3;

interface ActionGridProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    compareCount: number;
    newListingsCount: number;
}

const ACTIONS = [
    { id: "buy",      label: "Buy",      sub: "Browse cars",    icon: "car-sport"    as const, color: "#235CF8", bg: "#EEF2FF", route: "/cars/buy-car" },
    { id: "sell",     label: "Sell",     sub: "Post free ad",   icon: "cash"         as const, color: "#10B981", bg: "#ECFDF5", route: "/cars/select-type" },
    { id: "rent",     label: "Rent",     sub: "Short hire",     icon: "key"          as const, color: "#F59E0B", bg: "#FFFBEB", route: "/cars/rent-car" },
    { id: "compare",  label: "Compare",  sub: "Side by side",   icon: "git-compare"  as const, color: "#7C3AED", bg: "#F5F3FF", route: "/(tabs)/compare" },
    { id: "dealers",  label: "Dealers",  sub: "Find nearby",    icon: "storefront"   as const, color: "#EF4444", bg: "#FEF2F2", route: "/find-dealers" },
    { id: "packages", label: "Boost",    sub: "Promote ad",     icon: "rocket"       as const, color: "#0891B2", bg: "#ECFEFF", route: "/packages/packages" },
];

const ActionGrid: React.FC<ActionGridProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();

    return (
        <Animated.View style={[styles.wrap, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Section header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Explore EasyAuto</Text>
                    <Text style={styles.sub}>Everything you need in one place</Text>
                </View>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
                {ACTIONS.map((a) => (
                    <TouchableOpacity
                        key={a.id}
                        style={styles.cell}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push(a.route as any);
                        }}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: a.bg }]}>
                            <Ionicons name={a.icon} size={22} color={a.color} />
                        </View>
                        <Text style={styles.cellLabel}>{a.label}</Text>
                        <Text style={styles.cellSub}>{a.sub}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#fff",
        paddingVertical: 20,
        marginHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    header: {
        paddingHorizontal: 20,
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
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 14,
        gap: 8,
    },
    cell: {
        width: CELL_W,
        backgroundColor: "#F8FAFF",
        borderRadius: 16,
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    cellLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 2,
    },
    cellSub: {
        fontSize: 10,
        color: "#94A3B8",
        fontWeight: "500",
        textAlign: "center",
    },
});

export default ActionGrid;
