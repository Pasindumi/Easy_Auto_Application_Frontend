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
            icon: "car-sport",
            iconFamily: Ionicons,
            color: "#2563EB",
            bgColor: "#F1F5F9",
            route: "/cars/buy-car",
        },
        {
            label: "Sell Vehicle",
            icon: "cash-outline",
            iconFamily: Ionicons,
            color: "#2563EB",
            bgColor: "#F1F5F9",
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
            color: "#2563EB",
            bgColor: "#F1F5F9",
            route: "/cars/rent-car",
        },
        {
            label: "Compare",
            icon: "git-compare-outline",
            iconFamily: Ionicons,
            color: "#2563EB",
            bgColor: "#F1F5F9",
            route: "/(tabs)/compare",
            badge: compareCount > 0 ? (compareCount > 9 ? "9+" : compareCount) : null,
            badgeColor: COLORS.status.danger
        },
        {
            label: "Dealers",
            icon: "storefront-outline",
            iconFamily: Ionicons,
            color: "#2563EB",
            bgColor: "#F1F5F9",
            route: "/find-dealers",
        },
        {
            label: "Packages",
            icon: "rocket-outline",
            iconFamily: Ionicons,
            color: "#2563EB",
            bgColor: "#F1F5F9",
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
                            <View style={[styles.iconBox, { backgroundColor: action.bgColor }]}>
                                <action.iconFamily name={action.icon as any} size={28} color={action.color} />
                                {action.badge && (
                                    <View style={[styles.badge, { backgroundColor: action.badgeColor }]}>
                                        <Text style={styles.badgeText}>{action.badge}</Text>
                                    </View>
                                )}
                            </View>

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
        marginBottom: 8,
        backgroundColor: "transparent",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 24,
        paddingVertical: 20,
        justifyContent: 'space-between',
        gap: 20,
    },
    cardContainer: {
        width: (Dimensions.get("window").width - 48 - 40) / 3, // 3 columns
        backgroundColor: "transparent",
    },
    cardContent: {
        alignItems: "center",
        justifyContent: "flex-start",
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "500",
        color: "#334155",
        textAlign: 'center',
    },
    badge: {
        position: 'absolute',
        top: -6,
        right: -6,
        height: 20,
        minWidth: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default ActionGrid;
