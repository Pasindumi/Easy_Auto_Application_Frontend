import { Image } from "expo-image";
import React, { useEffect, useState, useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

    useFocusEffect(
        React.useCallback(() => {
            loadLatest();
        }, [])
    );

    const loadLatest = async () => {
        try {
            const history = await getComparisonHistory();
            if (history && history.length > 0) {
                setLatest(history[0]);
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
            router.push({
                pathname: "/cars/compare-cars-detail",
                params: { id1: latest.id1, id2: latest.id2 }
            } as any);
        } else {
            router.push("/compare" as any);
        }
    };

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    const renderPlaceholder = () => (
        <TouchableOpacity style={themeStyles.card} activeOpacity={0.8} onPress={handlePress}>
            <LinearGradient
                colors={isDarkMode ? [colors.backgroundSecondary, colors.backgroundSecondary] : ["#F8FAFF", "#F1F5F9"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={themeStyles.placeholderRow}>
                <View style={themeStyles.plusBox}>
                    <Ionicons name="add" size={32} color={isDarkMode ? colors.text.muted : "#94A3B8"} />
                </View>
                <View style={themeStyles.vsCircleMin}>
                    <Text style={themeStyles.vsTextMin}>VS</Text>
                </View>
                <View style={themeStyles.plusBox}>
                    <Ionicons name="add" size={32} color={isDarkMode ? colors.text.muted : "#94A3B8"} />
                </View>
            </View>
            <Text style={themeStyles.placeholderLabel}>Start New Comparison</Text>
            <View style={themeStyles.ctaBar}>
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={themeStyles.ctaGrad}
                >
                    <Ionicons name="git-compare" size={16} color="#FFF" />
                    <Text style={themeStyles.ctaBarText}>Pick Two Cars to Compare</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    const renderComparison = (cmp: SimilarComparison) => (
        <TouchableOpacity style={themeStyles.card} activeOpacity={0.9} onPress={handlePress}>
            <LinearGradient
                colors={isDarkMode ? [colors.backgroundSecondary, colors.backgroundSecondary] : ["#F8FAFF", "#EEF3FF"]}
                style={StyleSheet.absoluteFillObject}
            />
            <View style={themeStyles.comparisonRow}>
                {/* Car 1 */}
                <View style={themeStyles.carSide}>
                    <View style={themeStyles.imgWrap}>
                        <Image source={{ uri: cmp.leftImage }} style={themeStyles.carImg} contentFit="cover" transition={300} />
                    </View>
                    <Text style={themeStyles.carName} numberOfLines={1}>{cmp.leftName}</Text>
                </View>

                {/* VS */}
                <View style={themeStyles.vsWrap}>
                    <View style={themeStyles.vsBadge}>
                        <Text style={themeStyles.vsText}>VS</Text>
                    </View>
                </View>

                {/* Car 2 */}
                <View style={themeStyles.carSide}>
                    <View style={themeStyles.imgWrap}>
                        <Image source={{ uri: cmp.rightImage }} style={themeStyles.carImg} contentFit="cover" transition={300} />
                    </View>
                    <Text style={themeStyles.carName} numberOfLines={1}>{cmp.rightName}</Text>
                </View>
            </View>

            {/* CTA bar */}
            <View style={themeStyles.ctaBar}>
                <LinearGradient
                    colors={[colors.primary, colors.primaryDark]}
                    style={themeStyles.ctaGrad}
                >
                    <Ionicons name="eye-outline" size={16} color="#FFF" />
                    <Text style={themeStyles.ctaBarText}>Re-analyze Comparison</Text>
                </LinearGradient>
            </View>
        </TouchableOpacity>
    );

    return (
        <Animated.View style={[themeStyles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="Latest Comparison"
                subtitle={latest ? "Continue where you left off" : "Smart head-to-head analysis"}
                onViewAll={() => router.push("/compare" as any)}
            />
            <View style={themeStyles.mainPadding}>
                {latest ? renderComparison(latest) : renderPlaceholder()}
            </View>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {},
    mainPadding: { paddingHorizontal: 20 },
    card: {
        width: CARD_W,
        borderRadius: 5,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#DBEAFE",
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
        borderRadius: 5,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#F1F5F9",
        borderWidth: 2,
        borderColor: isDarkMode ? colors.border : "#E2E8F0",
        borderStyle: "dashed",
        alignItems: "center",
        justifyContent: "center",
    },
    vsCircleMin: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
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
        color: colors.text.muted,
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
        borderRadius: 5,
        overflow: "hidden",
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E8EEFF",
        marginBottom: 10,
    },
    carImg: { width: "100%", height: "100%" },
    carName: { fontSize: 13, fontWeight: "700", color: colors.text.primary, textAlign: "center", marginBottom: 3 },
    vsWrap: { width: 40, alignItems: "center", zIndex: 1 },
    vsBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: colors.white,
    },
    vsText: { color: "#fff", fontWeight: "900", fontSize: 11, fontStyle: "italic" },
    ctaBar: {
        width: "100%",
        marginTop: 18,
        borderRadius: 5,
        overflow: 'hidden',
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
