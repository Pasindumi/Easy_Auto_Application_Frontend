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

    const tap = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === "menu") setSidebarVisible(true);
        if (type === "notif") router.push("/notifications/notifications" as any);
        if (type === "wish") router.push("/wishlist/wishlist" as any);
    };

    return (
        <Animated.View style={[styles.outer, { opacity: initialHeaderOpacity, paddingTop }]}>
            <View style={styles.px}>
                {/* ── Top row: menu & actions ── */}
                <View style={styles.topRow}>
                    <TouchableOpacity onPress={() => tap("menu")} style={styles.iconBtn} activeOpacity={0.7}>
                        <Ionicons name="menu-outline" size={26} color="#fff" />
                    </TouchableOpacity>

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

                {/* ── Logo Row ── */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("@/assets/applogonew.png")}
                        style={styles.logo}
                        contentFit="contain"
                    />
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    outer: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 100,
    },
    px: { paddingHorizontal: 20 },

    // Top row
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: 48,
    },
    logoContainer: {
        alignItems: 'center',
        paddingTop: 8,
        paddingBottom: 8,
    },
    logo: { width: 160, height: 38 },
    rightRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    iconBtn: {
        width: 40, height: 40,
        alignItems: "center", justifyContent: "center",
        position: "relative",
    },
    badge: {
        position: "absolute", top: 4, right: 4,
        minWidth: 15, height: 15, borderRadius: 7.5,
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
});

export default HomeHeader;
