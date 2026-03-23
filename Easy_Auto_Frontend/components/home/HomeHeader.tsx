import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

interface HomeHeaderProps {
    initialHeaderOpacity: Animated.Value;
    paddingTop: number;
    notificationCount: number;
    wishlistCount: number;
    setSidebarVisible: (v: boolean) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    initialHeaderOpacity,
    paddingTop,
    notificationCount,
    wishlistCount,
    setSidebarVisible,
}) => {
    const router = useRouter();
    const { t } = useTranslation();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t("home_header.good_morning", "Good morning ☀️");
        if (h < 17) return t("home_header.good_afternoon", "Good afternoon 🌤️");
        return t("home_header.good_evening", "Good evening 🌙");
    };

    const tap = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === "menu") setSidebarVisible(true);
        if (type === "notif") router.push("/notifications/notifications" as any);
        if (type === "wish") router.push("/wishlist/wishlist" as any);
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
                        <TouchableOpacity onPress={() => tap("wish")} style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="heart-outline" size={24} color="#fff" />
                            {wishlistCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{wishlistCount > 10 ? '9+' : wishlistCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tap("notif")} style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={24} color="#fff" />
                            {notificationCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{notificationCount > 10 ? '9+' : notificationCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Greeting ── */}
                <Text style={styles.greeting}>{getGreeting()} — {t("home_header.greeting", "Find your dream car")}</Text>

                {/* ── Search bar ── */}
                <View style={styles.searchRow}>
                    <TouchableOpacity
                        style={styles.searchBar}
                        activeOpacity={0.9}
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.push("/search" as any);
                        }}
                    >
                        <Ionicons name="search" size={18} color="#94A3B8" />
                        <Text style={styles.searchPlaceholder}>{t("home.search_placeholder", "Search make, model, year...")}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.push({ pathname: "/search", params: { openFilters: 'true' } } as any);
                        }}
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                            style={styles.filterGrad}
                        >
                            <Ionicons name="filter" size={20} color="white" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outer: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        paddingBottom: 18,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 18,
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
        width: 36, height: 36,
        alignItems: "center", justifyContent: "center",
        position: "relative",
    },
    badge: {
        position: "absolute", top: 4, right: 4,
        minWidth: 14, height: 14, borderRadius: 7,
        backgroundColor: "#FCD34D",
        borderWidth: 1.5, borderColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 2,
    },
    badgeText: {
        color: COLORS.primary,
        fontSize: 8,
        fontWeight: "900",
    },

    // Greeting
    greeting: {
        fontSize: 14,
        fontWeight: "800",
        color: "rgba(255,255,255,0.95)",
        marginBottom: 14,
        letterSpacing: -0.3,
    },

    // Search
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    searchBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 46,
        gap: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 13,
        color: "rgba(255,255,255,0.75)",
        fontWeight: "600",
    },
    filterBtn: {
        width: 46,
        height: 46,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    filterGrad: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterChipTxt: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
    },
});

export default HomeHeader;
