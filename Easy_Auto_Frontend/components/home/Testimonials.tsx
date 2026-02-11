import { TESTIMONIALS } from "@/constants/dummydata/homedummydata";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

interface TestimonialsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const Testimonials: React.FC<TestimonialsProps> = ({ fadeAnim, slideAnim }) => {

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>What Our Users Say</Text>
                    <Text style={styles.subtitle}>Trusted by thousands of happy customers</Text>
                </View>
                <TouchableOpacity style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 16}
            >
                {TESTIMONIALS.map((testimonial, index) => (
                    <View
                        key={`testimonial-${index}`}
                        style={styles.card}
                    >
                        <View style={styles.cardHeader}>
                            <View style={styles.userInfo}>
                                <View style={styles.avatarContainer}>
                                    <Text style={styles.avatar}>{testimonial.avatar}</Text>
                                </View>
                                <View>
                                    <Text style={styles.userName}>{testimonial.name}</Text>
                                    <View style={styles.ratingRow}>
                                        {[...Array(5)].map((_, i) => (
                                            <MaterialIcons
                                                key={`star-${i}`}
                                                name="star"
                                                size={14}
                                                color={i < testimonial.rating ? "#FFD700" : COLORS.border}
                                            />
                                        ))}
                                        <Text style={styles.dateText}>{testimonial.date}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.quoteIconContainer}>
                                <MaterialIcons name="format-quote" size={24} color={COLORS.primary} style={{ opacity: 0.2 }} />
                            </View>
                        </View>
                        
                        <Text style={styles.quoteText}>
                            "{testimonial.quote}"
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 40,
        paddingVertical: 16,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    viewAllText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "600",
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 16,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    avatar: {
        fontSize: 24,
    },
    userName: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dateText: {
        fontSize: 11,
        color: COLORS.text.muted,
        marginLeft: 8,
    },
    quoteIconContainer: {
        // Optional styling for quote icon container
    },
    quoteText: {
        fontSize: 15,
        color: COLORS.text.secondary,
        lineHeight: 24,
        fontStyle: "italic",
    },
});

export default Testimonials;
