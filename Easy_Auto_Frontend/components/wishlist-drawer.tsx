import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
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
  const drawerWidth = width * 0.7;
  const slideAnim = React.useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      model: "Nissan GTR R35",
      year: "2020",
      fuelType: "Petrol",
      location: "Badulla, Sri Lanka",
      mileage: "180,000Km",
      price: "$75,000",
      image:
        "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&auto=format",
    },
    {
      id: 2,
      model: "Range Rover Sport",
      year: "2022",
      fuelType: "Diesel",
      location: "Colombo, Sri Lanka",
      mileage: "120,000Km",
      price: "$85,000",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&auto=format",
    },
    {
      id: 3,
      model: "Toyota Camry 2024",
      year: "2024",
      fuelType: "Hybrid",
      location: "Kandy, Sri Lanka",
      mileage: "50,000Km",
      price: "$45,000",
      image:
        "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&auto=format",
    },
  ]);

  React.useEffect(() => {
    if (visible) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const removeFromWishlist = (id: number) => {
    Alert.alert(
      "Remove from Wishlist",
      "Are you sure you want to remove this car from your wishlist?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setWishlistItems(wishlistItems.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleShare = (item: (typeof wishlistItems)[0]) => {
    Alert.alert("Share", `Sharing ${item.model}...`);
  };

  const handleViewDetails = (item: (typeof wishlistItems)[0]) => {
    Alert.alert("View Details", `Opening details for ${item.model}...`);
  };

  const handleCompare = (item: (typeof wishlistItems)[0]) => {
    Alert.alert("Compare", `Adding ${item.model} to comparison...`);
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
              <View style={styles.headerTop}>
                <Text style={styles.drawerTitle}>Wishlist</Text>
                <View style={styles.headerCountBadge}>
                  <Text style={styles.headerCount}>{wishlistItems.length}</Text>
                </View>
              </View>
            </View>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {wishlistItems.length > 0 ? (
                <View style={styles.wishlistContainer}>
                  {wishlistItems.map((item) => (
                    <View key={item.id} style={styles.wishlistCard}>
                      <TouchableOpacity
                        style={styles.cardContent}
                        activeOpacity={0.9}
                      >
                        <View style={styles.carImageContainer}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.carImage}
                            contentFit="cover"
                            transition={200}
                          />
                          <View style={styles.cardOverlay}>
                            <TouchableOpacity
                              style={styles.favoriteButton}
                              onPress={() => removeFromWishlist(item.id)}
                              activeOpacity={0.7}
                            >
                              <MaterialIcons
                                name="favorite"
                                size={18}
                                color="#FFFFFF"
                              />
                            </TouchableOpacity>
                            <View style={styles.priceBadge}>
                              <Text style={styles.priceBadgeText}>
                                {item.price}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.carInfoContainer}>
                          <View style={styles.carHeader}>
                            <Text style={styles.carName} numberOfLines={1}>
                              {item.model}
                            </Text>
                            <View style={styles.yearBadge}>
                              <Text style={styles.yearText}>{item.year}</Text>
                            </View>
                          </View>
                          <View style={styles.carDetailsRow}>
                            <View style={styles.carDetailItem}>
                              <MaterialIcons
                                name="location-on"
                                size={14}
                                color="#6B7280"
                              />
                              <Text
                                style={styles.carLocation}
                                numberOfLines={1}
                              >
                                {item.location}
                              </Text>
                            </View>
                            <View style={styles.carDetailItem}>
                              <MaterialIcons
                                name="speed"
                                size={14}
                                color="#6B7280"
                              />
                              <Text style={styles.carMileage}>
                                {item.mileage}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.fuelTypeContainer}>
                            <MaterialIcons
                              name="local-gas-station"
                              size={14}
                              color="#235CF8"
                            />
                            <Text style={styles.fuelTypeText}>
                              {item.fuelType}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleViewDetails(item)}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons
                            name="visibility"
                            size={18}
                            color="#235CF8"
                          />
                          <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleShare(item)}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons
                            name="share"
                            size={18}
                            color="#235CF8"
                          />
                          <Text style={styles.actionButtonText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleCompare(item)}
                          activeOpacity={0.7}
                        >
                          <MaterialIcons
                            name="compare-arrows"
                            size={18}
                            color="#235CF8"
                          />
                          <Text style={styles.actionButtonText}>Compare</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <MaterialIcons
                      name="favorite-border"
                      size={48}
                      color="#D1D5DB"
                    />
                  </View>
                  <Text style={styles.emptyText}>Your wishlist is empty</Text>
                  <Text style={styles.emptySubtext}>
                    Start saving your favorite cars to view them here
                  </Text>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    width: width * 0.7,
    backgroundColor: "#235CF8",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: "#235CF8",
  },
  drawerHeader: {
    backgroundColor: "#235CF8",
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerCountBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  wishlistContainer: {
    gap: 12,
  },
  wishlistCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardContent: {
    width: "100%",
  },
  carImageContainer: {
    position: "relative",
    height: 180,
    width: "100%",
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  priceBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(35, 92, 248, 0.95)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
  carInfoContainer: {
    padding: 16,
    gap: 12,
  },
  carHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  carName: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  yearBadge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  yearText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#235CF8",
  },
  carDetailsRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  carDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  carLocation: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
    maxWidth: 100,
  },
  carMileage: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
  },
  fuelTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F9FF",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fuelTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#235CF8",
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#235CF8",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "400",
  },
});
