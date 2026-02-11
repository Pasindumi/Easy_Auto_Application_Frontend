import { Image } from "expo-image";
import React, { useRef, useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                // 1. Get Vehicle Types
                const types: any = await api.get('/api/vehicle-config/types');
                const carType = types.find((t: any) => t.type_name.toLowerCase() === 'car' || t.type_name.toLowerCase() === 'cars') || types[0];

                if (carType) {
                    // 2. Get Brands for this type
                    const brandsData: any = await api.get(`/api/vehicle-config/brands/${carType.id}`);
                    setBrands(brandsData);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, { height: 200, justifyContent: 'center' }]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    if (brands.length === 0) {
        return null;
    }

    // Use first 8 brands for the home page display (2 rows of 4)
    const brandsToDisplay = brands.slice(0, 8);

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
                        router.push('/cars/buy-car'); 
                    }}
                >
                    <Text style={styles.viewAllText}>View All</Text>
                    <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.brandGrid}>
                {brandsToDisplay.map((brand) => (
                    <View
                        key={`brand-${brand.id}`}
                        style={styles.brandItemWrapper}
                    >
                        <BrandCard 
                            brand={brand} 
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.push({
                                    pathname: '/cars/buy-car', 
                                    params: { brandId: brand.id, brandName: brand.brand_name } 
                                } as any);
                            }}
                        />
                    </View>
                ))}
            </View>
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
});

export default ExploreByBrand;
