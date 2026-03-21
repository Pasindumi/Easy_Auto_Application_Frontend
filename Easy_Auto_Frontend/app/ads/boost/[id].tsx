import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Loading from '../../../components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';

import Header from '../../../components/Header';
import PackagePlanCard from '../../../components/packages/packages/PackagePlanCard';
import { api } from '@/utils/api';
import COLORS from '../../../constants/Colors';
import { headerSectionStylesWhite } from '../../../styles/headerSectionStyles';

export default function BoostSelectionScreen() {
    const router = useRouter();
    const { id: adId } = useLocalSearchParams();

    const [loading, setLoading] = useState(true);
    const [packages, setPackages] = useState<any[]>([]);
    const [adDetails, setAdDetails] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (adId) {
            fetchData();
        }
    }, [adId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // 1. Fetch Ad Details to get Vehicle Type
            const adResponse = await api.get<{ success: boolean; data: any }>(`/api/cars/${adId}`);

            if (!adResponse.success || !adResponse.data) {
                Alert.alert("Error", "Failed to load advertisement details.");
                router.back();
                return;
            }

            setAdDetails(adResponse.data);
            const vehicleTypeId = adResponse.data.vehicle_type_id;

            // 2. Fetch Boost Packages for this vehicle type
            const pkgResponse = await api.get<any[]>(`/api/boosts/packages?vehicleTypeId=${vehicleTypeId}`);

            // The boost controller returns an array directly, not wrapped in { success: true, data: [...] } ?
            // Let's check boostController.js getBoostPackages.
            // It returns res.json(enrichedPackages); so it's an array.

            if (Array.isArray(pkgResponse)) {
                setPackages(pkgResponse);
            } else {
                setPackages([]);
            }

        } catch (error) {
            console.error("Error fetching boost data:", error);
            Alert.alert("Error", "Failed to load boost packages.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleSelectPackage = (pkg: any) => {
        // Navigate to details page instead of PayHere
        router.push({
            pathname: '/ads/boost/package-details',
            params: {
                adId: adId,
                packageId: pkg.id
            }
        });
    };

    const initiateBoostPayment = async (pkg: any) => {
        try {
            setLoading(true);
            const price = parseFloat(pkg.rules?.[0]?.price || "0");

            // If price is 0, we can apply directly (if logic supports free boosts)
            // But for now let's assume all boosts are paid or go through gateway even for 0 (PayHere might fail for 0).

            // Calculate amount
            const amount = price;
            const orderId = `BOOST-${adId}-${pkg.id}-${Date.now()}`;
            const items = `Boost: ${pkg.name}`;

            // User details - we need to fetch user details or assume backend handles it via auth token?
            // backend initiatePayment needs: first_name, last_name, email, phone...
            // effectively we need user profile.
            // We can fetch profile or pass what we have. adDetails.users has some info.

            const user = adDetails.users;

            const paymentObj = {
                order_id: orderId,
                items: items,
                amount: amount,
                currency: "LKR",
                first_name: user?.name?.split(' ')[0] || "User",
                last_name: user?.name?.split(' ')[1] || "User",
                email: user?.email || "user@example.com",
                phone: user?.phone || "0771234567",
                address: adDetails?.location || "Sri Lanka",
                city: "Colombo",
                country: "Sri Lanka",
                packageId: pkg.id,
                adId: adId, // Pass adId for backend to link
                sandbox: true
            };

            console.log("Initiating Boost Payment:", JSON.stringify(paymentObj));

            const response = await api.post<{ success: boolean; html: string }>(
                '/api/payment/initiate',
                paymentObj
            );

            if (!response.success || !response.html) {
                throw new Error("Failed to initiate payment.");
            }

            // 2. Navigate to Gateway with HTML content
            router.push({
                pathname: '/payments/payhere-gateway',
                params: { html: response.html },
            });

        } catch (error: any) {
            console.error("Payment Error:", error);
            Alert.alert("Payment Error", error.message || "Failed to initiate payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Boost Your Ad" />

            {/* Inline Sub-Header Section */}
            <View style={headerSectionStylesWhite.headerWrap}>
                <View style={headerSectionStylesWhite.header}>
                    <Ionicons name="rocket-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                    <Text style={headerSectionStylesWhite.headerTitle}>Select a Boost Package</Text>
                </View>
                <Text style={styles.subText}>Make your ad stand out and sell faster!</Text>
            </View>

            <BrandedRefreshOverlay refreshing={refreshing} top={150} />
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor="transparent"
                        colors={["transparent"]}
                        progressBackgroundColor="transparent"
                    />
                }
            >
                {loading ? (
                    <View style={styles.loaderContainer}>
                        <Loading size="large" message="Loading boost packages..." />
                    </View>
                ) : packages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="alert-circle-outline" size={48} color="#999" />
                        <Text style={styles.emptyText}>No boost packages available for this vehicle type.</Text>
                    </View>
                ) : (
                    packages.map((pkg) => {
                        // Extract price from first rule
                        const price = parseFloat(pkg.rules?.[0]?.price || "0");
                        // Duration
                        const duration = parseInt(pkg.config?.DURATION_DAYS || "0");

                        // Features from Included Items
                        const features = pkg.included_items?.map((item: any) => item.price_items?.name) || [];
                        // Add description if any
                        if (pkg.description) features.push(pkg.description);

                        return (
                            <PackagePlanCard
                                key={pkg.id}
                                id={pkg.id}
                                title={pkg.name}
                                days={duration}
                                price={price}
                                perDay={duration > 0 ? `LKR ${(price / duration).toFixed(0)}/day` : ''}
                                backgroundColor={pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}15` : "#FFF5EB"} // Orange tint for boosts
                                themeColor={pkg.config?.COLOR_THEME || "#F97316"} // Orange for boosts
                                features={features}
                                isPopular={pkg.code.includes('GOLD') || pkg.code.includes('POPULAR')}
                                btnText="Select Boost"
                                onSelect={() => handleSelectPackage(pkg)}
                            />
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    subText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 38, // align with title
        marginBottom: 8
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loaderText: {
        marginTop: 12,
        color: '#666',
        fontSize: 14,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        marginTop: 12,
        color: '#999',
        fontSize: 14,
        textAlign: 'center',
    },
});
