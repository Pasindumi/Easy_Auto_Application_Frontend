import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SectionHeader from "./SectionHeader";
import { getComparisonHistory } from "@/utils/comparisonHistory";
import { SimilarComparison } from "@/types/compare-detail.types";

const { width } = Dimensions.get("window");
const CARD_W = width - 40;

interface CarComparisonProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const CarComparison: React.FC<CarComparisonProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const [latest, setLatest] = useState<SimilarComparison | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadLatest();
        }, [])
    );

    const loadLatest = async () => {
        try {
            const history = await getComparisonHistory();
            if (history && history.length > 0) {
                setLatest(history[0]); // Take the newest one
            }
        } catch (error) {
            console.error("Home comparison load error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (latest) {
            // Navigate to detail with these IDs
            router.push({
                pathname: "/cars/compare-cars-detail",
                params: { id1: latest.id1, id2: latest.id2 }
            } as any);
        } else {
            router.push("/compare" as any);
        }
    };

    const renderPlaceholder = () => (
        <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={handlePress}>
            <LinearGradient
                colors={["#F8FAFF", "#F1F5F9"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.placeholderRow}>
                <View style={styles.plusBox}>
                    <Ionicons name="add" size={32} color="#94A3B8" />
                </View>
                <View style={styles.vsCircleMin}>
                    <Text style={styles.vsTextMin}>VS</Text>
                </View>
                <View style={styles.plusBox}>
                    <Ionicons name="add" size={32} color="#94A3B8" />
                </View>
            </View>
            <Text style={styles.placeholderLabel}>Start New Comparison</Text>
            <View style={styles.ctaBar}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaGrad}
                >
                    <Ionicons name="git-compare" size={16} color="#FFF" />
                    <Text style={styles.ctaBarText}>Pick Two Cars to Compare</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    const renderComparison = (cmp: SimilarComparison) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={handlePress}>
            <LinearGradient
                colors={["#F8FAFF", "#EEF3FF"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.comparisonRow}>
                {/* Car 1 */}
                <View style={styles.carSide}>
                    <View style={styles.imgWrap}>
                        <Image source={{ uri: cmp.leftImage }} style={styles.carImg} contentFit="cover" transition={300} />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{cmp.leftName}</Text>
                </View>

                {/* VS */}
                <View style={styles.vsWrap}>
                    <View style={styles.vsBadge}>
                        <Text style={styles.vsText}>VS</Text>
                    </View>
                </View>

                {/* Car 2 */}
                <View style={styles.carSide}>
                    <View style={styles.imgWrap}>
                        <Image source={{ uri: cmp.rightImage }} style={styles.carImg} contentFit="cover" transition={300} />
                    </View>
                    <Text style={styles.carName} numberOfLines={1}>{cmp.rightName}</Text>
                </View>
            </View>

            {/* CTA bar */}
            <View style={styles.ctaBar}>
                <LinearGradient
                    colors={[COLORS.primary, "#1E40AF"]}
                    style={styles.ctaGrad}
                >
                    <Ionicons name="eye-outline" size={16} color="#FFF" />
                    <Text style={styles.ctaBarText}>Re-analyze Comparison</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="Latest Comparison"
                subtitle={latest ? "Continue where you left off" : "Smart head-to-head analysis"}
                onViewAll={() => router.push("/compare" as any)}
            />
            <View style={styles.mainPadding}>
                {latest ? renderComparison(latest) : renderPlaceholder()}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF" },
    mainPadding: { paddingHorizontal: 20, paddingBottom: 20 },
    card: {
        width: CARD_W,
        borderRadius: 24,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#DDE8FF",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 14,
        elevation: 6,
        position: "relative",
    },
    comparisonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    placeholderRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        marginVertical: 10,
        width: "100%",
    },
    plusBox: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        borderWidth: 2,
        borderColor: "#E2E8F0",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
    },
    vsCircleMin: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#94A3B8",
        alignItems: "center",
        justifyContent: "center",
    },
    vsTextMin: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "900",
    },
    placeholderLabel: {
        fontSize: 15,
        fontWeight: "700",
        color: "#64748B",
        marginTop: 12,
        textAlign: "center",
        width: "100%",
    },
    carSide: {
        flex: 1,
        alignItems: "center",
        maxWidth: "42%",
    },
    imgWrap: {
        width: "100%",
        aspectRatio: 1.6,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: "#E8EEFF",
        marginBottom: 10,
    },
    carImg: { width: "100%", height: "100%" },
    carName: { fontSize: 13, fontWeight: "700", color: "#0F172A", textAlign: "center", marginBottom: 3 },
    vsWrap: { width: 40, alignItems: "center", zIndex: 1 },
    vsBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 2,
        borderColor: "#fff",
    },
    vsText: { color: "#fff", fontWeight: "900", fontSize: 11, fontStyle: "italic" },
    ctaBar: {
        width: "100%",
        marginTop: 18,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaGrad: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    ctaBarText: { fontSize: 13, fontWeight: "800", color: "#FFF", letterSpacing: 0.2 },
});

export default CarComparison;
