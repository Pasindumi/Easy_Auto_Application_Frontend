import ActionGrid from "@/components/home/ActionGrid";
import CarComparison from "@/components/home/CarComparison";
import BrandedRefreshOverlay from "@/components/ui/BrandedRefreshOverlay";

import ExploreByBrand from "@/components/home/ExploreByBrand";
import FlashSale from "@/components/home/FlashSale";
import { BackToTop } from "@/components/home/HomeCommon";
import HomeDrawers from "@/components/home/HomeDrawers";
import HomeHeader from "@/components/home/HomeHeader";
import PromoBanner from "@/components/home/PromoBanner";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import RecommendedCars from "@/components/home/RecommendedCars";
import HomeReviewsSlider from "@/components/home/HomeReviewsSlider";
import TrendingCars from "@/components/home/TrendingCars";
import ValueProps from "@/components/home/ValueProps";
import BoostPopup from "@/components/home/BoostPopup";
import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
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
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth(); // Get auth state

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [wishlistDrawerVisible, setWishlistDrawerVisible] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [compareCount, setCompareCount] = useState(12);
  const [newListingsCount, setNewListingsCount] = useState(500);
  const [trendingCategory, setTrendingCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const mainScrollViewRef = useRef<ScrollView>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowBackToTop(offsetY > 300);
  };

  const scrollToTop = () => {
    mainScrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Previews / Initial Data
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }

    if (showNotificationPreview || showWishlistPreview) {
      const timer = setTimeout(() => {
        setShowNotificationPreview(false);
        setShowWishlistPreview(false);
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showNotificationPreview, showWishlistPreview, isAuthenticated]);

  const fetchWishlistCount = async () => {
    try {
      const response = await api.get<{ success: boolean; data: any[] }>("/api/favorites");
      if (response.success) {
        setWishlistCount(response.data.length);
      }
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const initialHeaderOpacity = useRef(new Animated.Value(0)).current;

  // Initial animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(initialHeaderOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Sidebars and Drawers */}
      <BoostPopup />
      <HomeDrawers
        sidebarVisible={sidebarVisible}
        setSidebarVisible={setSidebarVisible}
        notificationDrawerVisible={notificationDrawerVisible}
        setNotificationDrawerVisible={setNotificationDrawerVisible}
        wishlistDrawerVisible={wishlistDrawerVisible}
        setWishlistDrawerVisible={setWishlistDrawerVisible}
      />

      {/* Backdrop for previews */}
      {(showNotificationPreview || showWishlistPreview) && (
        <TouchableOpacity
          style={styles.previewBackdrop}
          activeOpacity={1}
          onPress={() => {
            setShowNotificationPreview(false);
            setShowWishlistPreview(false);
          }}
        />
      )}

      {/* Home Header with Integrated Search */}
      <HomeHeader
        initialHeaderOpacity={initialHeaderOpacity}
        paddingTop={Math.max(insets.top, 12)}
        notificationCount={notificationCount}
        setNotificationCount={setNotificationCount}
        wishlistCount={wishlistCount}
        setWishlistCount={setWishlistCount}
        setSidebarVisible={setSidebarVisible}
        setNotificationDrawerVisible={setNotificationDrawerVisible}
        setWishlistDrawerVisible={setWishlistDrawerVisible}
        showNotificationPreview={showNotificationPreview}
        setShowNotificationPreview={setShowNotificationPreview}
        showWishlistPreview={showWishlistPreview}
        setShowWishlistPreview={setShowWishlistPreview}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        showSearchSuggestions={showSearchSuggestions}
        setShowSearchSuggestions={setShowSearchSuggestions}
      />

      <BrandedRefreshOverlay refreshing={refreshing} top={120} />
      <ScrollView
        ref={mainScrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
      >

        {/* Promotional Banner (Hero) */}
        <PromoBanner fadeAnim={fadeAnim} scaleAnim={scaleAnim} />

        {/* Action Buttons Grid */}
        <ActionGrid
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          compareCount={compareCount}
          newListingsCount={newListingsCount}
        />

        {/* Value Propositions (Brief Trust Indicators) */}
        <ValueProps fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* Flash Sale Banner (High Urgency) */}
        <FlashSale fadeAnim={fadeAnim} slideAnim={slideAnim} />



        <View style={styles.spacer} />

        {/* Trending Cars Section */}
        <TrendingCars
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
          trendingCategory={trendingCategory}
          setTrendingCategory={setTrendingCategory}
        />

        <View style={styles.spacer} />

        {/* Recommended For You Section */}
        <RecommendedCars fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* Explore by Brand Section */}
        <ExploreByBrand fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* Recently Viewed Section */}
        <RecentlyViewed fadeAnim={fadeAnim} slideAnim={slideAnim} />

        <View style={styles.spacer} />

        {/* Compare Cars Section */}
        <CarComparison fadeAnim={fadeAnim} slideAnim={slideAnim} />

        {/* What Our Users Say Section */}
        <HomeReviewsSlider />
      </ScrollView>

      {/* Back to Top Button */}
      <BackToTop visible={showBackToTop} onPress={scrollToTop} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 8,
    marginHorizontal: 20,
    opacity: 0.5,
  },
  spacer: {
    height: 24,
  },
  previewBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    zIndex: 999,
  },
});
