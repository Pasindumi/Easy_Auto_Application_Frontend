import { MaterialIcons } from "@expo/vector-icons";
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
        <MaterialIcons name={icon as any} size={64} color="#D1D5DB" />
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
    width: number;
    height: number;
    style?: any;
}) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 8,
                    opacity,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    emptyStateContainer: {
        paddingVertical: 60,
        paddingHorizontal: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginTop: 16,
        marginBottom: 8,
        textAlign: "center",
    },
    emptyStateMessage: {
        fontSize: 14,
        color: "#6B7280",
        textAlign: "center",
        lineHeight: 20,
        marginBottom: 24,
    },
    emptyStateButton: {
        backgroundColor: "#235CF8",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyStateButtonText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    // Back to Top Button
    backToTopButton: {
        position: "absolute",
        bottom: 100,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#235CF8",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
    },
});

// Back to Top Button
export const BackToTop = ({
    visible,
    onPress,
}: {
    visible: boolean;
    onPress: () => void;
}) => {
    if (!visible) return null;

    return (
        <TouchableOpacity
            style={styles.backToTopButton}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <MaterialIcons name="keyboard-arrow-up" size={28} color="#FFFFFF" />
        </TouchableOpacity>
    );
};
