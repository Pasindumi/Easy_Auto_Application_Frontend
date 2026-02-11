import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
}) => (
    <View style={styles.emptyStateContainer}>
        <View style={styles.emptyIconCircle}>
            <Ionicons name={icon as any} size={48} color={COLORS.text.muted} />
        </View>
        <Text style={styles.emptyStateTitle}>{title}</Text>
        <Text style={styles.emptyStateMessage}>{message}</Text>
        {actionText && onAction && (
            <TouchableOpacity style={styles.emptyStateButton} onPress={onAction}>
                <Text style={styles.emptyStateButtonText}>{actionText}</Text>
            </TouchableOpacity>
        )}
    </View>
);

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
                    backgroundColor: COLORS.border,
                    borderRadius: 12,
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

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.backToTopContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={styles.backToTopButton}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Ionicons name="chevron-up" size={24} color={COLORS.white} />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        marginBottom: 8,
        textAlign: "center",
        letterSpacing: -0.5,
    },
    emptyStateMessage: {
        fontSize: 14,
        color: COLORS.text.muted,
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
    emptyStateButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: COLORS.primary,
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
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
});
