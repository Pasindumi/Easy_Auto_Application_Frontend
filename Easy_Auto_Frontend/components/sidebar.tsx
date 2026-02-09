import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
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

import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const drawerWidth = width * 0.7;
  const slideAnim = React.useRef(new Animated.Value(-drawerWidth)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

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
          toValue: -drawerWidth,
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

  const userMenuItems = [
    {
      icon: "workspace-premium",
      label: "My Subscriptions",
      route: "/packages/subscriptions",
    },
    { icon: "tv", label: "My Listings", route: "/listings" },
    {
      icon: "account-balance-wallet",
      label: "Payment History",
      route: "/payments/payment-history",
    },
    { icon: "help-outline", label: "My Ads", route: "/ads/my-ads" },
    { icon: "star-outline", label: "Ratings", route: "/profile/ratings" },
    { icon: "phone", label: "Contact & Complaints", route: "/support/contact-us" },
  ];

  const guestMenuItems = [
    { icon: "home", label: "Home", route: "/(tabs)" },
    { icon: "search", label: "Search Cars", route: "/(tabs)/search" },
    { icon: "phone", label: "Contact & Complaints", route: "/support/contact-us" },
  ];

  const handleNavigation = (route: string) => {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          onClose(); // Close sidebar first
          logout();  // Update auth state
          router.replace("/(tabs)"); // Redirect to home
          console.log("User logged out");
        },
      },
    ]);
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
          <SafeAreaView style={styles.drawerContent} edges={["bottom"]}>
            <View style={styles.topBlueSection} />
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {isAuthenticated ? (
                // =============== LOGGED IN STATE ===============
                <>
                  {/* User Profile Card */}
                  <View style={styles.profileCard}>
                    <TouchableOpacity
                      style={styles.avatarContainer}
                      onPress={() => handleNavigation("/(tabs)/profile")}
                      activeOpacity={0.8}
                    >
                      <Image
                        source={{
                          uri:
                            user?.avatar ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                        }}
                        style={styles.avatarImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.avatarBadge}>
                        <MaterialIcons name="check" size={14} color="#FFFFFF" />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.profileInfo}>
                      <Text style={styles.userName}>
                        {user?.name || "Dilmin Ekanayaka"}
                      </Text>
                      <Text style={styles.userEmail}>
                        {user?.email || "dilmin@example.com"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.premiumButton}
                      activeOpacity={0.8}
                      onPress={() => handleNavigation("/packages/subscriptions")}
                    >
                      <MaterialIcons
                        name="workspace-premium"
                        size={16}
                        color="#FFD700"
                      />
                      <Text style={styles.premiumButtonText}>
                        Premium Member
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Main Navigation Menu Card */}
                  <View style={styles.menuCard}>
                    <Text style={styles.sectionLabel}>Menu</Text>
                    {userMenuItems.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.menuIconContainer}>
                          <MaterialIcons
                            name={item.icon as any}
                            size={20}
                            color="#235CF8"
                          />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={18}
                          color="#D1D5DB"
                          style={styles.chevron}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Settings and Logout Card */}
                  <View style={styles.settingsCard}>
                    <Text style={styles.sectionLabel}>Account</Text>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleNavigation("/settings/settings")}
                      activeOpacity={0.6}
                    >
                      <View style={styles.menuIconContainer}>
                        <MaterialIcons
                          name="settings"
                          size={20}
                          color="#235CF8"
                        />
                      </View>
                      <Text style={styles.menuItemText}>Settings</Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={18}
                        color="#D1D5DB"
                        style={styles.chevron}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.menuItem, styles.logoutItem]}
                      onPress={handleLogout}
                      activeOpacity={0.6}
                    >
                      <View
                        style={[
                          styles.menuIconContainer,
                          styles.logoutIconContainer,
                        ]}
                      >
                        <MaterialIcons
                          name="logout"
                          size={20}
                          color="#EF4444"
                        />
                      </View>
                      <Text
                        style={[styles.menuItemText, styles.logoutText]}
                      >
                        Logout
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // =============== GUEST STATE ===============
                <>
                  <View style={[styles.profileCard, styles.guestCard]}>
                    <View style={styles.guestIconContainer}>
                      <MaterialIcons
                        name="account-circle"
                        size={64}
                        color="#FFFFFF"
                        style={{ opacity: 0.9 }}
                      />
                    </View>
                    <Text style={styles.guestTitle}>Welcome Guest!</Text>
                    <Text style={styles.guestSubtitle}>
                      Log in to manage ads, save listings, and more.
                    </Text>

                    <View style={styles.guestButtonsRow}>
                      <TouchableOpacity
                        style={styles.guestLoginBtn}
                        onPress={() => handleNavigation("/auth/login")}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.guestLoginText}>Login</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.guestSignupBtn}
                        onPress={() => handleNavigation("/auth/signup")}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.guestSignupText}>Signup</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Guest Menu */}
                  <View style={styles.menuCard}>
                    <Text style={styles.sectionLabel}>Explore</Text>
                    {guestMenuItems.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={() => handleNavigation(item.route)}
                        activeOpacity={0.6}
                      >
                        <View style={styles.menuIconContainer}>
                          <MaterialIcons
                            name={item.icon as any}
                            size={20}
                            color="#235CF8"
                          />
                        </View>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                        <MaterialIcons
                          name="chevron-right"
                          size={18}
                          color="#D1D5DB"
                          style={styles.chevron}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>EasyAuto v1.0</Text>
              </View>
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
    flexDirection: "row",
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
    backgroundColor: "#F9FAFB",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  drawerContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  topBlueSection: {
    backgroundColor: "#235CF8",
    height: 12,
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#235CF8",
    padding: 20,
    marginBottom: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  userEmail: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.85,
    fontWeight: "400",
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
    alignSelf: "center",
  },
  premiumButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#9BA1A6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
    letterSpacing: -0.2,
  },
  chevron: {
    opacity: 0.4,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutItem: {
    marginTop: 4,
  },
  logoutIconContainer: {
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    color: "#EF4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 11,
    color: "#9BA1A6",
    fontWeight: "400",
    letterSpacing: 0.3,
  },
  guestCard: {
    paddingVertical: 32,
  },
  guestIconContainer: {
    marginBottom: 12,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },
  guestSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  guestButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  guestLoginBtn: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  guestLoginText: {
    color: "#235CF8",
    fontWeight: "700",
    fontSize: 14,
  },
  guestSignupBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  guestSignupText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
