import NotificationDrawer from "@/components/notification-drawer";
import Sidebar from "@/components/sidebar";
import WishlistDrawer from "@/components/wishlist-drawer";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
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

// Pressable Action Button with Glassmorphism
const GlassmorphismButton = ({
  children,
  onPress,
  delay = 0,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  delay?: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
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

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Animated Brand Card Component
const BrandCard = ({
  brand,
  index,
}: {
  brand: { name: string; logo: any };
  index: number;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.brandCard}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
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
    </Animated.View>
  );
};

// Empty State Component
const EmptyState = ({
  icon,
  title,
  message,
  actionText,
  onAction,
}: {
  icon: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}) => (
  <View style={styles.emptyStateContainer}>
    <MaterialIcons name={icon as any} size={64} color="#D1D5DB" />
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateMessage}>{message}</Text>
    {actionText && onAction && (
      <TouchableOpacity style={styles.emptyStateButton} onPress={onAction}>
        <Text style={styles.emptyStateButtonText}>{actionText}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Skeleton Loader Component
const SkeletonLoader = ({
  width,
  height,
  style,
}: {
  width: number;
  height: number;
  style?: any;
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: "#E5E7EB",
          borderRadius: 8,
          opacity,
        },
        style,
      ]}
    />
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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationDrawerVisible, setNotificationDrawerVisible] =
    useState(false);
  const [wishlistDrawerVisible, setWishlistDrawerVisible] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [compareCount, setCompareCount] = useState(12);
  const [newListingsCount, setNewListingsCount] = useState(500);
  const [trendingCategory, setTrendingCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 23,
    seconds: 45,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [showNotificationPreview, setShowNotificationPreview] = useState(false);
  const [showWishlistPreview, setShowWishlistPreview] = useState(false);
  const notificationLongPressTimer = useRef<NodeJS.Timeout | null>(null);
  const wishlistLongPressTimer = useRef<NodeJS.Timeout | null>(null);
  const mainScrollViewRef = useRef<ScrollView>(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Close previews when clicking outside
  useEffect(() => {
    if (showNotificationPreview || showWishlistPreview) {
      const timer = setTimeout(() => {
        setShowNotificationPreview(false);
        setShowWishlistPreview(false);
      }, 5000); // Auto-close after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [showNotificationPreview, showWishlistPreview]);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);

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
      <SafeAreaView style={styles.safeAreaTop} edges={["top"]}>
        <Animated.View
          style={[
            styles.header,
            {
              opacity: initialHeaderOpacity,
            },
          ]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSidebarVisible(true);
              }}
              onPressIn={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={styles.menuButton}
              activeOpacity={0.6}
            >
              <MaterialIcons name="menu" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Easy Auto</Text>
            </View>
            <View style={styles.headerIcons}>
              <View style={styles.iconButtonWrapper}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setNotificationDrawerVisible(true);
                    setShowNotificationPreview(false);
                  }}
                  onPressIn={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowNotificationPreview(true);
                  }}
                  onPressOut={() => {
                    if (notificationLongPressTimer.current) {
                      clearTimeout(notificationLongPressTimer.current);
                      notificationLongPressTimer.current = null;
                    }
                  }}
                  activeOpacity={0.6}
                >
                  <MaterialIcons
                    name="notifications-none"
                    size={20}
                    color="#FFFFFF"
                  />
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 9 ? "9+" : notificationCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* Notification Preview */}
                {showNotificationPreview && (
                  <View style={styles.notificationPreview}>
                    <View style={styles.previewHeader}>
                      <Text style={styles.previewTitle}>
                        Recent Notifications
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          setShowNotificationPreview(false);
                          setNotificationDrawerVisible(true);
                        }}
                      >
                        <Text style={styles.previewSeeAll}>See All</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView
                      style={styles.previewContent}
                      nestedScrollEnabled
                    >
                      {[
                        {
                          id: 1,
                          title: "New car matches your search",
                          message: "5 new listings for Toyota Camry",
                          time: "2 min ago",
                          type: "match",
                          unread: true,
                        },
                        {
                          id: 2,
                          title: "Price drop alert",
                          message: "BMW 3 Series price reduced by $2,000",
                          time: "15 min ago",
                          type: "price",
                          unread: true,
                        },
                        {
                          id: 3,
                          title: "Deal of the day",
                          message: "Special offer on Honda Civic",
                          time: "1 hour ago",
                          type: "deal",
                          unread: false,
                        },
                      ].map((notif) => (
                        <TouchableOpacity
                          key={notif.id}
                          style={[
                            styles.previewItem,
                            notif.unread && styles.previewItemUnread,
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            setShowNotificationPreview(false);
                            setNotificationDrawerVisible(true);
                          }}
                        >
                          <View
                            style={[
                              styles.previewIcon,
                              notif.type === "match" && styles.previewIconMatch,
                              notif.type === "price" && styles.previewIconPrice,
                              notif.type === "deal" && styles.previewIconDeal,
                            ]}
                          >
                            <MaterialIcons
                              name={
                                notif.type === "match"
                                  ? "search"
                                  : notif.type === "price"
                                  ? "trending-down"
                                  : "local-offer"
                              }
                              size={18}
                              color="#FFFFFF"
                            />
                          </View>
                          <View style={styles.previewText}>
                            <Text style={styles.previewItemTitle}>
                              {notif.title}
                            </Text>
                            <Text style={styles.previewItemMessage}>
                              {notif.message}
                            </Text>
                            <Text style={styles.previewItemTime}>
                              {notif.time}
                            </Text>
                          </View>
                          {notif.unread && (
                            <View style={styles.previewUnreadDot} />
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <TouchableOpacity
                      style={styles.previewMarkAll}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        setNotificationCount(0);
                        setShowNotificationPreview(false);
                      }}
                    >
                      <MaterialIcons
                        name="done-all"
                        size={16}
                        color="#235CF8"
                      />
                      <Text style={styles.previewMarkAllText}>
                        Mark all as read
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={styles.iconButtonWrapper}>
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setWishlistDrawerVisible(true);
                    setShowWishlistPreview(false);
                  }}
                  onPressIn={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setShowWishlistPreview(true);
                  }}
                  activeOpacity={0.6}
                >
                  <MaterialIcons
                    name="favorite-border"
                    size={20}
                    color="#FFFFFF"
                  />
                  {wishlistCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {wishlistCount > 9 ? "9+" : wishlistCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                {/* Wishlist Preview */}
                {showWishlistPreview && (
                  <View style={styles.wishlistPreview}>
                    <View style={styles.previewHeader}>
                      <Text style={styles.previewTitle}>Wishlist</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Light
                          );
                          setShowWishlistPreview(false);
                          setWishlistDrawerVisible(true);
                        }}
                      >
                        <Text style={styles.previewSeeAll}>View All</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView
                      style={styles.previewContent}
                      nestedScrollEnabled
                    >
                      {[
                        {
                          id: 1,
                          name: "Toyota Camry 2024",
                          price: "$25,000",
                          image:
                            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=150&fit=crop",
                          addedAt: "2 days ago",
                        },
                        {
                          id: 2,
                          name: "Honda Civic 2023",
                          price: "$22,000",
                          image:
                            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=150&fit=crop",
                          addedAt: "5 days ago",
                        },
                        {
                          id: 3,
                          name: "BMW 3 Series",
                          price: "$35,000",
                          image:
                            "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=150&fit=crop",
                          addedAt: "1 week ago",
                        },
                      ].map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.previewItem}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light
                            );
                            setShowWishlistPreview(false);
                            setWishlistDrawerVisible(true);
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={styles.previewItemImage}
                            contentFit="cover"
                          />
                          <View style={styles.previewText}>
                            <Text style={styles.previewItemTitle}>
                              {item.name}
                            </Text>
                            <Text style={styles.previewItemMessage}>
                              {item.price}
                            </Text>
                            <Text style={styles.previewItemTime}>
                              Added {item.addedAt}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={styles.previewRemoveButton}
                            onPress={() => {
                              Haptics.impactAsync(
                                Haptics.ImpactFeedbackStyle.Light
                              );
                              setWishlistCount((prev) => Math.max(0, prev - 1));
                            }}
                          >
                            <MaterialIcons
                              name="close"
                              size={16}
                              color="#9CA3AF"
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
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
              onFocus={() => {
                setSearchFocused(true);
                setShowSearchSuggestions(true);
              }}
              onBlur={() => {
                setSearchFocused(false);
                setTimeout(() => setShowSearchSuggestions(false), 200);
              }}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <MaterialIcons
                name="tune"
                size={18}
                color={searchFocused ? "#235CF8" : "#9BA1A6"}
              />
            </TouchableOpacity>
          </View>

          {/* Quick Search Suggestions */}
          {showSearchSuggestions && (
            <View style={styles.searchSuggestions}>
              <Text style={styles.suggestionsTitle}>Recent Searches</Text>
              {["Toyota Camry", "Honda Civic", "BMW 3 Series"].map(
                (suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="history" size={16} color="#9BA1A6" />
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                )
              )}
              <Text style={styles.suggestionsTitle}>Popular Searches</Text>
              {["SUV", "Sedan", "Electric Cars"].map((suggestion, index) => (
                <TouchableOpacity
                  key={`popular-${index}`}
                  style={styles.suggestionItem}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="trending-up" size={16} color="#235CF8" />
                  <Text style={[styles.suggestionText, styles.popularText]}>
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
      <ScrollView
        ref={mainScrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
      >
        {/* Daily Deals Section */}
        <Animated.View
          style={[
            styles.dailyDealsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.dailyDealsHeader}>
            <View>
              <Text style={styles.dailyDealsTitle}>Daily Deals</Text>
              <Text style={styles.dailyDealsSubtitle}>Limited time offers</Text>
            </View>
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownLabel}>Ends in:</Text>
              <View style={styles.countdownTimer}>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownValue}>
                    {String(timeLeft.hours).padStart(2, "0")}
                  </Text>
                  <Text style={styles.countdownUnit}>H</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownValue}>
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </Text>
                  <Text style={styles.countdownUnit}>M</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownItem}>
                  <Text style={styles.countdownValue}>
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </Text>
                  <Text style={styles.countdownUnit}>S</Text>
                </View>
              </View>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dailyDealsScroll}
          >
            {[
              {
                id: 1,
                name: "BMW 5 Series",
                originalPrice: "$45,000",
                dealPrice: "$38,000",
                discount: "15% OFF",
                image:
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop",
              },
              {
                id: 2,
                name: "Mercedes E-Class",
                originalPrice: "$50,000",
                dealPrice: "$42,000",
                discount: "16% OFF",
                image:
                  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop",
              },
            ].map((deal) => (
              <TouchableOpacity key={deal.id} style={styles.dailyDealCard}>
                <Image
                  source={{ uri: deal.image }}
                  style={styles.dailyDealImage}
                  contentFit="cover"
                />
                <View style={styles.dailyDealBadge}>
                  <Text style={styles.dailyDealBadgeText}>{deal.discount}</Text>
                </View>
                <View style={styles.dailyDealInfo}>
                  <Text style={styles.dailyDealName}>{deal.name}</Text>
                  <View style={styles.dailyDealPriceRow}>
                    <Text style={styles.dailyDealOriginalPrice}>
                      {deal.originalPrice}
                    </Text>
                    <Text style={styles.dailyDealPrice}>{deal.dealPrice}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Flash Sale Banner */}
        <Animated.View
          style={[
            styles.flashSaleBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.flashSaleContent}>
            <View style={styles.flashSaleLeft}>
              <View style={styles.flashSaleBadge}>
                <MaterialIcons name="flash-on" size={18} color="#FFFFFF" />
                <Text style={styles.flashSaleBadgeText}>FLASH SALE</Text>
              </View>
              <Text style={styles.flashSaleTitle}>
                Up to 30% OFF on Premium Cars
              </Text>
              <Text style={styles.flashSaleSubtitle}>
                Limited time only - Don&apos;t miss out!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.flashSaleButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }}
            >
              <Text style={styles.flashSaleButtonText}>Shop Now</Text>
              <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Value Propositions & Trust Indicators */}
        <Animated.View
          style={[
            styles.valuePropsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.valuePropsRow}>
            <View style={styles.valuePropItem}>
              <MaterialIcons name="verified" size={20} color="#10B981" />
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropNumber}>10,000+</Text>
                <Text style={styles.valuePropLabel}>Cars</Text>
              </View>
            </View>
            <View style={styles.valuePropDivider} />
            <View style={styles.valuePropItem}>
              <MaterialIcons name="store" size={20} color="#235CF8" />
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropNumber}>500+</Text>
                <Text style={styles.valuePropLabel}>Dealers</Text>
              </View>
            </View>
            <View style={styles.valuePropDivider} />
            <View style={styles.valuePropItem}>
              <MaterialIcons name="star" size={20} color="#FFD700" />
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropNumber}>4.8</Text>
                <Text style={styles.valuePropLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.valuePropDivider} />
            <View style={styles.valuePropItem}>
              <MaterialIcons name="people" size={20} color="#F57C00" />
              <View style={styles.valuePropText}>
                <Text style={styles.valuePropNumber}>50K+</Text>
                <Text style={styles.valuePropLabel}>Users</Text>
              </View>
            </View>
          </View>
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
                <View style={styles.bannerGradientOverlay} />
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                  <TouchableOpacity style={styles.bannerCTA}>
                    <Text style={styles.bannerCTAText}>Explore Now</Text>
                    <MaterialIcons
                      name="arrow-forward"
                      size={18}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
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
            <GlassmorphismButton delay={100}>
              <View style={styles.scrollableActionCard}>
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
                <Text style={styles.scrollableActionDescription}>
                  Find your perfect car
                </Text>
              </View>
            </GlassmorphismButton>

            <GlassmorphismButton delay={150}>
              <View style={styles.scrollableActionCard}>
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#FFF3E0" },
                  ]}
                >
                  <MaterialIcons name="sell" size={32} color="#F57C00" />
                </View>
                <Text style={styles.scrollableActionLabel}>Sell a Car</Text>
                <Text style={styles.scrollableActionDescription}>
                  Get instant quotes
                </Text>
              </View>
            </GlassmorphismButton>

            <GlassmorphismButton delay={200}>
              <View style={styles.scrollableActionCard}>
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#E8F5E9" },
                  ]}
                >
                  <MaterialIcons name="vpn-key" size={32} color="#388E3C" />
                </View>
                <Text style={styles.scrollableActionLabel}>Rent a Car</Text>
                <Text style={styles.scrollableActionDescription}>
                  Daily & monthly rates
                </Text>
              </View>
            </GlassmorphismButton>

            <GlassmorphismButton delay={250}>
              <View style={styles.scrollableActionCard}>
                <View style={styles.actionCardHeader}>
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
                  {compareCount > 0 && (
                    <View style={styles.actionBadge}>
                      <Text style={styles.actionBadgeText}>
                        {compareCount > 9 ? "9+" : compareCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.scrollableActionLabel}>Compare</Text>
                <Text style={styles.scrollableActionDescription}>
                  Side by side
                </Text>
              </View>
            </GlassmorphismButton>

            <GlassmorphismButton delay={300}>
              <View style={styles.scrollableActionCard}>
                <View
                  style={[
                    styles.colorfulIconContainer,
                    { backgroundColor: "#FFEBEE" },
                  ]}
                >
                  <MaterialIcons name="store" size={32} color="#C62828" />
                </View>
                <Text style={styles.scrollableActionLabel}>Find Dealers</Text>
                <Text style={styles.scrollableActionDescription}>
                  {newListingsCount}+ new listings
                </Text>
              </View>
            </GlassmorphismButton>
          </ScrollView>
        </Animated.View>

        {/* Section Divider */}
        <View style={styles.sectionDivider} />

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
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Trending Cars</Text>
              <Text style={styles.sectionSubtitle}>Most popular this week</Text>
            </View>
            <TouchableOpacity
              style={styles.viewAllButtonSmall}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.viewAllButtonTextSmall}>View All</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#235CF8" />
            </TouchableOpacity>
          </View>
          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryTabsScroll}
            contentContainerStyle={styles.categoryTabsContainer}
          >
            {[
              { name: "All", count: 24 },
              { name: "SUV", count: 8 },
              { name: "Sedan", count: 10 },
              { name: "Hatchback", count: 4 },
              { name: "Sports", count: 2 },
            ].map((category) => (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryTab,
                  trendingCategory === category.name &&
                    styles.categoryTabActive,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setTrendingCategory(category.name);
                }}
              >
                <Text
                  style={[
                    styles.categoryTabText,
                    trendingCategory === category.name &&
                      styles.categoryTabTextActive,
                  ]}
                >
                  {category.name}
                </Text>
                {category.count > 0 && (
                  <View
                    style={[
                      styles.categoryCountBadge,
                      trendingCategory === category.name &&
                        styles.categoryCountBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryCountText,
                        trendingCategory === category.name &&
                          styles.categoryCountTextActive,
                      ]}
                    >
                      {category.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {[
              {
                id: 1,
                model: "Nissan GTR R35",
                location: "Badulla, Sri Lanka",
                mileage: "180,000Km",
                price: "$75,000",
                image:
                  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
                status: "Hot Deal",
                rating: 4.8,
                fuelEfficiency: "12 km/l",
                transmission: "Manual",
                dealer: "AutoMax Dealers",
                verifiedDealer: true,
                views: 12,
                isNewArrival: false,
                stockLeft: 3,
                year: 2020,
                images: 5,
              },
              {
                id: 2,
                model: "Range Rover Sport",
                location: "Colombo, Sri Lanka",
                mileage: "120,000Km",
                price: "$85,000",
                image:
                  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop",
                status: "Certified",
                rating: 4.9,
                fuelEfficiency: "10 km/l",
                transmission: "Automatic",
                dealer: "Premium Motors",
                verifiedDealer: true,
                views: 8,
                isNewArrival: true,
                stockLeft: null,
                year: 2021,
                images: 8,
              },
              {
                id: 3,
                model: "Toyota Camry",
                location: "Kandy, Sri Lanka",
                mileage: "95,000Km",
                price: "$28,000",
                image:
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
                status: "New",
                rating: 4.7,
                fuelEfficiency: "15 km/l",
                transmission: "Automatic",
                dealer: "Toyota Lanka",
                verifiedDealer: true,
                views: 15,
                isNewArrival: true,
                stockLeft: null,
                year: 2023,
                images: 6,
              },
              {
                id: 4,
                model: "BMW 3 Series",
                location: "Galle, Sri Lanka",
                mileage: "150,000Km",
                price: "$45,000",
                image:
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
                status: "Hot Deal",
                rating: 4.6,
                fuelEfficiency: "13 km/l",
                transmission: "Automatic",
                dealer: "BMW Premium",
                verifiedDealer: true,
                views: 20,
                isNewArrival: false,
                stockLeft: 2,
                year: 2019,
                images: 7,
              },
              {
                id: 5,
                model: "Mercedes C-Class",
                location: "Negombo, Sri Lanka",
                mileage: "110,000Km",
                price: "$52,000",
                image:
                  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
                status: "Certified",
                rating: 4.8,
                fuelEfficiency: "12 km/l",
                transmission: "Automatic",
                dealer: "Mercedes Elite",
                verifiedDealer: true,
                views: 18,
                isNewArrival: false,
                stockLeft: null,
                year: 2020,
                images: 9,
              },
              {
                id: 6,
                model: "Honda Civic",
                location: "Matara, Sri Lanka",
                mileage: "80,000Km",
                price: "$22,000",
                image:
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
                status: "New",
                rating: 4.5,
                fuelEfficiency: "18 km/l",
                transmission: "Manual",
                dealer: "Honda Auto",
                verifiedDealer: true,
                views: 25,
                isNewArrival: true,
                stockLeft: null,
                year: 2024,
                images: 5,
              },
            ].map((car, index) => (
              <TouchableOpacity
                key={car.id}
                style={styles.trendingCarCard}
                activeOpacity={0.95}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.trendingImageWrapper}>
                  <Image
                    source={{ uri: car.image }}
                    style={styles.trendingCarImage}
                    contentFit="cover"
                    transition={300}
                    placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgRj" }}
                    cachePolicy="memory-disk"
                    priority="high"
                    recyclingKey={`trending-${car.id}`}
                  />
                  {/* Status Badge */}
                  <View
                    style={[
                      styles.trendingStatusBadge,
                      car.status === "Hot Deal" && styles.statusBadgeHot,
                      car.status === "Certified" && styles.statusBadgeCertified,
                      car.status === "New" && styles.statusBadgeNew,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{car.status}</Text>
                  </View>
                </View>
                {/* Car Info */}
                <View style={styles.trendingCarInfo}>
                  <Text style={styles.trendingCarName}>
                    {car.model} {car.year && `(${car.year})`}
                  </Text>
                  <View style={styles.trendingCarPriceRow}>
                    <Text style={styles.trendingCarPrice}>{car.price}</Text>
                    <Text style={styles.trendingCarLocation}>
                      {car.location.split(",")[0]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Section Divider */}
        <View style={styles.sectionDivider} />

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
          <View style={styles.sectionHeader}>
            <View style={styles.recommendedHeader}>
              <Text style={styles.sectionTitle}>Recommended For You</Text>
              <Text style={styles.recommendedSubtitle}>
                Based on your searches
              </Text>
            </View>
            <TouchableOpacity style={styles.refreshButton}>
              <MaterialIcons name="refresh" size={18} color="#235CF8" />
            </TouchableOpacity>
          </View>
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
                price: "$4,000",
                image:
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop",
                status: "New",
                rating: 4.6,
                reason: "Similar to your saved cars",
                matchScore: 95,
                fuelEfficiency: "18 km/l",
                transmission: "Automatic",
              },
              {
                id: 2,
                name: "Honda Civic 2024",
                distance: "5.2km away",
                price: "$3,500",
                image:
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
                status: "Certified",
                rating: 4.5,
                reason: "Based on your searches",
                matchScore: 88,
                fuelEfficiency: "20 km/l",
                transmission: "Manual",
              },
              {
                id: 3,
                name: "BMW 3 Series",
                distance: "3.8km away",
                price: "$12,000",
                image:
                  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
                status: "Hot Deal",
                rating: 4.9,
                reason: "Popular in your area",
                matchScore: 92,
                fuelEfficiency: "15 km/l",
                transmission: "Automatic",
              },
            ].map((car) => (
              <TouchableOpacity
                key={car.id}
                style={styles.recommendedCarCard}
                activeOpacity={0.95}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.recommendedImageWrapper}>
                  <Image
                    source={{ uri: car.image }}
                    style={styles.recommendedCarImage}
                    contentFit="cover"
                    transition={300}
                    placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgRj" }}
                    cachePolicy="memory-disk"
                  />
                  {/* Status Badge */}
                  <View
                    style={[
                      styles.recommendedStatusBadge,
                      car.status === "Hot Deal" && styles.statusBadgeHot,
                      car.status === "Certified" && styles.statusBadgeCertified,
                      car.status === "New" && styles.statusBadgeNew,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{car.status}</Text>
                  </View>
                </View>
                {/* Car Info */}
                <View style={styles.recommendedCarInfo}>
                  <Text style={styles.recommendedCarName}>{car.name}</Text>
                  <View style={styles.recommendedCarPriceRow}>
                    <Text style={styles.recommendedCarPrice}>{car.price}</Text>
                    <Text style={styles.recommendedCarDistance}>
                      {car.distance}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Recently Viewed Section */}
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
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
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
                id: 1,
                name: "Toyota Camry 2023",
                price: "$25,000",
                image:
                  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=200&fit=crop",
                viewedAt: "2 hours ago",
              },
              {
                id: 2,
                name: "Honda Accord 2024",
                price: "$28,000",
                image:
                  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop",
                viewedAt: "5 hours ago",
              },
              {
                id: 3,
                name: "Mazda CX-5",
                price: "$32,000",
                image:
                  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop",
                viewedAt: "1 day ago",
              },
            ].map((car) => (
              <TouchableOpacity key={car.id} style={styles.recentlyViewedCard}>
                <Image
                  source={{ uri: car.image }}
                  style={styles.recentlyViewedImage}
                  contentFit="cover"
                />
                <View style={styles.recentlyViewedInfo}>
                  <Text style={styles.recentlyViewedName}>{car.name}</Text>
                  <Text style={styles.recentlyViewedPrice}>{car.price}</Text>
                  <Text style={styles.recentlyViewedTime}>{car.viewedAt}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Section Divider */}
        <View style={styles.sectionDivider} />

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
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Explore by Brand</Text>
          </View>
          {/* Featured Brands */}
          <Text style={styles.featuredBrandsTitle}>Featured Brands</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredBrandsScroll}
            contentContainerStyle={styles.featuredBrandsContainer}
          >
            {[
              {
                name: "Toyota",
                logo: require("@/assets/images/vehicle logo/toyota.svg"),
                carCount: 1234,
                featured: true,
              },
              {
                name: "Honda",
                logo: require("@/assets/images/vehicle logo/honda.svg"),
                carCount: 987,
                featured: true,
              },
              {
                name: "BMW",
                logo: null,
                carCount: 756,
                featured: true,
              },
              {
                name: "Mercedes",
                logo: null,
                carCount: 654,
                featured: true,
              },
            ].map((brand, index) => (
              <TouchableOpacity
                key={`featured-${index}`}
                style={styles.featuredBrandCard}
              >
                <View style={styles.featuredBrandLogoContainer}>
                  {brand.logo ? (
                    <Image
                      source={brand.logo}
                      style={styles.featuredBrandLogo}
                      contentFit="contain"
                    />
                  ) : (
                    <Text style={styles.featuredBrandText}>
                      {brand.name.substring(0, 2).toUpperCase()}
                    </Text>
                  )}
                </View>
                <Text style={styles.featuredBrandName}>{brand.name}</Text>
                <Text style={styles.featuredBrandCount}>
                  {brand.carCount} cars
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* All Brands Grid - Show only 3 rows (12 brands) */}
          <View style={styles.brandGrid}>
            {[
              {
                name: "Toyota",
                logo: require("@/assets/images/vehicle logo/toyota.svg"),
                carCount: 1234,
              },
              {
                name: "Honda",
                logo: require("@/assets/images/vehicle logo/honda.svg"),
                carCount: 987,
              },
              {
                name: "Jeep",
                logo: require("@/assets/images/vehicle logo/jeep.svg"),
                carCount: 456,
              },
              {
                name: "Hyundai",
                logo: require("@/assets/images/vehicle logo/hyundai.svg"),
                carCount: 789,
              },
              {
                name: "Nissan",
                logo: require("@/assets/images/vehicle logo/nissan.svg"),
                carCount: 654,
              },
              { name: "BMW", logo: null, carCount: 756 },
              { name: "Mercedes", logo: null, carCount: 654 },
              {
                name: "Volkswagen",
                logo: require("@/assets/images/vehicle logo/volkswagen.svg"),
                carCount: 543,
              },
              {
                name: "KIA",
                logo: require("@/assets/images/vehicle logo/kia.svg"),
                carCount: 432,
              },
              { name: "Audi", logo: null, carCount: 321 },
              {
                name: "Tesla",
                logo: require("@/assets/images/vehicle logo/tesla.svg"),
                carCount: 234,
              },
              {
                name: "Land Rover",
                logo: require("@/assets/images/vehicle logo/land.svg"),
                carCount: 189,
              },
            ]
              .slice(0, 12)
              .map((brand, index) => (
                <View key={index} style={styles.brandCardWithInfo}>
                  <BrandCard brand={brand} index={index} />
                  <Text style={styles.brandName}>{brand.name}</Text>
                  <Text style={styles.brandCarCount}>
                    {brand.carCount} cars
                  </Text>
                </View>
              ))}
          </View>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>View All Brands</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Section Divider */}
        <View style={styles.sectionDivider} />

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
                  "Found my dream benz in just 2 days! Great platform and amazing deals.",
                avatar: "👩",
                date: "2 days ago",
              },
              {
                name: "John Doe",
                rating: 5,
                quote:
                  "Excellent service and great selection of cars. Highly recommended!",
                avatar: "👨",
                date: "1 week ago",
              },
            ].map((testimonial, index) => (
              <TouchableOpacity key={index} style={styles.testimonialCard}>
                <View style={styles.testimonialHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>{testimonial.avatar}</Text>
                  </View>
                  <View style={styles.testimonialInfo}>
                    <View style={styles.testimonialNameRow}>
                      <Text style={styles.testimonialName}>
                        {testimonial.name}
                      </Text>
                      <Text style={styles.testimonialDate}>
                        {testimonial.date}
                      </Text>
                    </View>
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

      {/* Back to Top Button */}
      {showBackToTop && (
        <TouchableOpacity
          style={styles.backToTopButton}
          onPress={scrollToTop}
          activeOpacity={0.8}
        >
          <MaterialIcons name="keyboard-arrow-up" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}
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
    paddingBottom: 16,
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
    minHeight: 44,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  menuButton: {
    padding: 6,
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  iconButton: {
    padding: 6,
    minWidth: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    position: "relative",
    overflow: "hidden",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#FF4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: "#235CF8",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
  },
  iconButtonWrapper: {
    position: "relative",
  },
  // Notification & Wishlist Preview Styles
  notificationPreview: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1000,
    maxHeight: 400,
  },
  wishlistPreview: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
    zIndex: 1000,
    maxHeight: 400,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  previewSeeAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#235CF8",
  },
  previewContent: {
    maxHeight: 280,
  },
  previewItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  previewItemUnread: {
    backgroundColor: "#F0F9FF",
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  previewIconMatch: {
    backgroundColor: "#235CF8",
  },
  previewIconPrice: {
    backgroundColor: "#10B981",
  },
  previewIconDeal: {
    backgroundColor: "#F59E0B",
  },
  previewText: {
    flex: 1,
    gap: 2,
  },
  previewItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  previewItemMessage: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  previewItemTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  previewItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  previewUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#235CF8",
  },
  previewMarkAll: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 6,
  },
  previewMarkAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#235CF8",
  },
  previewRemoveButton: {
    padding: 4,
  },
  previewBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 999,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginTop: 0,
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
  searchSuggestions: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: 300,
  },
  suggestionsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9BA1A6",
    marginTop: 8,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  popularText: {
    color: "#235CF8",
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },
  sectionWhite: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#FFFFFF",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  viewAllButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  viewAllButtonTextSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#235CF8",
  },
  categoryTabsScroll: {
    marginBottom: 12,
  },
  categoryTabsContainer: {
    paddingRight: 20,
    gap: 8,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  categoryTabActive: {
    backgroundColor: "#235CF8",
    borderColor: "#235CF8",
  },
  categoryCountBadge: {
    backgroundColor: "rgba(107, 114, 128, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  categoryCountBadgeActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  categoryCountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6B7280",
  },
  categoryCountTextActive: {
    color: "#FFFFFF",
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  categoryTabTextActive: {
    color: "#FFFFFF",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  sortScroll: {
    flex: 1,
  },
  sortPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    gap: 6,
  },
  sortPillActive: {
    backgroundColor: "#235CF8",
    borderColor: "#235CF8",
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  sortPillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.4,
  },
  sectionTitleContainer: {
    gap: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  filterSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  clearAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#EBF4FF",
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#235CF8",
  },
  sectionTitleNoMargin: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 0,
    letterSpacing: -0.4,
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
  filterPillActive: {
    backgroundColor: "#235CF8",
    borderColor: "#235CF8",
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  filterPillText: {
    fontSize: 12,
    color: "#235CF8",
    fontWeight: "600",
    letterSpacing: -0.1,
  },
  filterPillTextActive: {
    color: "#FFFFFF",
  },
  dailyDealsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFF5F5",
    marginBottom: 12,
    borderTopWidth: 3,
    borderTopColor: "#FF4444",
  },
  dailyDealsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dailyDealsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  dailyDealsSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  countdownContainer: {
    alignItems: "flex-end",
  },
  countdownLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  countdownTimer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  countdownItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  countdownValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4444",
  },
  countdownUnit: {
    fontSize: 9,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 2,
  },
  countdownSeparator: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4444",
  },
  dailyDealsScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dailyDealCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  dailyDealImage: {
    width: "100%",
    height: 140,
  },
  dailyDealBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF4444",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dailyDealBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dailyDealInfo: {
    padding: 12,
    minHeight: 80,
    justifyContent: "space-between",
  },
  dailyDealName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    lineHeight: 20,
  },
  dailyDealPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    gap: 8,
  },
  dailyDealOriginalPrice: {
    fontSize: 13,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontWeight: "500",
  },
  dailyDealPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4444",
  },
  // Live Activity Feed Styles
  liveActivityContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F0FDF4",
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  liveActivityHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  liveActivityTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  liveActivityScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  liveActivityContent: {
    gap: 12,
    paddingRight: 20,
  },
  liveActivityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 200,
  },
  liveActivityAvatar: {
    fontSize: 24,
  },
  liveActivityText: {
    flex: 1,
  },
  liveActivityName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },
  liveActivityAction: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
  },
  liveActivityTime: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
  // Flash Sale Banner Styles
  flashSaleBanner: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FF6B35",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  flashSaleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    gap: 16,
  },
  flashSaleLeft: {
    flex: 1,
    gap: 8,
  },
  flashSaleBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  flashSaleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  flashSaleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  flashSaleSubtitle: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "500",
  },
  flashSaleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  flashSaleButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B35",
  },
  valuePropsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  valuePropsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  valuePropItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  valuePropText: {
    gap: 2,
  },
  valuePropNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  valuePropLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: -0.1,
  },
  valuePropDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
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
  actionGridContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    minHeight: 120,
    overflow: "hidden",
  },
  colorfulIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  scrollableActionLabel: {
    fontSize: 12,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: -0.1,
    marginTop: 2,
  },
  scrollableActionDescription: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "400",
    textAlign: "center",
    marginTop: 2,
  },
  actionCardHeader: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  actionBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  actionBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
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
    width: 200,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  trendingImageWrapper: {
    position: "relative",
    width: "100%",
    height: 140,
    overflow: "hidden",
  },
  trendingCarImage: {
    width: "100%",
    height: "100%",
  },
  trendingStatusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  trendingCarInfo: {
    padding: 12,
    minHeight: 80,
    justifyContent: "space-between",
  },
  trendingCarName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  trendingCarPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  trendingCarPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#235CF8",
    letterSpacing: -0.2,
  },
  trendingCarLocation: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  trendingTopBadges: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 8,
    zIndex: 3,
  },
  trendingTopActions: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    gap: 8,
    zIndex: 3,
  },
  trendingCarBottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#235CF8",
    padding: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    zIndex: 2,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  trendingFavoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 18,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  carImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  carGradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "65%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  favoriteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 3,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
    zIndex: 2,
  },
  carInfo: {
    gap: 8,
  },
  carHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  carName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
    flex: 1,
  },
  carRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  carRatingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
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
    marginTop: 16,
  },
  brandCardWithInfo: {
    width: (width - 56) / 4,
    marginBottom: 16,
    alignItems: "center",
  },
  brandName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    marginTop: 6,
    textAlign: "center",
  },
  brandCarCount: {
    fontSize: 10,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
    textAlign: "center",
  },
  featuredBrandsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },
  featuredBrandsScroll: {
    marginBottom: 20,
  },
  featuredBrandsContainer: {
    paddingRight: 20,
    gap: 12,
  },
  featuredBrandCard: {
    width: 100,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredBrandLogoContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featuredBrandLogo: {
    width: "100%",
    height: "100%",
  },
  featuredBrandText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#235CF8",
    letterSpacing: 1,
  },
  featuredBrandName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    textAlign: "center",
  },
  featuredBrandCount: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  brandCard: {
    width: (width - 56) / 4,
    aspectRatio: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
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
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginRight: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    fontSize: 28,
  },
  testimonialInfo: {
    flex: 1,
    gap: 8,
  },
  testimonialNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  testimonialName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  testimonialDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    gap: 3,
  },
  testimonialQuote: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.1,
    fontStyle: "italic",
  },
  // Status Badge Styles
  statusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statusBadgeHot: {
    backgroundColor: "#FF6B35",
  },
  statusBadgeCertified: {
    backgroundColor: "#10B981",
  },
  statusBadgeNew: {
    backgroundColor: "#235CF8",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  // Car Card Enhancement Styles
  comparisonCheckbox: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 18,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dealerBadge: {
    position: "absolute",
    top: 12,
    right: 60,
    zIndex: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dealerBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  newArrivalBadge: {
    position: "absolute",
    top: 12,
    right: 60,
    zIndex: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  newArrivalBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  limitedStockBadge: {
    position: "absolute",
    top: 50,
    right: 12,
    zIndex: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  limitedStockBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  quickViewButton: {
    position: "absolute",
    bottom: 100,
    left: 12,
    right: 12,
    zIndex: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35, 92, 248, 0.9)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  quickViewText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  carAdditionalInfo: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  carInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  carInfoText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  dealerName: {
    fontSize: 11,
    color: "#FFFFFF",
    opacity: 0.85,
    fontWeight: "500",
    marginTop: 2,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 6,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#235CF8",
  },
  // Recommended Section Styles
  recommendedHeader: {
    flex: 1,
  },
  recommendedSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#EBF4FF",
  },
  recommendedCarCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  recommendedImageWrapper: {
    position: "relative",
    width: "100%",
    height: 140,
    overflow: "hidden",
  },
  recommendedCarImage: {
    width: "100%",
    height: "100%",
  },
  recommendedStatusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  recommendedCarInfo: {
    padding: 12,
    minHeight: 80,
    justifyContent: "space-between",
  },
  recommendedCarName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  recommendedCarPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
  },
  recommendedCarPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#235CF8",
    letterSpacing: -0.2,
  },
  recommendedCarDistance: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  recommendedCardWrapper: {
    position: "relative",
  },
  // Recently Viewed Styles
  recentlyViewedCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  recentlyViewedImage: {
    width: "100%",
    height: 100,
  },
  recentlyViewedInfo: {
    padding: 10,
  },
  recentlyViewedName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  recentlyViewedPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#235CF8",
    marginBottom: 2,
  },
  recentlyViewedTime: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  // Back to Top Button
  backToTopButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#235CF8",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  // Empty State Styles
  emptyStateContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#235CF8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Section Divider
  sectionDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
    marginHorizontal: 20,
    opacity: 0.5,
  },
  // Quick Links Styles
  quickLinksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  quickLinkCard: {
    width: (width - 56) / 3,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  quickLinkIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  quickLinkLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  // How It Works Styles
  howItWorksContainer: {
    gap: 24,
  },
  howItWorksStep: {
    alignItems: "center",
    position: "relative",
  },
  howItWorksStepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 12,
  },
  howItWorksIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  howItWorksStepNumber: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#235CF8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  howItWorksStepNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  howItWorksStepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  howItWorksStepDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  howItWorksConnector: {
    marginTop: 16,
    marginBottom: -8,
  },
});
