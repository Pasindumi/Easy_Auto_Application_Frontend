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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: "car" | "price" | "message" | "alert" | "promo" | "system";
}

const TYPE_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
    car: { icon: "car-sport", color: "#235CF8", bg: "#EEF2FF", label: "Listing" },
    price: { icon: "trending-down", color: "#10B981", bg: "#ECFDF5", label: "Price Drop" },
    message: { icon: "chatbubbles", color: "#7C3AED", bg: "#F5F3FF", label: "Message" },
    alert: { icon: "warning", color: "#F59E0B", bg: "#FFFBEB", label: "Alert" },
    promo: { icon: "star", color: "#DB2777", bg: "#FDF2F8", label: "Promo" },
    system: { icon: "settings", color: "#64748B", bg: "#F1F5F9", label: "System" },
};

const INITIAL: NotificationItem[] = [
    { id: 1, type: "car", title: "New Listing Match", message: "A 2022 Toyota Corolla matching your search was just listed in Colombo. Take a look before it's gone!", time: "Just now", read: false },
    { id: 2, type: "price", title: "Price Drop Alert 🎉", message: "Great news! Your saved BMW 3 Series dropped by LKR 500,000. It's now LKR 14,500,000.", time: "2 hours ago", read: false },
    { id: 3, type: "message", title: "Dealer Replied", message: "Auto Lanka Motors responded to your inquiry about the Nissan GTR 2021. Check your chat.", time: "5 hours ago", read: false },
    { id: 4, type: "alert", title: "Subscription Expiring", message: "Your Premium Listing plan will expire in 3 days. Renew now to keep your ads featured at the top!", time: "1 day ago", read: true },
    { id: 5, type: "promo", title: "Weekend Special Offer", message: "Get 30% off on all Premium listings this weekend only! Use code PREMIUM30.", time: "2 days ago", read: true },
    { id: 6, type: "system", title: "Profile Verified ✅", message: "Congratulations! Your account has been verified. You can now post unlimited ads and build more trust with buyers.", time: "3 days ago", read: true },
];

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [items, setItems] = useState<NotificationItem[]>(INITIAL);
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [refreshing, setRefreshing] = useState(false);

    const unreadCount = items.filter((n) => !n.read).length;
    const displayed = filter === "unread" ? items.filter((n) => !n.read) : items;

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const read = (id: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const readAll = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const remove = (id: number) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setItems((prev) => prev.filter((n) => n.id !== id));
    };

    const clearAll = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert("Clear All Notifications", "Are you sure you want to remove all notifications permanently?", [
            { text: "Cancel", style: "cancel" },
            { text: "Clear All", style: "destructive", onPress: () => setItems([]) },
        ]);
    };

    const renderRightActions = (
        progress: Animated.AnimatedInterpolation<number>,
        dragX: Animated.AnimatedInterpolation<number>,
        id: number
    ) => {
        const scale = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity 
                style={styles.deleteAction} 
                onPress={() => remove(id)}
                activeOpacity={0.8}
            >
                <Animated.View style={[styles.deleteActionInner, { transform: [{ scale }] }]}>
                    <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* ── Professional Header (Exact Home Theme) ── */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            router.back();
                        }} 
                        style={styles.backBtn}
                    >
                        <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <View style={styles.headerTitleContainer}>
                         <Text style={styles.headerTitle}>Notifications</Text>
                    </View>

                    {/* Placeholder for balance/alignment or a settings icon */}
                    <TouchableOpacity 
                        style={styles.headerActionBtn}
                        onPress={() => router.push("/notifications/notifications-setting")}
                    >
                        <Ionicons name="settings-outline" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Filter Strip (Now Outside Header) ── */}
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
                            {unreadCount > 0 && <View style={styles.unreadMiniBadge}><Text style={styles.unreadMiniBadgeText}>{unreadCount}</Text></View>}
                        </View>
                    </TouchableOpacity>
                </View>
                
                {unreadCount > 0 ? (
                    <TouchableOpacity onPress={readAll} style={styles.markAllLink}>
                        <Text style={styles.markAllText}>Mark all as read</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={clearAll} style={styles.clearAllLink}>
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                {displayed.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="notifications-off-outline" size={56} color="#CBD5E1" />
                        </View>
                        <Text style={styles.emptyTitle}>Nothing to show</Text>
                        <Text style={styles.emptyText}>You've read all your notifications. We'll update you when there's something new.</Text>
                        <TouchableOpacity 
                            style={styles.backHomeBtn} 
                            onPress={() => router.replace("/(tabs)")}
                        >
                             <Text style={styles.backHomeText}>Go back home</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    displayed.map((n) => {
                        const meta = TYPE_META[n.type] || TYPE_META.system;
                        return (
                            <Swipeable
                                key={n.id}
                                renderRightActions={(p, d) => renderRightActions(p, d, n.id)}
                                overshootRight={false}
                                containerStyle={styles.swipeContainer}
                            >
                                <TouchableOpacity
                                    onPress={() => read(n.id)}
                                    activeOpacity={0.9}
                                    style={[
                                        styles.notificationCard,
                                        !n.read && styles.unreadNotificationCard
                                    ]}
                                >
                                    <View style={[styles.cardIconBox, { backgroundColor: meta.bg }]}>
                                        <Ionicons name={meta.icon} size={20} color={meta.color} />
                                    </View>

                                    <View style={styles.cardMainContent}>
                                        <View style={styles.cardRow}>
                                            <Text style={[styles.typeLabel, { color: meta.color }]}>{meta.label}</Text>
                                            <Text style={styles.timeLabel}>{n.time}</Text>
                                        </View>

                                        <Text style={[styles.cardTitleText, !n.read && styles.unreadTitleText]}>
                                            {n.title}
                                        </Text>
                                        <Text style={styles.cardMessageText} numberOfLines={3}>
                                            {n.message}
                                        </Text>

                                        {!n.read && (
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    // Header Style
    header: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.22,
        shadowRadius: 15,
        elevation: 12,
        zIndex: 100,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        height: 64,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 21,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: -0.5,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: "center",
    },
    headerActionBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: "rgba(255,255,255,0.15)",
        alignItems: "center",
        justifyContent: "center",
    },

    // Filter Strip Style
    filterStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    filterPills: {
        flexDirection: 'row',
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    unreadMiniBadge: {
        backgroundColor: "#FCD34D",
        borderRadius: 6,
        paddingHorizontal: 5,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadMiniBadgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#92400E',
    },
    markAllLink: {
        paddingVertical: 4,
    },
    markAllText: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.primary,
    },
    clearAllLink: {
        paddingVertical: 4,
    },
    clearAllText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#94A3B8",
    },

    content: {
        flex: 1,
    },

    // Empty state
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
        fontWeight: '800',
        fontSize: 14,
    },

    // Swipeable
    swipeContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    deleteAction: {
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        height: '100%',
        borderRadius: 20,
        marginLeft: 10,
    },
    deleteActionInner: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Notification Card
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
    cardMainContent: {
        flex: 1,
    },
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
        fontWeight: '500',
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
        alignSelf: 'flex-start',
        marginTop: 8,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    newBadgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
    },
});
