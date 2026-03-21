import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    FlatList,
    Platform,
    StatusBar as RNStatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const ONBOARDING_SEEN_KEY = "@easyauto_onboarding_seen";

// ── Slide Data ────────────────────────────────────────────────────────────────
const SLIDES = [
    {
        id: "1",
        image: require("../assets/images/onboardingScreem.jpg"),
        accentColor:  "#235CF8",
        gradient1:    "#235CF8",
        gradient2:    "#0D3AAD",
        tag:          "10,000+ LISTINGS",
        title:        "Find Your\nDream Car",
        desc:         "Browse verified listings from trusted dealers and private sellers across Sri Lanka.",
        features: [
            { icon: "checkmark-circle" as const, text: "Verified sellers only" },
            { icon: "pricetag"          as const, text: "Price match guarantee" },
            { icon: "document-text"     as const, text: "Full vehicle history" },
        ],
    },
    {
        id: "2",
        image: require("../assets/images/onboardingScreen2.jpg"),
        accentColor:  "#059669",
        gradient1:    "#047857",
        gradient2:    "#064E3B",
        tag:          "FREE TO LIST",
        title:        "Sell Fast,\nSell Smart",
        desc:         "Post your car for free and reach 50,000+ active buyers. Get the best price in days.",
        features: [
            { icon: "flash"            as const, text: "List in under 5 minutes" },
            { icon: "people"           as const, text: "50,000+ active buyers" },
            { icon: "storefront"       as const, text: "500+ dealers competing" },
        ],
    },
    {
        id: "3",
        image: require("../assets/images/onboardingScreen3.jpg"),
        accentColor:  "#7C3AED",
        gradient1:    "#6D28D9",
        gradient2:    "#3B0764",
        tag:          "TRUSTED PLATFORM",
        title:        "Safe &\nSecure Deals",
        desc:         "Every listing is verified. Chat securely, calculate EMI, and buy with full confidence.",
        features: [
            { icon: "shield-checkmark"  as const, text: "KYC verified dealers" },
            { icon: "calculator"        as const, text: "Built-in EMI calculator" },
            { icon: "headset"           as const, text: "24/7 customer support" },
        ],
    },
];

