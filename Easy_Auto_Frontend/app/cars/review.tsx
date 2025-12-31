import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const API_URL = 'http://192.168.1.29:5000/api/cars'; // Replace with env var in real app

export default function ReviewAdScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [ad, setAd] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [mainImage, setMainImage] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            if (data.success) {
                setAd(data.data);
                // Set initial main image
                if (data.data.AdImage && data.data.AdImage.length > 0) {
                    setMainImage(data.data.AdImage[0].image_url);
                }
            } else {
                Alert.alert("Error", "Failed to load ad details.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error.");
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async () => {
        setPublishing(true);
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'ACTIVE' }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Your ad is now live!", [
                    { text: "View Listings", onPress: () => router.push('/listings') }
                ]);
            } else {
                Alert.alert("Error", data.message || "Failed to publish ad.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error.");
        } finally {
            setPublishing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!ad) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Ad not found.</Text>
            </View>
        );
    }

    const images = ad.AdImage || [];
    const details = Array.isArray(ad.CarDetails) ? ad.CarDetails[0] : (ad.CarDetails || {});
    // Mock user name if not in ad data directly (since we didn't add it to CarAd table yet, usually fetched via seller_id join or just passed)
    // For now we might not have it unless we join users table. 
    // Assuming backend might not return user name yet unless we adjusted getAdById to join users.
    // We'll leave it simple or just show "Owner".

    return (
        <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} title="Review Your Ad" />

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>This is a preview. Your ad is not visible to others yet.</Text>
                </View>

                {/* IMAGE GALLERY */}
                <View style={styles.imageSection}>
                    <Image
                        source={mainImage ? { uri: mainImage } : require('@/assets/images/car.jpg')}
                        style={styles.mainImage}
                    />
                    {images.length > 0 && (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailList}>
                            {images.map((img: any, index: number) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setMainImage(img.image_url)}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: img.image_url }}
                                        style={[
                                            styles.thumbnail,
                                            mainImage === img.image_url && styles.activeThumbnail
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* BASIC INFORMATION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Title:</Text>
                        <Text style={styles.value}>{ad.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Price:</Text>
                        <Text style={styles.priceValue}>{ad.price} {ad.negotiable ? '(Negotiable)' : ''}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Location:</Text>
                        <Text style={styles.value}>{ad.location}</Text>
                    </View>
                </View>

                {/* CAR DETAILS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Car Details</Text>
                    <View style={styles.detailsGrid}>
                        <DetailItem label="Condition" value={details.condition} />
                        <DetailItem label="Brand" value={details.brand} />
                        <DetailItem label="Model" value={details.model} />
                        <DetailItem label="Year" value={details.year} />
                        <DetailItem label="Mileage" value={details.mileage} />
                        <DetailItem label="Body Type" value={details.body_type} />
                        <DetailItem label="Fuel Type" value={details.fuel_type} />
                        <DetailItem label="Transmission" value={details.transmission} />
                        <DetailItem label="Engine (cc)" value={details.engine_capacity} />
                    </View>
                </View>

                {/* DESCRIPTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.descriptionText}>{ad.description || "No description provided."}</Text>
                </View>

                {/* CONTACT DETAILS */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Details</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Name:</Text>
                        <Text style={styles.value}>{ad.users?.name || "Owner"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Phone:</Text>
                        <Text style={styles.value}>{ad.users?.phone || "N/A"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{ad.users?.email || "N/A"}</Text>
                    </View>
                </View>

                {/* ACTIONS */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="create-outline" size={20} color={COLORS.primary} />
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.publishBtn}
                        onPress={handlePublish}
                        disabled={publishing}
                    >
                        {publishing ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                <Text style={styles.publishBtnText}>Post Ad Now</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}

const DetailItem = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailItem}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value || '-'}</Text>
    </View>
);

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        paddingBottom: 40,
    },
    banner: {
        backgroundColor: '#FFF9C4',
        padding: 12,
        alignItems: 'center',
        marginBottom: 10,
    },
    bannerText: {
        color: '#856404',
        fontWeight: '600',
    },
    imageSection: {
        marginBottom: 16,
        backgroundColor: 'white',
        paddingVertical: 16,
    },
    mainImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    thumbnailList: {
        marginTop: 10,
        paddingHorizontal: 16,
    },
    thumbnail: {
        width: 70,
        height: 50,
        borderRadius: 6,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    activeThumbnail: {
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    section: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 12,
        marginHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.divider,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
        // alignItems: 'center', 
    },
    label: {
        width: 100,
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
    },
    priceValue: {
        flex: 1,
        fontSize: 16,
        color: COLORS.primary,
        fontWeight: '700',
    },
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    detailItem: {
        width: '50%',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        color: '#1F2937',
        fontWeight: '600',
        marginTop: 2,
    },
    descriptionText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 22,
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 16,
        gap: 12,
    },
    editBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    editBtnText: {
        marginLeft: 8,
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 16,
    },
    publishBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
    },
    publishBtnText: {
        marginLeft: 8,
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
});
