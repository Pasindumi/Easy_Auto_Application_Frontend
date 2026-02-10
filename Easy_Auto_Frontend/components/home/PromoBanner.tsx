import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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

const { width } = Dimensions.get("window");

const STATIC_BANNERS = [
    {
        id: 'static-1',
        title: "Find Your Dream Car",
        subtitle: "Browse thousand of verified listings",
        image:
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
        isAd: false
    },
    {
        id: 'static-2',
        title: "Sell Your Car in a Minute",
        subtitle: "Get instant Quotes from Verified Dealers",
        image:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop",
        isAd: false
    },
    {
        id: 'static-3',
        title: "Best Deals Available",
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

import { api } from "@/utils/api";
import { useRouter } from "expo-router";

const PromoBanner: React.FC<PromoBannerProps> = ({ fadeAnim, scaleAnim }) => {
    const router = useRouter();
    const [banners, setBanners] = useState<any[]>([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        fetchAllBanners();
    }, []);

    const fetchAllBanners = async () => {
        try {
            // Fetch both boosted ads and announcements in parallel
            const [adsRes, announcementsRes] = await Promise.all([
                api.get<{ success: boolean; data: any[] }>('/api/cars?isHomepageBanner=true&limit=5'),
                api.get<{ success: boolean; data: any[] }>('/api/announcements/active')
            ]);

            let combinedBanners: any[] = [];

            // Add Boosted Ads
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

            // Add Announcements
            if (announcementsRes.data && announcementsRes.data.length > 0) {
                const announcements = announcementsRes.data.map((ann: any) => ({
                    id: `ann-${ann.id}`,
                    title: ann.title,
                    subtitle: ann.content || '',
                    image: ann.image_url || "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80",
                    isAd: false,
                    link: ann.link
                }));
                combinedBanners = [...combinedBanners, ...announcements];
            }

            // If no banners at all, maybe add a default one or leave empty
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
        }
    };

    // Auto-play functionality
    useEffect(() => {
        if (banners.length <= 1) return;

        autoPlayTimer.current = setInterval(() => {
            setCurrentBannerIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % banners.length;
                scrollViewRef.current?.scrollTo({
                    x: nextIndex * (width - 40),
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
    }, [banners]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const bannerWidth = width - 40;
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
            x: index * (width - 40),
            animated: true,
        });
    };

    const handleBannerPress = (banner: any) => {
        if (banner.isAd && banner.adId) {
            router.push(`/cars/${banner.adId}`);
        } else if (banner.link) {
            // Handle external or internal link if needed
            // For now just navigate to search if no link
            console.log("Announcement link:", banner.link);
        } else {
            router.push('/(tabs)/search');
        }
    };

    return (
        <Animated.View
            style={[
                styles.bannerContainer,
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
                style={styles.bannerScrollView}
            >
                {banners.map((banner) => (
                    <View key={`banner-${banner.id}`} style={styles.banner}>
                        <Image
                            source={banner.image}
                            style={styles.bannerImage}
                            contentFit="cover"
                            transition={300}
                        />
                        <View style={styles.bannerGradientOverlay} />
                        <View style={styles.bannerOverlay} />
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>{banner.title}</Text>
                            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                            <TouchableOpacity style={styles.bannerCTA} onPress={() => handleBannerPress(banner)}>
                                <Text style={styles.bannerCTAText}>{banner.isAd ? "View Ad" : "Explore Now"}</Text>
                                <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.carouselDots}>
                {banners.map((_, index) => (
                    <TouchableOpacity
                        key={`banner-dot-${index}`}
                        onPress={() => handleDotPress(index)}
                        activeOpacity={0.7}
                    >
                        <View
                            style={[
                                styles.dot,
                                index === currentBannerIndex
                                    ? styles.dotActive
                                    : styles.dotInactive,
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        paddingHorizontal: 20,
        marginBottom: 16,
        paddingTop: 8,
    },
    bannerScrollView: {
        marginBottom: 16,
    },
    banner: {
        backgroundColor: "#2C3E50",
        borderRadius: 24,
        height: 220,
        width: width - 40,
        overflow: "hidden",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
        marginRight: 0,
    },
    bannerImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
    },
    bannerGradientOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "70%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bannerOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    bannerContent: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        zIndex: 2,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    bannerSubtitle: {
        fontSize: 15,
        color: "#FFFFFF",
        opacity: 0.95,
        fontWeight: "400",
        lineHeight: 22,
        marginBottom: 16,
    },
    bannerCTA: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        alignSelf: "flex-start",
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
    bannerCTAText: {
        fontSize: 15,
        fontWeight: "700",
        color: "#235CF8",
        letterSpacing: -0.2,
    },
    carouselDots: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        alignItems: "center",
        marginTop: 4,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 32,
        backgroundColor: "#235CF8",
        shadowColor: "#235CF8",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 4,
    },
    dotInactive: {
        width: 8,
        backgroundColor: "#D1D5DB",
        opacity: 0.6,
    },
});

export default PromoBanner;
