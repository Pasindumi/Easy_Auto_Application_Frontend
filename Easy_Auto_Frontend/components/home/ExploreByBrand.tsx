import { Image } from "expo-image";
import React, { useRef, useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import Loading from "../ui/Loading";
import api from "@/utils/api";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Brand {
    id: string;
    brand_name: string;
    brand_image: string | null;
    status: string;
}

// Animated Brand Card Component
const BrandCard = ({
    brand,
    onPress,
}: {
    brand: Brand;
    onPress: () => void;
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.9,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
                style={styles.brandCard}
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
            >
                <View style={styles.brandLogoContainer}>
                    {brand.brand_image ? (
                        <Image
                            source={{ uri: brand.brand_image }}
                            style={styles.brandLogoImage}
                            contentFit="contain"
                            transition={200}
                        />
                    ) : (
                        <Text style={styles.brandLogoText}>
                            {brand.brand_name.substring(0, 2).toUpperCase()}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
            <Text style={styles.brandName} numberOfLines={1}>{brand.brand_name}</Text>
        </Animated.View>
    );
};

interface ExploreByBrandProps {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
}


const ExploreByBrand: React.FC<ExploreByBrandProps> = ({
    fadeAnim,
    slideAnim,
}) => {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<string>("All");
    const [loading, setLoading] = useState(true);

    // Initial Fetch (Types + Initial Brands)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // 1. Get Vehicle Types
                const typesRes: any = await api.get('/api/vehicle-config/types');
                if (Array.isArray(typesRes)) {
                    // Prepend "All" option
                    const allOption = { id: 'all', type_name: 'All' };
                    setVehicleTypes([allOption, ...typesRes]);
                }

                // 2. Fetch Initial Brands (All, Random)
                await fetchBrands("all");

            } catch (error) {
                console.error("Error fetching initial data:", error);
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const fetchBrands = async (typeId: string) => {
        setLoading(true);
        try {
            let url = '/api/vehicle-config/brands';
            const params: any = { limit: 8 };

            if (typeId === 'all') {
                params.random = 'true';
            } else {
                params.type_id = typeId;
            }

            // Construct query string manually or use axios params if available (using simple string here for fetch wrapper)
            const queryString = new URLSearchParams(params).toString();
            const fullUrl = `${url}?${queryString}`;

            const brandsData: any = await api.get(fullUrl);
            setBrands(brandsData || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
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
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Explore by Brand</Text>
                    <Text style={styles.subtitle}>Find your favorite manufacturer</Text>
                </View>
                <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/brands');
                    }}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Vehicle Type Tabs */}
            <View style={{ marginBottom: 16 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
                >
                    {vehicleTypes.map((type) => (
                        <TouchableOpacity
                            key={type.id}
                            style={[
                                styles.tab,
                                selectedType === type.type_name && styles.tabActive
                            ]}
                            onPress={() => handleTypeSelect(type.id, type.type_name)}
                        >
                            <Text style={[
                                styles.tabText,
                                selectedType === type.type_name && styles.tabTextActive
                            ]}>
                                {type.type_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={{ height: 160, justifyContent: 'center', alignItems: 'center' }}>
                    <Loading size="small" />
                </View>
            ) : (
                <View style={styles.brandGrid}>
                    {brands.length > 0 ? brands.map((brand) => (
                        <View
                            key={`brand-${brand.id}`}
                            style={styles.brandItemWrapper}
                        >
                            <BrandCard
                                brand={brand}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    // if selectedType !== All, perform specific logic?
                                    // passing selected brand is usually enough
                                    router.push({
                                        pathname: '/cars/buy-car',
                                        params: { brandId: brand.id, brandName: brand.brand_name }
                                    } as any);
                                }}
                            />
                        </View>
                    )) : (
                        <View style={{ width: '100%', padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: COLORS.text.muted }}>No brands found for this category.</Text>
                        </View>
                    )}
                </View>
            )}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "800",
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: COLORS.text.muted,
        marginTop: 2,
        fontWeight: "500",
    },
    viewAllButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        padding: 4,
    },
    viewAllText: {
        fontSize: 13,
        fontWeight: "600",
        color: COLORS.primary,
    },
    brandGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        gap: 12,
    },
    brandItemWrapper: {
        width: (width - 40 - 36) / 4, // 20px padding * 2, 12px gap * 3
        marginBottom: 16,
        alignItems: "center",
    },
    brandCard: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 8,
    },
    brandLogoContainer: {
        width: "70%",
        height: "70%",
        justifyContent: "center",
        alignItems: "center",
    },
    brandLogoImage: {
        width: "100%",
        height: "100%",
    },
    brandLogoText: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.primary,
    },
    brandName: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.text.primary,
        textAlign: "center",
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.primaryLight,
        marginRight: 4,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: COLORS.primary,
    },
    tabTextActive: {
        color: COLORS.white,
    },
});

export default ExploreByBrand;
