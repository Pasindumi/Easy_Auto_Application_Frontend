import COLORS from "@/constants/Colors";
import { api } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Swipeable } from "react-native-gesture-handler";

export default function WishlistScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            if (!refreshing) setLoading(true);
            const res = await api.get<{ success: boolean; data: any[] }>("/api/favorites");
            if (res.success) setItems(res.data);
        } catch { /* silent */ }
        finally { 
            setLoading(false); 
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchWishlist();
    };

    const removeItem = async (id: number) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        try {
            // Optimistic update
            const originalItems = [...items];
            setItems((prev) => prev.filter((i) => i.id !== id));

            const res = await api.post<{ success: boolean; isFavorite: boolean }>("/api/favorites/toggle", { ad_id: id });
            if (!res.success || res.isFavorite) {
                setItems(originalItems);
                Alert.alert("Error", "Could not remove item. Please try again.");
            }
        } catch {
            Alert.alert("Error", "Something went wrong.");
        }
    };

    const viewCar = (id: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/cars/${id}` as any);
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(price);

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
                onPress={() => removeItem(id)}
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

            {/* ── Professional Header (Home Match) ── */}
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
                         <Text style={styles.headerTitle}>My Wishlist</Text>
                    </View>

                    <View style={styles.headerRightPlaceholder} />
                </View>

                {/* Subtitle & Count */}
                <View style={styles.headerInfo}>
                    <View />
                    {items.length > 0 && (
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{items.length} {items.length === 1 ? 'Item' : 'Items'}</Text>
                        </View>
                    )}
                </View>
            </View>

            {loading && !refreshing ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingTop: 20, paddingBottom: insets.bottom + 40 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                >
                    {items.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconCircle}>
                                <Ionicons name="heart-dislike-outline" size={56} color="#CBD5E1" />
                            </View>
                            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                            <Text style={styles.emptyText}>Tap the heart on any car listing to save it here for quick access.</Text>
                            <TouchableOpacity 
                                style={styles.exploreBtn} 
                                onPress={() => router.replace("/(tabs)/search")}
                            >
                                 <Text style={styles.exploreBtnText}>Explore Cars</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        items.map((item) => {
                            const img = item.AdImage?.find((i: any) => i.is_main)?.image_url || item.AdImage?.[0]?.image_url;
                            const details = item.CarDetails?.[0] || item.CarDetails || {};
                            return (
                                <Swipeable
                                    key={item.id}
                                    renderRightActions={(p, d) => renderRightActions(p, d, item.id)}
                                    overshootRight={false}
                                    containerStyle={styles.swipeContainer}
                                >
                                    <TouchableOpacity
                                        onPress={() => viewCar(item.id)}
                                        activeOpacity={0.9}
                                        style={styles.wishlistCard}
                                    >
                                        <View style={styles.imageContainer}>
                                            {img ? (
                                                <Image source={{ uri: img }} style={styles.cardImage} contentFit="cover" />
                                            ) : (
                                                <View style={styles.placeholderImg}>
                                                    <Ionicons name="car-outline" size={24} color="#CBD5E1" />
                                                </View>
                                            )}
                                        </View>

                                        <View style={styles.cardContent}>
                                            <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>
                                            <Text style={styles.carPrice}>{formatPrice(item.price)}</Text>
                                            
                                            <View style={styles.specsRow}>
                                                <View style={styles.specItem}>
                                                    <Ionicons name="speedometer-outline" size={12} color="#64748B" />
                                                    <Text style={styles.specText}>{details.mileage ? `${Number(details.mileage).toLocaleString()} km` : "—"}</Text>
                                                </View>
                                                <View style={styles.specDivider} />
                                                <View style={styles.specItem}>
                                                    <Ionicons name="location-outline" size={12} color="#64748B" />
                                                    <Text style={styles.specText}>{item.location || "N/A"}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.chevronIcon}>
                                             <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                                        </View>
                                    </TouchableOpacity>
                                </Swipeable>
                            );
                        })
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFDFD",
    },
    // Header Style
    header: {
        backgroundColor: COLORS.primary,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 25,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 18,
        elevation: 12,
        zIndex: 100,
    },
    headerTop: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        height: 56,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#FFFFFF",
        letterSpacing: -0.4,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: "center",
    },
    headerRightPlaceholder: {
        width: 44,
    },
    headerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    headerSub: {
        fontSize: 14,
        color: "rgba(255,255,255,0.75)",
        fontWeight: '600',
    },
    countBadge: {
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "800",
    },

    content: {
        flex: 1,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Empty state
    emptyContainer: {
        marginTop: 80,
        alignItems: "center",
        paddingHorizontal: 45,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#F1F5F9",
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
    exploreBtn: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 30,
        paddingVertical: 14,
        borderRadius: 18,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    exploreBtnText: {
        color: "#FFFFFF",
        fontWeight: '800',
        fontSize: 15,
    },

    // Cards
    swipeContainer: {
        paddingHorizontal: 16,
        marginBottom: 14,
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
    wishlistCard: {
        flexDirection: "row",
        padding: 12,
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    imageContainer: {
        width: 90,
        height: 90,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    placeholderImg: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    carTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1E293B",
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    carPrice: {
        fontSize: 15,
        fontWeight: "800",
        color: COLORS.primary,
        marginBottom: 8,
    },
    specsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    specItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    specDivider: {
        width: 1,
        height: 10,
        backgroundColor: '#E2E8F0',
        marginHorizontal: 8,
    },
    specText: {
        fontSize: 11,
        color: "#64748B",
        fontWeight: '500',
    },
    chevronIcon: {
        justifyContent: 'center',
        paddingLeft: 5,
    },
});
