import Header from "@/components/Header";
import { COLORS } from "@/constants/Colors";
import { api } from "@/utils/api";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import Loading from "@/components/ui/Loading";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type Ad = {
    id: string;
    title: string;
    location: string;
    price: string;
    image: string;
    status: string;
    description?: string;
};

export default function DeleteRental() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ad, setAd] = useState<Ad | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [pausing, setPausing] = useState(false);

    const fetchAdDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<{ success: boolean; data: any }>(`/api/rentals/${id}`);
            if (response.success) {
                const data = response.data;
                setAd({
                    id: data.id,
                    title: data.title,
                    location: data.location,
                    price: data.price_per_day ? `Rs. ${Number(data.price_per_day).toLocaleString()}/day` : "Contact for Price",
                    image: data.rental_ad_images?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
                    status: data.status,
                    description: data.description,
                });
            }
        } catch (error) {
            console.error("Error fetching rental details:", error);
            Alert.alert("Error", "Could not load rental details.");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchAdDetails();
    }, [fetchAdDetails]);

    const handleConfirmDelete = () => {
        Alert.alert(
            "Confirm Delete",
            "Delete this rental ad from active management? It will move to the Deleted section and cannot be opened again.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: performDelete
                }
            ]
        );
    };

    const handleConfirmPause = () => {
        Alert.alert(
            "Pause Rental Ad",
            "Paused ads are hidden from buyers and may be automatically deleted after 14 days. You can resume the ad from the Paused section before that.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Pause Ad",
                    onPress: performPause
                }
            ]
        );
    };

    const performPause = async () => {
        setPausing(true);
        try {
            const pauseRes = await api.put<{ success: boolean; message?: string }>(`/api/rentals/${id}/status`, { status: 'PAUSED' });

            if (pauseRes.success) {
                Alert.alert("Paused", "The rental ad has been moved to the Paused section.", [
                    { text: "OK", onPress: () => router.replace('/(tabs)/my-ads') }
                ]);
            } else {
                Alert.alert("Error", pauseRes.message || "Failed to pause the rental ad.");
            }
        } catch (error: any) {
            console.error("Pause error:", error);
            const msg = error.response?.data?.error || error.response?.data?.message || "An unexpected error occurred.";
            Alert.alert("Error", msg);
        } finally {
            setPausing(false);
        }
    };

    const performDelete = async () => {
        setDeleting(true);
        try {
            const deleteRes = await api.delete<{ success: boolean; message?: string }>(`/api/rentals/${id}`);

            if (deleteRes.success) {
                Alert.alert("Deleted", "The rental ad has been moved to the Deleted section.", [
                    { text: "OK", onPress: () => router.replace('/(tabs)/my-ads') }
                ]);
            } else {
                Alert.alert("Error", deleteRes.message || "Failed to delete the ad.");
            }
        } catch (error: any) {
            console.error("Delete error:", error);
            const msg = error.response?.data?.error || error.response?.data?.message || "An unexpected error occurred.";
            Alert.alert("Error", msg);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
                <Loading size="large" />
            </View>
        );
    }

    if (!ad) {
        return (
            <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.text.muted }}>Rental ad not found</Text>
                <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
                    <Text style={{ color: COLORS.primary }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} />

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.pageHeader}>
                    <View style={styles.headerIcon}>
                        <Ionicons name="trash-outline" size={22} color={COLORS.status.danger} />
                    </View>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.pageTitle}>Delete Rental Ad</Text>
                        <Text style={styles.pageSubtitle}>Review the rental advertisement before removing it permanently.</Text>
                    </View>
                </View>

                <View style={styles.imageCard}>
                    <Image source={{ uri: ad.image }} style={styles.carImage} />
                </View>

                <View style={styles.infoCard}>
                    <View style={styles.warningBox}>
                            <Ionicons name="alert-circle-outline" size={18} color={COLORS.status.danger} />
                        <View style={styles.warningTextWrap}>
                            <Text style={styles.warnTitle}>Permanent deletion</Text>
                            <Text style={styles.warnText}>Delete moves the ad to the Deleted section. Pause hides it from buyers and keeps it available to resume for 14 days.</Text>
                        </View>
                    </View>

                    <View style={styles.detailsList}>
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Title</Text>
                            <Text style={styles.value}>{ad.title}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Location</Text>
                            <Text style={styles.value}>{ad.location}</Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.label}>Price</Text>
                            <Text style={styles.value}>{ad.price}</Text>
                        </View>

                        <View style={[styles.detailRow, styles.detailRowLast]}>
                            <Text style={styles.label}>Description</Text>
                            <Text style={styles.value}>{ad.description ?? 'No description'}</Text>
                        </View>
                    </View>

                    <View style={styles.buttonsRow}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn]}
                            onPress={() => router.back()}
                            disabled={deleting || pausing}
                        >
                            <Ionicons name="close-outline" size={18} color={COLORS.primary} />
                            <Text style={[styles.btnText, { color: COLORS.primary }]}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.pauseBtn]}
                            onPress={handleConfirmPause}
                            disabled={deleting || pausing}
                        >
                            {pausing ? (
                                <Loading size="small" />
                            ) : (
                                <>
                                    <Ionicons name="pause-outline" size={18} color={COLORS.status.warning} />
                                    <Text style={[styles.btnText, { color: COLORS.status.warning }]}>Pause</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.deleteBtn]}
                            onPress={handleConfirmDelete}
                            disabled={deleting || pausing}
                        >
                            {deleting ? (
                                <Loading size="small" />
                            ) : (
                                <>
                                    <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                                    <Text style={[styles.btnText, { color: COLORS.white }]}>Delete</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
    },
    headerIcon: {
        width: 42,
        height: 42,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.status.dangerLight,
        marginRight: 12,
    },
    headerTextWrap: {
        flex: 1,
    },
    pageTitle: {
        color: COLORS.text.primary,
        fontSize: 18,
        fontWeight: '600',
    },
    pageSubtitle: {
        color: COLORS.text.muted,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 3,
    },
    imageCard: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 6,
        marginBottom: 14,
    },
    carImage: {
        width: '100%',
        height: 180,
        borderRadius: 8,
        backgroundColor: COLORS.divider,
    },
    infoCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.status.dangerLight,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
        padding: 12,
        marginBottom: 14,
    },
    warningTextWrap: {
        flex: 1,
        marginLeft: 8,
    },
    warnTitle: {
        color: COLORS.status.danger,
        fontWeight: '600',
        fontSize: 14,
    },
    warnText: {
        color: COLORS.text.secondary,
        fontSize: 13,
        lineHeight: 18,
        marginTop: 3,
    },
    detailsList: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        overflow: 'hidden',
    },
    detailRow: {
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.divider,
    },
    detailRowLast: {
        borderBottomWidth: 0,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.text.muted,
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        color: COLORS.text.primary,
        lineHeight: 20,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
        marginTop: 16,
    },
    btn: {
        flex: 1,
        minHeight: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    cancelBtn: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pauseBtn: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    deleteBtn: {
        backgroundColor: COLORS.status.danger,
    },
    btnText: {
        marginLeft: 8,
        fontWeight: '600',
        fontSize: 14,
    },
});
