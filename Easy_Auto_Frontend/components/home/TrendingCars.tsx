import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.72;

interface TrendingCarsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const formatPrice = (p: any) =>
    new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: "LKR",
        maximumFractionDigits: 0,
        notation: "compact",
        compactDisplay: "short",
    }).format(Number(p) || 0);

const TrendingCars: React.FC<TrendingCarsProps> = ({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrending();
    }, []);

    const fetchTrending = async () => {
        try {
            setLoading(true);
            const res: any = await api.get("/api/cars/trending");
            if (res.success && Array.isArray(res.data)) setAds(res.data);
        } catch (e) {
            console.error("Trending fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    if (!loading && ads.length === 0) return null;

    return (
        <Animated.View
            style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
            <SectionHeader
                title="🔥 Trending Now"
                subtitle="Most viewed listings this week"
                onViewAll={() => router.push("/(tabs)/search" as any)}
            />

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    decelerationRate="fast"
                    snapToInterval={CARD_W + 16}
                >
                    {ads.map((ad, i) => {
                        const imageUrl = ad.AdImage?.[0]?.image_url;
                        const year = ad.CarDetails?.manufacture_year || ad.CarDetails?.year || "";
                        const mileage = ad.CarDetails?.mileage
                            ? `${(Number(ad.CarDetails.mileage) / 1000).toFixed(0)}k km`
                            : null;
                        const fuel = ad.CarDetails?.fuel_type || null;

                        return (
                            <TouchableOpacity
                                key={`trending-${ad.id}-${i}`}
                                style={styles.card}
                                activeOpacity={0.9}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push(`/cars/${ad.id}` as any);
                                }}
                            >
                                <View style={styles.imageWrap}>
                                    <Image
                                        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/car.jpg")}
                                        style={styles.image}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <LinearGradient
                                        colors={["transparent", "rgba(2,14,39,0.5)"]}
                                        style={StyleSheet.absoluteFillObject}
                                    />
                                    <View style={styles.priceBadge}>
                                        <Text style={styles.priceText}>{formatPrice(ad.price)}</Text>
                                    </View>
                                    <TouchableOpacity style={styles.heartBtn}>
                                        <Ionicons name="heart-outline" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.content}>
                                    <Text style={styles.title} numberOfLines={1}>
                                        {ad.title || `${ad.CarDetails?.brand} ${ad.CarDetails?.model}`}
                                    </Text>

                                    <View style={styles.specsRow}>
                                        {year ? (
                                            <View style={styles.specTag}>
                                                <Ionicons name="calendar-outline" size={11} color="#64748B" />
                                                <Text style={styles.specText}>{year}</Text>
                                            </View>
                                        ) : null}
                                        {mileage ? (
                                            <View style={styles.specTag}>
                                                <Ionicons name="speedometer-outline" size={11} color="#64748B" />
                                                <Text style={styles.specText}>{mileage}</Text>
                                            </View>
                                        ) : null}
                                        {fuel ? (
                                            <View style={styles.specTag}>
                                                <Ionicons name="flask-outline" size={11} color="#64748B" />
                                                <Text style={styles.specText}>{fuel}</Text>
                                            </View>
                                        ) : null}
                                    </View>

                                    <View style={styles.footer}>
                                        <View style={styles.locRow}>
                                            <Ionicons name="location-outline" size={12} color="#94A3B8" />
                                            <Text style={styles.locText} numberOfLines={1}>
                                                {ad.location?.split(",")[0] || "Sri Lanka"}
                                            </Text>
                                        </View>
                                        <View style={styles.ratingBox}>
                                            <Ionicons name="star" size={11} color="#F59E0B" />
                                            <Text style={styles.ratingText}>4.5</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF", paddingBottom: 4 },
    loader: { height: 260, justifyContent: "center", alignItems: "center" },
    scrollContent: { paddingHorizontal: 20, gap: 16, paddingBottom: 4 },
    card: {
        width: CARD_W,
        backgroundColor: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 1,
        borderColor: "#E8EEFF",
    },
    imageWrap: { height: 160, width: "100%", position: "relative" },
    image: { width: "100%", height: "100%" },
    priceBadge: {
        position: "absolute",
        bottom: 12,
        left: 12,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    priceText: { color: "#fff", fontSize: 13, fontWeight: "800" },
    heartBtn: {
        position: "absolute",
        top: 10,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    content: { padding: 14 },
    title: { fontSize: 15, fontWeight: "700", color: "#0F172A", marginBottom: 10 },
    specsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
    specTag: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#F1F5F9",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    specText: { fontSize: 11, color: "#64748B", fontWeight: "600" },
    footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    locRow: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
    locText: { fontSize: 12, color: "#94A3B8", fontWeight: "500", flex: 1 },
    ratingBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "#FFFBEB",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    ratingText: { fontSize: 11, fontWeight: "700", color: "#92400E" },
});

export default TrendingCars;
