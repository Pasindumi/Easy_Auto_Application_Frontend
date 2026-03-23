import { COMPARISONS } from "@/constants/dummydata/homedummydata";
import { Image } from "expo-image";
import React from "react";
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
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const CARD_W = width - 48;

interface CarComparisonProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const CarComparison: React.FC<CarComparisonProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/compare" as any);
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="Compare Cars"
                subtitle="Head-to-head spec comparison"
                onViewAll={() => router.push("/compare" as any)}
            />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                decelerationRate="fast"
                snapToInterval={CARD_W + 14}
            >
                {COMPARISONS.map((cmp, i) => (
                    <TouchableOpacity key={i} style={styles.card} activeOpacity={0.9} onPress={handlePress}>
                        <LinearGradient
                            colors={["#F8FAFF", "#EEF3FF"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={StyleSheet.absoluteFillObject}
                        />
                        {/* Car 1 */}
                        <View style={styles.carSide}>
                            <View style={styles.imgWrap}>
                                <Image source={{ uri: cmp.car1.image }} style={styles.carImg} contentFit="cover" transition={300} />
                            </View>
                            <Text style={styles.carName} numberOfLines={1}>{cmp.car1.name}</Text>
                            <Text style={styles.carModel}>{cmp.car1.model}</Text>
                        </View>

                        {/* VS */}
                        <View style={styles.vsWrap}>
                            <View style={styles.vsBadge}>
                                <Text style={styles.vsText}>VS</Text>
                            </View>
                            <View style={styles.vsStemTop} />
                            <View style={styles.vsStemBot} />
                        </View>

                        {/* Car 2 */}
                        <View style={styles.carSide}>
                            <View style={styles.imgWrap}>
                                <Image source={{ uri: cmp.car2.image }} style={styles.carImg} contentFit="cover" transition={300} />
                            </View>
                            <Text style={styles.carName} numberOfLines={1}>{cmp.car2.name}</Text>
                            <Text style={styles.carModel}>{cmp.car2.model}</Text>
                        </View>

                        {/* CTA bar */}
                        <View style={styles.ctaBar}>
                            <LinearGradient
                                colors={[COLORS.primary, "#1E40AF"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.ctaGrad}
                            >
                                <Ionicons name="git-compare" size={16} color="#FFF" />
                                <Text style={styles.ctaBarText}>Compare Specifications Now</Text>
                                <Ionicons name="chevron-forward" size={16} color="#FFF" />
                            </LinearGradient>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF" },
    scroll: { paddingHorizontal: 20, gap: 14 },
    card: {
        width: CARD_W,
        borderRadius: 24,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
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
    carModel: { fontSize: 11, color: COLORS.primary, fontWeight: "600", textAlign: "center" },
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
    vsStemTop: { width: 1, height: 20, backgroundColor: "#DDE8FF", position: "absolute", top: -22 },
    vsStemBot: { width: 1, height: 20, backgroundColor: "#DDE8FF", position: "absolute", bottom: -22 },
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
