import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface HomeHeaderProps {
    initialHeaderOpacity: Animated.Value;
    paddingTop: number;
    notificationCount: number;
    setNotificationCount: (count: number | ((prev: number) => number)) => void;
    wishlistCount: number;
    setWishlistCount: (count: number | ((prev: number) => number)) => void;
    setSidebarVisible: (visible: boolean) => void;
    setNotificationDrawerVisible: (visible: boolean) => void;
    setWishlistDrawerVisible: (visible: boolean) => void;
    showNotificationPreview: boolean;
    setShowNotificationPreview: (visible: boolean) => void;
    showWishlistPreview: boolean;
    setShowWishlistPreview: (visible: boolean) => void;
    // Search Props
    searchFocused: boolean;
    setSearchFocused: (focused: boolean) => void;
    showSearchSuggestions: boolean;
    setShowSearchSuggestions: (visible: boolean) => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
    initialHeaderOpacity,
    paddingTop,
    notificationCount,
    setSidebarVisible,
    setNotificationDrawerVisible,
    setWishlistDrawerVisible,
    showNotificationPreview,
    setShowNotificationPreview,
    showWishlistPreview,
    setShowWishlistPreview,
    wishlistCount,
    searchFocused,
    setSearchFocused,
    showSearchSuggestions,
    setShowSearchSuggestions,
}) => {
    useEffect(() => {
        if (showNotificationPreview || showWishlistPreview) {
            const timer = setTimeout(() => {
                setShowNotificationPreview(false);
                setShowWishlistPreview(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showNotificationPreview, showWishlistPreview, setShowNotificationPreview, setShowWishlistPreview]);

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    opacity: initialHeaderOpacity,
                    paddingTop,
                },
            ]}
        >
            <LinearGradient
                colors={[COLORS.primary, '#1E40AF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradient}
            />

            <View style={styles.topRow}>
                {/* Left: Hamburger Menu */}
                <TouchableOpacity
                    onPress={() => {
                        setSidebarVisible(true);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    activeOpacity={0.7}
                >
                    <View style={styles.menuIconBox}>
                        <Ionicons name="menu-outline" size={26} color={COLORS.white} />
                    </View>
                </TouchableOpacity>

                {/* Center: Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("@/assets/applogonew.png")}
                        style={styles.logoImage}
                        contentFit="contain"
                    />
                </View>

                {/* Right: Icons */}
                <View style={styles.rightActions}>
                    <View style={styles.langWrapper}>
                        <LanguageSwitcher />
                    </View>

                    {/* Notification Icon */}
                    <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => {
                            setNotificationDrawerVisible(true);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
                        {notificationCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {notificationCount > 9 ? "9+" : notificationCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Wishlist Heart Icon */}
                    <TouchableOpacity
                        style={styles.actionIcon}
                        onPress={() => {
                            setWishlistDrawerVisible(true);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Ionicons name="heart-outline" size={24} color={COLORS.white} />
                        {wishlistCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.greetingSection}>
                <Text style={styles.greetingTitle}>Find Your Dream Car</Text>
                <Text style={styles.subtitleText}>
                    The trusted way to buy & sell cars in Sri Lanka
                </Text>
            </View>

            {/* Integrated Search Bar */}
            <View style={styles.searchContainerOuter}>
                <View
                    style={[
                        styles.searchBar,
                        searchFocused && styles.searchBarFocused,
                    ]}
                >
                    <View style={styles.searchIconBox}>
                        <Ionicons
                            name="search"
                            size={20}
                            color={searchFocused ? COLORS.primary : COLORS.text.muted}
                        />
                    </View>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by brand, model or type..."
                        placeholderTextColor={COLORS.text.placeholder}
                        onFocus={() => {
                            setSearchFocused(true);
                            setShowSearchSuggestions(true);
                        }}
                        onBlur={() => {
                            setSearchFocused(false);
                            setTimeout(() => setShowSearchSuggestions(false), 200);
                        }}
                    />
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    >
                        <Ionicons
                            name="options-outline"
                            size={20}
                            color={COLORS.primary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Quick Search Suggestions */}
                {showSearchSuggestions && (
                    <View style={styles.suggestionsContainer}>
                        <View style={styles.suggestionHeaderRow}>
                            <Text style={styles.suggestionsHeader}>Recent Searches</Text>
                            <TouchableOpacity>
                                <Text style={styles.clearAllText}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                        {["Toyota Camry", "Honda Civic", "BMW 3 Series"].map(
                            (suggestion, index) => (
                                <TouchableOpacity
                                    key={`recent-${index}`}
                                    style={styles.suggestionRow}
                                >
                                    <View style={styles.historyIconBox}>
                                        <Ionicons name="time-outline" size={18} color={COLORS.text.muted} />
                                    </View>
                                    <Text style={styles.suggestionText}>{suggestion}</Text>
                                    <Ionicons name="chevron-forward" size={14} color={COLORS.border} />
                                </TouchableOpacity>
                            )
                        )}
                        <Text style={[styles.suggestionsHeader, { marginTop: 16 }]}>Popular Brands</Text>
                        <View style={styles.popularGrid}>
                            {["Toyota", "BMW", "Benz", "Audi"].map((brand, idx) => (
                                <TouchableOpacity key={idx} style={styles.popularTag}>
                                    <Text style={styles.popularTagText}>{brand}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingBottom: 24,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        zIndex: 100,
        position: 'relative',
        overflow: 'hidden',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
        height: 60,
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        flex: 1,
        alignItems: "center",
    },
    logoImage: {
        width: 220,
        height: 60,
    },
    rightActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    langWrapper: {
        marginRight: 4,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: "center",
    },
    badge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "#EF4444",
        borderRadius: 6,
        minWidth: 12,
        height: 12,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 7,
        fontWeight: "800",
    },
    greetingSection: {
        marginBottom: 20,
        paddingLeft: 4,
    },
    greetingTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    subtitleText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: "500",
        marginTop: 6,
        letterSpacing: 0.2,
    },
    searchContainerOuter: {
        zIndex: 110,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 18,
        paddingHorizontal: 8,
        height: 54,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    searchBarFocused: {
        borderWidth: 1.5,
        borderColor: COLORS.white,
        shadowOpacity: 0.15,
    },
    searchIconBox: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.text.primary,
        fontWeight: "500",
    },
    filterBtn: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: 'rgba(35, 92, 248, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 15,
        zIndex: 2000,
    },
    suggestionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    suggestionsHeader: {
        fontSize: 12,
        fontWeight: "800",
        color: COLORS.text.muted,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    clearAllText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
    },
    suggestionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    historyIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: "600",
    },
    popularGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    popularTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    popularTagText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.text.primary,
    },
});

export default HomeHeader;