import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.card}>
                <View style={styles.row}>
                    <View style={styles.item}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.number}>10k+</Text>
                            <Text style={styles.label}>Verified Cars</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.item}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(35, 92, 248, 0.1)' }]}>
                            <Ionicons name="business" size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.number}>500+</Text>
                            <Text style={styles.label}>Trusted Dealers</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.horizontalDivider} />

                <View style={styles.row}>
                    <View style={styles.item}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
                            <Ionicons name="star" size={20} color="#EAB308" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.number}>4.8/5</Text>
                            <Text style={styles.label}>User Rating</Text>
                        </View>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.item}>
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                            <Ionicons name="people" size={20} color="#F97316" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.number}>50k+</Text>
                            <Text style={styles.label}>Happy Users</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.background,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    item: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        justifyContent: 'center', // Center content in its half
        paddingVertical: 8,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        justifyContent: "center",
    },
    number: {
        fontSize: 16,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.3,
    },
    label: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.text.muted,
        marginTop: 2,
    },
    divider: {
        width: 1,
        height: 32,
        backgroundColor: COLORS.border,
        marginHorizontal: 8,
    },
    horizontalDivider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
        width: '100%',
    },
});

export default ValueProps;
