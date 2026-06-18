import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useMemo } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

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
    themeStyles,
}: {
    children: React.ReactNode;
    onPress?: () => void;
    delay?: number;
    themeStyles: any;
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
                style={themeStyles.cardContainer}
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
    const { colors, isDarkMode } = useTheme();

    const actions = [
        {
            label: "Buy Vehicle",
            icon: "car-sport",
            iconFamily: Ionicons,
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
            route: "/cars/buy-car",
        },
        {
            label: "Sell Vehicle",
            icon: "cash-outline",
            iconFamily: Ionicons,
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
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
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
            route: "/cars/rent-car",
        },
        {
            label: "Compare",
            icon: "git-compare-outline",
            iconFamily: Ionicons,
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
            route: "/(tabs)/compare",
            badge: compareCount > 0 ? (compareCount > 9 ? "9+" : compareCount) : null,
            badgeColor: colors.status.danger
        },
        {
            label: "Dealers",
            icon: "storefront-outline",
            iconFamily: Ionicons,
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
            route: "/find-dealers",
        },
        {
            label: "Packages",
            icon: "rocket-outline",
            iconFamily: Ionicons,
            gradientColors: isDarkMode ? [colors.primary, '#1E40AF' as any] : ["#60A5FA", "#2563EB"],
            route: "/packages/packages",
        },
    ];

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View
            style={[
                themeStyles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={themeStyles.grid}>
                {actions.map((action, index) => (
                    <ActionCard
                        key={index}
                        delay={100 + index * 50}
                        themeStyles={themeStyles}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            if (action.onPress) {
                                action.onPress();
                            } else if (action.route) {
                                router.push(action.route as any);
                            }
                        }}
                    >
                        <View style={themeStyles.cardContent}>
                            <LinearGradient
                                colors={action.gradientColors as [string, string]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={themeStyles.iconGradient}
                            >
                                <action.iconFamily name={action.icon as any} size={26} color="#FFFFFF" />
                                {action.badge && (
                                    <View style={[themeStyles.badge, { backgroundColor: action.badgeColor }]}>
                                        <Text style={themeStyles.badgeText}>{action.badge}</Text>
                                    </View>
                                )}
                            </LinearGradient>

                            <Text style={themeStyles.label}>{action.label}</Text>
                        </View>
                    </ActionCard>
                ))}
            </View>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
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
        rowGap: 10,
    },
    cardContainer: {
        width: (Dimensions.get("window").width - 32 - 20) / 3,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 5,
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#BFDBFE",
    },
    cardContent: {
        alignItems: "center",
        justifyContent: "flex-start",
    },
    iconGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.text.primary,
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
        borderColor: isDarkMode ? colors.backgroundSecondary : "#FFFFFF",
    },
    badgeText: {
        color: "#FFFFFF",
        fontSize: 10,
        fontWeight: '900',
    },
});

export default ActionGrid;


