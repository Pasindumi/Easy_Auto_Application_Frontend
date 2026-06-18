import ActionGrid from "@/components/home/ActionGrid";
import CarComparison from "@/components/home/CarComparison";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";

import ExploreByBrand from "@/components/home/ExploreByBrand";
import { BackToTop } from "@/components/home/HomeCommon";
import HomeDrawers from "@/components/home/HomeDrawers";
import HomeHeader from "@/components/home/HomeHeader";
import HomeReviewsSlider from "@/components/home/HomeReviewsSlider";
import MarketInsightsBanner from "@/components/home/MarketInsightsBanner";
import NearYouCars from "@/components/home/NearYouCars";
// import PriceDropAlert from "@/components/home/PriceDropAlert";
import PromoBanner from "@/components/home/PromoBanner";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import RecommendedCars from "@/components/home/RecommendedCars";
import TrendingCars from "@/components/home/TrendingCars";
import ValueProps from "@/components/home/ValueProps";
import BoostPopup from "@/components/home/BoostPopup";
import SectionHeader from "@/components/home/SectionHeader";
import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";
import { useNotifications } from "@/hooks/useNotifications";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Easing,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const { isDarkMode, colors } = useTheme();

    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);
    const { unreadCount: notificationCount } = useNotifications();
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [trendingCategory, setTrendingCategory] = useState("All");
    const scrollRef = useRef<ScrollView>(null);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        setShowBackToTop(e.nativeEvent.contentOffset.y > 400);
    };

    useEffect(() => {
        if (isAuthenticated) fetchWishlistCount();
        else setWishlistCount(0);
    }, [isAuthenticated]);

    const fetchWishlistCount = async () => {
        try {
            const r = await api.get<{ success: boolean; data: any[] }>("/api/favorites");
            if (r.success) setWishlistCount(r.data.length);
        } catch { }
    };

    // Entrance animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const scaleAnim = useRef(new Animated.Value(0.97)).current;
    const headerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

    return (
        <View style={themeStyles.root}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? colors.backgroundSecondary : colors.white} />

            <BoostPopup />
            <HomeDrawers
                sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}
            />

            <HomeHeader
                initialHeaderOpacity={headerAnim}
                paddingTop={Math.max(insets.top, 10)}
                notificationCount={notificationCount}
                wishlistCount={wishlistCount}
                setSidebarVisible={setSidebarVisible}
            />


            <ScrollView
                ref={scrollRef}
                style={themeStyles.scroll}
                contentContainerStyle={themeStyles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
                }
            >
                <View style={themeStyles.inner}>
                    {/* 1. Explore Easyauto */}
                    <View style={themeStyles.section}>
                        <SectionHeader
                            title={t("home_screen.explore", "Explore EasyAuto")}
                        />
                        <ActionGrid fadeAnim={fadeAnim} slideAnim={slideAnim} compareCount={0} newListingsCount={0} />
                    </View>

                    {/* 2. Trending Now */}
                    <View style={themeStyles.section}>
                        <TrendingCars
                            fadeAnim={fadeAnim}
                            slideAnim={slideAnim}
                            trendingCategory={trendingCategory}
                            setTrendingCategory={setTrendingCategory}
                        />
                    </View>

                    {/* 3. Price Drop Alert - REMOVED AS PER USER REQUEST */}
                    {/* <View>
                        <PriceDropAlert fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View> */}

                    {/* 4. Near You Cars */}
                    <View style={themeStyles.section}>
                        <NearYouCars fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 5. Recommended for you */}
                    <View style={themeStyles.section}>
                        <RecommendedCars fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 6. Advertisement section */}
                    <View style={themeStyles.section}>
                        <PromoBanner fadeAnim={fadeAnim} scaleAnim={scaleAnim} />
                    </View>

                    {/* 7. New Arrivals */}
                    <View style={themeStyles.section}>
                        <RecentlyViewed fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 8. Compare Cars */}
                    <View style={themeStyles.section}>
                        <CarComparison fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 9. Easy Auto by Numbers */}
                    <View style={themeStyles.section}>
                        <ValueProps fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 10. Explore by Brand */}
                    <View style={themeStyles.section}>
                        <ExploreByBrand fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 11. Why EasyAuto Section */}
                    <View style={themeStyles.section}>
                        <MarketInsightsBanner fadeAnim={fadeAnim} />
                    </View>

                    {/* 12. User Testimonials */}
                    <View style={[themeStyles.section, { marginBottom: 20 }]}>
                        <HomeReviewsSlider />
                    </View>
                </View>
            </ScrollView>

            <BackToTop visible={showBackToTop} onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
        </View>
    );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 130 },
    inner: {
        backgroundColor: colors.background,
        gap: 48,
        paddingTop: 12,
    },
    section: {
        paddingVertical: 0,
        paddingBottom: 10,
    },
    sectionHeaderContainer: {
        paddingHorizontal: 20,
        marginBottom: 8,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: colors.text.primary,
        letterSpacing: -0.4,
    },
});

