import { COMPARISONS } from "@/app/dummydata/homedummydata";
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

const { width } = Dimensions.get("window");

interface CarComparisonProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const CarComparison: React.FC<CarComparisonProps> = ({ fadeAnim, slideAnim }) => {

    return (
        <Animated.View
            style={[
                styles.section,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Compare Cars</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllLink}>See all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={{ paddingBottom: 20 }}
            >
                {COMPARISONS.map((comparison) => (
                    <TouchableOpacity
                        key={`compare-${comparison.id}`}
                        style={styles.compareCard}
                    >
                        <View style={styles.side}>
                            <Image
                                source={{ uri: comparison.car1.image }}
                                style={styles.carImage}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text style={styles.carName}>{comparison.car1.name}</Text>
                            <Text style={styles.carYear}>{comparison.car1.model}</Text>
                        </View>

                        <View style={styles.vsColumn}>
                            <View style={styles.vsCircle}>
                                <Text style={styles.vsText}>vs</Text>
                            </View>
                        </View>

                        <View style={styles.side}>
                            <Image
                                source={{ uri: comparison.car2.image }}
                                style={styles.carImage}
                                contentFit="cover"
                                transition={300}
                            />
                            <Text style={styles.carName}>{comparison.car2.name}</Text>
                            <Text style={styles.carYear}>{comparison.car2.model}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 0,
        paddingVertical: 24,
        paddingBottom: 32,
        backgroundColor: "#FFFFFF",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.4,
    },
    seeAllLink: {
        fontSize: 14,
        color: "#235CF8",
        fontWeight: "600",
    },
    horizontalScroll: {
        paddingHorizontal: 20,
    },
    compareCard: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        marginRight: 16,
        alignItems: "center",
        justifyContent: "space-between",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
        borderWidth: 0.5,
        borderColor: "rgba(35,92,248,0.3)",
    },
    side: {
        flex: 1,
        alignItems: "center",
    },
    carImage: {
        width: 120,
        height: 70,
        borderRadius: 8,
        marginBottom: 8,
    },
    carName: {
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
        fontSize: 14,
    },
    carYear: {
        color: "#235CF8",
        marginTop: 4,
        fontSize: 12,
        fontWeight: "600",
    },
    vsColumn: {
        width: 40,
        alignItems: "center",
    },
    vsCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#E6E8EE",
        alignItems: "center",
        justifyContent: "center",
    },
    vsText: {
        color: "#235CF8",
        fontWeight: "700",
        fontSize: 12,
    },
});

export default CarComparison;
