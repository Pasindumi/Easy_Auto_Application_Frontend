import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Loading from '@/components/ui/Loading';
import { Image } from 'expo-image';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import api from '@/utils/api';
import Header from "@/components/Header";

const { width } = Dimensions.get('window');

interface Brand {
    id: string;
    brand_name: string;
    brand_image: string | null;
}

interface VehicleType {
    id: string;
    type_name: string;
    brands?: Brand[];
}

export default function BrandsScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<VehicleType[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Types
            const typesRes: any = await api.get('/api/vehicle-config/types');

            if (Array.isArray(typesRes)) {
                // 2. Fetch Brands for each type (or fetch all and filter if API supports it)
                // For now, let's assume we can fetch all brands or fetch by type in parallel
                // To avoid N+1, ideally we'd have an endpoint for this. 
                // Since user wants "categorized by vehicle types", we'll try to fetch brands per type.

                const typesWithBrands = await Promise.all(typesRes.map(async (type: VehicleType) => {
                    try {
                        // Fetching all brands for this type
                        const brandsRes: any = await api.get(`/api/vehicle-config/brands?type_id=${type.id}&limit=50`);
                        return {
                            ...type,
                            brands: Array.isArray(brandsRes) ? brandsRes : []
                        };
                    } catch (e) {
                        return { ...type, brands: [] };
                    }
                }));

                // Filter out types with no brands to keep UI clean
                setData(typesWithBrands.filter(t => t.brands && t.brands.length > 0));
            }
        } catch (error) {
            console.error("Error fetching brands data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBrandPress = (brand: Brand) => {
        router.push({
            pathname: '/cars/buy-car',
            params: { brandId: brand.id, brandName: brand.brand_name }
        } as any);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header title="All Brands" showBack={true} />
                <Loading />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header title="All Brands" showBack={true} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {data.map((type) => (
                    <View key={type.id} style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{type.type_name}</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.brandsGrid}>
                            {type.brands?.map((brand) => (
                                <TouchableOpacity
                                    key={brand.id}
                                    style={styles.brandCard}
                                    onPress={() => handleBrandPress(brand)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.logoContainer}>
                                        {brand.brand_image ? (
                                            <Image
                                                source={{ uri: brand.brand_image }}
                                                style={styles.logo}
                                                contentFit="contain"
                                                transition={200}
                                            />
                                        ) : (
                                            <Text style={styles.placeholderLogo}>
                                                {brand.brand_name.substring(0, 2).toUpperCase()}
                                            </Text>
                                        )}
                                    </View>
                                    <Text style={styles.brandName} numberOfLines={1}>
                                        {brand.brand_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {data.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No brands available right now.</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginRight: 12,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    brandsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    brandCard: {
        width: (width - 32 - 24) / 3, // 3 columns, accounting for padding and gap
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    logoContainer: {
        width: 48,
        height: 48,
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
    },
    logo: {
        width: '80%',
        height: '80%',
    },
    placeholderLogo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    brandName: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.text.primary,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.text.muted,
        fontSize: 16,
    }
});
