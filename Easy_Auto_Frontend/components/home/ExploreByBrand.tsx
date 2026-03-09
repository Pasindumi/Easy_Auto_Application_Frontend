import { Image } from "expo-image";
import React, { useRef, useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import api from "@/utils/api";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const COL = (width - 40 - 30) / 4; // 4 cols

interface Brand { id: string; brand_name: string; brand_image: string | null; status: string }

interface ExploreByBrandProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}

const ExploreByBrand: React.FC<ExploreByBrandProps> = ({ fadeAnim, slideAnim }) => {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                const typesRes: any = await api.get("/api/vehicle-config/types");
                if (Array.isArray(typesRes))
                    setVehicleTypes([{ id: "all", type_name: "All" }, ...typesRes]);
                await fetchBrands("all");
            } catch {
                setLoading(false);
            }
        };
        init();
    }, []);

    const fetchBrands = async (typeId: string) => {
        setLoading(true);
        try {
            const params: any = { limit: 8 };
            if (typeId === "all") params.random = "true";
            else params.type_id = typeId;
            const qs = new URLSearchParams(params).toString();
            const data: any = await api.get(`/api/vehicle-config/brands?${qs}`);
            setBrands(data || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="Explore by Brand"
                subtitle="Find your favourite manufacturer"
                onViewAll={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/brands" as any); }}
            />

            {/* Type tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabs}
            >
                {vehicleTypes.map((t) => {
                    const active = selectedType === t.type_name;
                    return (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.tab, active && styles.tabActive]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedType(t.type_name);
                                fetchBrands(t.id);
                            }}
                        >
                            <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.type_name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {loading ? (
                <View style={styles.loader}><ActivityIndicator color={COLORS.primary} /></View>
            ) : (
                <View style={styles.grid}>
                    {brands.map((brand) => (
                        <TouchableOpacity
                            key={brand.id}
                            style={styles.brandCell}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push({ pathname: "/cars/buy-car", params: { brandId: brand.id, brandName: brand.brand_name } } as any);
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={styles.brandCard}>
                                {brand.brand_image ? (
                                    <Image source={{ uri: brand.brand_image }} style={styles.brandImg} contentFit="contain" transition={200} />
                                ) : (
                                    <Text style={styles.brandInitial}>{brand.brand_name.substring(0, 2).toUpperCase()}</Text>
                                )}
                            </View>
                            <Text style={styles.brandName} numberOfLines={1}>{brand.brand_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#F8FAFF" },
    tabs: {
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: "#EEF2FF",
    },
    tabActive: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    tabText: { fontSize: 13, fontWeight: "600", color: COLORS.primary },
    tabTextActive: { color: "#fff" },
    loader: { height: 140, justifyContent: "center", alignItems: "center" },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        gap: 10,
    },
    brandCell: {
        width: COL,
        alignItems: "center",
        marginBottom: 4,
    },
    brandCard: {
        width: COL,
        height: COL,
        backgroundColor: "#fff",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E8EEFF",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 6,
    },
    brandImg: { width: "68%", height: "68%" },
    brandInitial: { fontSize: 18, fontWeight: "800", color: COLORS.primary },
    brandName: { fontSize: 11, fontWeight: "600", color: "#475569", textAlign: "center" },
});

export default ExploreByBrand;
