import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

interface ActionGridProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    compareCount: number;
    newListingsCount: number;
}

// Pressable Action Button with Glassmorphism
const GlassmorphismButton = ({
    children,
    onPress,
    delay = 0,
}: {
    children: React.ReactNode;
    onPress?: () => void;
    delay?: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 400,
                delay,
                easing: Easing.out(Easing.back(1.1)),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 400,
                delay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay, scaleAnim, opacityAnim]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    return (
        <Animated.View
            style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                {children}
            </TouchableOpacity>
        </Animated.View>
    );
};

const ActionGrid: React.FC<ActionGridProps> = ({
    fadeAnim,
    slideAnim,
    compareCount,
    newListingsCount,
}) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    return (
        <Animated.View
            style={[
                styles.actionGridContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollableActionContainer}
                style={styles.scrollableActionScrollView}
            >
                <GlassmorphismButton
                    delay={100}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/cars/buy-car");
                    }}
                >
                    <View style={styles.scrollableActionCard}>
                        <View
                            style={[
                                styles.colorfulIconContainer,
                                { backgroundColor: "#E3F2FD" },
                            ]}
                        >
                            <MaterialIcons name="directions-car" size={32} color="#1976D2" />
                        </View>
                        <Text style={styles.scrollableActionLabel}>Buy a Car</Text>
                        <Text style={styles.scrollableActionDescription}>
                            Find your perfect car
                        </Text>
                    </View>
                </GlassmorphismButton>

                <GlassmorphismButton
                    delay={150}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        if (isAuthenticated) {
                            router.push("/cars/select-type");
                        } else {
                            router.push("/cars/select-type"); // Guard in the page will handle it
                        }
                    }}
                >
                    <View style={styles.scrollableActionCard}>
                        <View
                            style={[
                                styles.colorfulIconContainer,
                                { backgroundColor: "#FFF3E0" },
                            ]}
                        >
                            <MaterialIcons name="sell" size={32} color="#F57C00" />
                        </View>
                        <Text style={styles.scrollableActionLabel}>Sell Vehicle</Text>
                        <Text style={styles.scrollableActionDescription}>
                            Get instant quotes
                        </Text>
                    </View>
                </GlassmorphismButton>

                <GlassmorphismButton
                    delay={200}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/cars/rent-car");
                    }}
                >
                    <View style={styles.scrollableActionCard}>
                        <View
                            style={[
                                styles.colorfulIconContainer,
                                { backgroundColor: "#E8F5E9" },
                            ]}
                        >
                            <MaterialIcons name="vpn-key" size={32} color="#388E3C" />
                        </View>
                        <Text style={styles.scrollableActionLabel}>Rent a Car</Text>
                        <Text style={styles.scrollableActionDescription}>
                            Daily & monthly rates
                        </Text>
                    </View>
                </GlassmorphismButton>

                <GlassmorphismButton
                    delay={250}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/(tabs)/compare");
                    }}
                >
                    <View style={styles.scrollableActionCard}>
                        <View style={styles.actionCardHeader}>
                            <View
                                style={[
                                    styles.colorfulIconContainer,
                                    { backgroundColor: "#F3E5F5" },
                                ]}
                            >
                                <MaterialIcons name="compare-arrows" size={32} color="#7B1FA2" />
                            </View>
                            {compareCount > 0 && (
                                <View style={styles.actionBadge}>
                                    <Text style={styles.actionBadgeText}>
                                        {compareCount > 9 ? "9+" : compareCount}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.scrollableActionLabel}>Compare</Text>
                        <Text style={styles.scrollableActionDescription}>Side by side</Text>
                    </View>
                </GlassmorphismButton>

                <GlassmorphismButton
                    delay={300}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push("/find-dealers");
                    }}
                >
                    <View style={styles.scrollableActionCard}>
                        <View
                            style={[
                                styles.colorfulIconContainer,
                                { backgroundColor: "#FFEBEE" },
                            ]}
                        >
                            <MaterialIcons name="store" size={32} color="#C62828" />
                        </View>
                        <Text style={styles.scrollableActionLabel}>Find Dealers</Text>
                        <Text style={styles.scrollableActionDescription}>
                            {newListingsCount}+ new listings
                        </Text>
                    </View>
                </GlassmorphismButton>
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    actionGridContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 32,
        marginBottom: 0,
        backgroundColor: "#FFFFFF",
    },
    scrollableActionScrollView: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    scrollableActionContainer: {
        flexDirection: "row",
        gap: 10,
        paddingRight: 20,
        paddingBottom: 20,
    },
    scrollableActionCard: {
        width: 100,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    colorfulIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    scrollableActionLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
    },
    scrollableActionDescription: {
        fontSize: 10,
        color: "#6B7280",
        fontWeight: "400",
        textAlign: "center",
        marginTop: 2,
    },
    actionCardHeader: {
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
    },
    actionBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#FF4444",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    actionBadgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: "700",
    },
});

export default ActionGrid;
