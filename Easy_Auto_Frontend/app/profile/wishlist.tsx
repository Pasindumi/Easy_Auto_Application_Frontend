import COLORS from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";

const { width } = Dimensions.get("window");

export default function WishlistScreen() {
  // Protect this route - require authentication
  useProtectedRoute();
  
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      model: "Nissan GTR R35",
      location: "Badulla, Sri Lanka",
      mileage: "180,000Km",
      price: "$75,000",
      image: null,
    },
    {
      id: 2,
      model: "Range Rover Sport",
      location: "Colombo, Sri Lanka",
      mileage: "120,000Km",
      price: "$85,000",
      image: null,
    },
    {
      id: 3,
      model: "Toyota Camry 2024",
      location: "Kandy, Sri Lanka",
      mileage: "50,000Km",
      price: "$45,000",
      image: null,
    },
  ]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Wishlist" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {wishlistItems.length > 0 ? (
          <View style={styles.wishlistGrid}>
            {wishlistItems.map((item) => (
              <View key={item.id} style={styles.wishlistCard}>
                <View style={styles.carImageContainer}>
                  <View style={styles.carImagePlaceholder}>
                    <MaterialIcons
                      name="directions-car"
                      size={60}
                      color={COLORS.text.muted}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => removeFromWishlist(item.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="favorite" size={24} color={COLORS.status.danger} />
                  </TouchableOpacity>
                  <View style={styles.carOverlay}>
                    <View style={styles.carInfo}>
                      <Text style={styles.carName} numberOfLines={1}>{item.model}</Text>
                      <View style={styles.carDetails}>
                        <Text style={styles.carLocation}>{item.location}</Text>
                        <Text style={styles.carPrice}>{item.price}</Text>
                      </View>
                      <Text style={styles.carMileage}>{item.mileage}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
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
    height: 220,
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
