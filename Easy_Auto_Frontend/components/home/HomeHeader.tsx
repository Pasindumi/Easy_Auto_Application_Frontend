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

// const { width } = Dimensions.get("window");

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
    // ... (rest of the component logic remains the same, but using imported arrays)
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
                    <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
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
                        <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
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
                        <Ionicons name="heart-outline" size={26} color="#FFFFFF" />
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
                            color={searchFocused ? "#235CF8" : "#9CA3AF"}
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search cars, brands or models..."
                            placeholderTextColor="#9CA3AF"
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
                                color={searchFocused ? "#235CF8" : "#9CA3AF"}
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
                                    <MaterialIcons name="history" size={16} color="#9BA1A6" />
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
                                <MaterialIcons name="trending-up" size={16} color="#235CF8" />
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
        backgroundColor: "#235CF8",
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 0,
        // overflow: "hidden", // Removed to prevent clipping touches
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 50,
        marginBottom: 14,
        zIndex: 50,
        position: 'relative', // Context for absolute logo
    },
    menuButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100, // Ensure it sits on top
        marginBottom: 80,
    },
    rightIconsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 80,
        zIndex: 100, // Ensure actionable
    },
    centeredLogoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1, // Sit below icons
    },
    topRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 6,
        paddingBottom: 10,
    },
    rightIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        width: 100,
        justifyContent: "flex-end",
    },
    headerButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    logoWrapper: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
    },
    logoImage: {
        width: 350,
        height: 155,
    },
    logoText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        letterSpacing: -0.3,
    },
    headerActions: {
        flexDirection: "row",
        gap: 12, // Increased from 8
        alignItems: "center",
    },
    iconButtonWrapper: {
        position: "relative",
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
        backgroundColor: "#EF4444",
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: "#235CF8",
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: -0.2,
    },
    notificationPreview: {
        position: "absolute",
        top: 50,
        right: 0,
        width: 320,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
        zIndex: 1000,
        maxHeight: 400,
    },
    wishlistPreview: {
        position: "absolute",
        top: 50,
        right: 0,
        width: 320,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 12,
        zIndex: 1000,
        maxHeight: 400,
    },
    previewHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E7EB",
    },
    previewTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
    previewSeeAll: {
        fontSize: 14,
        fontWeight: "600",
        color: "#235CF8",
    },
    previewContent: {
        maxHeight: 280,
    },
    previewItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
        gap: 12,
    },
    previewItemUnread: {
        backgroundColor: "#F0F9FF",
    },
    previewIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    previewIconMatch: {
        backgroundColor: "#235CF8",
    },
    previewIconPrice: {
        backgroundColor: "#10B981",
    },
    previewIconDeal: {
        backgroundColor: "#F59E0B",
    },
    previewText: {
        flex: 1,
        gap: 2,
    },
    previewItemTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },
    previewItemMessage: {
        fontSize: 12,
        color: "#6B7280",
        marginTop: 2,
    },
    previewItemTime: {
        fontSize: 11,
        color: "#9CA3AF",
        marginTop: 4,
    },
    previewItemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    previewUnreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#235CF8",
    },
    previewMarkAll: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        gap: 6,
    },
    previewMarkAllText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#235CF8",
    },
    previewRemoveButton: {
        padding: 4,
    },
    // Search Bar Styles
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
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 6,
        gap: 12,
        borderWidth: 1.5,
        borderColor: "rgba(255, 255, 255, 0.3)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    searchContainerFocused: {
        borderColor: "#FFFFFF",
        borderWidth: 2,
        backgroundColor: "#FFFFFF",
        shadowOpacity: 0.12,
        shadowRadius: 14,
    },
    searchIcon: {
        marginRight: 0,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: "#111827",
        fontWeight: "400",
        paddingVertical: 0,
        letterSpacing: -0.2,
    },
    searchSuggestions: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginTop: 8,
        padding: 12,
        shadowColor: "#000",
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
        color: "#9BA1A6",
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
        color: "#1A1A1A",
        fontWeight: "500",
    },
    popularText: {
        color: "#235CF8",
        fontWeight: "600",
    },
});

export default HomeHeader;