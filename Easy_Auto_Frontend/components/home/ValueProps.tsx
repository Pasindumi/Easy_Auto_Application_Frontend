import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

interface ValuePropsProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const ValueProps: React.FC<ValuePropsProps> = ({ fadeAnim, slideAnim }) => {
    return (
        <Animated.View
            style={[
                styles.valuePropsContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.valuePropsRow}>
                <View style={styles.valuePropItem}>
                    <MaterialIcons name="verified" size={20} color="#10B981" />
                    <View style={styles.valuePropText}>
                        <Text style={styles.valuePropNumber}>10,000+</Text>
                        <Text style={styles.valuePropLabel}>Cars</Text>
                    </View>
                </View>
                <View style={styles.valuePropDivider} />
                <View style={styles.valuePropItem}>
                    <MaterialIcons name="store" size={20} color="#235CF8" />
                    <View style={styles.valuePropText}>
                        <Text style={styles.valuePropNumber}>500+</Text>
                        <Text style={styles.valuePropLabel}>Dealers</Text>
                    </View>
                </View>
                <View style={styles.valuePropDivider} />
                <View style={styles.valuePropItem}>
                    <MaterialIcons name="star" size={20} color="#FFD700" />
                    <View style={styles.valuePropText}>
                        <Text style={styles.valuePropNumber}>4.8</Text>
                        <Text style={styles.valuePropLabel}>Rating</Text>
                    </View>
                </View>
                <View style={styles.valuePropDivider} />
                <View style={styles.valuePropItem}>
                    <MaterialIcons name="people" size={20} color="#F57C00" />
                    <View style={styles.valuePropText}>
                        <Text style={styles.valuePropNumber}>50K+</Text>
                        <Text style={styles.valuePropLabel}>Users</Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    valuePropsContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: "#F9FAFB",
        marginBottom: 8,
    },
    valuePropsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    valuePropItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        flex: 1,
        justifyContent: "center",
    },
    valuePropText: {
        gap: 2,
    },
    valuePropNumber: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.3,
    },
    valuePropLabel: {
        fontSize: 11,
        fontWeight: "500",
        color: "#6B7280",
        letterSpacing: -0.1,
    },
    valuePropDivider: {
        width: 1,
        height: 30,
        backgroundColor: "#E5E7EB",
    },
});

export default ValueProps;
