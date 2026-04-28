import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
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
            icon: "car-sport",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
            route: "/cars/buy-car",
        },
        {
            label: "Sell Vehicle",
            icon: "cash-outline",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
            onPress: () => {
                if (isAuthenticated) {
                    router.push("/cars/select-type");
                } else {
                    router.push("/cars/select-type");
                }
            }
        },
        {
            label: "Rentals",
            icon: "key-outline",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
            route: "/cars/rent-car",
        },
        {
            label: "Compare",
            icon: "git-compare-outline",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
            route: "/(tabs)/compare",
            badge: compareCount > 0 ? (compareCount > 9 ? "9+" : compareCount) : null,
            badgeColor: COLORS.status.danger
        },
        {
            label: "Dealers",
            icon: "storefront-outline",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
            route: "/find-dealers",
        },
        {
            label: "Packages",
            icon: "rocket-outline",
            iconFamily: Ionicons,
            colors: ["#60A5FA", "#2563EB"], // Blue Gradient
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
                                colors={action.colors as [string, string]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.iconGradient}
                            >
                                <action.iconFamily name={action.icon as any} size={26} color="#FFFFFF" />
                                {action.badge && (
                                    <View style={[styles.badge, { backgroundColor: action.badgeColor }]}>
                                        <Text style={styles.badgeText}>{action.badge}</Text>
                                    </View>
                                )}
                            </LinearGradient>

                            <Text style={styles.label}>{action.label}</Text>
                        </View>
                    </ActionCard>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        backgroundColor: "transparent",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
        paddingVertical: 10,
        justifyContent: 'space-between',
        rowGap: 16,
    },
    cardContainer: {
        width: (Dimensions.get("window").width - 32 - 24) / 3, // 3 columns, 16px horizontal padding, 12px gap
        backgroundColor: "#FFFFFF",
        borderRadius: 5,
        paddingVertical: 16,
        paddingHorizontal: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },
    cardContent: {
        alignItems: "center",
        justifyContent: "flex-start",
    },
    iconGradient: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#1E293B",
        textAlign: 'center',
        letterSpacing: -0.2,
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        height: 22,
        minWidth: 22,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: '900',
    },
});

export default ActionGrid;
