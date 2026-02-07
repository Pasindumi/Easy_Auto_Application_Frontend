import COLORS from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";
import { api } from "@/utils/api";

const { width } = Dimensions.get("window");

export default function WishlistScreen() {
  // Protect this route - require authentication
  useProtectedRoute();

  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchWishlist();
  }, []);

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

  const removeFromWishlist = async (adId: string) => {
    try {
      const response = await api.post<{ success: boolean; isFavorite: boolean }>("/api/favorites/toggle", {
        ad_id: adId
      });
      if (response.success && !response.isFavorite) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== adId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Wishlist" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ marginTop: 50 }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : wishlistItems.length > 0 ? (
          <View style={styles.wishlistGrid}>
            {wishlistItems.map((item) => {
              const mainImage = item.AdImage?.find((img: any) => img.is_main)?.image_url ||
                item.AdImage?.[0]?.image_url;
              const details = item.CarDetails?.[0] || item.CarDetails || {};

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.wishlistCard}
                  onPress={() => router.push(`/cars/${item.id}` as any)}
                >
                  <View style={styles.carImageContainer}>
                    {mainImage ? (
                      <Image source={{ uri: mainImage }} style={styles.carImage} />
                    ) : (
                      <View style={styles.carImagePlaceholder}>
                        <MaterialIcons
                          name="directions-car"
                          size={60}
                          color={COLORS.text.muted}
                        />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => removeFromWishlist(item.id)}
                      activeOpacity={0.8}
                    >
                      <MaterialIcons name="favorite" size={24} color={COLORS.status.danger} />
                    </TouchableOpacity>
                    <View style={styles.carOverlay}>
                      <View style={styles.carInfo}>
                        <Text style={styles.carName} numberOfLines={1}>{item.title}</Text>
                        <View style={styles.carDetails}>
                          <Text style={styles.carLocation} numberOfLines={1}>{item.location}</Text>
                          <Text style={styles.carPrice}>{formatPrice(item.price)}</Text>
                        </View>
                        <Text style={styles.carMileage}>{item.CarDetails?.mileage || item.CarDetails?.[0]?.mileage || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MaterialIcons name="favorite-border" size={64} color={COLORS.text.muted} />
            </View>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Start saving your favorite cars to view them here
            </Text>

            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => router.push("/(tabs)")}
            >
              <Text style={styles.exploreBtnText}>Explore Cars</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wishlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wishlistCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden",
  },
  carImageContainer: {
    position: "relative",
    height: 180,
  },
  carImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  carImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.backgroundMuted,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 8,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  carOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(35, 92, 248, 0.85)",
    padding: 12,
  },
  carInfo: {
    gap: 4,
  },
  carName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carLocation: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.9,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.white,
  },
  carMileage: {
    fontSize: 10,
    color: COLORS.white,
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: COLORS.text.muted,
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 22,
    marginBottom: 32,
  },
  exploreBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
