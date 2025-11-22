import NotificationDrawer from "@/components/notification-drawer";
import Sidebar from "@/components/sidebar";
import WishlistDrawer from "@/components/wishlist-drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Animated Button Component
const AnimatedButton = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
};

const BANNER_DATA = [
  {
    id: 1,
    title: "Find Your Dream Car",
    subtitle: "Browse thousand of verified listings",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Sell Your Car in a Minute",
    subtitle: "Get instant Quotes from Verified Dealers",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Best Deals Available",
    subtitle: "Compare prices and find the perfect match",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=400&fit=crop",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [wishlistDrawerVisible, setWishlistDrawerVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

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
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-play functionality
  useEffect(() => {
    autoPlayTimer.current = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % BANNER_DATA.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * (width - 40),
          animated: true,
        });
        return nextIndex;
      });
    }, 4000); // Change banner every 4 seconds

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const bannerWidth = width - 40; // Account for padding
    const index = Math.round(scrollPosition / bannerWidth);
    if (
      index !== currentBannerIndex &&
      index >= 0 &&
      index < BANNER_DATA.length
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#235CF8" />
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
      <NotificationDrawer
        visible={notificationDrawerVisible}
        onClose={() => setNotificationDrawerVisible(false)}
      />
      <WishlistDrawer
        visible={wishlistDrawerVisible}
        onClose={() => setWishlistDrawerVisible(false)}
      />
      <SafeAreaView style={styles.safeAreaTop} edges={["top"]}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: headerOpacity,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="menu" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Easy Auto</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setNotificationDrawerVisible(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="notifications-none"
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setWishlistDrawerVisible(true)}
                activeOpacity={0.7}
              >
                <MaterialIcons
                  name="favorite-border"
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={[
              styles.searchContainer,
              searchFocused && styles.searchContainerFocused,
            ]}
          >
            <MaterialIcons
              name="search"
              size={18}
              color={searchFocused ? "#235CF8" : "#9BA1A6"}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="what are you looking for?"
              placeholderTextColor="#9BA1A6"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons
                name="tune"
                size={18}
                color={searchFocused ? "#235CF8" : "#9BA1A6"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Find the Right Car By Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Find the Right Car By</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="account-balance-wallet"
                size={16}
                color="#235CF8"
              />
              <Text style={styles.filterPillText}>Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="local-gas-station"
                size={16}
                color="#235CF8"
              />
              <Text style={styles.filterPillText}>Fuel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons name="directions-car" size={16} color="#235CF8" />
              <Text style={styles.filterPillText}>Body Type</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons name="people" size={16} color="#235CF8" />
              <Text style={styles.filterPillText}>Seating</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Promotional Banner */}
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
            {BANNER_DATA.map((banner, index) => (
              <View key={banner.id} style={styles.banner}>
                <Image
                  source={{ uri: banner.image }}
                  style={styles.bannerImage}
                  contentFit="cover"
                  transition={300}
                />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.carouselDots}>
            {BANNER_DATA.map((_, index) => (
              <TouchableOpacity
                key={index}
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

        {/* Action Buttons Grid */}
        <Animated.View
          style={[
            styles.actionGridContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollableActionContainer}
            style={styles.scrollableActionScrollView}
          >
            <AnimatedButton delay={100}>
              <TouchableOpacity
                style={styles.scrollableActionCard}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#E3F2FD" },
                  ]}
                >
                  <MaterialIcons
                    name="directions-car"
                    size={32}
                    color="#1976D2"
                  />
                </View>
                <Text style={styles.scrollableActionLabel}>Buy a Car</Text>
              </TouchableOpacity>
            </AnimatedButton>

            <AnimatedButton delay={150}>
              <TouchableOpacity
                style={styles.scrollableActionCard}
                activeOpacity={0.85}
                onPress={() => router.push('/post-add')}
              >
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#FFF3E0" },
                  ]}
                >
                  <MaterialIcons name="sell" size={32} color="#F57C00" />
                </View>
                <Text style={styles.scrollableActionLabel}>Sell a Car</Text>
              </TouchableOpacity>
            </AnimatedButton>

            <AnimatedButton delay={200}>
              <TouchableOpacity
                style={styles.scrollableActionCard}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#E8F5E9" },
                  ]}
                >
                  <MaterialIcons name="vpn-key" size={32} color="#388E3C" />
                </View>
                <Text style={styles.scrollableActionLabel}>Rent a Car</Text>
              </TouchableOpacity>
            </AnimatedButton>

            <AnimatedButton delay={250}>
              <TouchableOpacity
                style={styles.scrollableActionCard}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#F3E5F5" },
                  ]}
                >
                  <MaterialIcons
                    name="compare-arrows"
                    size={32}
                    color="#7B1FA2"
                  />
                </View>
                <Text style={styles.scrollableActionLabel}>Compare</Text>
              </TouchableOpacity>
            </AnimatedButton>

            <AnimatedButton delay={300}>
              <TouchableOpacity
                style={styles.scrollableActionCard}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#FFEBEE" },
                  ]}
                >
                  <MaterialIcons name="store" size={32} color="#C62828" />
                </View>
                <Text style={styles.scrollableActionLabel}>Find Dealers</Text>
              </TouchableOpacity>
            </AnimatedButton>
          </ScrollView>
        </Animated.View>

        {/* Trending Cars Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Trending Cars</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[
              {
                model: "Nissan GTR R35",
                location: "Badulla, Sri Lanka",
                mileage: "180,000Km",
                price: "$75,000",
                image:
                  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop",
              },
              {
                model: "Range Rover Sport",
                location: "Badulla, Sri Lanka",
                mileage: "180,000Km",
                price: "$85,000",
                image:
                  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
              },
              {
                model: "Toyota Supra",
                location: "Colombo, Sri Lanka",
                mileage: "120,000Km",
                price: "$65,000",
                image:
                  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
              },
            ].map((car, index) => (
              <TouchableOpacity key={index} style={styles.trendingCarCard}>
                <View style={styles.trendingCarImageContainer}>
                  <Image
                    source={{ uri: car.image }}
                    style={styles.trendingCarImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={styles.trendingCarOverlay}>
                    <View style={styles.trendingCarInfo}>
                      <Text style={styles.trendingCarModel}>{car.model}</Text>
                      <View style={styles.trendingCarDetailsRow}>
                        <View style={styles.trendingCarLocationMileage}>
                          <Text style={styles.trendingCarLocation}>
                            {car.location}
                          </Text>
                          <Text style={styles.trendingCarMileage}>
                            {car.mileage}
                          </Text>
                        </View>
                        <TouchableOpacity style={styles.trendingPriceButton}>
                          <Text style={styles.trendingPriceText}>
                            {car.price}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recommended For You Section */}
        <Animated.View
          style={[
            styles.sectionWhite,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Recommended For You</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[
              {
                id: 1,
                name: "Nissan Juke 2025",
                distance: "2.5km away",
                price: "$4000",
                image:
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              },
              {
                id: 2,
                name: "Honda Civic 2024",
                distance: "5.2km away",
                price: "$3500",
                image:
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
              },
              {
                id: 3,
                name: "BMW 3 Series",
                distance: "3.8km away",
                price: "$12000",
                image:
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
              },
              {
                id: 4,
                name: "Mercedes C-Class",
                distance: "7.1km away",
                price: "$15000",
                image:
                  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
              },
            ].map((car) => (
              <TouchableOpacity key={car.id} style={styles.carCard}>
                <View style={styles.carImageContainer}>
                  <Image
                    source={{ uri: car.image }}
                    style={styles.carImage}
                    contentFit="cover"
                    transition={300}
                  />
                  <TouchableOpacity style={styles.favoriteButton}>
                    <MaterialIcons
                      name="favorite-border"
                      size={20}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.carOverlay}>
                    <View style={styles.carInfo}>
                      <Text style={styles.carName}>{car.name}</Text>
                      <View style={styles.carDetails}>
                        <Text style={styles.carDistance}>{car.distance}</Text>
                        <Text style={styles.carPrice}>{car.price}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Explore by Brand Section */}
        <Animated.View
          style={[
            styles.sectionWhite,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Explore by Brand</Text>
          <View style={styles.brandGrid}>
            {[
              {
                name: "Toyota",
                logo: require("@/assets/images/vehicle logo/toyota.svg"),
              },
              {
                name: "Honda",
                logo: require("@/assets/images/vehicle logo/honda.svg"),
              },
              {
                name: "Jeep",
                logo: require("@/assets/images/vehicle logo/jeep.svg"),
              },
              {
                name: "Hyundai",
                logo: require("@/assets/images/vehicle logo/hyundai.svg"),
              },
              {
                name: "Nissan",
                logo: require("@/assets/images/vehicle logo/nissan.svg"),
              },
              { name: "BMW", logo: null },
              { name: "Mercedes", logo: null },
              {
                name: "Volkswagen",
                logo: require("@/assets/images/vehicle logo/volkswagen.svg"),
              },
              {
                name: "KIA",
                logo: require("@/assets/images/vehicle logo/kia.svg"),
              },
              { name: "Audi", logo: null },
              {
                name: "Tesla",
                logo: require("@/assets/images/vehicle logo/tesla.svg"),
              },
              {
                name: "Land Rover",
                logo: require("@/assets/images/vehicle logo/land.svg"),
              },
            ].map((brand, index) => (
              <TouchableOpacity key={index} style={styles.brandCard}>
                <View style={styles.brandLogoContainer}>
                  {brand.logo ? (
                    <Image
                      source={brand.logo}
                      style={styles.brandLogoImage}
                      contentFit="contain"
                      transition={200}
                    />
                  ) : (
                    <Text style={styles.brandLogoText}>
                      {brand.name.substring(0, 2).toUpperCase()}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Brands</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Compare Cars Section */}
        <Animated.View
          style={[
            styles.sectionWhite,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Compare Cars</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[
              {
                id: 1,
                car1: {
                  name: "Range Rover",
                  model: "Sport",
                  price: "Rs.13.11 Lakh onwards",
                  image:
                    "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=300&h=200&fit=crop",
                },
                car2: {
                  name: "Range Rover",
                  model: "Evoque",
                  price: "Rs.12.45 Lakh onwards",
                  image:
                    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop",
                },
              },
              {
                id: 2,
                car1: {
                  name: "BMW",
                  model: "3 Series",
                  price: "Rs.45.50 Lakh onwards",
                  image:
                    "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=300&h=200&fit=crop",
                },
                car2: {
                  name: "Mercedes",
                  model: "C-Class",
                  price: "Rs.42.30 Lakh onwards",
                  image:
                    "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop",
                },
              },
            ].map((comparison) => (
              <TouchableOpacity key={comparison.id} style={styles.compareCard}>
                <View style={styles.compareContent}>
                  <View style={styles.compareCarImage}>
                    <Image
                      source={{ uri: comparison.car1.image }}
                      style={styles.compareCarImageStyle}
                      contentFit="cover"
                      transition={300}
                    />
                    <Text style={styles.compareCarName}>
                      {comparison.car1.name}{" "}
                      <Text style={styles.highlight}>
                        {comparison.car1.model}
                      </Text>
                    </Text>
                    <Text style={styles.comparePrice}>
                      {comparison.car1.price}
                    </Text>
                  </View>
                  <View style={styles.vsContainer}>
                    <View style={styles.vsLine} />
                    <View style={styles.vsCircle}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>
                    <View style={styles.vsLine} />
                  </View>
                  <View style={styles.compareCarImage}>
                    <Image
                      source={{ uri: comparison.car2.image }}
                      style={styles.compareCarImageStyle}
                      contentFit="cover"
                      transition={300}
                    />
                    <Text style={styles.compareCarName}>
                      {comparison.car2.name}{" "}
                      <Text style={styles.highlight}>
                        {comparison.car2.model}
                      </Text>
                    </Text>
                    <Text style={styles.comparePrice}>
                      {comparison.car2.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>More Comparisons</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* What Our Users Say Section */}
        <Animated.View
          style={[
            styles.sectionWhite,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoMargin}>What Our Users Say</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllLink}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[
              {
                name: "Tharushi Silva",
                rating: 5,
                quote:
                  "found my dream benz in just 2 days! Great platform and amazing deals.",
                avatar: "👩",
              },
              {
                name: "John Doe",
                rating: 5,
                quote:
                  "Excellent service and great selection of cars. Highly recommended!",
                avatar: "👨",
              },
            ].map((testimonial, index) => (
              <TouchableOpacity key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>{testimonial.avatar}</Text>
                  </View>
                  <View style={styles.testimonialInfo}>
                    <Text style={styles.testimonialName}>
                      {testimonial.name}
                    </Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <MaterialIcons
                          key={i}
                          name="star"
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.testimonialQuote}>
                  {'"'}
                  {testimonial.quote}
                  {'"'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeAreaTop: {
    backgroundColor: "#235CF8",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#235CF8",
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: -1,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 48,
    marginBottom: 4,
  },
  logoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  menuButton: {
    padding: 8,
    minWidth: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    minWidth: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#EBEEF2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchContainerFocused: {
    borderColor: "#235CF8",
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "400",
    paddingVertical: 0,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  sectionWhite: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionTitleNoMargin: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 0,
    letterSpacing: -0.3,
  },
  seeAllLink: {
    fontSize: 15,
    color: "#235CF8",
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  horizontalScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  filterText: {
    marginTop: 8,
    fontSize: 12,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterPillText: {
    fontSize: 12,
    color: "#235CF8",
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
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
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
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
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#235CF8",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#D1D5DB",
  },
  actionGridContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
    marginBottom: 0,
    backgroundColor: "#FFFFFF",
  },
  scrollableActionScrollView: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  scrollableActionContainer: {
    flexDirection: "row",
    gap: 10,
    paddingRight: 20,
  },
  scrollableActionCard: {
    width: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    minHeight: 120,
  },
  colorfulIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  scrollableActionLabel: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.1,
    marginTop: 2,
  },
  trendingContainer: {
    marginTop: 8,
  },
  comingSoon: {
    fontSize: 16,
    color: "#9BA1A6",
    textAlign: "center",
    paddingVertical: 40,
  },
  // Trending Cars Styles
  trendingCarCard: {
    width: width * 0.78,
    marginRight: 16,
    borderRadius: 24,
    overflow: "hidden",
  },
  trendingCarImageContainer: {
    position: "relative",
    height: 280,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  trendingCarImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  trendingCarOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#235CF8",
    padding: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  trendingCarInfo: {
    gap: 8,
  },
  trendingCarModel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  trendingCarDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  trendingCarLocationMileage: {
    gap: 4,
    flex: 1,
  },
  trendingCarLocation: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
  },
  trendingCarMileage: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
  },
  trendingPriceButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minWidth: 100,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  trendingPriceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#235CF8",
    letterSpacing: -0.3,
  },
  // Car Card Styles
  carCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  carImageContainer: {
    position: "relative",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  carImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  carOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(35, 92, 248, 0.95)",
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  carInfo: {
    gap: 8,
  },
  carName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carDistance: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.95,
    fontWeight: "400",
  },
  carPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  // Brand Grid Styles
  brandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  brandCard: {
    width: (width - 56) / 4,
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  brandLogoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  brandLogoImage: {
    width: "100%",
    height: "100%",
  },
  brandLogoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#235CF8",
    letterSpacing: 1,
  },
  viewAllButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  viewAllButtonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  // Compare Card Styles
  compareCard: {
    width: width * 0.88,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  compareContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  compareCarImage: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  compareCarImageStyle: {
    width: "100%",
    height: 140,
    borderRadius: 16,
    marginBottom: 10,
  },
  compareCarName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    letterSpacing: -0.2,
  },
  highlight: {
    color: "#235CF8",
    fontWeight: "700",
  },
  comparePrice: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
    marginTop: 4,
  },
  vsContainer: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  vsLine: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E5E5",
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  vsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#235CF8",
  },
  // Testimonial Card Styles
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  avatar: {
    fontSize: 26,
  },
  testimonialInfo: {
    flex: 1,
    gap: 6,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    letterSpacing: -0.2,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  testimonialQuote: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    fontWeight: "400",
    letterSpacing: -0.1,
  },
});
