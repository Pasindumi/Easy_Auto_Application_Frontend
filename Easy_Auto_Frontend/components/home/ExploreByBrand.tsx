import { Image } from "expo-image";
import React, { useRef, useEffect, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from "react-native";
import api from "@/utils/api";

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
    index,
}: {
    brand: Brand;
    index: number;
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.92,
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
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
                style={styles.brandCard}
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
            <View style={[styles.sectionWhite, { height: 200, justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color="#235CF8" />
            </View>
        );
    }

    if (brands.length === 0) {
        return null;
    }

    // Use first 12 brands for the home page display
    const brandsToDisplay = brands.slice(0, 12);

    return (
        <Animated.View
            style={[
                styles.sectionWhite,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Explore by Brand</Text>
            </View>

            {/* Consolidated Brands Grid */}
            <View style={styles.brandGrid}>
                {brandsToDisplay.map((brand, index) => (
                    <View
                        key={`brand-${brand.id}`}
                        style={styles.brandCardWithInfo}
                    >
                        <BrandCard brand={brand} index={index} />
                        <Text style={styles.brandName}>{brand.brand_name}</Text>
                        {/* <Text style={styles.brandCarCount}>{brand.carCount} cars</Text> */}
                    </View>
                ))}
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
                <Text style={styles.viewAllButtonText}>View All Brands</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sectionWhite: {
        paddingVertical: 20,
        backgroundColor: "#FFFFFF",
        marginBottom: 8,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        letterSpacing: -0.4,
    },
    featuredBrandsTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 12,
        marginTop: 8,
        paddingHorizontal: 20,
    },
    featuredBrandsScroll: {
        marginBottom: 20,
    },
    featuredBrandsContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    featuredBrandCard: {
        width: 70,
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 8,
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    featuredBrandLogoContainer: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 4,
    },
    featuredBrandLogo: {
        width: "100%",
        height: "100%",
    },
    featuredBrandText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: 1,
    },
    featuredBrandName: {
        fontSize: 11,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 2,
        textAlign: "center",
    },
    featuredBrandCount: {
        fontSize: 9,
        fontWeight: "500",
        color: "#6B7280",
        textAlign: "center",
    },
    brandGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 16,
        marginTop: 16,
    },
    brandCardWithInfo: {
        width: (width - 80) / 4,
        marginBottom: 16,
        alignItems: "center",
    },
    brandCard: {
        width: "100%",
        aspectRatio: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        marginBottom: 8,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1.5,
        borderColor: "#E5E7EB",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
        elevation: 5,
    },
    brandLogoContainer: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
    },
    brandLogoImage: {
        width: "100%",
        height: "100%",
    },
    brandLogoText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: 1,
    },
    brandName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#111827",
        marginTop: 6,
        textAlign: "center",
    },
    brandCarCount: {
        fontSize: 10,
        fontWeight: "500",
        color: "#6B7280",
        marginTop: 2,
        textAlign: "center",
    },
    viewAllButton: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginHorizontal: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        marginBottom: 20,
    },
    viewAllButtonText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#1A1A1A",
    },
});

export default ExploreByBrand;
