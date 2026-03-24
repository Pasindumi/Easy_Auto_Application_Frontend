import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmationModal from "./ui/ConfirmationModal";

const { width } = Dimensions.get("window");
const DRAWER_W = width * 0.7; // Adjusted for better usability while keeping content readable

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const USER_ITEMS = [
  { icon: "list",                 label: "My Ads",          sub: "Manage your listings",    route: "/(tabs)/my-ads",             color: COLORS.primary, bg: "#EEF2FF" },
  { icon: "wallet",               label: "Payments",         sub: "Transaction history",     route: "/payments/payment-history",  color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "ribbon",               label: "Subscriptions",    sub: "Your active plans",       route: "/packages/subscriptions",    color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "rocket",               label: "Boost an Ad",      sub: "Get more visibility",     route: "/packages/boost-ad",         color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "help-circle",          label: "Help Centre",      sub: "FAQs & guides",           route: "/support/help-center",        color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "shield-checkmark",     label: "Privacy & Policy", sub: "Data & terms",            route: "/support/privacy-policy",     color: COLORS.primary, bg: "#F8FAFC" },
];

const GUEST_ITEMS = [
  { icon: "search-outline",      label: "Find Cars",   sub: "Search new & used",       route: "/(tabs)/search",     color: COLORS.primary, bg: "#EEF2FF" },
  { icon: "car-sport-outline",   label: "Buy a Car",   sub: "Browse our collection",   route: "/cars/buy-car",      color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "add-circle-outline",  label: "Sell a Car",  sub: "Post an ad quickly",      route: "/cars/select-type",  color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "pricetag-outline",    label: "Offers",      sub: "View latest deals",       route: "/offers",            color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "call-outline",        label: "Contact Us",  sub: "We're here to help",      route: "/support/contact-us",color: COLORS.primary, bg: "#F8FAFC" },
  { icon: "information-outline", label: "About App",   sub: "Learn about EasyAuto",    route: "/support/about",     color: COLORS.primary, bg: "#F8FAFC" },
];

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const insets    = useSafeAreaInsets();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const slideAnim = useRef(new Animated.Value(-DRAWER_W)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0,          duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgOpacity,  { toValue: 1,          duration: 300, easing: Easing.out(Easing.ease),  useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: -DRAWER_W,  duration: 280, easing: Easing.in(Easing.cubic),  useNativeDriver: true }),
        Animated.timing(bgOpacity,  { toValue: 0,          duration: 260, easing: Easing.in(Easing.ease),   useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const go = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => router.push(route as any), 300);
  };

  const confirmLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowLogoutConfirm(true);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>

        {/* ── Drawer ─────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <View style={{ flex: 1 }}>
            {/* ── FIXED HEADER ────────────────────────────────────────── */}
            {isAuthenticated ? (
              <View style={styles.authHeaderWrapper}>
                <LinearGradient
                  colors={[COLORS.primary, "#2563EB"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.authHeaderFull, { paddingTop: insets.top + 20 }]}
                >
                  <View style={styles.headerAbstractDecor} />
                  
                  <View style={styles.profileSection}>
                    <TouchableOpacity onPress={() => go("/(tabs)/profile")} activeOpacity={0.9} style={styles.profileAvatarFrame}>
                      <Image
                        source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/user.jpeg')}
                        style={styles.avatarCircle}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={["#FCD34D", "#F59E0B"]}
                        style={styles.premiumBadgeOverlay}
                      >
                        <Ionicons name="star" size={8} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <View style={styles.profileInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.profileName} numberOfLines={1}>{user?.name || "Premium Member"}</Text>
                      </View>
                      <View style={styles.emailRow}>
                        <Ionicons name="mail" size={10} color="rgba(255,255,255,0.6)" />
                        <Text style={styles.profileEmail} numberOfLines={1}>{user?.email}</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <LinearGradient
                colors={["#235CF8", "#1346C8", "#0D3AAD"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.2 }}
                style={[styles.guestHeader, { paddingTop: insets.top + 20 }]}
              >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <View style={styles.guestLogoContainer}>
                  <Image
                    source={require("@/assets/logoHome.png")}
                    style={styles.guestLogo}
                    contentFit="contain"
                  />
                </View>
                <Text style={styles.guestSub}>Sri Lanka's #1 Car Marketplace</Text>
                
                <View style={styles.guestAuthBtnRow}>
                  <TouchableOpacity style={styles.btnSignIn} onPress={() => go("/auth/login")}>
                    <Text style={styles.btnSignInTxt}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnRegister} onPress={() => go("/auth/signup")}>
                    <Text style={styles.btnRegisterTxt}>Register</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}

            {/* ── SCROLLABLE MENU ─────────────────────────────────────── */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={{ flex: 1 }}
              bounces={true}
            >

              <View style={styles.menuSection}>
                {(isAuthenticated ? USER_ITEMS : GUEST_ITEMS).map((item: any, i: number) => (
                  <TouchableOpacity
                    key={item.route}
                    style={[
                      styles.menuRow,
                      i < (isAuthenticated ? USER_ITEMS.length : GUEST_ITEMS.length) - 1 && styles.menuDivider
                    ]}
                    onPress={() => go(item.route)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                      <Ionicons name={item.icon as any} size={19} color={item.color} />
                    </View>
                    <View style={styles.menuMeta}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.sub && <Text style={styles.menuSub}>{item.sub}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </TouchableOpacity>
                ))}

                {isAuthenticated && (
                  <TouchableOpacity
                    style={[styles.menuRow, { marginTop: 8 }]}
                    onPress={() => go("/settings/settings")}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconBox, { backgroundColor: "#F8FAFC" }]}>
                      <Ionicons name="settings-outline" size={19} color={COLORS.primary} />
                    </View>
                    <View style={styles.menuMeta}>
                      <Text style={styles.menuLabel}>App Settings</Text>
                      <Text style={styles.menuSub}>Preferences & privacy</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={14} color="#E2E8F0" />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {/* ── FIXED BOTTOM AREA ───────────────────────────────────── */}
            <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 16 }]}>
              {isAuthenticated && (
                <TouchableOpacity style={styles.logoutBtnFixed} onPress={confirmLogout} activeOpacity={0.8}>
                  <LinearGradient
                    colors={["#F8FAFC", "#F1F5F9"]}
                    style={styles.logoutGradientFixed}
                  >
                    <View style={styles.logoutIconFrameFixed}>
                      <Ionicons name="log-out-outline" size={18} color="#64748B" />
                    </View>
                    <Text style={styles.logoutTxtFixed}>Sign Out</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              
              <View style={styles.footerMin}>
                <Text style={styles.footerTxtMin}>EasyAuto v1.0.0 · Sri Lanka 🇱🇰</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <ConfirmationModal
          visible={showLogoutConfirm}
          title="Sign Out"
          message="Are you sure you want to sign out? We'll miss you!"
          confirmText="Sign Out"
          cancelText="Stay Logged In"
          type="danger"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            onClose();
            logout();
            showToast({ message: "Successfully logged out. See you soon!", type: "info" });
            router.replace("/(tabs)");
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        {/* ── Backdrop ───────────────────────────────────────────────────── */}
        <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} pointerEvents={visible ? "auto" : "none"}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

      </View>
    </Modal>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:    { flex: 1, flexDirection: "row" },
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.4)" }, // Slightly lighter backdrop for premium feel

  drawer: {
    width: DRAWER_W,
    backgroundColor: "#fff",
    height: "100%",
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 24,
  },

  // ── Auth Header ─────────────────
  authHeaderWrapper: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    elevation: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  authHeaderFull: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerAbstractDecor: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  premiumBadgeOverlay: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileAvatarFrame: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
    position: "relative",
  },
  avatarCircle: {
    width: "100%",
    height: "100%",
    borderRadius: 32,
  },
  onlineStatus: {
    position: "absolute",
    bottom: 0,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileInfo: {
    flex: 1,
    paddingTop: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "500",
  },
  quickStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 20,
    paddingVertical: 14,
  },
  quickStat: {
    flex: 1,
    alignItems: "center",
  },
  quickStatVal: {
    fontSize: 17,
    fontWeight: "900",
    color: "#fff",
  },
  quickStatLbl: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    marginTop: 2,
  },
  statLine: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  // ── Guest Header ────────────────────────
  guestHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  guestLogoContainer: {
    marginTop: 0,
    marginBottom: 6,
    alignItems: "center",
  },
  guestLogo: {
    width: 130,
    height: 34,
  },
  guestSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  guestAuthBtnRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    justifyContent: "center",
  },
  btnSignIn: {
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 100,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  btnSignInTxt: {
    color: COLORS.primary,
    fontWeight: "900",
    fontSize: 14,
  },
  btnRegister: {
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 14,
    minWidth: 100,
    alignItems: 'center',
  },
  btnRegisterTxt: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  decorCircle1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: -60,
    right: -50,
  },
  decorCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -20,
    left: -30,
  },

  // ── Menu ────────────────────────────────
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  menuDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  menuMeta: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    letterSpacing: -0.3,
  },
  menuSub: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
    marginTop: 1,
  },

  // ── Scroll Content ───────────────
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  menuSection: {
    backgroundColor: "#fff",
  },
  guestAuthRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },

  // ── Bottom Area ───────────────────
  bottomArea: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 16,
  },
  logoutBtnFixed: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
  },
  logoutGradientFixed: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  logoutIconFrameFixed: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  logoutTxtFixed: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
    letterSpacing: -0.2,
  },
  footerMin: {
    alignItems: "center",
  },
  footerTxtMin: {
    fontSize: 10,
    color: "#CBD5E1",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
