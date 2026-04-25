import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    onViewAll?: () => void;
    viewAllLabel?: string;
    rightElement?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    onViewAll,
    viewAllLabel = "See All",
    rightElement,
}) => (
    <View style={styles.row}>
        <View style={styles.left}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightElement
            ? rightElement
            : onViewAll
            ? (
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onViewAll();
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.btnText}>{viewAllLabel}</Text>
                    <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
                </TouchableOpacity>
            )
            : null}
    </View>
);

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    left: { flex: 1 },
    title: {
        fontSize: 18,
        fontWeight: "800",
        color: "#0F172A",
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "500",
        color: "#94A3B8",
        marginTop: 2,
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        backgroundColor: "#EEF3FF",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },
    btnText: {
        fontSize: 12,
        fontWeight: "700",
        color: COLORS.primary,
    },
});

export default SectionHeader;
