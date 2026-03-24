import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

const ShimmerBox = ({
    style,
    shimmerAnim,
}: {
    style?: any;
    shimmerAnim: Animated.Value;
}) => {
    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.75],
    });

    return (
        <Animated.View
            style={[
                styles.shimmerBase,
                style,
                { opacity },
            ]}
        />
    );
};

interface SkeletonCardProps {
    variant?: "list" | "grid" | "horizontal";
    count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = "list", count = 1 }) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 750,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 750,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const renderListCard = (key: number) => (
        <View key={key} style={styles.listCard}>
            <ShimmerBox style={styles.listImage} shimmerAnim={shimmerAnim} />
            <View style={styles.listContent}>
                <ShimmerBox style={styles.titleLine} shimmerAnim={shimmerAnim} />
                <ShimmerBox style={styles.subtitleLine} shimmerAnim={shimmerAnim} />
                <View style={styles.chipRow}>
                    <ShimmerBox style={styles.chip} shimmerAnim={shimmerAnim} />
                    <ShimmerBox style={styles.chip} shimmerAnim={shimmerAnim} />
                    <ShimmerBox style={styles.chip} shimmerAnim={shimmerAnim} />
                </View>
                <ShimmerBox style={styles.priceLine} shimmerAnim={shimmerAnim} />
            </View>
        </View>
    );

    const renderGridCard = (key: number) => (
        <View key={key} style={styles.gridCard}>
            <ShimmerBox style={styles.gridImage} shimmerAnim={shimmerAnim} />
            <View style={styles.gridContent}>
                <ShimmerBox style={styles.titleLine} shimmerAnim={shimmerAnim} />
                <ShimmerBox style={styles.subtitleLineShort} shimmerAnim={shimmerAnim} />
                <ShimmerBox style={styles.chip} shimmerAnim={shimmerAnim} />
            </View>
        </View>
    );

    const renderHorizontalCard = (key: number) => (
        <View key={key} style={styles.horizontalCard}>
            <ShimmerBox style={styles.horizontalImage} shimmerAnim={shimmerAnim} />
            <View style={styles.horizontalContent}>
                <ShimmerBox style={styles.titleLine} shimmerAnim={shimmerAnim} />
                <ShimmerBox style={styles.subtitleLine} shimmerAnim={shimmerAnim} />
            </View>
        </View>
    );

    return (
        <>
            {Array.from({ length: count }, (_, i) => {
                if (variant === "grid") return renderGridCard(i);
                if (variant === "horizontal") return renderHorizontalCard(i);
                return renderListCard(i);
            })}
        </>
    );
};

const styles = StyleSheet.create({
    shimmerBase: {
        backgroundColor: "#E2E8F0",
        borderRadius: 8,
    },
    // List card
    listCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 20,
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 12,
        gap: 12,
        borderWidth: 1,
        borderColor: "#F1F5F9",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    listImage: {
        width: 130,
        height: 100,
        borderRadius: 14,
        flexShrink: 0,
    },
    listContent: {
        flex: 1,
        gap: 8,
        justifyContent: "center",
    },
    titleLine: {
        height: 14,
        width: "80%",
        borderRadius: 6,
    },
    subtitleLine: {
        height: 11,
        width: "60%",
        borderRadius: 6,
    },
    subtitleLineShort: {
        height: 11,
        width: "45%",
        borderRadius: 6,
    },
    chipRow: {
        flexDirection: "row",
        gap: 8,
    },
    chip: {
        height: 22,
        width: 56,
        borderRadius: 10,
    },
    priceLine: {
        height: 16,
        width: "50%",
        borderRadius: 6,
    },
    // Grid card
    gridCard: {
        width: (width - 48) / 2,
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F1F5F9",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
    },
    gridImage: {
        width: "100%",
        height: 120,
        borderRadius: 0,
    },
    gridContent: {
        padding: 12,
        gap: 8,
    },
    // Horizontal card
    horizontalCard: {
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    horizontalImage: {
        width: "100%",
        height: 130,
        borderRadius: 0,
    },
    horizontalContent: {
        padding: 12,
        gap: 8,
    },
});

export default SkeletonCard;
