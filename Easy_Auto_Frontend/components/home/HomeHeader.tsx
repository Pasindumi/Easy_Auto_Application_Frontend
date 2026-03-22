import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";

interface HomeHeaderProps {
    initialHeaderOpacity: Animated.Value;
    paddingTop: number;
    notificationCount: number;
    wishlistCount: number;
    setSidebarVisible: (v: boolean) => void;
    searchFocused: boolean;
    setSearchFocused: (v: boolean) => void;
    showSearchSuggestions: boolean;
    setShowSearchSuggestions: (v: boolean) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    initialHeaderOpacity,
    paddingTop,
    notificationCount,
    wishlistCount,
    setSidebarVisible,
    searchFocused,
    setSearchFocused,
}) => {
    const router = useRouter();
    const { user } = useAuth();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning ☀️";
        if (h < 17) return "Good afternoon 🌤️";
        return "Good evening 🌙";
    };

    const firstName = user?.name?.split(" ")[0] || null;

    const tap = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === "menu")  setSidebarVisible(true);
        if (type === "notif") router.push("/notifications/notifications" as any);
        if (type === "wish")  router.push("/wishlist/wishlist" as any);
    };

    return (
        <Animated.View style={[styles.outer, { opacity: initialHeaderOpacity, paddingTop }]}>
            <View style={styles.px}>
                {/* ── Top row: menu | logo | actions ── */}
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => tap("menu")} style={styles.iconBtn} activeOpacity={0.7}>
                        <Ionicons name="menu-outline" size={26} color="#fff" />
                    </TouchableOpacity>

                    <Image
                        source={require("@/assets/logoHome.png")}
                        style={styles.logo}
                        contentFit="contain"
                    />

                    <View style={styles.rightRow}>
                        {/* Wishlist icon with count badge */}
                        <TouchableOpacity onPress={() => tap("wish")} style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="heart-outline" size={22} color="#fff" />
                            {wishlistCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {wishlistCount > 9 ? "9+" : wishlistCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Notification icon with count badge */}
                        <TouchableOpacity onPress={() => tap("notif")} style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={22} color="#fff" />
                            {notificationCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {notificationCount > 9 ? "9+" : notificationCount}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Greeting with user name ── */}
                <Text style={styles.greeting}>
                    {getGreeting()}{firstName ? `, ${firstName}` : ""} — Find your dream car
                </Text>

                {/* ── Search bar ── */}
                <TouchableOpacity
                    style={styles.searchBar}
                    activeOpacity={0.9}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push("/(tabs)/search" as any);
                    }}
                >
                    <Ionicons name="search" size={18} color="#94A3B8" />
                    <Text style={styles.searchPlaceholder}>Search make, model, year...</Text>
                    <TouchableOpacity
                        style={styles.filterChip}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push("/(tabs)/search" as any);
                        }}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, "#1E40AF"]}
                            style={styles.filterChipGrad}
                        >
                            <Ionicons name="options-outline" size={14} color="#fff" />
                            <Text style={styles.filterChipTxt}>Filter</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </TouchableOpacity>

                {/* ── Quick stats row ── */}
                <View style={styles.quickStats}>
                    <View style={styles.statItem}>
                        <Ionicons name="car-outline" size={13} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statText}>10,000+ Cars</Text>
                    </View>
                    <View style={styles.statDot} />
                    <View style={styles.statItem}>
                        <Ionicons name="shield-checkmark-outline" size={13} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statText}>Verified Sellers</Text>
                    </View>
                    <View style={styles.statDot} />
                    <View style={styles.statItem}>
                        <Ionicons name="flash-outline" size={13} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statText}>Fast Deals</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outer: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 14,
        zIndex: 100,
    },
    px: { paddingHorizontal: 18 },

    // Top row
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 44,
        marginBottom: 10,
    },
    logo: { width: 120, height: 28 },
    rightRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    iconBtn: {
        width: 38, height: 38,
        alignItems: "center", justifyContent: "center",
        position: "relative",
        backgroundColor: "rgba(255,255,255,0.12)",
        borderRadius: 12,
    },
    badge: {
        position: "absolute", top: 4, right: 4,
        minWidth: 16, height: 16, borderRadius: 8,
        backgroundColor: "#FCD34D",
        borderWidth: 1.5, borderColor: COLORS.primary,
        alignItems: "center", justifyContent: "center",
        paddingHorizontal: 3,
    },
    badgeText: {
        color: "#1E293B",
        fontSize: 8,
        fontWeight: "900",
    },

    // Greeting
    greeting: {
        fontSize: 13,
        fontWeight: "600",
        color: "rgba(255,255,255,0.82)",
        marginBottom: 10,
        letterSpacing: 0.1,
    },

    // Search
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 48,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 14,
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    filterChip: {
        borderRadius: 10,
        overflow: "hidden",
    },
    filterChipGrad: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    filterChipTxt: {
        fontSize: 12,
        fontWeight: "700",
        color: "#fff",
    },

    // Quick stats
    quickStats: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    statText: {
        fontSize: 11,
        color: "rgba(255,255,255,0.75)",
        fontWeight: "500",
    },
    statDot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.4)",
    },
});

export default HomeHeader;
