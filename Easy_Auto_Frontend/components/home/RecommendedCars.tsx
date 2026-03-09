import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
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
const CARD_W = width - 40;

interface RecommendedCarsProps {
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

const RecommendedCars: React.FC<RecommendedCarsProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAds(); }, []);

    const fetchAds = async () => {
        setLoading(true);
        try {
            const res: any = await api.get("/api/cars/recommended");
            if (res.success) setAds(res.data || []);
        } catch (e) {
            console.error("Recommended fetch error:", e);
        } finally {
            setLoading(false);
        }
    };

    if (!loading && ads.length === 0) return null;

    const renderItem = ({ item: car }: { item: any }) => {
        const imageUrl = car.AdImage?.[0]?.image_url;
        const brand = car.CarDetails?.brand || "";
        const model = car.CarDetails?.model || "";
        const title = car.title || `${brand} ${model}`;
        const year = car.CarDetails?.manufacture_year || "";
        const mileage = car.CarDetails?.mileage
            ? `${(Number(car.CarDetails.mileage) / 1000).toFixed(0)}k km`
            : "N/A";
        const fuel = car.CarDetails?.fuel_type || "N/A";
        const transmission = car.CarDetails?.transmission || "N/A";

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.92}
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push(`/cars/${car.id}` as any);
                }}
            >
                <View style={styles.imageWrap}>
                    <Image
                        source={imageUrl ? { uri: imageUrl } : require("@/assets/images/car.jpg")}
                        style={styles.image}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={["transparent", "rgba(2,14,39,0.35)", "rgba(2,14,39,0.85)"]}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceLabel}>From</Text>
                        <Text style={styles.priceMain}>{formatPrice(car.price)}</Text>
                    </View>
                    <View style={styles.carBadge}>
                        <Ionicons name="sparkles" size={12} color="#F59E0B" />
                        <Text style={styles.badgeText}>Top Choice</Text>
                    </View>
                </View>

                <View style={styles.cardInfo}>
                    <View style={styles.mainRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                            <Text style={styles.cardSub}>{brand} · {year} Model</Text>
                        </View>
                        <View style={styles.arrowBox}>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </View>
                    </View>

                    <View style={styles.gridStats}>
                        <View style={styles.statBox}>
                            <Ionicons name="speedometer-outline" size={14} color={COLORS.primary} />
                            <Text style={styles.statVal}>{mileage}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Ionicons name="settings-outline" size={14} color={COLORS.primary} />
                            <Text style={styles.statVal}>{transmission.charAt(0)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Ionicons name="flask-outline" size={14} color={COLORS.primary} />
                            <Text style={styles.statVal}>{fuel.substring(0, 3)}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statBox}>
                            <Ionicons name="location-outline" size={14} color={COLORS.primary} />
                            <Text style={styles.statVal} numberOfLines={1}>{car.location?.split(',')[0] || 'SL'}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="✨ Recommended For You"
                subtitle="Curated based on your interests"
                onViewAll={fetchAds}
                viewAllLabel="Refresh"
            />
            {loading ? (
                <View style={styles.loader}><ActivityIndicator color={COLORS.primary} /></View>
            ) : (
                <FlatList
                    data={ads}
                    renderItem={renderItem}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_W + 16}
                    decelerationRate="fast"
                    contentContainerStyle={styles.list}
                    keyExtractor={(item) => item.id}
                />
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF", paddingBottom: 8 },
    loader: { height: 300, justifyContent: "center", alignItems: "center" },
    list: { paddingHorizontal: 20, gap: 16, paddingBottom: 4 },
    card: {
        width: CARD_W,
        backgroundColor: "#fff",
        borderRadius: 28,
        overflow: "hidden",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: "#E8EEFF",
    },
    imageWrap: { height: 210, position: "relative" },
    image: { width: "100%", height: "100%" },
    priceContainer: {
        position: "absolute",
        bottom: 16,
        left: 16,
    },
    priceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: "600", marginBottom: -2 },
    priceMain: { color: "#fff", fontSize: 24, fontWeight: "800" },
    carBadge: {
        position: "absolute",
        top: 14,
        left: 14,
        backgroundColor: "rgba(2,14,39,0.55)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
    cardInfo: { padding: 18 },
    mainRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
    cardTitle: { fontSize: 18, fontWeight: "800", color: "#0F172A", letterSpacing: -0.4 },
    cardSub: { fontSize: 13, color: "#64748B", fontWeight: "500", marginTop: 2 },
    arrowBox: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    gridStats: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F8FAFF",
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: "#F0F4FF",
    },
    statBox: { flex: 1, alignItems: "center", gap: 3 },
    statDivider: { width: 1, height: 20, backgroundColor: "#E2E8F0" },
    statVal: { fontSize: 11, fontWeight: "700", color: "#1E293B", textAlign: "center" },
});

export default RecommendedCars;
