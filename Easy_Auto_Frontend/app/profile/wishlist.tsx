import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function WishlistScreen() {
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color="#FFFFFF"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.content}>
        {wishlistItems.length > 0 ? (
          <View style={styles.wishlistGrid}>
            {wishlistItems.map((item) => (
              <View key={item.id} style={styles.wishlistCard}>
                <View style={styles.carImageContainer}>
                  <View style={styles.carImagePlaceholder}>
                    <MaterialIcons
                      name="directions-car"
                      size={60}
                      color="#666"
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => removeFromWishlist(item.id)}
                  >
                    <MaterialIcons name="favorite" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                  <View style={styles.carOverlay}>
                    <View style={styles.carInfo}>
                      <Text style={styles.carName}>{item.model}</Text>
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
            <MaterialIcons name="favorite-border" size={64} color="#9BA1A6" />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Start saving your favorite cars to view them here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  wishlistGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wishlistCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  carImageContainer: {
    position: "relative",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
  },
  carImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 8,
  },
  carOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 102, 255, 0.9)",
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  carInfo: {
    gap: 4,
  },
  carName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  carDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carLocation: {
    fontSize: 11,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
  },
  carPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  carMileage: {
    fontSize: 11,
    color: "#FFFFFF",
    opacity: 0.9,
    fontWeight: "400",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9BA1A6",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
