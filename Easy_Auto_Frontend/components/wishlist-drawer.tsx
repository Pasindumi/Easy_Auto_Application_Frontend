import COLORS from "@/constants/Colors";
import { api } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "./ui/Loading";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface WishlistDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({
  visible,
  onClose,
}: WishlistDrawerProps) {
  const drawerWidth = width * 0.85;
  const slideAnim = React.useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (visible) {
      fetchWishlist();
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: drawerWidth,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, drawerWidth, slideAnim, backdropOpacity]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: any[] }>("/api/favorites");
      if (response.success) {
        setWishlistItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Remove",
      "Remove this vehicle from your wishlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.post<{ success: boolean; isFavorite: boolean }>("/api/favorites/toggle", {
                ad_id: id
              });
              if (response.success && !response.isFavorite) {
                setWishlistItems(wishlistItems.filter((item) => item.id !== id));
              }
            } catch (error) {
              console.error("Error removing from wishlist:", error);
              Alert.alert("Error", "Failed to remove item.");
            }
          },
        },
      ]
    );
  };

  const handleShare = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert("Share", `Sharing ${item.title}...`);
  };

  const handleViewDetails = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    router.push(`/cars/${item.id}` as any);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent} edges={["top", "bottom"]}>
            <LinearGradient
                colors={[COLORS.primary, '#1E40AF']}
                style={styles.header}
            >
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Wishlist</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{wishlistItems.length}</Text>
                    </View>
                </View>
                <Text style={styles.subtitle}>Your saved dream cars</Text>
            </LinearGradient>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Loading size="large" />
                </View>
              ) : wishlistItems.length > 0 ? (
                <View style={styles.container}>
                  {wishlistItems.map((item) => {
                    const mainImage = item.AdImage?.find((img: any) => img.is_main)?.image_url ||
                      item.AdImage?.[0]?.image_url;
                    const details = item.CarDetails?.[0] || item.CarDetails || {};
                    const formattedPrice = new Intl.NumberFormat('en-LK', {
                      style: 'currency',
                      currency: 'LKR',
                      maximumFractionDigits: 0
                    }).format(item.price);

                    return (
                      <View key={item.id} style={styles.card}>
                        <TouchableOpacity
                          style={styles.cardContent}
                          activeOpacity={0.9}
                          onPress={() => handleViewDetails(item)}
                        >
                          <View style={styles.imageContainer}>
                            {mainImage ? (
                              <Image
                                source={{ uri: mainImage }}
                                style={styles.image}
                                contentFit="cover"
                                transition={200}
                              />
                            ) : (
                              <View style={styles.imagePlaceholder}>
                                <Ionicons name="car-outline" size={40} color={COLORS.border} />
                              </View>
                            )}
                            <TouchableOpacity
                                style={styles.favBtn}
                                onPress={() => removeFromWishlist(item.id)}
                            >
                                <Ionicons name="heart" size={20} color="#EF4444" />
                            </TouchableOpacity>
                          </View>

                          <View style={styles.info}>
                            <View style={styles.cardHeader}>
                              <Text style={styles.carName} numberOfLines={1}>
                                {item.title}
                              </Text>
                              <View style={styles.yearBadge}>
                                <Text style={styles.yearText}>{details.year || 'N/A'}</Text>
                              </View>
                            </View>

                            <Text style={styles.price}>{formattedPrice}</Text>

                            <View style={styles.metaRow}>
                              <View style={styles.metaItem}>
                                <Ionicons name="location-outline" size={12} color={COLORS.text.muted} />
                                <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
                              </View>
                              <View style={styles.metaItem}>
                                <Ionicons name="speedometer-outline" size={12} color={COLORS.text.muted} />
                                <Text style={styles.metaText}>{details.mileage || 'N/A'} km</Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>

                        <View style={styles.actions}>
                          <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => handleViewDetails(item)}
                          >
                            <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.actionText}>View</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={() => handleShare(item)}
                          >
                            <Ionicons name="share-social-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.actionText}>Share</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.compareBtn}
                          >
                            <Ionicons name="git-compare-outline" size={18} color={COLORS.primary} />
                            <Text style={styles.actionText}>Compare</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.empty}>
                  <View style={styles.emptyCircle}>
                    <Ionicons name="heart-dislike-outline" size={48} color={COLORS.border} />
                  </View>
                  <Text style={styles.emptyTitle}>Wishlist Empty</Text>
                  <Text style={styles.emptyText}>Tap the heart icon on any car to save it here for later.</Text>
                  <TouchableOpacity 
                    style={styles.browseBtn}
                    onPress={() => { onClose(); router.push('/cars/buy-car'); }}
                  >
                    <Text style={styles.browseText}>Browse Cars</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>

        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row-reverse",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    backgroundColor: COLORS.background,
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 32,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: "500",
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
  },
  container: {
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    width: "100%",
  },
  imageContainer: {
    position: "relative",
    height: 160,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  carName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  yearBadge: {
    backgroundColor: '#EEF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  yearText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: '#FAFBFD',
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  compareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text.primary,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  browseBtn: {
      backgroundColor: COLORS.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 16,
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
  },
  browseText: {
      color: COLORS.white,
      fontWeight: "700",
      fontSize: 15,
  }
});
