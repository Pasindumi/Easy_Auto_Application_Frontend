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

const { width } = Dimensions.get("window");

interface TestimonialsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const Testimonials: React.FC<TestimonialsProps> = ({ fadeAnim, slideAnim }) => {

    return (
        <Animated.View
            style={[
                styles.sectionWhite,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitleNoMargin}>What Our Users Say</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllLink}>See all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {TESTIMONIALS.map((testimonial, index) => (
                    <TouchableOpacity
                        key={`testimonial-${index}`}
                        style={styles.testimonialCard}
                    >
                        <View style={styles.testimonialHeader}>
                            <View style={styles.avatarContainer}>
                                <Text style={styles.avatar}>{testimonial.avatar}</Text>
                            </View>
                            <View style={styles.testimonialInfo}>
                                <View style={styles.testimonialNameRow}>
                                    <Text style={styles.testimonialName}>
                                        {testimonial.name}
                                    </Text>
                                    <Text style={styles.testimonialDate}>
                                        {testimonial.date}
                                    </Text>
                                </View>
                                <View style={styles.ratingContainer}>
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <MaterialIcons
                                            key={`testimonial-${index}-star-${i}`}
                                            name="star"
                                            size={16}
                                            color="#FFD700"
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                        <Text style={styles.testimonialQuote}>
                            {'"'}
                            {testimonial.quote}
                            {'"'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sectionWhite: {
        paddingHorizontal: 0,
        paddingVertical: 24,
        paddingBottom: 32,
        backgroundColor: "#FFFFFF",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitleNoMargin: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.4,
    },
    seeAllLink: {
        fontSize: 14,
        color: "#235CF8",
        fontWeight: "600",
    },
    horizontalScroll: {
        paddingHorizontal: 20,
    },
    testimonialCard: {
        width: width * 0.85,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 24,
        marginRight: 16,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    testimonialHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2.5,
        borderColor: "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        fontSize: 28,
    },
    testimonialInfo: {
        flex: 1,
        gap: 8,
    },
    testimonialNameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    testimonialName: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1F2937",
        letterSpacing: -0.3,
    },
    testimonialDate: {
        fontSize: 12,
        color: "#9CA3AF",
        fontWeight: "500",
    },
    ratingContainer: {
        flexDirection: "row",
        gap: 3,
    },
    testimonialQuote: {
        fontSize: 15,
        color: "#4B5563",
        lineHeight: 24,
        fontWeight: "400",
        letterSpacing: -0.1,
        fontStyle: "italic",
    },
});

export default Testimonials;