// ────────────────────────────────────────────────────────────────────
// SPLASH SCREEN
// ────────────────────────────────────────────────────────────────────
function SplashScreen({ onDone }: { onDone: () => void }) {
    const scale      = useRef(new Animated.Value(0.5)).current;
    const logoOpacity= useRef(new Animated.Value(0)).current;
    const nameSlide  = useRef(new Animated.Value(30)).current;
    const nameOpacity= useRef(new Animated.Value(0)).current;
    const tagOpacity = useRef(new Animated.Value(0)).current;
    const statsOpacity=useRef(new Animated.Value(0)).current;
    const barProg    = useRef(new Animated.Value(0)).current;
    const imgScale   = useRef(new Animated.Value(1.08)).current;

    useEffect(() => {
        Animated.sequence([
            // 1. Background image zooms in
            Animated.timing(imgScale, { toValue: 1, duration: 800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
            // 2. Logo card pops
            Animated.parallel([
                Animated.spring(scale,       { toValue: 1, friction: 6, tension: 70, useNativeDriver: true }),
                Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
            ]),
            // 3. App name slides up
            Animated.parallel([
                Animated.timing(nameSlide,   { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
                Animated.timing(nameOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
            // 4. Tagline
            Animated.timing(tagOpacity,   { toValue: 1, duration: 350, useNativeDriver: true }),
            // 5. Stats row
            Animated.timing(statsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            // 6. Progress bar fills → done
            Animated.timing(barProg, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.quad), useNativeDriver: false }),
        ]).start(() => onDone());
    }, []);

    const STATS = [
        { icon: "car-sport"      as const, value: "10k+",  label: "Cars"    },
        { icon: "people"         as const, value: "50k+",  label: "Buyers"  },
        { icon: "star"           as const, value: "4.8★",  label: "Rating"  },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            {/* ── Full-screen cinematic background ── */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: imgScale }] }]}>
                <Image
                    source={require("../assets/images/onboardingScreen1.jpg")}
                    style={StyleSheet.absoluteFillObject}
                    contentFit="cover"
                />
            </Animated.View>

            {/* ── Multi-layer gradient overlay ── */}
            {/* Top dark band */}
            <LinearGradient
                colors={["rgba(0,0,0,0.72)", "rgba(0,0,0,0.10)", "transparent"]}
                style={sp.topOverlay}
                pointerEvents="none"
            />
            {/* Bottom cinematic gradient */}
            <LinearGradient
                colors={["transparent", "rgba(5,10,30,0.70)", "rgba(5,8,26,0.92)", "#050A1A"]}
                style={sp.bottomOverlay}
                pointerEvents="none"
            />

            {/* ── Center logo area ── */}
            <View style={sp.center}>
                {/* Logo card */}
                <Animated.View style={[sp.logoCard, { opacity: logoOpacity, transform: [{ scale }] }]}>
                    <Image
                        source={require("../assets/applogonew.png")}
                        style={sp.logo}
                        contentFit="contain"
                    />
                </Animated.View>
            </View>

            {/* ── Bottom content area ── */}
            <View style={sp.bottomContent}>
                {/* App name */}
                <Animated.Text style={[sp.appName, { opacity: nameOpacity, transform: [{ translateY: nameSlide }] }]}>
                    EasyAuto
                </Animated.Text>

                {/* Tagline */}
                <Animated.View style={[sp.tagRow, { opacity: tagOpacity }]}>
                    <View style={sp.tagLine} />
                    <Text style={sp.tagTxt}>Sri Lanka's #1 Car Marketplace</Text>
                    <View style={sp.tagLine} />
                </Animated.View>

                {/* Stats row */}
                <Animated.View style={[sp.statsRow, { opacity: statsOpacity }]}>
                    {STATS.map((s, i) => (
                        <View key={i} style={sp.statChip}>
                            <Ionicons name={s.icon} size={13} color="#235CF8" />
                            <Text style={sp.statVal}>{s.value}</Text>
                            <Text style={sp.statLbl}>{s.label}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Progress bar */}
                <View style={sp.progressTrack}>
                    <Animated.View style={[sp.progressFill, {
                        width: barProg.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }),
                    }]} />
                </View>
                <Text style={sp.loadingTxt}>Loading your experience...</Text>
            </View>

            {/* Footer */}
            <View style={sp.footer}>
                <Ionicons name="shield-checkmark" size={11} color="rgba(255,255,255,0.3)" />
                <Text style={sp.footerTxt}> Verified & Secure · v1.0.0</Text>
            </View>
        </View>
    );
}

const sp = StyleSheet.create({
    // Overlays
    topOverlay:    { position: "absolute", top: 0, left: 0, right: 0, height: 220, zIndex: 1 },
    bottomOverlay: { position: "absolute", bottom: 0, left: 0, right: 0, height: height * 0.55, zIndex: 1 },

    // Center logo
    center: {
        flex: 1, alignItems: "center", justifyContent: "center", zIndex: 2,
    },
    logoCard: {
        width: 110, height: 110, borderRadius: 30,
        backgroundColor: "rgba(255,255,255,0.10)",
        alignItems: "center", justifyContent: "center",
        borderWidth: 1.5, borderColor: "rgba(255,255,255,0.18)",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.55, shadowRadius: 40, elevation: 20,
    },
    logo: { width: 86, height: 86 },

    // Bottom content
    bottomContent: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28, paddingBottom: 60, zIndex: 2,
        alignItems: "center",
    },
    appName: {
        fontSize: 42, fontWeight: "800", color: "#fff",
        letterSpacing: -1.2, marginBottom: 8,
    },
    tagRow: {
        flexDirection: "row", alignItems: "center", gap: 10,
        marginBottom: 24,
    },
    tagLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.2)" },
    tagTxt:  { fontSize: 12, color: "rgba(255,255,255,0.60)", fontWeight: "600", letterSpacing: 0.5 },

    // Stats
    statsRow: {
        flexDirection: "row", gap: 10, marginBottom: 28,
    },
    statChip: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1, borderColor: "rgba(255,255,255,0.14)",
        borderRadius: 14,
        paddingVertical: 10, paddingHorizontal: 6,
        alignItems: "center", gap: 4,
    },
    statVal: { fontSize: 15, fontWeight: "800", color: "#fff", letterSpacing: -0.3 },
    statLbl: { fontSize: 10, fontWeight: "600", color: "rgba(255,255,255,0.55)" },

    // Progress
    progressTrack: {
        width: "70%", height: 2.5,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 2, overflow: "hidden", marginBottom: 10,
    },
    progressFill: { height: "100%", backgroundColor: "#235CF8", borderRadius: 2 },
    loadingTxt:   { fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: "500" },

    // Footer
    footer:    { position: "absolute", bottom: 16, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "center", zIndex: 3 },
    footerTxt: { fontSize: 11, color: "rgba(255,255,255,0.28)", fontWeight: "500" },
});

