import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
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

interface HomeHeaderProps {
    initialHeaderOpacity: Animated.Value;
    paddingTop: number;
    notificationCount: number;
    wishlistCount: number;
    setSidebarVisible: (v: boolean) => void;
    setNotificationDrawerVisible: (v: boolean) => void;
    setWishlistDrawerVisible: (v: boolean) => void;
    searchFocused: boolean;
    setSearchFocused: (v: boolean) => void;
    showSearchSuggestions: boolean;
    setShowSearchSuggestions: (v: boolean) => void;
}

const QUICK_FILTERS = ["Sedan", "SUV", "Pickup", "Van", "Electric"];

const HomeHeader: React.FC<HomeHeaderProps> = ({
    initialHeaderOpacity,
    paddingTop,
    notificationCount,
    wishlistCount,
    setSidebarVisible,
    setNotificationDrawerVisible,
    setWishlistDrawerVisible,
    searchFocused,
    setSearchFocused,
}) => {
    const router = useRouter();

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning ☀️";
        if (h < 17) return "Good afternoon 🌤️";
        return "Good evening 🌙";
    };

    const tap = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === "menu")  setSidebarVisible(true);
        if (type === "notif") setNotificationDrawerVisible(true);
        if (type === "wish")  setWishlistDrawerVisible(true);
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
                            <Ionicons name="heart-outline" size={22} color="#fff" />
                            {wishlistCount > 0 && <View style={styles.badge} />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tap("notif")} style={styles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={22} color="#fff" />
                            {notificationCount > 0 && <View style={styles.badge} />}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Greeting ── */}
                <Text style={styles.greeting}>{getGreeting()} — Find your dream car</Text>

                {/* ── Search bar ── */}
                <TouchableOpacity
                    style={[styles.searchBar, searchFocused && styles.searchBarFocused]}
                    activeOpacity={0.9}
                    onPress={() => {
                        Haptics.selectionAsync();
                        router.push("/(tabs)/search" as any);
                    }}
                >
                    <Ionicons name="search" size={18} color="#94A3B8" />
                    <Text style={styles.searchPlaceholder}>Search make, model, year...</Text>
                    <View style={styles.filterChip}>
                        <Ionicons name="options-outline" size={15} color={COLORS.primary} />
                        <Text style={styles.filterChipTxt}>Filter</Text>
                    </View>
                </TouchableOpacity>

                {/* ── Quick filter pills ── */}
                <View style={styles.pillsRow}>
                    {QUICK_FILTERS.map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={styles.pill}
                            onPress={() => {
                                Haptics.selectionAsync();
                                router.push(`/(tabs)/search` as any);
                            }}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.pillTxt}>{f}</Text>
                        </TouchableOpacity>
                    ))}
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
        position: "absolute", top: 6, right: 6,
        width: 7, height: 7, borderRadius: 4,
        backgroundColor: "#FCD34D",
        borderWidth: 1.5, borderColor: COLORS.primary,
    },

    // Greeting
    greeting: {
        fontSize: 13,
        fontWeight: "600",
        color: "rgba(255,255,255,0.80)",
        marginBottom: 10,
        letterSpacing: 0.1,
    },

    // Search
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 44,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 12,
    },
    searchBarFocused: {
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.4)",
    },
    searchPlaceholder: {
        flex: 1,
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    filterChip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: "#EEF2FF",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    filterChipTxt: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
    },

    // Quick filter pills
    pillsRow: {
        flexDirection: "row",
        gap: 8,
    },
    pill: {
        backgroundColor: "rgba(255,255,255,0.18)",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.25)",
    },
    pillTxt: {
        fontSize: 12,
        fontWeight: "600",
        color: "#fff",
    },
});

export default HomeHeader;
