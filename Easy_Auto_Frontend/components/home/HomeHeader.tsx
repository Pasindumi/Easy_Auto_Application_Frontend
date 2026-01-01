import COLORS from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
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
    setNotificationCount,
    wishlistCount,
    setWishlistCount,
    setSidebarVisible,
    setNotificationDrawerVisible,
    setWishlistDrawerVisible,
    showNotificationPreview,
    setShowNotificationPreview,
    showWishlistPreview,
    setShowWishlistPreview,
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
            pointerEvents="box-none"
        >
            <View style={styles.headerContent}>
                {/* Left: Hamburger Menu */}
                <TouchableOpacity
                    onPress={() => {
                        setSidebarVisible(true);
                        try {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        } catch (e) {
                            // Ignore
                        }
                    }}
                    style={styles.menuButton}
                    activeOpacity={0.7}
                    hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                    <Ionicons name="menu-outline" size={28} color={COLORS.white} />
                </TouchableOpacity>

                {/* Center: Logo */}
                <View style={styles.centeredLogoContainer}>
                    <Image
                        source={require("@/assets/images/white logo bg.png")}
                        style={styles.logoImage}
                        contentFit="contain"
                    />
                </View>

                {/* Right: Icons */}
                <View style={styles.rightIconsContainer}>
                    {/* Notification Icon */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setNotificationDrawerVisible(true);
                            try {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            } catch (e) {
                                // Ignore haptics error
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="notifications-outline" size={26} color={COLORS.white} />
                        {notificationCount > 0 && (
                            <View style={[styles.badge, { borderColor: COLORS.primary }]}>
                                <Text style={styles.badgeText}>
                                    {notificationCount > 9 ? "9+" : notificationCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Wishlist Heart Icon */}
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => {
                            setWishlistDrawerVisible(true);
                            try {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            } catch (error) {
                                // Ignore haptics error
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="heart-outline" size={26} color={COLORS.white} />
                        {wishlistCount > 0 && (
                            <View style={[styles.badge, { borderColor: COLORS.primary }]}>
                                <Text style={styles.badgeText}>
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Integrated Search Bar */}
            <View style={styles.searchSection}>
                <View style={styles.searchWrapper}>
                    <View
                        style={[
                            styles.searchContainer,
                            searchFocused && styles.searchContainerFocused,
                        ]}
                    >
                        <MaterialIcons
                            name="search"
                            size={22}
                            color={searchFocused ? COLORS.primary : COLORS.text.placeholder}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search cars, brands or models..."
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
                            activeOpacity={0.75}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons
                                name="tune"
                                size={20}
                                color={searchFocused ? COLORS.primary : COLORS.text.placeholder}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Search Suggestions */}
                {showSearchSuggestions && (
                    <View style={styles.searchSuggestions}>
                        <Text style={styles.suggestionsTitle}>Recent Searches</Text>
                        {["Toyota Camry", "Honda Civic", "BMW 3 Series"].map(
                            (suggestion, index) => (
                                <TouchableOpacity
                                    key={`recent-search-${index}`}
                                    style={styles.suggestionItem}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="history" size={16} color={COLORS.text.muted} />
                                    <Text style={styles.suggestionText}>{suggestion}</Text>
                                </TouchableOpacity>
                            )
                        )}
                        <Text style={styles.suggestionsTitle}>Popular Searches</Text>
                        {["SUV", "Sedan", "Electric Cars"].map((suggestion, index) => (
                            <TouchableOpacity
                                key={`popular-${index}`}
                                style={styles.suggestionItem}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="trending-up" size={16} color={COLORS.primary} />
                                <Text style={[styles.suggestionText, styles.popularText]}>
                                    {suggestion}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primary,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 0,
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 50,
        marginBottom: 14,
        zIndex: 50,
        position: 'relative',
    },
    menuButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        marginBottom: 80,
    },
    rightIconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 80,
        zIndex: 100,
    },
    centeredLogoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
    },
    logoImage: {
        width: 350,
        height: 155,
    },
    iconButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: 4,
        right: 4,
        backgroundColor: COLORS.status.danger,
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderWidth: 2,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: -0.2,
    },
    searchSection: {
        marginTop: -55,
        zIndex: 10,
    },
    searchWrapper: {
        paddingBottom: 0,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 6,
        gap: 12,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    searchContainerFocused: {
        borderColor: COLORS.white,
        borderWidth: 2,
        backgroundColor: COLORS.white,
        shadowOpacity: 0.12,
        shadowRadius: 14,
    },
    searchIcon: {
        marginRight: 0,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text.primary,
        fontWeight: "400",
        paddingVertical: 0,
        letterSpacing: -0.2,
    },
    searchSuggestions: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginTop: 8,
        padding: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        maxHeight: 300,
        zIndex: 2000,
    },
    suggestionsTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.text.muted,
        marginTop: 8,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    suggestionItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 8,
        gap: 10,
    },
    suggestionText: {
        fontSize: 14,
        color: COLORS.text.primary,
        fontWeight: "500",
    },
    popularText: {
        color: COLORS.primary,
        fontWeight: "600",
    },
});
export default HomeHeader;