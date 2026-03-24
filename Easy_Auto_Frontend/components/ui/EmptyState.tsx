import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    ctaLabel?: string;
    onCta?: () => void;
    compact?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = "car-outline",
    title,
    subtitle,
    ctaLabel,
    onCta,
    compact = false,
}) => {
    return (
        <View style={[styles.container, compact && styles.compact]}>
            {/* Soft glowing icon container */}
            <View style={styles.iconOuter}>
                <LinearGradient
                    colors={[COLORS.primaryLight, "#E0E7FF"]}
                    style={styles.iconCircle}
                >
                    <Ionicons name={icon} size={compact ? 36 : 52} color={COLORS.primary} />
                </LinearGradient>
            </View>

            <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>

            {subtitle ? (
                <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>
                    {subtitle}
                </Text>
            ) : null}

            {ctaLabel && onCta ? (
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onCta();
                    }}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={[COLORS.primary, "#1E40AF"]}
                        style={styles.ctaGrad}
                    >
                        <Text style={styles.ctaText}>{ctaLabel}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 60,
        paddingHorizontal: 32,
    },
    compact: {
        paddingVertical: 30,
    },
    iconOuter: {
        marginBottom: 20,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 19,
        fontWeight: "800",
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: 8,
        letterSpacing: -0.3,
    },
    titleCompact: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.text.muted,
        textAlign: "center",
        lineHeight: 21,
        fontWeight: "500",
        marginBottom: 24,
    },
    subtitleCompact: {
        fontSize: 13,
        marginBottom: 16,
    },
    ctaBtn: {
        borderRadius: 16,
        overflow: "hidden",
        marginTop: 4,
    },
    ctaGrad: {
        paddingHorizontal: 28,
        paddingVertical: 13,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    ctaText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
});

export default EmptyState;
