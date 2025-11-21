import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  const slideAnim = React.useRef(new Animated.Value(width * 0.8)).current;
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      model: "Nissan GTR R35",
      location: "Badulla, Sri Lanka",
      mileage: "180,000Km",
      price: "$75,000",
    },
    {
      id: 2,
      model: "Range Rover Sport",
      location: "Colombo, Sri Lanka",
      mileage: "120,000Km",
      price: "$85,000",
    },
    {
      id: 3,
      model: "Toyota Camry 2024",
      location: "Kandy, Sri Lanka",
      mileage: "50,000Km",
      price: "$45,000",
    },
  ]);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width * 0.8,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
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
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent} edges={["top", "bottom"]}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Wishlist</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {wishlistItems.length > 0 ? (
                <View style={styles.wishlistContainer}>
                  {wishlistItems.map((item) => (
                    <View key={item.id} style={styles.wishlistCard}>
                      <View style={styles.carImageContainer}>
                        <View style={styles.carImagePlaceholder}>
                          <MaterialIcons
                            name="directions-car"
                            size={50}
                            color="#666"
                          />
                        </View>
                        <TouchableOpacity
                          style={styles.favoriteButton}
                          onPress={() => removeFromWishlist(item.id)}
                        >
                          <MaterialIcons
                            name="favorite"
                            size={20}
                            color="#FF3B30"
                          />
                        </TouchableOpacity>
                        <View style={styles.carOverlay}>
                          <View style={styles.carInfo}>
                            <Text style={styles.carName}>{item.model}</Text>
                            <View style={styles.carDetails}>
                              <Text style={styles.carLocation}>
                                {item.location}
                              </Text>
                              <Text style={styles.carPrice}>{item.price}</Text>
                            </View>
                            <Text style={styles.carMileage}>
                              {item.mileage}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <MaterialIcons
                    name="favorite-border"
                    size={64}
                    color="#9BA1A6"
                  />
                  <Text style={styles.emptyText}>Your wishlist is empty</Text>
                  <Text style={styles.emptySubtext}>
                    Start saving your favorite cars to view them here
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawer: {
    width: width * 0.8,
    backgroundColor: "#F5F5F5",
    height: "100%",
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  wishlistContainer: {
    gap: 12,
  },
  wishlistCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  carImageContainer: {
    position: "relative",
    height: 180,
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
