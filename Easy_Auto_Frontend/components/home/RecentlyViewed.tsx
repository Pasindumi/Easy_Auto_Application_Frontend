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
    ActivityIndicator,
} from "react-native";
import Loading from "../ui/Loading";
import { useRouter } from "expo-router";
import { api } from "@/utils/api";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.58;

interface RecentlyViewedProps {
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

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res: any = await api.get("/api/cars?status=ACTIVE&limit=10&sort=created_at&order=desc");
                if (res.success) setAds(res.data || []);
            } catch { }
            finally { setLoading(false); }
        })();
    }, []);

    if (!loading && ads.length === 0) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="New Arrivals"
                subtitle="Just added to the marketplace"
                onViewAll={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/cars/buy-car" as any); }}
            />
            {loading ? (
                <View style={styles.loader}>
                    <Loading size="small" />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scroll}
                    decelerationRate="fast"
                    snapToInterval={CARD_W + 12}
                >
                    {ads.map((car) => {
                        const imgUrl = car.AdImage?.[0]?.image_url;
                        const title = car.title || `${car.CarDetails?.brand || ""} ${car.CarDetails?.model || ""}`;
                        return (
                            <TouchableOpacity
                                key={car.id}
                                style={styles.card}
                                activeOpacity={0.9}
                                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push(`/cars/${car.id}` as any); }}
                            >
                                <View style={styles.imgWrap}>
                                    <Image
                                        source={imgUrl ? { uri: imgUrl } : require("@/assets/images/car.jpg")}
                                        style={styles.img}
                                        contentFit="cover"
                                        transition={300}
                                    />
                                    <LinearGradient colors={["transparent", "rgba(2,14,39,0.55)"]} style={StyleSheet.absoluteFillObject} />
                                    <View style={styles.newBadge}>
                                        <Text style={styles.newBadgeText}>NEW</Text>
                                    </View>
                                    <TouchableOpacity style={styles.wishBtn}>
                                        <Ionicons name="heart-outline" size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.body}>
                                    <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
                                    <Text style={styles.price}>{formatPrice(car.price)}</Text>
                                    <View style={styles.metaRow}>
                                        <Ionicons name="location-outline" size={11} color="#94A3B8" />
                                        <Text style={styles.meta} numberOfLines={1}>
                                            {car.location?.split(",")[0] || "Sri Lanka"}
                                        </Text>
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
    container: { backgroundColor: "#F8FAFF" },
    loader: { height: 200, justifyContent: "center", alignItems: "center" },
    scroll: { paddingHorizontal: 20, gap: 12, paddingBottom: 4 },
    card: {
        width: CARD_W,
        backgroundColor: "#fff",
        borderRadius: 22,
        overflow: "hidden",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.09,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#E8EEFF",
    },
    imgWrap: { height: 130, position: "relative" },
    img: { width: "100%", height: "100%" },
    newBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#10B981",
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    newBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
    wishBtn: {
        position: "absolute",
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    body: { padding: 12 },
    cardTitle: { fontSize: 13, fontWeight: "700", color: "#0F172A", marginBottom: 4 },
    price: { fontSize: 16, fontWeight: "800", color: COLORS.primary, marginBottom: 6, letterSpacing: -0.3 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    meta: { fontSize: 11, color: "#94A3B8", fontWeight: "500", flex: 1 },
});

export default RecentlyViewed;
