import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import SearchBar from '@/components/SearchBar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    Image as RNImage,
    Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { ENDPOINTS } from '../../constants/API';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

export default function SelectVehicleTypeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { mode } = useLocalSearchParams(); // 'sell' or 'rent'
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { colors, isDarkMode } = useTheme();

    const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    const fetchTypes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(ENDPOINTS.VEHICLE_CONFIG.TYPES, {
                headers: { 'Content-Type': 'application/json' },
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
                    return nameA.localeCompare(nameB);
                });
                setVehicleTypes(sorted);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error: any) {
            console.error("Error fetching vehicle types:", error);
            setError(error.message || "Failed to fetch vehicle types");
        } finally {
            setLoading(false);
        }
    }, [colors]);

    useFocusEffect(
        useCallback(() => {
            fetchTypes();
        }, [fetchTypes])
    );

    const filteredTypes = useMemo(() => {
        if (!searchQuery.trim()) return vehicleTypes;
        return vehicleTypes.filter(type =>
            type.type_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [vehicleTypes, searchQuery]);

    const handleSelect = (type: any) => {
        const pathname = mode === 'rent' ? '/cars/create-rental-ad' : '/cars/sell-car';
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({
            pathname: pathname as any,
            params: {
                vehicleType: type.type_name,
                vehicleTypeId: type.id
            }
        });
    };

    const getIcon = (name: string) => {
        const n = (name || '').toLowerCase();
        if (n.includes('car')) return { lib: Ionicons, name: 'car-sport' as const };
        if (n.includes('bike') || n.includes('motor')) return { lib: MaterialCommunityIcons, name: 'motorbike' as const };
        if (n.includes('three')) return { lib: MaterialCommunityIcons, name: 'rickshaw' as const };
        if (n.includes('van')) return { lib: MaterialCommunityIcons, name: 'van-passenger' as const };
        if (n.includes('bus')) return { lib: Ionicons, name: 'bus' as const };
        if (n.includes('lorry') || n.includes('truck')) return { lib: MaterialCommunityIcons, name: 'truck' as const };
        if (n.includes('heavy') || n.includes('machinery')) return { lib: MaterialCommunityIcons, name: 'excavator' as const };
        return { lib: Ionicons, name: 'car' as const };
    };

    const CategoryItem = ({ item }: { item: any }) => {
        const iconData = getIcon(item?.type_name);
        const IconLib = iconData.lib;

        return (
            <TouchableOpacity
                style={themeStyles.itemRow}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
            >
                <View style={[themeStyles.iconBox, { backgroundColor: isDarkMode ? colors.backgroundMuted : colors.primaryLight }]}>
                    <IconLib name={iconData.name as any} size={22} color={colors.primary} />
                </View>
                <View style={themeStyles.itemTextContainer}>
                    <Text style={themeStyles.itemTitle}>{item?.type_name || 'Unknown'}</Text>
                    <Text style={themeStyles.itemSubtitle}>{mode === 'rent' ? 'Rental' : 'Selling'} category</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.text.muted} />
            </TouchableOpacity>
        );
    };

    if (authLoading) {
        return (
            <View style={themeStyles.centerContainer}>
                <Loading message="Checking session..." />
            </View>
        );
    }

    if (!isAuthenticated) {
        return (
            <View style={themeStyles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} title={mode === 'rent' ? "Rent Your Vehicle" : "Sell Your Vehicle"} />
                <View style={themeStyles.authGuardContainer}>
                    <View style={themeStyles.iconCircle}>
                        <Ionicons name="lock-closed" size={32} color={colors.primary} />
                    </View>
                    <Text style={themeStyles.authGuardTitle}>Login Required</Text>
                    <Text style={themeStyles.authGuardMessage}>Please login or create an account to proceed with your listing.</Text>

                    <View style={themeStyles.authButtonGroup}>
                        <TouchableOpacity
                            style={[themeStyles.authButton, themeStyles.loginButton]}
                            onPress={() => router.push('/auth/login')}
                        >
                            <Text style={themeStyles.loginButtonText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[themeStyles.authButton, themeStyles.signupButton]}
                            onPress={() => router.push('/auth/signup')}
                        >
                            <Text style={themeStyles.signupButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={themeStyles.container}>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : [colors.primary, colors.primary]}
                style={[themeStyles.header, { paddingTop: insets.top + 4 }]}
            >
                <View style={themeStyles.headerTopRow}>
                    <TouchableOpacity style={themeStyles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={themeStyles.headerTitleArea}>
                        <Text style={themeStyles.headerTitleText}>
                            {mode === 'rent' ? 'Vehicle for Rent' : 'Vehicle for Sale'}
                        </Text>
                    </View>

                    <View pointerEvents="none" style={themeStyles.headerLogoContainer}>
                        <RNImage
                            source={require("@/assets/logoHome.png")}
                            resizeMode="contain"
                            style={themeStyles.logoImg}
                        />
                    </View>
                </View>
                <View style={themeStyles.headerSubtitleArea}>
                    <Text style={themeStyles.headerSubtitleText}>Choose a vehicle category to proceed</Text>
                </View>
            </LinearGradient>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search vehicle type..."
            />

            {loading && vehicleTypes.length === 0 ? (
                <View style={themeStyles.centerContainer}>
                    <Loading message="Loading categories..." />
                </View>
            ) : error ? (
                <View style={themeStyles.centerContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.status.danger} />
                    <Text style={themeStyles.errorText}>{error}</Text>
                    <TouchableOpacity style={themeStyles.retryButton} onPress={fetchTypes}>
                        <Text style={themeStyles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredTypes}
                    ListEmptyComponent={() => (
                        <View style={themeStyles.emptyContainer}>
                            <Ionicons name="search" size={48} color={colors.text.muted} />
                            <Text style={themeStyles.emptyText}>No categories match your search</Text>
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Text style={{ color: colors.primary, fontWeight: '700', marginTop: 8 }}>Clear search</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    renderItem={({ item }) => <CategoryItem item={item} />}
                    keyExtractor={item => item?.id?.toString() || Math.random().toString()}
                    contentContainerStyle={themeStyles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        elevation: 4,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
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
    logoImg: { width: 100, height: 26, tintColor: isDarkMode ? colors.text.primary : '#fff' },
    headerTitleArea: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 8,
    },
    headerTitleText: { color: isDarkMode ? colors.text.primary : 'white', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
    headerSubtitleArea: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    headerSubtitleText: { color: isDarkMode ? colors.text.muted : 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '600' },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 5,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
        letterSpacing: -0.3,
    },
    itemSubtitle: {
        fontSize: 12,
        color: colors.text.muted,
        fontWeight: '500',
        marginTop: 1,
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
        backgroundColor: isDarkMode ? colors.backgroundSecondary : 'rgba(35, 92, 248, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    authGuardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text.primary,
        marginBottom: 10,
    },
    authGuardMessage: {
        fontSize: 15,
        color: colors.text.muted,
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
        height: 48,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButton: {
        backgroundColor: colors.primary,
    },
    signupButton: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    loginButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    signupButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
    errorText: {
        fontSize: 16,
        color: colors.text.muted,
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: colors.primary,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '700',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 16,
        color: colors.text.muted,
        marginTop: 12,
        fontWeight: '600',
    }
});

