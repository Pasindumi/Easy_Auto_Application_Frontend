import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import COLORS from "@/constants/Colors";
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
    Dimensions
} from 'react-native';
import { ENDPOINTS } from '../../constants/API';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SelectVehicleTypeScreen() {
    const router = useRouter();
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
        router.push({
            pathname: '/cars/sell-car',
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

    const renderItem = ({ item }: { item: any }) => {
        const iconData = getIcon(item.type_name);
        const IconLib = iconData.lib;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleSelect(item)}
                activeOpacity={0.9}
            >
                <LinearGradient
                    colors={[COLORS.white, '#F8FAFC']}
                    style={styles.cardGradient}
                >
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['#EFF6FF', '#DBEAFE']}
                            style={styles.iconBackground}
                        >
                            <IconLib name={iconData.name as any} size={32} color={COLORS.primary} />
                        </LinearGradient>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.cardTitle}>{item.type_name}</Text>
                        <Text style={styles.cardSubtitle}>Sell your {item.type_name}</Text>
                    </View>

                    <View style={styles.arrowContainer}>
                        <Ionicons name="arrow-forward" size={20} color={COLORS.primary} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

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
            <Header showBack={true} title="Select Type" />

            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>What are you selling?</Text>
                <Text style={styles.headerSubtitle}>Choose the vehicle category to proceed</Text>
            </View>

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
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.text.primary,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 14,
        color: COLORS.text.muted,
        fontWeight: '500',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    card: {
        width: (width - 56) / 2, // 20px padding * 2, 16px gap
        borderRadius: 20,
        backgroundColor: COLORS.white,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    cardGradient: {
        padding: 16,
        alignItems: 'center',
        height: 160,
        justifyContent: 'space-between',
    },
    iconContainer: {
        marginBottom: 12,
    },
    iconBackground: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: 4,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 11,
        color: COLORS.text.muted,
        textAlign: 'center',
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
