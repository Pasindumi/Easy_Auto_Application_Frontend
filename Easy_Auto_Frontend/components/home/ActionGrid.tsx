import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import COLORS from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

interface ActionGridProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
    compareCount: number;
    newListingsCount: number;
}

// Modern Pressable Card
const ActionCard = ({
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
                duration: 500,
                delay,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 500,
                delay,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }),
        ]).start();
    }, [delay]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
            useNativeDriver: true,
            tension: 400,
            friction: 12,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 400,
            friction: 12,
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
                style={styles.cardContainer}
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

    const actions = [
        {
            label: "Buy Vehicle",
            desc: "Find your dream ride",
            icon: "car-sport",
            iconFamily: Ionicons,
            color: "#235CF8",
            bgColor: "#EEF3FF",
            route: "/cars/buy-car",
        },
        {
            label: "Sell Vehicle",
            desc: "Get instant quotes",
            icon: "cash-outline",
            iconFamily: Ionicons,
            color: "#059669",
            bgColor: "#ECFDF5",
            onPress: () => {
                if (isAuthenticated) {
                    router.push("/cars/select-type");
                } else {
                    router.push("/cars/select-type"); // Protected route handles redirect
                }
            }
        },
        {
            label: "Rentals",
            desc: "Flexible options",
            icon: "key-outline",
            iconFamily: Ionicons,
            color: "#D97706",
            bgColor: "#FFFBEB",
            route: "/cars/rent-car",
        },
        {
            label: "Compare",
            desc: "Side by side",
            icon: "git-compare-outline",
            iconFamily: Ionicons,
            color: "#7C3AED",
            bgColor: "#F5F3FF",
            route: "/(tabs)/compare",
            badge: compareCount > 0 ? (compareCount > 9 ? "9+" : compareCount) : null,
            badgeColor: COLORS.status.danger
        },
        {
            label: "Dealers",
            desc: `${newListingsCount}+ Listings`,
            icon: "storefront-outline",
            iconFamily: Ionicons,
            color: "#DC2626",
            bgColor: "#FEF2F2",
            route: "/find-dealers",
        },
        {
            label: "Packages",
            desc: "Boost ads",
            icon: "rocket-outline",
            iconFamily: Ionicons,
            color: "#0891B2",
            bgColor: "#ECFEFF",
            route: "/packages/packages",
        },
    ];

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
            <View style={styles.grid}>
                {actions.map((action, index) => (
                    <ActionCard
                        key={index}
                        delay={100 + index * 50}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            if (action.onPress) {
                                action.onPress();
                            } else if (action.route) {
                                router.push(action.route as any);
                            }
                        }}
                    >
                        <View style={styles.cardContent}>
                            <LinearGradient
                                colors={[action.bgColor, action.bgColor + 'CC']}
                                style={styles.iconBox}
                            >
                                <action.iconFamily name={action.icon as any} size={26} color={action.color} />
                            </LinearGradient>

                            {action.badge && (
                                <View style={[styles.badge, { backgroundColor: action.badgeColor }]}>
                                    <Text style={styles.badgeText}>{action.badge}</Text>
                                </View>
                            )}

                            <Text style={styles.label}>{action.label}</Text>
                            <Text style={styles.desc} numberOfLines={1}>{action.desc}</Text>
                        </View>
                    </ActionCard>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
        backgroundColor: COLORS.white,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
        gap: 10,
    },
    cardContainer: {
        width: (Dimensions.get("window").width - 32 - 20) / 3, // Perfect 3-column width
        height: 120,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    cardContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.text.primary,
        marginBottom: 2,
        textAlign: 'center',
    },
    desc: {
        fontSize: 9,
        color: COLORS.text.muted,
        textAlign: 'center',
        lineHeight: 11,
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        height: 16,
        minWidth: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 8,
        fontWeight: 'bold',
    },
});

export default ActionGrid;
