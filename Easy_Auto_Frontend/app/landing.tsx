import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { api } from '@/utils/api';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LandingPage = () => {
    const router = useRouter();
    const [ads, setAds] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        // Fade in animation
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        fetchPopupAds();
    }, []);

    const fetchPopupAds = async () => {
        try {
            const response = await api.get<{ success: boolean; data: any[] }>('/api/cars?isPopupPromotion=true&limit=5');
            if (response.success && response.data.length > 0) {
                setAds(response.data);
            }
        } catch (error) {
            console.error("Error fetching landing ads:", error);
        }
    };

    // Auto-play for the slider
    useEffect(() => {
        if (ads.length <= 1) return;

        autoPlayTimer.current = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % ads.length;
                scrollViewRef.current?.scrollTo({
                    x: next * width,
                    animated: true
                });
                return next;
            });
        }, 4000);

        return () => {
            if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
        };
    }, [ads]);

    // Blinking animation for "Touch to continue"
    const blinkAnim = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(blinkAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const handleScroll = (event: any) => {
        const xOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(xOffset / width);
        if (index !== currentIndex && index >= 0 && index < ads.length) {
            setCurrentIndex(index);
        }
    };

    const handleContinue = () => {
        router.replace('/(tabs)');
    };

    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={handleContinue}
        >
            <StatusBar style="light" />
            <LinearGradient
                colors={['#1F2937', '#111827', '#000000']}
                style={styles.background}
            />

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Logo and App Name */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/applogonew.png')}
                        style={styles.logo}
                        contentFit="contain"
                    />
                    <Text style={styles.appName}>Easy Auto</Text>
                    <Text style={styles.tagline}>Your Dream Car Awaits</Text>
                </View>

                {/* Offers Carousel */}
                <View style={styles.carouselContainer}>
                    {ads.length > 0 ? (
                        <View>
                            <Text style={styles.sectionTitle}>Featured Offers</Text>
                            <ScrollView
                                ref={scrollViewRef}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onScroll={handleScroll}
                                scrollEventThrottle={16}
                                style={styles.slider}
                            >
                                {ads.map((ad, index) => (
                                    <View key={ad.id} style={styles.slide}>
                                        <Image
                                            source={{ uri: ad.AdImage?.[0]?.image_url }}
                                            style={styles.adImage}
                                            contentFit="cover"
                                        />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                                            style={styles.adGradient}
                                        >
                                            <Text style={styles.adTitle} numberOfLines={1}>{ad.title}</Text>
                                            <Text style={styles.adPrice}>LKR {Number(ad.price).toLocaleString()}</Text>
                                        </LinearGradient>
                                    </View>
                                ))}
                            </ScrollView>

                            {/* Pagination Dots */}
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
                        </View>
                    ) : (
                        // Placeholder or static content if no ads
                        <View style={styles.placeholderContainer}>
                            <Text style={styles.placeholderText}>Best Deals in Town</Text>
                        </View>
                    )}
                </View>

                {/* Touch to Continue */}
                <View style={styles.footerContainer}>
                    <Animated.Text style={[styles.continueText, { opacity: blinkAnim }]}>Touch to continue</Animated.Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 16,
        color: '#9CA3AF',
        marginTop: 8,
    },
    carouselContainer: {
        height: 300,
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginLeft: 20,
        marginBottom: 12,
        opacity: 0.9,
    },
    slider: {
        width: width,
        height: 220,
    },
    slide: {
        width: width,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    adImage: {
        width: width - 40,
        height: 220,
        borderRadius: 16,
    },
    adGradient: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 80,
        borderRadius: 16,
        justifyContent: 'flex-end',
        padding: 16,
    },
    adTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    adPrice: {
        color: '#3B82F6',
        fontSize: 16,
        fontWeight: '700',
        marginTop: 4,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        gap: 8,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: '#3B82F6',
    },
    dotInactive: {
        width: 8,
        backgroundColor: '#4B5563',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
    },
    placeholderText: {
        color: '#6B7280',
        fontSize: 20,
        fontWeight: '500',
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '500',
        opacity: 0.8,
        // Simple blinking effect could be added with animation loop if needed
    },
});

export default LandingPage;
