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
import Header from "@/components/Header";

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

            <Header title="My Wishlist" />

            {/* Sub-Header: Item Count */}
            {items.length > 0 && (
                <View style={styles.subHeader}>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{items.length} {items.length === 1 ? 'Item' : 'Items'} Saved</Text>
                    </View>
                </View>
            )}

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
    subHeader: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    countBadge: {
        backgroundColor: "rgba(35, 92, 248, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: "rgba(35, 92, 248, 0.12)",
    },
    countText: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: "800",
        textTransform: 'uppercase',
        letterSpacing: 0.5,
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
