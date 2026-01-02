import { ALL_BRANDS, FEATURED_BRANDS } from "@/constants/dummydata/homedummydata";
import { Image } from "expo-image";
import React, { useRef } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Animated Brand Card Component
const BrandCard = ({
    brand,
    index,
}: {
    brand: { name: string; logo: any };
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
                    {brand.logo ? (
                        <Image
                            source={brand.logo}
                            style={styles.brandLogoImage}
                            contentFit="contain"
                            transition={200}
                        />
                    ) : (
                        <Text style={styles.brandLogoText}>
                            {brand.name.substring(0, 2).toUpperCase()}
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
            {/* Featured Brands */}
            <Text style={styles.featuredBrandsTitle}>Featured Brands</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.featuredBrandsScroll}
                contentContainerStyle={{ ...styles.featuredBrandsContainer, paddingBottom: 20 }}
            >
                {FEATURED_BRANDS.map((brand, index) => (
                    <TouchableOpacity
                        key={`featured-${index}`}
                        style={styles.featuredBrandCard}
                    >
                        <View style={styles.featuredBrandLogoContainer}>
                            {brand.logo ? (
                                <Image
                                    source={brand.logo}
                                    style={styles.featuredBrandLogo}
                                    contentFit="contain"
                                />
                            ) : (
                                <Text style={styles.featuredBrandText}>
                                    {brand.name.substring(0, 2).toUpperCase()}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.featuredBrandName}>{brand.name}</Text>
                        <Text style={styles.featuredBrandCount}>{brand.carCount} cars</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* All Brands Grid - Show only 3 rows (12 brands) */}
            <View style={styles.brandGrid}>
                {ALL_BRANDS.slice(0, 12).map((brand, index) => (
                    <View
                        key={`brand-${brand.name}-${index}`}
                        style={styles.brandCardWithInfo}
                    >
                        <BrandCard brand={brand} index={index} />
                        <Text style={styles.brandName}>{brand.name}</Text>
                        <Text style={styles.brandCarCount}>{brand.carCount} cars</Text>
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
