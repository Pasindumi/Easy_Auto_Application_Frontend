import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { useTheme } from "@/contexts/ThemeContext";

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
    const { colors, isDarkMode } = useTheme();

    useEffect(() => {
        fetchAllBanners();
    }, []);

    const fetchAllBanners = async () => {
        try {
            const [adsRes, announcementsRes, discountsRes] = await Promise.all([
                api.get<{ success: boolean; data: any[] }>('/api/cars?isHomepageBanner=true&limit=5'),
                api.get<{ success: boolean; data: any[] }>('/api/announcements/active'),
                api.get<{ success: boolean; data: any[] }>('/api/discounts/active')
            ]);

            let combinedBanners: any[] = [];

            if (adsRes.success && adsRes.data.length > 0) {
                const boostedBanners = adsRes.data.map((ad: any) => ({
                    id: `ad-${ad.id}`,
                    title: ad.title,
                    subtitle: `LKR ${Number(ad.price).toLocaleString()}`,
                    image: ad.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80",
                    isAd: true,
                    adId: ad.id
                }));
                combinedBanners = [...combinedBanners, ...boostedBanners];
            }

            if (discountsRes.data && discountsRes.data.length > 0) {
                const discountBanners = discountsRes.data.map((discount: any) => ({
                    id: `discount-${discount.id}`,
                    title: discount.name,
                    subtitle: discount.discount_type === 'PERCENTAGE'
                        ? `${discount.value}% OFF`
                        : `Rs. ${discount.value} OFF`,
                    image: discount.offer_image_url || "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&h=400&fit=crop",
                    isDiscount: true,
                    discountId: discount.id,
                    link: null
                }));
                combinedBanners = [...combinedBanners, ...discountBanners];
            }

            if (announcementsRes.data && announcementsRes.data.length > 0) {
                const announcements = announcementsRes.data.map((ann: any) => ({
                    id: `ann-${ann.id}`,
                    title: ann.title,
                    subtitle: ann.content || '',
                    image: ann.image_url || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
                    isAd: false,
                    isDiscount: false,
                    link: ann.link
                }));
                combinedBanners = [...combinedBanners, ...announcements];
            }

            if (combinedBanners.length < 3) {
                combinedBanners = [...combinedBanners, ...STATIC_BANNERS];
            }

            if (combinedBanners.length === 0) {
                combinedBanners = [
                    {
                        id: 'default-1',
                        title: "Welcome to Easy Auto",
                        subtitle: "Your premium marketplace for vehicles",
                        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
                        isAd: false
                    }
                ];
            }

            setBanners(combinedBanners);
        } catch (error) {
            console.error("Error fetching banner data:", error);
            setBanners(STATIC_BANNERS);
        }
    };

    useEffect(() => {
        if (banners.length <= 1) return;

        autoPlayTimer.current = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % banners.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * width,
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
        const bannerWidth = width;
        const index = Math.round(scrollPosition / bannerWidth);
        if (
            index !== currentBannerIndex &&
            index >= 0 &&
            index < banners.length
        ) {
            setCurrentBannerIndex(index);
        }
    };

    const handleBannerPress = (banner: any) => {
        if (banner.isAd && banner.adId) {
            router.push(`/cars/${banner.adId}` as any);
        } else if (banner.link) {
            console.log("Announcement link:", banner.link);
        } else {
            router.push('/(tabs)/search');
        }
    };

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <Animated.View
            style={[
                themeStyles.container,
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
                contentContainerStyle={themeStyles.scrollContent}
                decelerationRate="fast"
                snapToInterval={width}
            >
                {banners.map((banner, index) => (
                    <View key={`banner-${banner.id}-${index}`} style={themeStyles.bannerWrapper}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => handleBannerPress(banner)}
                            style={themeStyles.bannerCard}
                        >
                            <Image
                                source={banner.image}
                                style={themeStyles.bannerImage}
                                contentFit="cover"
                                transition={500}
                            />

                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.8)']}
                                style={themeStyles.gradient}
                            />

                            <View style={themeStyles.contentContainer}>
                                {banner.isAd && (
                                    <View style={themeStyles.adBadge}>
                                        <Text style={themeStyles.adBadgeText}>Featured</Text>
                                    </View>
                                )}
                                {banner.isDiscount && (
                                    <View style={[themeStyles.adBadge, { backgroundColor: '#EF4444' }]}>
                                        <Text style={themeStyles.adBadgeText}>Offer</Text>
                                    </View>
                                )}
                                <Text style={themeStyles.title} numberOfLines={2}>{banner.title}</Text>
                                <Text style={themeStyles.subtitle} numberOfLines={1}>{banner.subtitle}</Text>

                                <View style={themeStyles.ctaButton}>
                                    <Text style={themeStyles.ctaText}>{banner.isAd ? "View Details" : "Explore"}</Text>
                                    <MaterialIcons name="arrow-forward" size={16} color={colors.white} />
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            <View style={themeStyles.pagination}>
                {banners.map((_, index) => (
                    <Animated.View
                        key={`dot-${index}`}
                        style={[
                            themeStyles.dot,
                            index === currentBannerIndex ? themeStyles.dotActive : themeStyles.dotInactive
                        ]}
                    />
                ))}
            </View>
        </Animated.View>
    );
};

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    container: {
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    bannerWrapper: {
        width: width - 40,
        height: 180,
        marginRight: 40,
    },
    bannerCard: {
        flex: 1,
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: colors.secondary,
        position: 'relative',
        borderWidth: 1,
        borderColor: isDarkMode ? colors.border : '#BFDBFE',
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
        borderRadius: 5,
    },
    contentContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
    },
    adBadge: {
        backgroundColor: colors.accent,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    adBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.white,
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
        borderRadius: 5,
        alignSelf: 'flex-start',
        gap: 6,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    ctaText: {
        color: colors.white,
        fontSize: 13,
        fontWeight: '700',
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
        backgroundColor: colors.primary,
    },
    dotInactive: {
        width: 6,
        backgroundColor: colors.border,
    },
});

export default PromoBanner;
