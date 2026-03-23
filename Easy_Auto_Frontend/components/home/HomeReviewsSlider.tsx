import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import api from "@/utils/api";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const CARD_W = width * 0.76;

interface Review {
    id: string;
    rating: number;
    comment: string;
    user: { name: string };
}

const HomeReviewsSlider = () => {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTopReviews();
    }, []);

    const fetchTopReviews = async () => {
        try {
            const response: any = await api.get("/api/app-reviews?rating=5");
            if (response.success) {
                setReviews(response.data.slice(0, 6));
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || reviews.length === 0) return null;

    const renderItem = ({ item }: { item: Review }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={12} color="#F59E0B" />
                    ))}
                </View>
                <View style={styles.quotePill}>
                    <Ionicons name="chatbubble-ellipses" size={14} color={COLORS.primary} />
                </View>
            </View>

            <Text style={styles.comment} numberOfLines={4}>
                "{item.comment}"
            </Text>

            <View style={styles.cardFooter}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {item.user?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                </View>
                <View>
                    <Text style={styles.userName}>{item.user?.name || "Happy User"}</Text>
                    <Text style={styles.userMeta}>Verified Buyer</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionHeader
                title="⭐ User Testimonials"
                subtitle="What our community says about us"
                onViewAll={() => router.push("/testimonials" as any)}
            />

            <View style={styles.summaryBox}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryMain}>4.9</Text>
                    <Text style={styles.summarySub}>Rating</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryMain}>2.5k</Text>
                    <Text style={styles.summarySub}>Reviews</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryMain}>98%</Text>
                    <Text style={styles.summarySub}>Success</Text>
                </View>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_W + 16}
                decelerationRate="fast"
                contentContainerStyle={styles.list}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF", paddingBottom: 24, paddingTop: 10 },
    summaryBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 18,
        borderRadius: 24,
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: "#F0F4FF",
    },
    summaryItem: { flex: 1, alignItems: "center" },
    summaryDivider: { width: 1, height: 24, backgroundColor: "#E2E8F0" },
    summaryMain: { fontSize: 20, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5 },
    summarySub: { fontSize: 11, color: "#94A3B8", fontWeight: "600", marginTop: 2 },
    list: { paddingHorizontal: 20, gap: 16 },
    card: {
        width: CARD_W,
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    starsRow: { flexDirection: "row", gap: 3 },
    quotePill: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#EEF3FF",
        alignItems: "center",
        justifyContent: "center",
    },
    comment: {
        fontSize: 14,
        color: "#475569",
        lineHeight: 22,
        fontWeight: "500",
        fontStyle: "italic",
        marginBottom: 18,
    },
    cardFooter: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#fff",
    },
    avatarText: { color: COLORS.primary, fontWeight: "800", fontSize: 16 },
    userName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
    userMeta: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
});

export default HomeReviewsSlider;
