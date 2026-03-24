import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import COLORS from "@/constants/Colors";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
    Pressable
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const { isAuthenticated } = useAuth();
    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTypes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES, {
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                },
            });
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setVehicleTypes(data);
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
    };

    useEffect(() => {
        fetchTypes();
    }, []);

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

    const getIconName = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('car')) return 'car-sport';
        if (n.includes('bike') || n.includes('motor')) return 'motorbike';
        if (n.includes('three')) return 'rickshaw'; // MaterialCommunityIcons has this? Checking fallback
        if (n.includes('van')) return 'van-utility';
        if (n.includes('bus')) return 'bus';
        if (n.includes('lorry') || n.includes('truck')) return 'truck';
        return 'car';
    };

    // Helper to get icon family/name safely
    const getIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('car')) return { lib: Ionicons, name: 'car-sport' };
        if (n.includes('bike') || n.includes('motor')) return { lib: MaterialCommunityIcons, name: 'motorbike' };
        if (n.includes('three')) return { lib: MaterialCommunityIcons, name: 'rickshaw-electric' }; // or tuktuk? using generic
        if (n.includes('van')) return { lib: MaterialCommunityIcons, name: 'van-passenger' };
        if (n.includes('bus')) return { lib: Ionicons, name: 'bus' };
        if (n.includes('lorry') || n.includes('truck')) return { lib: MaterialCommunityIcons, name: 'truck' };
        if (n.includes('heavy') || n.includes('machinery')) return { lib: MaterialCommunityIcons, name: 'excavator' };
        return { lib: Ionicons, name: 'car' };
    };

    const CategoryCard = ({ item, index, onSelect }: { item: any, index: number, onSelect: (item: any) => void }) => {
        const scaleAnim = React.useRef(new Animated.Value(1)).current;
        const iconData = getIcon(item.type_name);
        const IconLib = iconData.lib;

        const handlePressIn = () => {
            Animated.spring(scaleAnim, {
                toValue: 0.97,
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
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                            source={{ uri: CATEGORY_IMAGES[item.type_name] || CATEGORY_IMAGES['default'] }}
                            style={styles.cardImage}
                        />
                        <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.4)']}
                            style={StyleSheet.absoluteFill}
                        />
                    </View>

                    <View style={styles.cardContent}>
                        <View style={styles.categoryIconCircle}>
                            <IconLib name={iconData.name as any} size={24} color={COLORS.primary} />
                        </View>
                        <Text style={styles.cardTitle}>{item.type_name}</Text>
                        <Text style={styles.cardSubtitle}>{mode === 'rent' ? 'Rent' : 'Sell'}</Text>
                    </View>
                </Pressable>
            </Animated.View>
        );
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <CategoryCard 
            item={item} 
            index={index} 
            onSelect={handleSelect} 
        />
    );

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title="Sell Your Vehicle" />
                <View style={styles.authGuardContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed" size={40} color={COLORS.primary} />
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
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={[styles.header, { paddingTop: insets.top + 4 }]}
            >
                <View style={styles.headerTopRow}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <View pointerEvents="none" style={styles.logoCentre}>
                        <RNImage
                            source={require("@/assets/logoHome.png")}
                            resizeMode="contain"
                            style={styles.logoImg}
                        />
                    </View>
                </View>

                <View style={styles.headerTitleArea}>
                    <Text style={styles.headerTitleText}>
                        {mode === 'rent' ? 'What are you renting?' : 'What are you selling?'}
                    </Text>
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
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
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
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        zIndex: 100,
    },
    headerTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 40, marginBottom: 8 },
    backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
    logoCentre: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
    logoImg: { width: 90, height: 22 },
    headerTitleArea: { alignItems: 'center', justifyContent: 'center', marginTop: 4 },
    headerTitleText: { color: 'white', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
    headerSubtitleText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 2, fontWeight: '500' },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    cardContainer: {
        width: (width - 48) / 2, // 16px padding * 2, 16px gap
    },
    card: {
        borderRadius: 24,
        backgroundColor: COLORS.white,
        borderWidth: 1, borderColor: '#F1F5F9',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },
    cardImageContainer: {
        height: 110,
        backgroundColor: '#F1F5F9',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cardContent: {
        padding: 16,
        alignItems: 'center',
    },
    categoryIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 2,
    },
    cardSubtitle: {
        fontSize: 12,
        color: COLORS.text.muted,
        fontWeight: '600',
    },
    arrowContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
        opacity: 0.5,
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
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(35, 92, 248, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    authGuardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 12,
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
        height: 50,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
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
        borderRadius: 12,
    },
    retryButtonText: {
        color: COLORS.white,
        fontWeight: '700',
    },
});