// ────────────────────────────────────────────────────────────────────
// SINGLE ONBOARDING SLIDE
// ────────────────────────────────────────────────────────────────────
function Slide({ item }: { item: typeof SLIDES[0] }) {
    const panelY = useRef(new Animated.Value(60)).current;
    const panelO = useRef(new Animated.Value(0)).current;
    const imgS   = useRef(new Animated.Value(1.08)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(panelY, { toValue: 0,    duration: 540, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(panelO, { toValue: 1,    duration: 480, useNativeDriver: true }),
            Animated.timing(imgS,   { toValue: 1,    duration: 800, easing: Easing.out(Easing.quad),  useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={sl.slide}>
            {/* ── Full-screen background image ── */}
            <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ scale: imgS }] }]}>
                <Image source={item.image} style={StyleSheet.absoluteFillObject} contentFit="cover" />
            </Animated.View>

            {/* ── Top gradient fade (dark header area) ── */}
            <LinearGradient
                colors={["rgba(0,0,0,0.55)", "transparent"]}
                style={sl.topGrad}
                pointerEvents="none"
            />

            {/* ── Bottom content panel ── */}
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.65)", item.gradient1, item.gradient2]}
                style={sl.bottomGrad}
                pointerEvents="none"
            />

            {/* ── Content (on top of gradient) ── */}
            <Animated.View
                style={[sl.contentPanel, { transform: [{ translateY: panelY }], opacity: panelO }]}
            >
                {/* Title */}
                <Text style={sl.title}>{item.title}</Text>

                {/* Description */}
                <Text style={sl.desc}>{item.desc}</Text>

                {/* Feature list */}
                <View style={sl.featureList}>
                    {item.features.map((f, i) => (
                        <View key={i} style={sl.featureRow}>
                            <View style={[sl.featureIcon, { backgroundColor: `${item.accentColor}30` }]}>
                                <Ionicons name={f.icon} size={15} color={item.accentColor} />
                            </View>
                            <Text style={sl.featureTxt}>{f.text}</Text>
                        </View>
                    ))}
                </View>
            </Animated.View>
        </View>
    );
}

const sl = StyleSheet.create({
    slide:       { width, height, position: "relative" },
    topGrad:     { position: "absolute", top: 0, left: 0, right: 0, height: 160, zIndex: 2 },
    bottomGrad:  { position: "absolute", bottom: 0, left: 0, right: 0, height: height * 0.62, zIndex: 2 },
    contentPanel: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28,
        paddingBottom: 160,   // space for bottom controls
        zIndex: 3,
    },

    tag: {
        flexDirection: "row", alignItems: "center", gap: 6,
        alignSelf: "flex-start",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
        marginBottom: 14,
    },
    tagDot: { width: 6, height: 6, borderRadius: 3 },
    tagTxt: { color: "#fff", fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },

    title: {
        fontSize: 42, fontWeight: "800", color: "#fff",
        letterSpacing: -1.2, lineHeight: 48, marginBottom: 14,
    },
    desc: {
        fontSize: 15, color: "rgba(255,255,255,0.78)",
        fontWeight: "500", lineHeight: 23, marginBottom: 22,
    },

    featureList: { gap: 10 },
    featureRow:  { flexDirection: "row", alignItems: "center", gap: 12 },
    featureIcon: {
        width: 32, height: 32, borderRadius: 10,
        alignItems: "center", justifyContent: "center",
    },
    featureTxt: { color: "#fff", fontSize: 14, fontWeight: "600", letterSpacing: 0.1 },
});

