import React, { useState } from "react";
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import COLORS from "@/constants/Colors";

interface VehicleCategoryStripProps {
    fadeAnim: Animated.Value;
}

const CATS = [
    { id: "all",       label: "All",      icon: "grid",         lib: "Ionicons" as const },
    { id: "suv",       label: "SUV",      icon: "car-suv",      lib: "MaterialCommunityIcons" as const },
    { id: "sedan",     label: "Sedan",    icon: "car-sedan",    lib: "MaterialCommunityIcons" as const },
    { id: "hatchback", label: "Hatchback",icon: "car-hatchback",lib: "MaterialCommunityIcons" as const },
    { id: "van",       label: "Van",      icon: "bus",          lib: "Ionicons" as const },
    { id: "pickup",    label: "Pickup",   icon: "truck-pickup", lib: "MaterialCommunityIcons" as const },
    { id: "electric",  label: "Electric", icon: "flash",        lib: "Ionicons" as const },
    { id: "luxury",    label: "Luxury",   icon: "diamond",      lib: "Ionicons" as const },
];

const VehicleCategoryStrip: React.FC<VehicleCategoryStripProps> = ({ fadeAnim }) => {
    const router = useRouter();
    const [sel, setSel] = useState("all");

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {CATS.map((cat) => {
                    const active = sel === cat.id;
                    const IconComp: any = cat.lib === "Ionicons" ? Ionicons : MaterialCommunityIcons;

                    return (
                        <TouchableOpacity
                            key={cat.id}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSel(cat.id);
                                if (cat.id === "all") router.push("/(tabs)/search" as any);
                                else router.push({ pathname: "/(tabs)/search", params: { type: cat.label } } as any);
                            }}
                            style={[styles.chip, active && styles.chipActive]}
                            activeOpacity={0.7}
                        >
                            <IconComp 
                                name={cat.icon} 
                                size={16} 
                                color={active ? "#fff" : "#64748B"} 
                            />
                            <Text style={[styles.label, active && styles.labelActive]}>{cat.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    scroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "#F1F5F9",
        gap: 6,
        borderWidth: 1,
        borderColor: "transparent",
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748B",
    },
    labelActive: {
        color: "#fff",
        fontWeight: "700",
    },
});

export default VehicleCategoryStrip;
