import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
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
    const [ads, setAds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchPopupAds();
    }, []);

    const fetchPopupAds = async () => {
        try {
            // Fetch multiple popup ads
            const response = await api.get<{ success: boolean; data: any[] }>('/api/cars?isPopupPromotion=true&limit=10');

            if (response.success && response.data.length > 0) {
                setAds(response.data);

                // Show popup after a short delay
                setTimeout(() => {
                    setVisible(true);
                }, 3000);
            }
        } catch (error) {
            console.error("Error fetching popup ads:", error);
        }
    };

    // Auto-play for the popup slider
    useEffect(() => {
        if (!visible || ads.length <= 1) return;

        autoPlayTimer.current = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % ads.length;
                scrollViewRef.current?.scrollTo({
                    x: next * (width * 0.85),
                    animated: true
                });
                return next;
            });
        }, 4000);

        return () => {
            if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
        };
    }, [visible, ads]);

    const handleScroll = (event: any) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / (width * 0.85));
        if (index !== currentIndex && index >= 0 && index < ads.length) {
            setCurrentIndex(index);
        }
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handlePress = (ad: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setVisible(false);
        if (ad && ad.id) {
            router.push(`/cars/${ad.id}`);
        }
    };

    if (ads.length === 0) return null;

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

                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={styles.slider}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {ads.map((ad, index) => (
                            <TouchableOpacity
                                key={`popup-ad-${ad.id}`}
                                activeOpacity={0.9}
                                onPress={() => handlePress(ad)}
                                style={styles.slide}
                            >
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

                                    <View style={styles.ctaButton}>
                                        <Text style={styles.ctaText}>View Details</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Pagination Dots */}
                    {ads.length > 1 && (
                        <View style={styles.dotsContainer}>
                            {ads.map((_, i) => (
                                <View
                                    key={`dot-${i}`}
                                    style={[
                                        styles.dot,
                                        i === currentIndex ? styles.dotActive : styles.dotInactive
                                    ]}
                                />
                            ))}
                        </View>
                    )}
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
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 20,
    },
    slider: {
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
    },
    slide: {
        width: width * 0.85,
    },
    image: {
        width: '100%',
        height: 280,
    },
    textContainer: {
        padding: 24,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    tag: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 10,
    },
    tagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 8,
        color: '#111827',
        letterSpacing: -0.5,
    },
    price: {
        fontSize: 22,
        fontWeight: '900',
        color: '#2563EB',
        marginBottom: 20,
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        gap: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    ctaText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    dotsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 180, // Positioned above the text container
        alignSelf: 'center',
        zIndex: 15,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 20,
        backgroundColor: '#fff',
    },
    dotInactive: {
        width: 6,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
});

export default BoostPopup;