// ────────────────────────────────────────────────────────────────────
// ONBOARDING SCREEN
// ────────────────────────────────────────────────────────────────────
function OnboardingScreen() {
    const router  = useRouter();
    const insets  = useSafeAreaInsets();
    const flatRef = useRef<FlatList>(null);
    const [idx, setIdx] = useState(0);
    const ctaScale = useRef(new Animated.Value(1)).current;

    const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;
    const handleViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) setIdx(viewableItems[0].index ?? 0);
    }).current;

    const pulseCTA = () => {
        Animated.sequence([
            Animated.timing(ctaScale, { toValue: 0.94, duration: 100, useNativeDriver: true }),
            Animated.timing(ctaScale, { toValue: 1,    duration: 150, useNativeDriver: true }),
        ]).start();
    };

    const next = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pulseCTA();
        if (idx < SLIDES.length - 1) {
            flatRef.current?.scrollToIndex({ index: idx + 1, animated: true });
        } else {
            goHome();
        }
    };

    const goHome = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await AsyncStorage.setItem(ONBOARDING_SEEN_KEY, "true");
        router.replace("/(tabs)");
    };

    const slide = SLIDES[idx];

    return (
        <View style={{ flex: 1, backgroundColor: "#000" }}>
            {/* Slides */}
            <FlatList
                ref={flatRef}
                data={SLIDES}
                keyExtractor={(s) => s.id}
                horizontal
                pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={handleViewable}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item }) => <Slide item={item} />}
            />

            {/* ── Overlay controls (fixed, above slides) ── */}
            <View style={[ob.controls, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 24 }]}>
                {/* Skip */}
                <TouchableOpacity style={ob.skipBtn} onPress={goHome}>
                    <Text style={ob.skipTxt}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* ── Bottom bar ── */}
            <View style={[ob.bottomBar, { paddingBottom: insets.bottom + 24 }]}>
                {/* Dot indicators */}
                <View style={ob.dotsRow}>
                    {SLIDES.map((s, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => {
                                Haptics.selectionAsync();
                                flatRef.current?.scrollToIndex({ index: i, animated: true });
                            }}
                        >
                            <View style={[ob.dot, i === idx && { backgroundColor: slide.accentColor, width: 28 }]} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CTA button */}
                <Animated.View style={{ transform: [{ scale: ctaScale }] }}>
                    <TouchableOpacity
                        style={[ob.cta, { backgroundColor: slide.accentColor }]}
                        onPress={next}
                        activeOpacity={0.88}
                    >
                        <Text style={ob.ctaTxt}>
                            {idx === SLIDES.length - 1 ? "GET STARTED" : "CONTINUE"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Sign in link */}
                <TouchableOpacity
                    style={ob.loginRow}
                    onPress={() => router.push("/auth/login" as any)}
                >
                    <Text style={ob.loginTxt}>Already have an account? </Text>
                    <Text style={ob.loginLink}>Sign In →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const ob = StyleSheet.create({
    // Skip overlay (top right)
    controls: {
        position: "absolute", top: 0, left: 0, right: 0,
        flexDirection: "row", justifyContent: "flex-end",
        paddingHorizontal: 20, zIndex: 10,
    },
    skipBtn: {
        backgroundColor: "rgba(0,0,0,0.35)",
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
    },
    skipTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },

    // Bottom bar
    bottomBar: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        paddingHorizontal: 28, gap: 16, zIndex: 10,
    },
    dotsRow: { flexDirection: "row", gap: 8 },
    dot: {
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: "rgba(255,255,255,0.35)",
    },

    // CTA
    cta: {
        alignItems: "center", justifyContent: "center",
        paddingVertical: 17,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
        elevation: 10,
    },
    ctaTxt: {
        fontSize: 14,
        fontWeight: "800",
        color: "#fff",
        letterSpacing: 2,
    },

    // Login link
    loginRow: { flexDirection: "row", alignSelf: "center" },
    loginTxt: { color: "rgba(255,255,255,0.55)", fontSize: 13, fontWeight: "500" },
    loginLink: { color: "#fff", fontSize: 13, fontWeight: "800" },
});

// ────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
    const [phase, setPhase] = useState<"splash" | "onboarding">("splash");

    return (
        <View style={{ flex: 1, backgroundColor: "#0A1628" }}>
            <StatusBar style="light" />

            {phase === "splash" ? (
                <SplashScreen onDone={() => setPhase("onboarding")} />
            ) : (
                <OnboardingScreen />
            )}
        </View>
    );
}
