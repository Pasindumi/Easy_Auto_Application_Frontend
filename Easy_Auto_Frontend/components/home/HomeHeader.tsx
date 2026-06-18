import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

    const tap = (type: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (type === "menu") setSidebarVisible(true);
        if (type === "notif") router.push("/notifications/notifications" as any);
        if (type === "wish") router.push("/wishlist/wishlist" as any);
    };

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);
    const iconColor = isDarkMode ? colors.text.primary : "#fff";

    return (
        <Animated.View style={[themeStyles.outer, { opacity: initialHeaderOpacity, paddingTop }]}>
            <View style={themeStyles.px}>
                {/* ── Top row: menu & actions ── */}
                <View style={themeStyles.topRow}>
                    <TouchableOpacity onPress={() => tap("menu")} style={themeStyles.iconBtn} activeOpacity={0.7}>
                        <Ionicons name="menu-outline" size={26} color={iconColor} />
                    </TouchableOpacity>

                    <View style={themeStyles.rightRow}>
                        <TouchableOpacity onPress={() => tap("wish")} style={themeStyles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="heart-outline" size={24} color={iconColor} />
                            {wishlistCount > 0 && (
                                <View style={themeStyles.badge}>
                                    <Text style={themeStyles.badgeText}>{wishlistCount > 10 ? '9+' : wishlistCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => tap("notif")} style={themeStyles.iconBtn} activeOpacity={0.7}>
                            <Ionicons name="notifications-outline" size={24} color={iconColor} />
                            {notificationCount > 0 && (
                                <View style={themeStyles.badge}>
                                    <Text style={themeStyles.badgeText}>{notificationCount > 10 ? '9+' : notificationCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Logo Row ── */}
                <View style={themeStyles.logoContainer}>
                    <Image
                        source={require("@/assets/applogonew.png")}
                        style={[themeStyles.logo, isDarkMode && { tintColor: colors.text.primary }]}
                        contentFit="contain"
                    />
                </View>
            </View>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    outer: {
        backgroundColor: isDarkMode ? colors.backgroundSecondary : colors.primary,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 12,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
        zIndex: 100,
        borderBottomWidth: isDarkMode ? 1 : 0,
        borderBottomColor: colors.border,
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
        backgroundColor: isDarkMode ? colors.primary : "#FCD34D",
        borderWidth: 1.5, borderColor: isDarkMode ? colors.backgroundSecondary : colors.primary,
        alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 2,
    },
    badgeText: {
        color: isDarkMode ? "#fff" : colors.primary,
        fontSize: 8,
        fontWeight: "900",
    },
});


export default HomeHeader;
