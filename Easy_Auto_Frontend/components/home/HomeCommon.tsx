import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useMemo } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

// Animated Button Component
export const AnimatedButton = ({
    children,
    delay = 0,
}: {
    children: React.ReactNode;
    delay?: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
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

    return (
        <Animated.View
            style={{
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
            }}
        >
            {children}
        </Animated.View>
    );
};

// Empty State Component
export const EmptyState = ({
    icon,
    title,
    message,
    actionText,
    onAction,
}: {
    icon: string;
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
}) => {
    const { colors, isDarkMode } = useTheme();
    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <View style={themeStyles.emptyStateContainer}>
            <View style={themeStyles.emptyIconCircle}>
                <Ionicons name={icon as any} size={48} color={colors.text.muted} />
            </View>
            <Text style={themeStyles.emptyStateTitle}>{title}</Text>
            <Text style={themeStyles.emptyStateMessage}>{message}</Text>
            {actionText && onAction && (
                <TouchableOpacity style={themeStyles.emptyStateButton} onPress={onAction}>
                    <Text style={themeStyles.emptyStateButtonText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Skeleton Loader Component
export const SkeletonLoader = ({
    width,
    height,
    style,
}: {
    width: any;
    height: any;
    style?: any;
}) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const { colors } = useTheme();

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.6],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: colors.border,
                    borderRadius: 10,
                    opacity,
                },
                style,
            ]}
        />
    );
};

// Back to Top Button
export const BackToTop = ({
    visible,
    onPress,
}: {
    visible: boolean;
    onPress: () => void;
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { colors, isDarkMode } = useTheme();
    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[themeStyles.backToTopContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={themeStyles.backToTopButton}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Ionicons name="chevron-up" size={24} color={COLORS.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    emptyStateContainer: {
        paddingVertical: 60,
        paddingHorizontal: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: colors.text.primary,
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    emptyStateMessage: {
        fontSize: 14,
        color: colors.text.muted,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
    emptyStateButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 10,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    emptyStateButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.white,
    },
    backToTopContainer: {
        position: "absolute",
        bottom: 100,
        right: 20,
        zIndex: 1000,
    },
    backToTopButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: colors.white,
    },
});

