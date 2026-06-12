import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
    Alert,
    RefreshControl,
    Animated,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";
import Header from "@/components/Header";
import { useNotifications, AppNotification } from "@/hooks/useNotifications";

// ─── Type → icon/colour mapping ───────────────────────────────────────────────

const TYPE_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    // API types (from backend)
    PURCHASE:          { icon: "bag-check",          color: "#10B981", bg: "#ECFDF5", label: "Purchase"     },
    EXPIRY_WARNING:    { icon: "time",               color: "#F59E0B", bg: "#FFFBEB", label: "Expiry"       },
    AD_LIMIT_WARNING:  { icon: "stats-chart",        color: "#EF4444", bg: "#FEF2F2", label: "Ad Limit"     },
    AD_APPROVED:       { icon: "checkmark-circle",   color: "#10B981", bg: "#ECFDF5", label: "Approved"     },
    AD_REJECTED:       { icon: "close-circle",       color: "#EF4444", bg: "#FEF2F2", label: "Rejected"     },
    AD_EXPIRED:        { icon: "hourglass",          color: "#F59E0B", bg: "#FFFBEB", label: "Expired"      },
    CHAT_MESSAGE:      { icon: "chatbubbles",        color: "#7C3AED", bg: "#F5F3FF", label: "Message"      },
    VERIFICATION:      { icon: "shield-checkmark",   color: "#235CF8", bg: "#EEF2FF", label: "Verified"     },
    SUBSCRIPTION_CANCELLED: { icon: "close-circle",       color: "#DC2626", bg: "#FEF2F2", label: "Cancelled"    },
    SYSTEM:            { icon: "settings",           color: "#64748B", bg: "#F1F5F9", label: "System"       },
    // Legacy keys kept for safety
    car:               { icon: "car-sport",          color: "#235CF8", bg: "#EEF2FF", label: "Listing"      },
    price:             { icon: "trending-down",      color: "#10B981", bg: "#ECFDF5", label: "Price Drop"   },
    message:           { icon: "chatbubbles",        color: "#7C3AED", bg: "#F5F3FF", label: "Message"      },
    alert:             { icon: "warning",            color: "#F59E0B", bg: "#FFFBEB", label: "Alert"        },
    promo:             { icon: "star",               color: "#DB2777", bg: "#FDF2F8", label: "Promo"        },
    system:            { icon: "settings",           color: "#64748B", bg: "#F1F5F9", label: "System"       },
};

