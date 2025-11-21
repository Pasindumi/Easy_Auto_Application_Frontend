import NotificationDrawer from "@/components/notification-drawer";
import Sidebar from "@/components/sidebar";
import WishlistDrawer from "@/components/wishlist-drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [wishlistDrawerVisible, setWishlistDrawerVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={styles.menuButton}
            >
              <MaterialIcons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>EASY AUTO</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setNotificationDrawerVisible(true)}
              >
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setWishlistDrawerVisible(true)}
              >
                <MaterialIcons
                  name="favorite-border"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <MaterialIcons
              name="search"
              size={20}
              color="#9BA1A6"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="what are you looking for?"
              placeholderTextColor="#9BA1A6"
            />
            <TouchableOpacity>
              <MaterialIcons name="tune" size={24} color="#9BA1A6" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Find the Right Car By Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find the Right Car By</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterScroll}
          >
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="account-balance-wallet"
                size={18}
                color="#235CF8"
              />
              <Text style={styles.filterPillText}>Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="local-gas-station"
                size={18}
                color="#235CF8"
              />

              <Text style={styles.filterPillText}>Fuel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons name="directions-car" size={18} color="#235CF8" />
              <Text style={styles.filterPillText}>Body Type</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="local-gas-station"
                size={18}
                color="#235CF8"
              />

              <Text style={styles.filterPillText}>Fuel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterPill}>
              <MaterialIcons
                name="local-gas-station"
                size={18}
                color="#235CF8"
              />

              <Text style={styles.filterPillText}>Fuel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Promotional Banner */}
        <View style={styles.bannerContainer}>
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
        </View>

        {/* Action Buttons Grid */}
        <View style={styles.actionGridContainer}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons
                  name="directions-car"
                  size={26}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.actionText}>Buy a Car</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="sell" size={26} color="#0066FF" />
              </View>
              <Text style={styles.actionText}>Sell a Car</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="vpn-key" size={26} color="#0066FF" />
              </View>
              <Text style={styles.actionText}>Rent a Car</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.actionRow, styles.actionRowCentered]}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons
                  name="compare-arrows"
                  size={26}
                  color="#0066FF"
                />
              </View>
              <Text style={styles.actionText}>Compare Cars</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="store" size={26} color="#0066FF" />
              </View>
              <Text style={styles.actionText}>Find Dealers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trending Cars Section */}
        <View style={styles.section}>
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
        </View>

        {/* Recommended For You Section */}
        <View style={styles.sectionWhite}>
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
        </View>

        {/* Explore by Brand Section */}
        <View style={styles.sectionWhite}>
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
        </View>

        {/* Compare Cars Section */}
        <View style={styles.sectionWhite}>
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
        </View>

        {/* What Our Users Say Section */}
        <View style={styles.sectionWhite}>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#235CF8",
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
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    minHeight: 56,
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
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  menuButton: {
    padding: 8,
    minWidth: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontWeight: "400",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
  },
  sectionWhite: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  sectionTitleNoMargin: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 0,
    letterSpacing: -0.2,
  },
  seeAllLink: {
    fontSize: 14,
    color: "#0066FF",
    fontWeight: "500",
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
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    gap: 6,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
  },
  filterPillText: {
    fontSize: 13,
    color: "#235CF8",
    fontWeight: "500",
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  bannerScrollView: {
    marginBottom: 12,
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
    shadowOpacity: 0.2,
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
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
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
    backgroundColor: "#0066FF",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#D0D0D0",
  },
  actionGridContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionRowCentered: {
    justifyContent: "center",
    gap: (width - 60) / 3,
    marginBottom: 0,
  },
  actionButton: {
    width: (width - 60) / 3,
    alignItems: "center",
  },
  actionIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#0066FF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  actionText: {
    fontSize: 13,
    color: "#1A1A1A",
    fontWeight: "500",
    textAlign: "center",
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
    borderRadius: 20,
    overflow: "hidden",
  },
  trendingCarImageContainer: {
    position: "relative",
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
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
    backgroundColor: "#0066FF",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  trendingCarInfo: {
    gap: 8,
  },
  trendingCarModel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
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
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 90,
    alignItems: "center",
  },
  trendingPriceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066FF",
  },
  // Car Card Styles
  carCard: {
    width: width * 0.72,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  carImageContainer: {
    position: "relative",
    height: 220,
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
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 6,
  },
  carOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 102, 255, 0.9)",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  carInfo: {
    gap: 6,
  },
  carName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carDistance: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
  },
  carPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Brand Grid Styles
  brandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  brandCard: {
    width: (width - 56) / 4,
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
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
    color: "#0066FF",
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
    padding: 20,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  compareCarName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    textAlign: "center",
  },
  highlight: {
    color: "#0066FF",
    fontWeight: "600",
  },
  comparePrice: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontWeight: "400",
    marginTop: 2,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  vsText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  // Testimonial Card Styles
  testimonialCard: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  avatar: {
    fontSize: 24,
  },
  testimonialInfo: {
    flex: 1,
    gap: 4,
  },
  testimonialName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: -0.2,
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 2,
  },
  testimonialQuote: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    fontWeight: "400",
  },
});
