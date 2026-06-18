import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import api from "@/utils/api";
import SectionHeader from "./SectionHeader";
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

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

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    if (loading || reviews.length === 0) return null;

    const renderItem = ({ item }: { item: Review }) => (
        <View style={themeStyles.card}>
            <View style={themeStyles.cardHeader}>
                <View style={themeStyles.starsRow}>
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons key={s} name="star" size={12} color="#F59E0B" />
                    ))}
                </View>
                <View style={themeStyles.quotePill}>
                    <Ionicons name="chatbubble-ellipses" size={14} color={colors.primary} />
                </View>
            </View>

            <Text style={themeStyles.comment} numberOfLines={4}>
                "{item.comment}"
            </Text>

            <View style={themeStyles.cardFooter}>
                <View style={themeStyles.avatar}>
                    <Text style={themeStyles.avatarText}>
                        {item.user?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                </View>
                <View>
                    <Text style={themeStyles.userName}>{item.user?.name || "Happy User"}</Text>
                    <Text style={themeStyles.userMeta}>Verified Buyer</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={themeStyles.container}>
            <SectionHeader
                title="⭐ User Testimonials"
                subtitle="What our community says about us"
                onViewAll={() => router.push("/testimonials" as any)}
            />

            <View style={themeStyles.summaryBox}>
                <View style={themeStyles.summaryItem}>
                    <Text style={themeStyles.summaryMain}>4.9</Text>
                    <Text style={themeStyles.summarySub}>Rating</Text>
                </View>
                <View style={themeStyles.summaryDivider} />
                <View style={themeStyles.summaryItem}>
                    <Text style={themeStyles.summaryMain}>2.5k</Text>
                    <Text style={themeStyles.summarySub}>Reviews</Text>
                </View>
                <View style={themeStyles.summaryDivider} />
                <View style={themeStyles.summaryItem}>
                    <Text style={themeStyles.summaryMain}>98%</Text>
                    <Text style={themeStyles.summarySub}>Success</Text>
                </View>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_W + 16}
                decelerationRate="fast"
                contentContainerStyle={themeStyles.list}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: { backgroundColor: isDarkMode ? colors.background : "#F8FAFF", paddingBottom: 24, paddingTop: 10 },
    summaryBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.backgroundSecondary,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingVertical: 18,
        borderRadius: 5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 4,
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#F0F4FF",
    },
    summaryItem: { flex: 1, alignItems: "center" },
    summaryDivider: { width: 1, height: 24, backgroundColor: isDarkMode ? colors.border : "#E2E8F0" },
    summaryMain: { fontSize: 20, fontWeight: "800", color: colors.text.primary, letterSpacing: -0.5 },
    summarySub: { fontSize: 11, color: colors.text.muted, fontWeight: "600", marginTop: 2 },
    list: { paddingHorizontal: 20, gap: 16 },
    card: {
        width: CARD_W,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 5,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#F1F5F9",
    },
    cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    starsRow: { flexDirection: "row", gap: 3 },
    quotePill: {
        width: 32,
        height: 32,
        borderRadius: 5,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.05)" : "#EEF3FF",
        alignItems: "center",
        justifyContent: "center",
    },
    comment: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 22,
        fontWeight: "500",
        fontStyle: "italic",
        marginBottom: 18,
    },
    cardFooter: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 5,
        backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: isDarkMode ? colors.border : "#fff",
    },
    avatarText: { color: colors.primary, fontWeight: "800", fontSize: 16 },
    userName: { fontSize: 15, fontWeight: "700", color: colors.text.primary },
    userMeta: { fontSize: 11, color: colors.text.muted, fontWeight: "600" },
});

export default HomeReviewsSlider;