// ─── Relative time helper ──────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
    const now = Date.now();
    const past = new Date(dateStr).getTime();
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60)          return "Just now";
    if (diff < 3600)        return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)       return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800)      return `${Math.floor(diff / 86400)} days ago`;
    return new Date(dateStr).toLocaleDateString();
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const {
        notifications,
        unreadCount,
        isLoading,
        isRefreshing,
        hasMore,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const displayed = filter === "unread"
        ? notifications.filter(n => !n.is_read)
        : notifications;

    // ── Handlers ───────────────────────────────────────────────────────────

    const handleRead = async (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await markAsRead(id);
    };

    const handleReadAll = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await markAllAsRead();
    };

    const handleClearAll = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
            "Clear Notifications",
            "This will mark all notifications as read. Continue?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Clear All", style: "destructive", onPress: handleReadAll },
            ]
        );
    };

    // ── Swipe-to-dismiss (marks as read) ──────────────────────────────────

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>,
        id: string
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: "clamp",
        });
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleRead(id)}
                activeOpacity={0.8}
            >
                <Animated.View style={[styles.deleteActionInner, { transform: [{ scale }] }]}>
                    <Ionicons name="checkmark-done-outline" size={24} color="#FFFFFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    // ── Loading skeleton ───────────────────────────────────────────────────

    if (isLoading) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Stack.Screen options={{ headerShown: false }} />
                <Header title="Notifications" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </View>
        );
    }

    // ── Main render ────────────────────────────────────────────────────────

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <Header
                title="Notifications"
                rightElement={
                    <TouchableOpacity
                        style={styles.headerActionBtn}
                        onPress={() => router.push("/notifications/notifications-setting")}
                    >
                        <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                }
            />

            {/* ── Filter Strip ── */}
            <View style={styles.filterStrip}>
                <View style={styles.filterPills}>
                    <TouchableOpacity
                        onPress={() => { Haptics.selectionAsync(); setFilter("all"); }}
                        style={[styles.filterChip, filter === "all" && styles.filterChipActive]}
                    >
                        <Text style={[styles.filterChipText, filter === "all" && styles.filterChipTextActive]}>
                            All
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => { Haptics.selectionAsync(); setFilter("unread"); }}
                        style={[styles.filterChip, filter === "unread" && styles.filterChipActive]}
                    >
                        <View style={styles.unreadChipContent}>
                            <Text style={[styles.filterChipText, filter === "unread" && styles.filterChipTextActive]}>
                                Unread
                            </Text>
                            {unreadCount > 0 && (
                                <View style={styles.unreadMiniBadge}>
                                    <Text style={styles.unreadMiniBadgeText}>{unreadCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {unreadCount > 0 ? (
                    <TouchableOpacity onPress={handleReadAll} style={styles.markAllLink}>
                        <Text style={styles.markAllText}>Mark all as read</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleClearAll} style={styles.clearAllLink}>
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* ── List ── */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={refresh}
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
                    />
                }
                onScroll={({ nativeEvent }) => {
                    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                    const nearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
                    if (nearBottom && hasMore) loadMore();
                }}
                scrollEventThrottle={400}
            >
                {displayed.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="notifications-off-outline" size={56} color="#CBD5E1" />
                        </View>
                        <Text style={styles.emptyTitle}>Nothing to show</Text>
                        <Text style={styles.emptyText}>
                            {filter === "unread"
                                ? "You have no unread notifications."
                                : "You'll be notified about messages, ad status, and payments here."}
                        </Text>
                        <TouchableOpacity
                            style={styles.backHomeBtn}
                            onPress={() => router.replace("/(tabs)")}
                        >
                            <Text style={styles.backHomeText}>Go back home</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    displayed.map((n: AppNotification) => {
                        const meta = TYPE_META[n.type] || TYPE_META.SYSTEM;
                        return (
                            <Swipeable
                                key={n.id}
                                renderRightActions={(p, d) => renderRightActions(p, d, n.id)}
                                overshootRight={false}
                                containerStyle={styles.swipeContainer}
                            >
                                <TouchableOpacity
                                    onPress={() => handleRead(n.id)}
                                    activeOpacity={0.9}
                                    style={[
                                        styles.notificationCard,
                                        !n.is_read && styles.unreadNotificationCard,
                                    ]}
                                >
                                    <View style={[styles.cardIconBox, { backgroundColor: meta.bg }]}>
                                        <Ionicons name={meta.icon} size={20} color={meta.color} />
                                    </View>

                                    <View style={styles.cardMainContent}>
                                        <View style={styles.cardRow}>
                                            <Text style={[styles.typeLabel, { color: meta.color }]}>
                                                {meta.label}
                                            </Text>
                                            <Text style={styles.timeLabel}>
                                                {timeAgo(n.created_at)}
                                            </Text>
                                        </View>

                                        <Text style={[styles.cardTitleText, !n.is_read && styles.unreadTitleText]}>
                                            {n.title}
                                        </Text>
                                        <Text style={styles.cardMessageText} numberOfLines={3}>
                                            {n.message}
                                        </Text>

                                        {!n.is_read && (
                                            <View style={styles.newBadgeWrapper}>
                                                <Text style={styles.newBadgeText}>New</Text>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </Swipeable>
                        );
                    })
                )}

                {hasMore && (
                    <View style={styles.loadMoreIndicator}>
                        <ActivityIndicator size="small" color={COLORS.primary} />
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

// ─── Styles (unchanged from original) ────────────────────────────────────────

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    headerActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    loadingText: {
        fontSize: 14,
        color: "#94A3B8",
        fontWeight: "500",
    },
    filterStrip: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    filterPills: {
        flexDirection: "row",
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterChipText: {
        fontSize: 13,
        fontWeight: "700",
        color: "#6B7280",
    },
    filterChipTextActive: {
        color: "#FFFFFF",
    },
    unreadChipContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    unreadMiniBadge: {
        backgroundColor: "#FCD34D",
        borderRadius: 6,
        paddingHorizontal: 5,
        minWidth: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    unreadMiniBadgeText: {
        fontSize: 10,
        fontWeight: "900",
        color: "#92400E",
    },
    markAllLink: { paddingVertical: 4 },
    markAllText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
    },
    clearAllLink: { paddingVertical: 4 },
    clearAllText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
    },
    content: { flex: 1 },
    emptyContainer: {
        marginTop: 100,
        alignItems: "center",
        paddingHorizontal: 45,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#EDF2F7",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#1E293B",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 15,
        color: "#64748B",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 30,
    },
    backHomeBtn: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "#E2E8F0",
    },
    backHomeText: {
        color: "#1E293B",
        fontWeight: "800",
        fontSize: 14,
    },
    swipeContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    deleteAction: {
        backgroundColor: "#10B981",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: "100%",
        borderRadius: 20,
        marginLeft: 10,
    },
    deleteActionInner: {
        alignItems: "center",
        justifyContent: "center",
    },
    notificationCard: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 1,
    },
    unreadNotificationCard: {
        backgroundColor: "#FFFFFF",
        borderColor: COLORS.primary,
        borderWidth: 1.5,
    },
    cardIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    cardMainContent: { flex: 1 },
    cardRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6,
    },
    typeLabel: {
        fontSize: 10,
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    timeLabel: {
        fontSize: 12,
        color: "#94A3B8",
        fontWeight: "500",
    },
    cardTitleText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#334155",
        marginBottom: 4,
        letterSpacing: -0.2,
    },
    unreadTitleText: {
        fontWeight: "800",
        color: "#0F172A",
    },
    cardMessageText: {
        fontSize: 14,
        color: "#64748B",
        lineHeight: 20,
    },
    newBadgeWrapper: {
        alignSelf: "flex-start",
        marginTop: 8,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    newBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "900",
        textTransform: "uppercase",
    },
    loadMoreIndicator: {
        paddingVertical: 20,
        alignItems: "center",
    },
});
