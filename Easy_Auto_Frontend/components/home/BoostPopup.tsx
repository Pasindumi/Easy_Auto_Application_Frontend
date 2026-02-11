import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { api } from '@/utils/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/Colors';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

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
            // Using a dummy param for now or existing API
            const response = await api.get<{ success: boolean; data: any[] }>('/api/cars?status=ACTIVE&limit=5');

            if (response.success && response.data.length > 0) {
                const ads = response.data;
                const randomAd = ads[Math.floor(Math.random() * ads.length)];
                setAd(randomAd);

                // Show popup after a short delay
                setTimeout(() => {
                    setVisible(true);
                }, 3000);
            }
        } catch (error) {
            console.error("Error fetching popup ad:", error);
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
                        <Ionicons name="close-circle" size={32} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.95} onPress={handlePress} style={styles.content}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80" }}
                                style={styles.image}
                                contentFit="cover"
                            />
                            <View style={styles.tag}>
                                <Text style={styles.tagText}>Featured Deal</Text>
                            </View>
                        </View>
                        
                        <View style={styles.textContainer}>
                            <Text style={styles.title} numberOfLines={2}>{ad.title}</Text>
                            <Text style={styles.price}>
                                {Number(ad.price).toLocaleString('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 })}
                            </Text>

                            <TouchableOpacity style={styles.ctaButton} onPress={handlePress}>
                                <Text style={styles.ctaText}>View Offer</Text>
                                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
        width: width * 0.85,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    content: {
        width: '100%',
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 280,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    tag: {
        position: 'absolute',
        top: 16,
        left: 16,
        backgroundColor: COLORS.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    tagText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    textContainer: {
        padding: 24,
        backgroundColor: COLORS.white,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        color: COLORS.text.primary,
        letterSpacing: -0.5,
    },
    price: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.primary,
        marginBottom: 20,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 16,
        gap: 8,
        width: '100%',
        justifyContent: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
});

export default BoostPopup;
