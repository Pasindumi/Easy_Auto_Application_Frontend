import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import COLORS from "@/constants/Colors";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Dimensions,
    Image as RNImage,
    Animated,
    Pressable,
    StatusBar as RNStatusBar,
    Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ENDPOINTS } from '../../constants/API';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const CATEGORY_IMAGES: { [key: string]: any } = {
    'Car': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop',
    'Bike': 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=600&auto=format&fit=crop',
    'Motorbike': 'https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=600&auto=format&fit=crop',
    'Van': 'https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=600&auto=format&fit=crop',
    'Bus': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600&auto=format&fit=crop',
    'Truck': 'https://images.unsplash.com/photo-1586191582056-a60d0069f232?q=80&w=600&auto=format&fit=crop',
    'Lorry': 'https://images.unsplash.com/photo-1586191582056-a60d0069f232?q=80&w=600&auto=format&fit=crop',
    'Three Wheeler': 'https://images.unsplash.com/photo-1594140062402-463870629735?q=80&w=600&auto=format&fit=crop',
    'Heavy Machinery': 'https://images.unsplash.com/photo-1579412690850-bd41ec0ca047?q=80&w=600&auto=format&fit=crop',
    'default': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600&auto=format&fit=crop'
};

export default function SelectVehicleTypeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { mode } = useLocalSearchParams(); // 'sell' or 'rent'
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                // Sort to put Car first, then Van, then others alphabetically
                const sorted = [...data].sort((a, b) => {
                    const nameA = (a?.type_name || '').toLowerCase();
                    const nameB = (b?.type_name || '').toLowerCase();

                    if (nameA === nameB) return 0;
                    if (nameA === 'car') return -1;
                    if (nameB === 'car') return 1;
                    if (nameA === 'van') return -1;
                    if (nameB === 'van') return 1;

                    return nameA.localeCompare(nameB);
                });
                setVehicleTypes(sorted);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error: any) {
            console.error("Error fetching vehicle types:", error);
            setError(error.message || "Failed to fetch vehicle types");
            Alert.alert("Connection Error", "Could not reach the server. Please check your internet and if the server is running.");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTypes();
        }, [fetchTypes])
    );

    const handleSelect = (type: any) => {
        const pathname = mode === 'rent' ? '/cars/create-rental-ad' : '/cars/sell-car';
        router.push({
            pathname: pathname as any,
            params: {
                vehicleType: type.type_name,
                vehicleTypeId: type.id
            }
        });
    };

    // Helper to get icon family/name safely
    const getIcon = (name: string) => {
        const n = (name || '').toLowerCase();
        if (n.includes('car')) return { lib: Ionicons, name: 'car-sport' };
        if (n.includes('bike') || n.includes('motor')) return { lib: MaterialCommunityIcons, name: 'motorbike' };
        if (n.includes('three')) return { lib: MaterialCommunityIcons, name: 'rickshaw' };
        if (n.includes('van')) return { lib: MaterialCommunityIcons, name: 'van-passenger' };
        if (n.includes('bus')) return { lib: Ionicons, name: 'bus' };
        if (n.includes('lorry') || n.includes('truck')) return { lib: MaterialCommunityIcons, name: 'truck' };
        if (n.includes('heavy') || n.includes('machinery')) return { lib: MaterialCommunityIcons, name: 'excavator' };
        return { lib: Ionicons, name: 'car' };
    };

    const CategoryCard = ({ item, onSelect }: { item: any, onSelect: (item: any) => void }) => {
        const scaleAnim = React.useRef(new Animated.Value(1)).current;
        const iconData = getIcon(item?.type_name);
        const IconLib = iconData.lib;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.95,
                useNativeDriver: true,
                speed: 20
            }).start();
        };

        const handlePressOut = () => {
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                friction: 4,
                tension: 40
            }).start();
        };

        const onPress = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onSelect(item);
        };

        return (
            <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
                <Pressable
                    style={styles.card}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onPress}
                >
                    <View style={styles.cardImageContainer}>
                        <RNImage
                            source={{ uri: item.type_image || CATEGORY_IMAGES[item.type_name] || CATEGORY_IMAGES['default'] }}
                            style={styles.cardImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.imageOverlay}
                        />
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.categoryIconCircle}>
                            <IconLib name={iconData.name as any} size={22} color={COLORS.primary} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.cardTitle}>{item?.type_name || 'Unknown'}</Text>
                            <Text style={styles.cardSubtitle}>{mode === 'rent' ? 'Rent' : 'Sell'} Category</Text>
                        </View>
                        <View style={styles.arrowIcon}>
                            <MaterialIcons name="chevron-right" size={20} color={COLORS.text.muted} />
                        </View>
                    </View>
                </Pressable>
            </Animated.View>
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <CategoryCard
            item={item}
            onSelect={handleSelect}
        />
    );

    if (authLoading) {
        return (
            <View style={styles.centerContainer}>
                <Loading message="Checking session..." />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title="Sell Your Vehicle" />
                <View style={styles.authGuardContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed" size={30} color={COLORS.primary} />
                    </View>
                    <Text style={styles.authGuardTitle}>Login Required</Text>
                    <Text style={styles.authGuardMessage}>Please login or create an account to sell your vehicle on Easy Auto.</Text>

                    <View style={styles.authButtonGroup}>
                        <TouchableOpacity
                            style={[styles.authButton, styles.loginButton]}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={styles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.authButton, styles.signupButton]}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={styles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />

            {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primary]}
                style={[styles.header, { paddingTop: insets.top + 4 }]}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleArea}>
                        <Text style={styles.headerTitleText}>
                            {mode === 'rent' ? 'What are you renting?' : 'What are you selling?'}
                        </Text>
                    </View>

                    <View pointerEvents="none" style={styles.headerLogoContainer}>
                        <RNImage
                            source={require("@/assets/logoHome.png")}
                            resizeMode="contain"
                            style={styles.logoImg}
                        />
                    </View>
                </View>
                <View style={styles.headerSubtitleArea}>
                    <Text style={styles.headerSubtitleText}>Choose a vehicle category to proceed</Text>
                </View>
            </LinearGradient>

            {loading ? (
                <View style={styles.centerContainer}>
                    <Loading message="Loading vehicle types..." />
                </View>
            ) : error ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={COLORS.status.danger} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchTypes}>
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={vehicleTypes}
                    ListEmptyComponent={() => (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Text style={{ color: COLORS.text.muted, textAlign: 'center', fontSize: 16 }}>No vehicle categories available at the moment.</Text>
                        </View>
                    )}
                    renderItem={renderItem}
                    keyExtractor={item => item?.id?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={1}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        zIndex: 100,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    headerLogoContainer: {
        width: 100,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    logoImg: { width: 100, height: 26 },
    headerTitleArea: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 8,
    },
    headerTitleText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
    headerSubtitleArea: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
        marginBottom: 8,
    },
    headerSubtitleText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    cardContainer: {
        width: width - 40, // 20px padding * 2
        marginBottom: 30,
    },
    card: {
        borderRadius: 5,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        overflow: 'hidden',
    },
    cardImageContainer: {
        height: 160,
        backgroundColor: '#F1F5F9',
        position: 'relative',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    cardContent: {
        padding: 12,
        alignItems: 'center',
        position: 'relative',
    },
    categoryIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 5,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -38,
        borderWidth: 2,
        borderColor: COLORS.white,
        zIndex: 10,
    },
    textContainer: {
        alignItems: 'center',
        marginTop: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: COLORS.text.primary,
        marginBottom: 2,
        letterSpacing: -0.5,
    },
    cardSubtitle: {
        fontSize: 11,
        color: COLORS.text.muted,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    arrowIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        opacity: 0.3,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    authGuardContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 5,
        backgroundColor: 'rgba(35, 92, 248, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    authGuardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#64748B', // Gray color
        marginBottom: 10,
    },
    authGuardMessage: {
        fontSize: 15,
        color: COLORS.text.muted,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    authButtonGroup: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    authButton: {
        flex: 1,
        height: 44,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: COLORS.primary,
    },
    signupButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1.5,
        borderColor: COLORS.primary,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    signupButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.primary,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.text.muted,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
    },
    retryButtonText: {
        color: COLORS.white,
        fontWeight: '700',
    },
});
