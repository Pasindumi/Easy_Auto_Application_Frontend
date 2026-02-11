import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { api } from "@/utils/api";
import { useRouter } from "expo-router";
import COLORS from "@/constants/Colors";

const { width } = Dimensions.get("window");

const STATIC_BANNERS = [
    {
        id: 'static-1',
        title: "Find Your Dream Car",
        subtitle: "Browse thousands of verified listings",
        image:
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
        isAd: false
    },
    {
        id: 'static-2',
        title: "Sell Your Car Fast",
        subtitle: "Get instant quotes from verified dealers",
        image:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop",
        isAd: false
    },
    {
        id: 'static-3',
        title: "Best Market Deals",
        subtitle: "Compare prices and find the perfect match",
        image:
            "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop",
        isAd: false
    },
];

interface PromoBannerProps {
    fadeAnim: Animated.Value;
    scaleAnim: Animated.Value;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ fadeAnim, scaleAnim }) => {
    const router = useRouter();
    const [banners, setBanners] = useState<any[]>(STATIC_BANNERS);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchBoostedAds();
    }, []);

    const fetchBoostedAds = async () => {
        try {
            const response = await api.get<{ success: boolean; data: any[] }>('/api/cars?isHomepageBanner=true&limit=5');
            if (response.success && response.data.length > 0) {
                const boostedBanners = response.data.map((ad: any) => ({
                    id: `ad-${ad.id}`,
                    title: ad.title,
                    subtitle: `LKR ${Number(ad.price).toLocaleString()}`,
                    image: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80",
                    isAd: true,
                    adId: ad.id
                }));
                setBanners([...boostedBanners, ...STATIC_BANNERS]);
            }
        } catch (error) {
            console.error("Error fetching banner ads:", error);
        }
    };

    // Auto-play functionality
    useEffect(() => {
        autoPlayTimer.current = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % banners.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * (width - 32), // Adjusted for margin
                    animated: true,
                });
                return nextIndex;
            });
        }, 5000);

        return () => {
            if (autoPlayTimer.current) {
                clearInterval(autoPlayTimer.current);
            }
        };
    }, [banners.length]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const bannerWidth = width - 32;
        const index = Math.round(scrollPosition / bannerWidth);
        if (
            index !== currentBannerIndex &&
            index >= 0 &&
            index < banners.length
        ) {
            setCurrentBannerIndex(index);
        }
    };

    const handleDotPress = (index: number) => {
        setCurrentBannerIndex(index);
        scrollViewRef.current?.scrollTo({
            x: index * (width - 32),
            animated: true,
        });
    };

    const handleBannerPress = (banner: any) => {
        if (banner.isAd && banner.adId) {
            router.push(`/cars/${banner.adId}` as any);
        } else {
            router.push('/(tabs)/search');
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styles.scrollContent}
                decelerationRate="fast"
                snapToInterval={width - 32}
            >
                {banners.map((banner, index) => (
                    <View key={`banner-${banner.id}-${index}`} style={styles.bannerWrapper}>
                         <TouchableOpacity 
                            activeOpacity={0.9}
                            onPress={() => handleBannerPress(banner)}
                            style={styles.bannerCard}
                        >
                            <Image
                                source={banner.image}
                                style={styles.bannerImage}
                                contentFit="cover"
                                transition={500}
                            />
                            
                            {/* Premium Gradient Overlay */}
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                                style={styles.gradient}
                            />

                            <View style={styles.contentContainer}>
                                {banner.isAd && (
                                    <View style={styles.adBadge}>
                                        <Text style={styles.adBadgeText}>Featured</Text>
                                    </View>
                                )}
                                <Text style={styles.title} numberOfLines={2}>{banner.title}</Text>
                                <Text style={styles.subtitle} numberOfLines={1}>{banner.subtitle}</Text>
                                
                                <View style={styles.ctaButton}>
                                    <Text style={styles.ctaText}>{banner.isAd ? "View Details" : "Explore"}</Text>
                                    <MaterialIcons name="arrow-forward" size={16} color={COLORS.white} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {banners.map((_, index) => (
                    <Animated.View
                        key={`dot-${index}`}
                        style={[
                            styles.dot,
                            index === currentBannerIndex ? styles.dotActive : styles.dotInactive
                        ]}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
        marginBottom: 24,
    },
    scrollContent: {
        paddingHorizontal: 16,
    },
    bannerWrapper: {
        width: width - 32,
        height: 200,
        marginRight: 0, 
    },
    bannerCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: COLORS.secondary,
        position: 'relative',
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    adBadge: {
        backgroundColor: COLORS.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    adBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 16,
        fontWeight: '500',
    },
    ctaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    ctaText: {
        color: COLORS.white,
        fontSize: 13,
        fontWeight: '600',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 24,
        backgroundColor: COLORS.primary,
    },
    dotInactive: {
        width: 6,
        backgroundColor: COLORS.border,
    },
});

export default PromoBanner;
