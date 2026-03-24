import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";

export type SortOption = {
    key: string;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
};

const DEFAULT_OPTIONS: SortOption[] = [
    { key: "newest",        label: "Newest",      icon: "time-outline"         },
    { key: "price_asc",     label: "Price ↑",     icon: "trending-up-outline"  },
    { key: "price_desc",    label: "Price ↓",     icon: "trending-down-outline" },
    { key: "mileage_asc",   label: "Low KMs",     icon: "speedometer-outline"  },
    { key: "year_desc",     label: "Latest Year", icon: "calendar-outline"     },
    { key: "popular",       label: "Popular",     icon: "flame-outline"        },
];

interface SortBarProps {
    selected: string;
    onSelect: (key: string) => void;
    options?: SortOption[];
    resultCount?: number;
}

const SortBar: React.FC<SortBarProps> = ({
    selected,
    onSelect,
    options = DEFAULT_OPTIONS,
    resultCount,
}) => {
    return (
        <View style={styles.wrapper}>
            {resultCount !== undefined && (
                <View style={styles.countWrap}>
                    <Text style={styles.countText}>
                        <Text style={styles.countNum}>{resultCount.toLocaleString()}</Text> results
                    </Text>
                </View>
            )}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {options.map((opt) => {
                    const isActive = selected === opt.key;
                    return (
                        <TouchableOpacity
                            key={opt.key}
                            style={[styles.pill, isActive && styles.pillActive]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onSelect(opt.key);
                            }}
                            activeOpacity={0.75}
                        >
                            {opt.icon && (
                                <Ionicons
                                    name={opt.icon}
                                    size={13}
                                    color={isActive ? "#fff" : COLORS.text.muted}
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <Text style={[styles.pillLabel, isActive && styles.pillLabelActive]}>
                                {opt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    countWrap: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    countText: {
        fontSize: 13,
        color: COLORS.text.muted,
        fontWeight: "500",
    },
    countNum: {
        color: COLORS.text.primary,
        fontWeight: "800",
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    pill: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
        borderWidth: 1,
        borderColor: "transparent",
    },
    pillActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    pillLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.text.muted,
    },
    pillLabelActive: {
        color: "#fff",
        fontWeight: "700",
    },
});

export default SortBar;
