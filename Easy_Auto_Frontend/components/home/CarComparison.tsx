import { COMPARISONS } from "@/constants/dummydata/homedummydata";
import { Image } from "expo-image";
import React from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

interface CarComparisonProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const CarComparison: React.FC<CarComparisonProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/compare' as any);
    };

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
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Compare Cars</Text>
                    <Text style={styles.subtitle}>Head-to-head comparisons</Text>
                </View>
                <TouchableOpacity 
                    style={styles.viewAllButton} 
                    onPress={() => router.push('/compare' as any)}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={CARD_WIDTH + 16}
            >
                {COMPARISONS.map((comparison, index) => (
                    <TouchableOpacity
                        key={`compare-${index}`}
                        style={styles.card}
                        activeOpacity={0.9}
                        onPress={handlePress}
                    >
                        <View style={styles.carContainer}>
                            <Image
                                source={{ uri: comparison.car1.image }}
                                style={styles.image}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text style={styles.carName} numberOfLines={1}>{comparison.car1.name}</Text>
                            <Text style={styles.carModel}>{comparison.car1.model}</Text>
                        </View>

                        <View style={styles.vsContainer}>
                            <View style={styles.vsBadge}>
                                <Text style={styles.vsText}>VS</Text>
                            </View>
                        </View>

                        <View style={styles.carContainer}>
                            <Image
                                source={{ uri: comparison.car2.image }}
                                style={styles.image}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text style={styles.carName} numberOfLines={1}>{comparison.car2.name}</Text>
                            <Text style={styles.carModel}>{comparison.car2.model}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingVertical: 16,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 4,
    },
    viewAllText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: "600",
    },
    scrollContent: {
        paddingHorizontal: 20,
        gap: 16,
    },
    card: {
        width: CARD_WIDTH,
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    carContainer: {
        flex: 1,
        alignItems: "center",
        maxWidth: '42%',
    },
    image: {
        width: '100%',
        aspectRatio: 1.5,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: COLORS.background,
    },
    carName: {
        fontSize: 13,
        fontWeight: "700",
        color: COLORS.text.primary,
        textAlign: "center",
        marginBottom: 2,
    },
    carModel: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: "600",
        textAlign: "center",
    },
    vsContainer: {
        width: 40,
        alignItems: "center",
        justifyContent: 'center',
        zIndex: 10,
    },
    vsBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    vsText: {
        color: COLORS.white,
        fontWeight: "900",
        fontSize: 12,
        fontStyle: 'italic',
    },
});

export default CarComparison;
