import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

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
}) => {
    const { colors, isDarkMode } = useTheme();
    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <View style={themeStyles.row}>
            <View style={themeStyles.left}>
                <Text style={themeStyles.title}>{title}</Text>
                {subtitle ? <Text style={themeStyles.subtitle}>{subtitle}</Text> : null}
            </View>
            {rightElement
                ? rightElement
                : onViewAll
                    ? (
                        <TouchableOpacity
                            style={themeStyles.btn}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onViewAll();
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={themeStyles.btnText}>{viewAllLabel}</Text>
                            <Ionicons name="chevron-forward" size={13} color={colors.primary} />
                        </TouchableOpacity>
                    )
                    : null}
        </View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
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
        color: colors.text.primary,
        letterSpacing: -0.4,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: "500",
        color: colors.text.muted,
        marginTop: 2,
    },
    btn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        backgroundColor: isDarkMode ? colors.backgroundSecondary : "#EEF3FF",
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : "#DBEAFE",
    },
    btnText: {
        fontSize: 12,
        fontWeight: "700",
        color: colors.primary,
    },
});

export default SectionHeader;

