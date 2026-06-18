import { Image } from "expo-image";
import React, { useRef, useEffect, useState, useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";

const { width } = Dimensions.get("window");
const GAPPING = 22;
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
    const { colors, isDarkMode } = useTheme();

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

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    if (loading && vehicleTypes.length === 0) {
        return (
            <View style={[themeStyles.container, { height: 200, justifyContent: 'center' }]}>
                <Loading size="small" />
            </View>
        );
    }

    return (
        <Animated.View style={[themeStyles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <SectionHeader
                title="Explore by Brand"
                subtitle="Find your favourite manufacturer"
                onViewAll={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push("/brands" as any); }}
            />

            {/* Type tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={themeStyles.tabs}
            >
                {vehicleTypes.map((t) => {
                    const active = selectedType === t.type_name;
                    return (
                        <TouchableOpacity
                            key={t.id}
                            style={[themeStyles.tab, active && themeStyles.tabActive]}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedType(t.type_name);
                                fetchBrands(t.id);
                            }}
                        >
                            <Text style={[themeStyles.tabText, active && themeStyles.tabTextActive]}>{t.type_name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {loading ? (
                <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                    <Loading size="small" />
                </View>
            ) : (
                <View style={themeStyles.grid}>
                    {brands.map((brand) => (
                        <TouchableOpacity
                            key={brand.id}
                            style={themeStyles.brandCell}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push({ pathname: "/cars/buy-car", params: { brandId: brand.id, brandName: brand.brand_name } } as any);
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={themeStyles.brandCard}>
                                {brand.brand_image ? (
                                    <Image source={{ uri: brand.brand_image }} style={themeStyles.brandImg} contentFit="contain" transition={200} />
                                ) : (
                                    <LinearGradient
                                        colors={[colors.primary, colors.primaryDark]}
                                        style={themeStyles.placeholderGradient}
                                    >
                                        <Text style={themeStyles.brandInitial}>{brand.brand_name.substring(0, 1).toUpperCase()}</Text>
                                    </LinearGradient>
                                )}
                            </View>
                            <Text style={themeStyles.brandName} numberOfLines={1}>{brand.brand_name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {},
    tabs: {
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
    },
    tab: {
        paddingHorizontal: 22,
        paddingVertical: 4,
        borderRadius: 5,
        backgroundColor: isDarkMode ? colors.backgroundSecondary : "#EEF2FF",
    },
    tabActive: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    tabText: { fontSize: 13, fontWeight: "600", color: colors.primary },
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
        backgroundColor: isDarkMode ? colors.backgroundSecondary : colors.white,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
        marginBottom: 4,
    },
    placeholderGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    brandImg: { width: "60%", height: "60%" },
    brandInitial: { fontSize: 18, fontWeight: "800", color: colors.white },
    brandName: { fontSize: 12, fontWeight: "600", color: colors.text.secondary, textAlign: "center" },
});

export default ExploreByBrand;
