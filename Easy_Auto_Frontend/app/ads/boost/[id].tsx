import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();

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
            <Header title="Boost Ad" showBack={true} />

            <View style={styles.boostIntroSection}>
                <View style={styles.boostIntroContent}>
                    <Text style={styles.boostIntroTitle}>Premium Visibility</Text>
                    <Text style={styles.boostIntroSub}>Boost your ad to reach thousands of buyers and sell faster than ever.</Text>
                </View>
                <View style={styles.boostIntroIcon}>
                    <Ionicons name="rocket" size={32} color={COLORS.primary} />
                </View>
            </View>

            <BrandedRefreshOverlay refreshing={refreshing} top={200} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={onRefresh} 
                        tintColor={COLORS.primary}
                        colors={[COLORS.primary]}
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
        backgroundColor: '#F8FAFF',
    },
    boostIntroSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        margin: 20,
        marginBottom: 10,
        padding: 20,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    boostIntroContent: {
        flex: 1,
        paddingRight: 16,
    },
    boostIntroTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0f172a',
        letterSpacing: -0.6,
    },
    boostIntroSub: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 6,
        lineHeight: 19,
        fontWeight: '500',
    },
    boostIntroIcon: {
        width: 60,
        height: 60,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '10',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        paddingHorizontal: 40,
    },
    emptyText: {
        marginTop: 16,
        color: '#94A3B8',
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '500',
    },
});
