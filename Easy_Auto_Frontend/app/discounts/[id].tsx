import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
} from 'react-native';
import { Image } from "expo-image";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import COLORS from '../../constants/Colors';
import { api } from '@/utils/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

export default function DiscountDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [discount, setDiscount] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchDiscount();
        }
    }, [id]);

    const fetchDiscount = async () => {
        try {
            setLoading(true);
            // API returns { success: true, data: { ... } }
            const response: any = await api.get(`/api/discounts/${id}`);
            if (response.success && response.data) {
                setDiscount(response.data);
            } else {
                // Fallback if response structure is different (e.g. direct object)
                setDiscount(response);
            }
        } catch (err) {
            console.error('Error loading discount detail', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: "long",
            day: "numeric"
        });
    };

    const handleBack = () => {
        router.back();
    };

    const handleClaim = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const packageId = discount?.discount_packages?.[0]?.package_id;
        if (packageId) {
            router.push(`/packages/${packageId}`);
        } else {
            router.push('/packages/packages');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!discount) {
        return (
            <View style={styles.errorContainer}>
                <Stack.Screen options={{ headerShown: false }} />
                <Ionicons name="alert-circle-outline" size={64} color={COLORS.gray} />
                <Text style={styles.errorText}>Offer not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const themeColor = discount.color_theme || COLORS.primary;
    const isPercentage = discount.discount_type === 'PERCENTAGE';
    const discountValueDisplay = isPercentage ? `${discount.value}%` : `$${discount.value}`;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Hero Section */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: discount.offer_image_url || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=600&fit=crop" }}
                        style={styles.heroImage}
                        contentFit="cover"
                        transition={500}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                        style={styles.heroGradient}
                    />

                    {/* Header Buttons */}
                    <View style={[styles.headerActions, { top: insets.top + 10 }]}>
                        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="share-social-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Hero Content */}
                    <View style={styles.heroContent}>
                        <View style={[styles.tag, { backgroundColor: themeColor }]}>
                            <Text style={styles.tagText}>LIMITED TIME OFFER</Text>
                        </View>
                        <Text style={styles.heroTitle}>{discount.name}</Text>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountValue}>{discountValueDisplay}</Text>
                            <Text style={styles.discountLabel}>OFF</Text>
                        </View>
                    </View>
                </View>

                {/* Details Container */}
                <View style={styles.detailsContainer}>

                    {/* Validity Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Offer Validity</Text>
                        <View style={styles.validityCard}>
                            <View style={styles.dateRow}>
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateLabel}>Valid From</Text>
                                    <Text style={styles.dateValue}>{formatDate(discount.start_date)}</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={20} color={COLORS.gray} style={{ opacity: 0.5 }} />
                                <View style={styles.dateBox}>
                                    <Text style={styles.dateLabel}>Expires On</Text>
                                    <Text style={[styles.dateValue, { color: '#E11D48' }]}>{formatDate(discount.end_date)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Eligibility Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Eligibility & Conditions</Text>
                        <View style={styles.conditionsGrid}>
                            {discount.is_first_time_user && (
                                <View style={styles.conditionItem}>
                                    <View style={[styles.conditionIcon, { backgroundColor: '#DBEAFE' }]}>
                                        <Ionicons name="person-add" size={20} color="#2563EB" />
                                    </View>
                                    <Text style={styles.conditionText}>First-time users only</Text>
                                </View>
                            )}

                            {discount.min_bulk_ads > 0 ? (
                                <View style={styles.conditionItem}>
                                    <View style={[styles.conditionIcon, { backgroundColor: '#FEE2E2' }]}>
                                        <MaterialCommunityIcons name="layers" size={20} color="#DC2626" />
                                    </View>
                                    <Text style={styles.conditionText}>Min. {discount.min_bulk_ads} bulk ads</Text>
                                </View>
                            ) : (
                                <View style={styles.conditionItem}>
                                    <View style={[styles.conditionIcon, { backgroundColor: '#D1FAE5' }]}>
                                        <Ionicons name="checkmark-circle" size={20} color="#059669" />
                                    </View>
                                    <Text style={styles.conditionText}>No minimum ads required</Text>
                                </View>
                            )}

                            <View style={styles.conditionItem}>
                                <View style={[styles.conditionIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <Ionicons name="shield-checkmark" size={20} color="#D97706" />
                                </View>
                                <Text style={styles.conditionText}>Verified Offer</Text>
                            </View>
                        </View>
                    </View>

                    {/* Applicable Vehicles */}
                    {discount.discount_vehicle_types && discount.discount_vehicle_types.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Applicable Vehicles</Text>
                            <View style={styles.chipsContainer}>
                                {discount.discount_vehicle_types.map((vt: any, idx: number) => (
                                    <View key={idx} style={styles.chip}>
                                        <Ionicons name="car-sport-outline" size={16} color={COLORS.text} />
                                        <Text style={styles.chipText}>{vt.vehicle_types?.type_name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Applicable Packages */}
                    {discount.discount_packages && discount.discount_packages.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Apply on Packages</Text>
                            {discount.discount_packages.map((pkg: any, idx: number) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.packageCard}
                                    onPress={() => router.push(`/packages/${pkg.package_id}`)}
                                >
                                    <View style={[styles.packageIcon, { backgroundColor: themeColor }]}>
                                        <Ionicons name="cube" size={24} color="#fff" />
                                    </View>
                                    <View style={styles.packageContent}>
                                        <Text style={styles.packageName}>{pkg.price_items?.name || "Premium Package"}</Text>
                                        <Text style={styles.packageSub}>Tap to view package details</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                </View>
            </ScrollView>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 24,
    },
    errorText: {
        fontSize: 18,
        color: COLORS.gray,
        marginTop: 16,
        marginBottom: 24,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    heroContainer: {
        height: 350,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    headerActions: {
        position: 'absolute',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        paddingBottom: 40,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    heroTitle: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    discountBadge: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
        alignSelf: 'flex-start',
    },
    discountValue: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111',
    },
    discountLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#666',
        marginLeft: 4,
    },
    detailsContainer: {
        marginTop: -24,
        backgroundColor: '#F8F9FA',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 100, // Space for bottom bar
    },
    section: {
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
        marginBottom: 16,
    },
    validityCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dateBox: {
        flex: 1,
    },
    dateLabel: {
        fontSize: 13,
        color: COLORS.gray,
        marginBottom: 4,
    },
    dateValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    conditionsGrid: {
        gap: 12,
    },
    conditionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    conditionIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    conditionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 6,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    packageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    packageIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    packageContent: {
        flex: 1,
    },
    packageName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    packageSub: {
        fontSize: 12,
        color: COLORS.gray,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingHorizontal: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    claimButton: {
        flexDirection: 'row',
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    claimButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});
