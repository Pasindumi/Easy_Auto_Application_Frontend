import ActionGrid from "@/components/home/ActionGrid";
import BudgetRangeSection from "@/components/home/BudgetRangeSection";
import CarComparison from "@/components/home/CarComparison";
import ExploreByBrand from "@/components/home/ExploreByBrand";
import FlashSale from "@/components/home/FlashSale";
import { BackToTop } from "@/components/home/HomeCommon";
import HomeDrawers from "@/components/home/HomeDrawers";
import HomeHeader from "@/components/home/HomeHeader";
import HomeReviewsSlider from "@/components/home/HomeReviewsSlider";
import LoanCalculatorTeaser from "@/components/home/LoanCalculatorTeaser";
import MarketInsightsBanner from "@/components/home/MarketInsightsBanner";
import PromoBanner from "@/components/home/PromoBanner";
import QuickSellBanner from "@/components/home/QuickSellBanner";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import RecommendedCars from "@/components/home/RecommendedCars";
import TrendingCars from "@/components/home/TrendingCars";
import ValueProps from "@/components/home/ValueProps";
import BoostPopup from "@/components/home/BoostPopup";
import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/utils/api";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    NativeScrollEvent,
    NativeSyntheticEvent,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { isAuthenticated } = useAuth();

    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [notificationDrawerVisible, setNotificationDrawerVisible] = useState(false);
    const [wishlistDrawerVisible, setWishlistDrawerVisible] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showNotificationPreview, setShowNotificationPreview] = useState(false);
    const [showWishlistPreview, setShowWishlistPreview] = useState(false);
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

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

            <BoostPopup />
            <HomeDrawers
                sidebarVisible={sidebarVisible} setSidebarVisible={setSidebarVisible}
                notificationDrawerVisible={notificationDrawerVisible} setNotificationDrawerVisible={setNotificationDrawerVisible}
                wishlistDrawerVisible={wishlistDrawerVisible} setWishlistDrawerVisible={setWishlistDrawerVisible}
            />

            <HomeHeader
                initialHeaderOpacity={headerAnim}
                paddingTop={Math.max(insets.top, 10)}
                notificationCount={notificationCount}
                wishlistCount={wishlistCount}
                setSidebarVisible={setSidebarVisible}
                setNotificationDrawerVisible={setNotificationDrawerVisible}
                setWishlistDrawerVisible={setWishlistDrawerVisible}
                searchFocused={searchFocused}
                setSearchFocused={setSearchFocused}
                showSearchSuggestions={showSearchSuggestions}
                setShowSearchSuggestions={setShowSearchSuggestions}
            />


            <ScrollView
                ref={scrollRef}
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} colors={[COLORS.primary]} />
                }
            >
                <View style={styles.inner}>
                    {/* 1. Quick Actions */}
                    <View style={styles.section}>
                        <ActionGrid fadeAnim={fadeAnim} slideAnim={slideAnim} compareCount={0} newListingsCount={0} />
                    </View>

                    {/* 2. Sell Your Car CTA */}
                    <View style={styles.section}>
                        <QuickSellBanner fadeAnim={fadeAnim} />
                    </View>

                    {/* 3. Hero Promo Banners */}
                    <View style={styles.section}>
                        <PromoBanner fadeAnim={fadeAnim} scaleAnim={scaleAnim} />
                    </View>

                    {/* 5. Flash Deals */}
                    <View style={styles.section}>
                        <FlashSale fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 4. Platform Stats + Reviews (listings, dealers, ratings, users) */}
                    <View style={styles.section}>
                        <ValueProps fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 5. User Testimonials */}
                    <View style={styles.section}>
                        <HomeReviewsSlider />
                    </View>

                    {/* 6. Trending Section */}
                    <View style={styles.section}>
                        <TrendingCars fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 7. Budget Browse */}
                    <View style={styles.section}>
                        <BudgetRangeSection fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 8. Recommended Section */}
                    <View style={styles.section}>
                        <RecommendedCars fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 9. Explore Brands */}
                    <View style={styles.section}>
                        <ExploreByBrand fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 10. Recently Added */}
                    <View style={styles.section}>
                        <RecentlyViewed fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 11. Car Comparison Tool */}
                    <View style={styles.section}>
                        <CarComparison fadeAnim={fadeAnim} slideAnim={slideAnim} />
                    </View>

                    {/* 12. Trust Banner */}
                    <View style={[styles.section, { paddingVertical: 20 }]}>
                        <MarketInsightsBanner fadeAnim={fadeAnim} />
                    </View>

                    <View style={{ height: 40 }} />
                </View>
            </ScrollView>

            <BackToTop visible={showBackToTop} onPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#fff" },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: 110 },
    inner: { backgroundColor: "#fff" },
    section: { backgroundColor: "#fff" },
});
