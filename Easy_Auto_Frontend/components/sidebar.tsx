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

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export default function Sidebar({ visible, onClose }: SidebarProps) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const menuItems = [
    {
      icon: "workspace-premium",
      label: "My Subscriptions",
      route: "/subscriptions",
    },
    { icon: "tv", label: "My Listings", route: "/listings" },
    {
      icon: "account-balance-wallet",
      label: "Payment History",
      route: "/payment-history",
    },
    { icon: "help-outline", label: "My Ads", route: "/my-ads" },
    { icon: "star-outline", label: "Ratings", route: "/ratings" },
    { icon: "phone", label: "Contact Us", route: "/contact-us" },
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
          onClose();
          // Add your logout logic here
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
              {/* User Profile Card */}
              <View style={styles.profileCard}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
                    }}
                    style={styles.avatarImage}
                    contentFit="cover"
                    transition={200}
                  />
                  <View style={styles.avatarBorder} />
                </View>
                <Text style={styles.userName}>Dilmin Ekanayaka</Text>
                <Text style={styles.userEmail}>dilmin@example.com</Text>
                <TouchableOpacity style={styles.premiumButton}>
                  <MaterialIcons
                    name="workspace-premium"
                    size={18}
                    color="#FFD700"
                  />
                  <Text style={styles.premiumButtonText}>Premium Member</Text>
                </TouchableOpacity>
              </View>

              {/* Main Navigation Menu Card */}
              <View style={styles.menuCard}>
                {menuItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => handleNavigation(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuIconContainer}>
                        <MaterialIcons
                          name={item.icon as any}
                          size={22}
                          color="#235CF8"
                        />
                      </View>
                      <Text style={styles.menuItemText}>{item.label}</Text>
                      <MaterialIcons
                        name="chevron-right"
                        size={20}
                        color="#9BA1A6"
                        style={styles.chevron}
                      />
                    </TouchableOpacity>
                    {index < menuItems.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </React.Fragment>
                ))}
              </View>

              {/* Settings and Logout Card */}
              <View style={styles.settingsCard}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("/settings")}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="settings" size={22} color="#235CF8" />
                  </View>
                  <Text style={styles.menuItemText}>Settings</Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#9BA1A6"
                    style={styles.chevron}
                  />
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleLogout}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconContainer}>
                    <MaterialIcons name="logout" size={22} color="#FF3B30" />
                  </View>
                  <Text style={[styles.menuItemText, styles.logoutText]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>

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
    width: width * 0.75,
    backgroundColor: "#FFFFFF",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
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
    height: 18,
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#235CF8",
    borderRadius: 0,
    padding: 24,
    margin: 0,
    marginBottom: 20,
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarBorder: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    top: -5,
    left: -5,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 20,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  premiumButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    marginHorizontal: 0,
    marginBottom: 12,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F5F7FA",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontWeight: "500",
  },
  chevron: {
    opacity: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginLeft: 24,
    marginRight: 24,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    marginHorizontal: 0,
    marginBottom: 12,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#FF3B30",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: "#9BA1A6",
  },
});
