import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Platform,
    Alert
} from 'react-native';
import { ENDPOINTS } from '../../constants/API';
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { useAuth } from '../../context/AuthContext';

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
            const response = await fetch(`${ENDPOINTS.VEHICLE_CONFIG}/types`);
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
        if (n.includes('car')) return 'directions-car';
        if (n.includes('bike') || n.includes('motor')) return 'two-wheeler';
        if (n.includes('three')) return 'electric-rickshaw';
        if (n.includes('van')) return 'airport-shuttle';
        if (n.includes('bus')) return 'directions-bus';
        if (n.includes('lorry') || n.includes('truck')) return 'local-shipping';
        return 'directions-car';
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleSelect(item)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: COLORS.primary + '15' }]}>
                {/* @ts-ignore */}
                <MaterialIcons name={getIconName(item.type_name)} size={32} color={COLORS.primary} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{item.type_name}</Text>
                <Text style={styles.subLabel}>Sell your {item.type_name.toLowerCase()}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.text.gray} />
        </TouchableOpacity>
    );

    if (!isAuthenticated) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <Header showBack={true} />
                <View style={styles.authGuardContainer}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="lock-closed-outline" size={40} color={COLORS.primary} />
                    </View>
                    <Text style={styles.authGuardTitle}>Login Required</Text>
                    <Text style={styles.authGuardMessage}>Please login or create an account to sell your vehicles on Easy Auto.</Text>

                    <View style={styles.authButtonGroup}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <TouchableOpacity
                                style={[styles.authButton, { backgroundColor: COLORS.primary }]}
                                onPress={() => router.push('/auth/login')}
                            >
                                <Text style={[styles.authButtonText, { color: COLORS.white }]}>Login</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={[styles.authButton, { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.primary }]}
                                onPress={() => router.push('/auth/signup')}
                            >
                                <Text style={[styles.authButtonText, { color: COLORS.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Select Vehicle Type" />

            {/* Unified Sub-Header */}
            <View style={headerSectionStyles.headerWrap}>
                <View style={headerSectionStyles.header}>
                    <MaterialIcons name="add-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text style={headerSectionStyles.headerTitle}>What are you selling?</Text>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={48} color={COLORS.primary} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchTypes}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={vehicleTypes}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No vehicle types available.</Text>}
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
    listContent: {
        padding: 20,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 4,
    },
    subLabel: {
        fontSize: 13,
        color: '#6B7280',
    },
    authGuardContainer: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + '10', // Light primary background
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    authGuardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text.primary,
        marginBottom: 12,
    },
    authGuardMessage: {
        fontSize: 16,
        color: COLORS.text.muted,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    authButtonGroup: {
        flexDirection: 'row',
        width: '100%',
    },
    authButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 24,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
