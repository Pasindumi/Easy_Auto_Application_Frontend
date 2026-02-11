import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
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

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const drawerWidth = width * 0.75;
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
  }, [visible, drawerWidth, slideAnim, backdropOpacity]);

  const userMenuItems = [
    {
      icon: "ribbon",
      label: "My Subscriptions",
      route: "/packages/subscriptions",
    },
    { icon: "heart", label: "Saved Ads", route: "/profile/wishlist" }, // Use a likely route, can be adjusted 
    {
      icon: "wallet",
      label: "Payment History",
      route: "/payments/payment-history",
    },
    { icon: "megaphone", label: "My Ads", route: "/ads/my-ads" },
    { icon: "chatbubbles", label: "Messages", route: "/chat" },
    { icon: "chatbubble-ellipses", label: "Contact & Support", route: "/support/contact-us" },
  ];

  const guestMenuItems = [
    { icon: "home", label: "Home", route: "/(tabs)" },
    { icon: "search", label: "Search Cars", route: "/(tabs)/search" },
    { icon: "gift", label: "Latest Offers", route: "/(tabs)/trending" },
    { icon: "help-circle", label: "About Us", route: "/support/about" },
  ];

  const handleNavigation = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          onClose();
          logout();
          router.replace("/(tabs)");
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
              width: drawerWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent} edges={["top", "bottom"]}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {isAuthenticated ? (
                <>
                  <LinearGradient
                    colors={[COLORS.primary, '#1E40AF']}
                    style={styles.profileHeader}
                  >
                    <TouchableOpacity
                      style={styles.avatarContainer}
                      onPress={() => handleNavigation("/(tabs)/profile")}
                      activeOpacity={0.9}
                    >
                      <Image
                        source={{
                          uri: user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                        }}
                        style={styles.avatarImage}
                        contentFit="cover"
                        transition={200}
                      />
                      <View style={styles.avatarBadge}>
                        <Ionicons name="checkmark" size={12} color={COLORS.white} />
                      </View>
                    </TouchableOpacity>

                    <View style={styles.profileInfo}>
                      <Text style={styles.userName} numberOfLines={1}>
                        {user?.name || "Dilmin Ekanayaka"}
                      </Text>
                      <Text style={styles.userEmail} numberOfLines={1}>
                        {user?.email || "dilmin@example.com"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.premiumBadge}
                      activeOpacity={0.8}
                      onPress={() => handleNavigation("/packages/subscriptions")}
                    >
                      <Ionicons name="sparkles" size={14} color="#FFD700" />
                      <Text style={styles.premiumText}>Premium Member</Text>
                    </TouchableOpacity>
                  </LinearGradient>

                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>Dashboard</Text>
                    <View style={styles.menuCard}>
                      {userMenuItems.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.menuItem, index === userMenuItems.length - 1 && { borderBottomWidth: 0 }]}
                          onPress={() => handleNavigation(item.route)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.iconBox, { backgroundColor: 'rgba(35, 92, 248, 0.08)' }]}>
                            <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                          </View>
                          <Text style={styles.menuItemText}>{item.label}</Text>
                          <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>Account Settings</Text>
                    <View style={styles.menuCard}>
                      <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => handleNavigation("/settings/settings")}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                          <Ionicons name="settings-outline" size={18} color={COLORS.text.secondary} />
                        </View>
                        <Text style={styles.menuItemText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.menuItem, { borderBottomWidth: 0 }]}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                      >
                        <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                        </View>
                        <Text style={[styles.menuItemText, { color: "#EF4444" }]}>Logout</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <LinearGradient
                    colors={[COLORS.primary, '#1E40AF']}
                    style={styles.guestHeader}
                  >
                    <View style={styles.guestIconCircle}>
                      <Ionicons name="person" size={40} color={COLORS.white} style={{ opacity: 0.9 }} />
                    </View>
                    <Text style={styles.guestTitle}>Welcome to EasyAuto</Text>
                    <Text style={styles.guestSubtitle}>Sign in to unlock more features</Text>

                    <View style={styles.authButtons}>
                      <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => handleNavigation("/auth/login")}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.loginText}>Sign In</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.signupBtn}
                        onPress={() => handleNavigation("/auth/signup")}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.signupText}>Join Now</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>

                  <View style={styles.menuSection}>
                    <Text style={styles.sectionLabel}>Explore</Text>
                    <View style={styles.menuCard}>
                      {guestMenuItems.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.menuItem, index === guestMenuItems.length - 1 && { borderBottomWidth: 0 }]}
                          onPress={() => handleNavigation(item.route)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.iconBox, { backgroundColor: 'rgba(35, 92, 248, 0.08)' }]}>
                            <Ionicons name={item.icon as any} size={18} color={COLORS.primary} />
                          </View>
                          <Text style={styles.menuItemText}>{item.label}</Text>
                          <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <View style={styles.sidebarFooter}>
                <Image
                  source={require("../assets/applogonew.png")}
                  style={styles.footerLogo}
                  contentFit="contain"
                />
                <Text style={styles.versionText}>EasyAuto v1.0.0</Text>
              </View>
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
    flexDirection: "row",
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
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#10B981",
    borderWidth: 3,
    borderColor: '#1E40AF',
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 16,
    width: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: "500",
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },
  guestHeader: {
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  guestIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  guestSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
  },
  authButtons: {
    flexDirection: "row",
    gap: 12,
  },
  loginBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginText: {
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  signupBtn: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  signupText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text.muted,
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft: 8,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  sidebarFooter: {
    marginTop: 40,
    alignItems: "center",
    gap: 12,
  },
  footerLogo: {
    width: 150,
    height: 50,
    opacity: 0.8,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: "500",
  },
});
