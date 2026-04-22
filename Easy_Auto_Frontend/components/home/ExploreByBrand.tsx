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
    ScrollView
} from "react-native";
import Loading from "../ui/Loading";
import api from "@/utils/api";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import SectionHeader from "./SectionHeader";

const { width } = Dimensions.get("window");
const GAPPING = 14;
const PADDING_H = 20;
const COL_COUNT = 4;
const COL_W = (width - (PADDING_H * 2) - (GAPPING * (COL_COUNT - 1))) / COL_COUNT;

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

    const handleTypeSelect = (typeId: string, typeName: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedType(typeName); // Determine active state by name or ID
        // Note: state update is async, but we pass ID directly
        fetchBrands(typeId);
    };

    if (loading && vehicleTypes.length === 0) {
        return (
            <View style={[styles.container, { height: 200, justifyContent: 'center' }]}>
                <Loading size="small" />
            </View>
        );
    }

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
                <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                    <Loading size="small" />
                </View>
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
                                    <LinearGradient
                                        colors={[COLORS.primary, COLORS.primaryDark]}
                                        style={styles.placeholderGradient}
                                    >
                                        <Text style={styles.brandInitial}>{brand.brand_name.substring(0, 1).toUpperCase()}</Text>
                                    </LinearGradient>
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
    container: { backgroundColor: "#FFFFFF" },
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
        paddingHorizontal: PADDING_H,
        justifyContent: 'space-between',
    },
    brandCell: {
        width: COL_W,
        alignItems: "center",
        marginBottom: 16,
    },
    brandCard: {
        width: COL_W,
        height: COL_W,
        backgroundColor: COLORS.white,
        borderRadius: COL_W / 2, // Perfect circle for premium brand avatars
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 8,
    },
    placeholderGradient: {
        width: '100%',
        height: '100%',
        borderRadius: COL_W / 2,
        justifyContent: "center",
        alignItems: "center",
    },
    brandImg: { width: "60%", height: "60%" },
    brandInitial: { fontSize: 18, fontWeight: "800", color: COLORS.white },
    brandName: { fontSize: 12, fontWeight: "600", color: COLORS.text.secondary, textAlign: "center" },
});

export default ExploreByBrand;
