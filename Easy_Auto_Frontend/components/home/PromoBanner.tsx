import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "@/utils/api";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CARD_W = width - 40;

const STATIC_BANNERS = [
    {
        id: "s1",
        title: "Experience Luxury on Every Drive",
        subtitle: "Premium collection of certified vehicles.",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&h=600&fit=crop",
        label: "LATEST ARRIVALS",
        color: "#235CF8"
    },
    {
        id: "s2",
        title: "Sell Your Car with Full Confidence",
        subtitle: "The fastest way to reach verified buyers.",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1000&h=600&fit=crop",
        label: "SELL FASTER",
        color: "#10B981"
    },
    {
        id: "s3",
        title: "Exclusive Deals for Active Buyers",
        subtitle: "Unlock special offers on your favorite brands.",
        image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1000&h=600&fit=crop",
        label: "PROMOTION",
        color: "#F59E0B"
    },
];

interface PromoBannerProps {
    fadeAnim: Animated.Value;
    scaleAnim: Animated.Value;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ fadeAnim, scaleAnim }) => {
    const router = useRouter();
    const [banners, setBanners] = useState<any[]>([]);
    const [idx, setIdx] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => { fetchBanners(); }, []);

    const fetchBanners = async () => {
        try {
            const [adsRes, discRes] = await Promise.all([
                api.get<any>("/api/cars?isHomepageBanner=true&limit=5"),
                api.get<any>("/api/discounts/active"),
            ]);
            let all: any[] = [];
            if (adsRes.success && adsRes.data?.length)
                all.push(...adsRes.data.map((d: any) => ({
                    id: `ad-${d.id}`, title: d.title,
                    subtitle: `Price starting from LKR ${Number(d.price).toLocaleString()}`,
                    image: d.AdImage?.[0]?.image_url || STATIC_BANNERS[0].image,
                    isAd: true, adId: d.id,
                    label: "FEATURED", color: "#235CF8"
                })));
            if (discRes.data?.length)
                all.push(...discRes.data.map((d: any) => ({
                    id: `disc-${d.id}`, title: d.name,
                    subtitle: d.discount_type === "PERCENTAGE" ? `${d.value}% EXTRA SAVINGS` : `SAVE LKR ${d.value} TODAY`,
                    image: d.offer_image_url || STATIC_BANNERS[2].image,
                    isDiscount: true,
                    label: "SPECIAL OFFER", color: "#F59E0B"
                })));
            
            if (all.length < 3) all = [...all, ...STATIC_BANNERS];
            setBanners(all.length ? all : STATIC_BANNERS);
        } catch {
            setBanners(STATIC_BANNERS);
        }
    };

    useEffect(() => {
        if (banners.length <= 1) return;
        timerRef.current = setInterval(() => {
            setIdx((prev) => {
                const next = (prev + 1) % banners.length;
                scrollRef.current?.scrollTo({ x: next * CARD_W, animated: true });
                return next;
            });
        }, 5000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [banners.length]);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const i = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
        if (i !== idx && i >= 0 && i < banners.length) setIdx(i);
    };

    return (
        <Animated.View style={[styles.wrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_W}
            >
                {banners.map((b, i) => (
                    <TouchableOpacity
                        key={`${b.id}-${i}`}
                        style={styles.card}
                        activeOpacity={0.97}
                        onPress={() => {
                            if (b.isAd && b.adId) router.push(`/cars/${b.adId}` as any);
                            else router.push("/(tabs)/search");
                        }}
                    >
                        <Image source={b.image} style={styles.img} contentFit="cover" transition={800} />
                        <LinearGradient
                            colors={["rgba(12,36,97,0.1)", "rgba(12,36,97,0.4)", "rgba(12,36,97,0.9)"]}
                            style={StyleSheet.absoluteFillObject}
                        />
                        <View style={styles.content}>
                            <View style={[styles.labelBadge, { backgroundColor: b.color }]}>
                                <Text style={styles.labelText}>{b.label}</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>{b.title}</Text>
                            <Text style={styles.subtitle} numberOfLines={1}>{b.subtitle}</Text>
                            
                            <View style={styles.ctaRow}>
                                <View style={styles.primaryCta}>
                                    <Text style={styles.primaryCtaText}>{b.isAd ? "Check Details" : "Learn More"}</Text>
                                    <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.dots}>
                {banners.map((_, i) => (
                    <View
                        key={i}
                        style={[styles.dot, i === idx ? styles.dotActive : styles.dotInactive]}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: "#F8FAFF",
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    card: {
        width: CARD_W,
        height: 240, // Slightly taller for more presence
        borderRadius: 24,
        overflow: "hidden",
        backgroundColor: COLORS.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    img: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
    },
    labelBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 10,
    },
    labelText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: -0.6,
        lineHeight: 28,
        marginBottom: 6,
        textShadowColor: "rgba(0,0,0,0.2)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "rgba(255,255,255,0.85)",
        fontWeight: "500",
        marginBottom: 16,
    },
    ctaRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    primaryCta: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    primaryCtaText: {
        color: COLORS.primary,
        fontSize: 13,
        fontWeight: "800",
    },
    dots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        marginTop: 14,
    },
    dot: {
        height: 4,
        borderRadius: 2,
    },
    dotActive: {
        width: 20,
        backgroundColor: COLORS.primary,
    },
    dotInactive: {
        width: 8,
        backgroundColor: "#E2E8F0",
    },
});

export default PromoBanner;
