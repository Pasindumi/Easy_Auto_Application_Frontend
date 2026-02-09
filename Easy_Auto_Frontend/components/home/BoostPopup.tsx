import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

const BoostPopup = () => {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [ad, setAd] = useState<any>(null);

    useEffect(() => {
        fetchPopupAd();
    }, []);

    const fetchPopupAd = async () => {
        try {
            // Fetch one random popup ad. Limit=5 to get a pool, then pick random.
            const response = await api.get<{ success: boolean; data: any[] }>('/api/cars?isPopupPromotion=true&limit=5');

            if (response.success && response.data.length > 0) {
                const ads = response.data;
                const randomAd = ads[Math.floor(Math.random() * ads.length)];
                setAd(randomAd);

                // Show popup after a short delay
                setTimeout(() => {
                    setVisible(true);
                }, 2000);
            }
        } catch (error) {
            console.error("Error fetching popup ad:", error);
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handlePress = () => {
        setVisible(false);
        if (ad && ad.id) {
            router.push(`/cars/${ad.id}`);
        }
    };

    if (!ad) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                        <Ionicons name="close-circle" size={28} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.9} onPress={handlePress} style={styles.content}>
                        <Image
                            source={{ uri: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80" }}
                            style={styles.image}
                            contentFit="cover"
                        />
                        <View style={styles.textContainer}>
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Featured Deal</Text>
                            </View>
                            <Text style={styles.title} numberOfLines={2}>{ad.title}</Text>
                            <Text style={styles.price}>LKR {Number(ad.price).toLocaleString()}</Text>

                            <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
                                <Text style={styles.ctaText}>View Details</Text>
                                <Ionicons name="arrow-forward" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        width: width * 0.85,
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 15,
    },
    content: {
        width: '100%',
    },
    image: {
        width: '100%',
        height: 250,
    },
    textContainer: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tag: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    tagText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        color: '#1F2937',
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2563EB',
        marginBottom: 16,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 25,
        gap: 8,
    },
    ctaText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default BoostPopup;
