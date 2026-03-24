import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";

type TabKey = "home" | "buy" | "sell" | "chat" | "profile";

const TABS: {
    key: TabKey;
    label: string;
    icon: string;
    iconActive: string;
    route: string;
}[] = [
    { key: "home",    label: "Home",    icon: "home-outline",       iconActive: "home",          route: "/(tabs)"         },
    { key: "buy",     label: "Browse",  icon: "search-outline",     iconActive: "search",        route: "/(tabs)/search"  },
    { key: "sell",    label: "Sell",    icon: "add",                iconActive: "add",           route: "/cars/select-type" },
    { key: "chat",    label: "Chat",    icon: "chatbubble-outline",  iconActive: "chatbubble",    route: "/(tabs)/chat"    },
    { key: "profile", label: "Profile", icon: "person-outline",     iconActive: "person",        route: "/(tabs)/profile" },
];

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const getActiveKey = (): TabKey => {
        if (pathname === "/" || pathname === "/index" || pathname.startsWith("/(tabs)") && !pathname.includes("/search") && !pathname.includes("/chat") && !pathname.includes("/compare") && !pathname.includes("/profile")) return "home";
        if (pathname.includes("/search") || pathname.includes("/buy-car")) return "buy";
        if (pathname.includes("/chat")) return "chat";
        if (pathname.includes("/profile")) return "profile";
        return "home";
    };

    const activeKey = getActiveKey();

    const handlePress = (tab: typeof TABS[0]) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(tab.route as any);
    };

    return (
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
            <View style={styles.container}>
                {TABS.map((tab) => {
                    const isActive = activeKey === tab.key;
                    const isSell = tab.key === "sell";

                    if (isSell) {
                        return (
                            <TouchableOpacity
                                key={tab.key}
                                style={styles.sellTabWrapper}
                                onPress={() => handlePress(tab)}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={[COLORS.primary, "#1E40AF"]}
                                    style={styles.sellFab}
                                >
                                    <Ionicons name="add" size={28} color="#fff" />
                                </LinearGradient>
                                <Text style={styles.sellLabel}>Sell</Text>
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={styles.tab}
                            onPress={() => handlePress(tab)}
                            activeOpacity={0.8}
                        >
                            {isActive && <View style={styles.activeIndicator} />}
                            <Ionicons
                                name={(isActive ? tab.iconActive : tab.icon) as any}
                                size={22}
                                color={isActive ? COLORS.primary : "#9CA3AF"}
                            />
                            <Text style={[styles.label, isActive && styles.labelActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 16,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 8,
        paddingTop: 10,
        paddingBottom: Platform.OS === "ios" ? 0 : 8,
        backgroundColor: "#fff",
        height: 64,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        position: "relative",
        paddingTop: 2,
    },
    activeIndicator: {
        position: "absolute",
        top: -10,
        width: 28,
        height: 3,
        borderRadius: 2,
        backgroundColor: COLORS.primary,
    },
    label: {
        fontSize: 10,
        fontWeight: "500",
        color: "#9CA3AF",
        marginTop: 3,
    },
    labelActive: {
        color: COLORS.primary,
        fontWeight: "700",
    },
    // Sell FAB
    sellTabWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        marginTop: -20,
    },
    sellFab: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 10,
        borderWidth: 3,
        borderColor: "#fff",
    },
    sellLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: COLORS.primary,
        marginTop: 3,
    },
});
