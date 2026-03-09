import COLORS from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useRef, useEffect } from "react";
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

const { width } = Dimensions.get("window");
const DRAWER_W = width * 0.82;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

const USER_SECTIONS = [
  {
    title: "My Activity",
    items: [
      { icon: "megaphone-outline",          label: "My Ads",          sub: "Manage your listings",    route: "/ads/my-ads",                color: "#235CF8", bg: "#EEF2FF" },
      { icon: "heart-outline",              label: "Saved Cars",       sub: "Your wishlist",           route: "/profile/wishlist",          color: "#EF4444", bg: "#FEF2F2" },
      { icon: "chatbubbles-outline",        label: "Messages",         sub: "Inbox & conversations",   route: "/chat",                      color: "#10B981", bg: "#ECFDF5" },
      { icon: "wallet-outline",             label: "Payments",         sub: "Transaction history",     route: "/payments/payment-history",  color: "#F59E0B", bg: "#FFFBEB" },
    ],
  },
  {
    title: "Growth",
    items: [
      { icon: "ribbon-outline",             label: "Subscriptions",    sub: "Your active plans",       route: "/packages/subscriptions",    color: "#7C3AED", bg: "#F5F3FF" },
      { icon: "rocket-outline",             label: "Boost an Ad",      sub: "Get more visibility",     route: "/packages/packages",         color: "#0891B2", bg: "#ECFEFF" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: "help-circle-outline",        label: "Help Centre",      sub: "FAQs & guides",           route: "/support/contact-us",        color: "#64748B", bg: "#F8FAFC" },
      { icon: "shield-checkmark-outline",   label: "Privacy & Policy", sub: "Data & terms",            route: "/support/about",             color: "#64748B", bg: "#F8FAFC" },
    ],
  },
];

const GUEST_ITEMS = [
  { icon: "home-outline",        label: "Home",         route: "/(tabs)"            },
  { icon: "search-outline",      label: "Search Cars",  route: "/(tabs)/search"     },
  { icon: "car-sport-outline",   label: "Buy a Car",    route: "/cars/buy-car"      },
  { icon: "cash-outline",        label: "Sell a Car",   route: "/cars/select-type"  },
  { icon: "help-circle-outline", label: "About Us",     route: "/support/about"     },
];

export default function Sidebar({ visible, onClose }: SidebarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const insets    = useSafeAreaInsets();
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
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: () => { onClose(); logout(); router.replace("/(tabs)"); } },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>

        {/* ── Drawer ─────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
            bounces={false}
          >
            {/* ── HEADER: Authenticated ─────────────────────────────────── */}
            {isAuthenticated ? (
              <LinearGradient
                colors={["#235CF8", "#1346C8", "#0D3AAD"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.2 }}
                style={[styles.header, { paddingTop: insets.top + 16 }]}
              >
                {/* Decorative circles */}
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                {/* Close */}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>

                {/* Avatar */}
                <TouchableOpacity onPress={() => go("/(tabs)/profile")} activeOpacity={0.85} style={styles.avatarWrap}>
                  <Image
                    source={{ uri: user?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.onlineDot} />
                </TouchableOpacity>

                <Text style={styles.userName}>{user?.name || "Welcome Back!"}</Text>
                <Text style={styles.userEmail}>{user?.email}</Text>

                {/* Premium pill */}
                <TouchableOpacity style={styles.premiumPill} onPress={() => go("/packages/subscriptions")}>
                  <Ionicons name="sparkles" size={12} color="#FCD34D" />
                  <Text style={styles.premiumText}>Premium Member</Text>
                  <Ionicons name="chevron-forward" size={12} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>

                {/* Stats */}
                <View style={styles.statsRow}>
                  {[{ v: "0", l: "Active Ads" }, { v: "0", l: "Saved" }, { v: "0", l: "Views" }].map((s, i) => (
                    <View key={i} style={[styles.statCell, i > 0 && styles.statBorder]}>
                      <Text style={styles.statVal}>{s.v}</Text>
                      <Text style={styles.statLbl}>{s.l}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            ) : (
              /* ── HEADER: Guest ───────────────────────────────────────── */
              <LinearGradient
                colors={["#235CF8", "#1346C8", "#0D3AAD"]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.2 }}
                style={[styles.guestHeader, { paddingTop: insets.top + 20 }]}
              >
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                  <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
                </TouchableOpacity>
                <View style={styles.guestIconCircle}>
                  <Ionicons name="car-sport" size={32} color="#fff" />
                </View>
                <Text style={styles.guestTitle}>Welcome to EasyAuto</Text>
                <Text style={styles.guestSub}>Sri Lanka's #1 Car Marketplace</Text>
                <View style={styles.authRow}>
                  <TouchableOpacity style={styles.btnSignIn} onPress={() => go("/auth/login")}>
                    <Text style={styles.btnSignInTxt}>Sign In</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnRegister} onPress={() => go("/auth/signup")}>
                    <Text style={styles.btnRegisterTxt}>Register</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            )}

            {/* ── MENU: Authenticated sections ──────────────────────────── */}
            {isAuthenticated && USER_SECTIONS.map((sec) => (
              <View key={sec.title} style={styles.section}>
                <Text style={styles.sectionLbl}>{sec.title}</Text>
                <View style={styles.menuCard}>
                  {sec.items.map((item, i) => (
                    <TouchableOpacity
                      key={item.route}
                      style={[styles.menuRow, i < sec.items.length - 1 && styles.menuDivider]}
                      onPress={() => go(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.menuIconBox, { backgroundColor: item.bg }]}>
                        <Ionicons name={item.icon as any} size={19} color={item.color} />
                      </View>
                      <View style={styles.menuMeta}>
                        <Text style={styles.menuLabel}>{item.label}</Text>
                        <Text style={styles.menuSub}>{item.sub}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}

            {/* ── MENU: Guest quick links ───────────────────────────────── */}
            {!isAuthenticated && (
              <View style={styles.section}>
                <Text style={styles.sectionLbl}>Explore</Text>
                <View style={styles.menuCard}>
                  {GUEST_ITEMS.map((item, i) => (
                    <TouchableOpacity
                      key={item.route}
                      style={[styles.menuRow, i < GUEST_ITEMS.length - 1 && styles.menuDivider]}
                      onPress={() => go(item.route)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.menuIconBox, { backgroundColor: "#EEF2FF" }]}>
                        <Ionicons name={item.icon as any} size={19} color={COLORS.primary} />
                      </View>
                      <Text style={[styles.menuLabel, { flex: 1 }]}>{item.label}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ── Account: Settings + Logout ────────────────────────────── */}
            {isAuthenticated && (
              <View style={styles.section}>
                <Text style={styles.sectionLbl}>Account</Text>
                <View style={styles.menuCard}>
                  <TouchableOpacity
                    style={[styles.menuRow, styles.menuDivider]}
                    onPress={() => go("/settings/settings")}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.menuIconBox, { backgroundColor: "#F1F5F9" }]}>
                      <Ionicons name="settings-outline" size={19} color="#64748B" />
                    </View>
                    <View style={styles.menuMeta}>
                      <Text style={styles.menuLabel}>Settings</Text>
                      <Text style={styles.menuSub}>App preferences</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuRow} onPress={confirmLogout} activeOpacity={0.7}>
                    <View style={[styles.menuIconBox, { backgroundColor: "#FEF2F2" }]}>
                      <Ionicons name="log-out-outline" size={19} color="#EF4444" />
                    </View>
                    <View style={styles.menuMeta}>
                      <Text style={[styles.menuLabel, { color: "#EF4444" }]}>Sign Out</Text>
                      <Text style={styles.menuSub}>Log out of your account</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ── Footer ───────────────────────────────────────────────── */}
            <View style={styles.footer}>
              <Image
                source={require("../assets/applogonew.png")}
                style={styles.footerLogo}
                contentFit="contain"
              />
              <Text style={styles.footerTxt}>EasyAuto v1.0.0 · Sri Lanka 🇱🇰</Text>
            </View>
          </ScrollView>
        </Animated.View>

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
  backdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.55)" },

  drawer: {
    width: DRAWER_W,
    backgroundColor: "#F8FAFF",
    height: "100%",
    zIndex: 50,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 24,
  },

  // ── Header ─────────────────────────────
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    alignItems: "center",
    overflow: "hidden",
  },
  decorCircle1: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.06)", top: -80, right: -60,
  },
  decorCircle2: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)", bottom: -20, left: -30,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 18,
  },
  avatarWrap: {
    width: 86, height: 86, borderRadius: 43,
    borderWidth: 3, borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 14, position: "relative",
  },
  avatar: { width: "100%", height: "100%", borderRadius: 43 },
  onlineDot: {
    position: "absolute", bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: "#10B981", borderWidth: 2.5, borderColor: "#1346C8",
  },
  userName: {
    fontSize: 20, fontWeight: "800", color: "#fff",
    letterSpacing: -0.4, marginBottom: 4, textAlign: "center",
  },
  userEmail: {
    fontSize: 12, color: "rgba(255,255,255,0.6)",
    fontWeight: "500", marginBottom: 14, textAlign: "center",
  },
  premiumPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    marginBottom: 20,
  },
  premiumText: { color: "#fff", fontWeight: "700", fontSize: 13, flex: 1 },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16, paddingVertical: 12,
    width: "100%",
  },
  statCell: { flex: 1, alignItems: "center" },
  statBorder: { borderLeftWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  statVal: { fontSize: 18, fontWeight: "800", color: "#fff" },
  statLbl: { fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: "500", marginTop: 2 },

  // ── Guest Header ────────────────────────
  guestHeader: {
    paddingHorizontal: 24, paddingBottom: 28,
    alignItems: "center", overflow: "hidden",
  },
  guestIconCircle: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14, marginTop: 4,
  },
  guestTitle: {
    fontSize: 20, fontWeight: "800", color: "#fff",
    letterSpacing: -0.4, marginBottom: 4, textAlign: "center",
  },
  guestSub: {
    fontSize: 13, color: "rgba(255,255,255,0.65)",
    marginBottom: 22, textAlign: "center",
  },
  authRow: { flexDirection: "row", gap: 10 },
  btnSignIn: {
    backgroundColor: "#fff",
    paddingHorizontal: 26, paddingVertical: 11, borderRadius: 14,
  },
  btnSignInTxt: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },
  btnRegister: {
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.45)",
    paddingHorizontal: 26, paddingVertical: 11, borderRadius: 14,
  },
  btnRegisterTxt: { color: "#fff", fontWeight: "700", fontSize: 14 },

  // ── Menu ────────────────────────────────
  section: { marginTop: 22, paddingHorizontal: 16 },
  sectionLbl: {
    fontSize: 11, fontWeight: "800", color: "#94A3B8",
    textTransform: "uppercase", letterSpacing: 1.2,
    marginBottom: 10, paddingLeft: 4,
  },
  menuCard: {
    backgroundColor: "#fff", borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: "#F1F5F9",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  menuRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 13, gap: 12,
  },
  menuDivider: { borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
  menuIconBox: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  menuMeta: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: "600", color: "#1E293B", letterSpacing: -0.2 },
  menuSub: { fontSize: 11, color: "#94A3B8", fontWeight: "500", marginTop: 1 },

  // ── Footer ──────────────────────────────
  footer: { marginTop: 30, alignItems: "center", gap: 6 },
  footerLogo: { width: 130, height: 40, opacity: 0.55 },
  footerTxt: { fontSize: 11, color: "#94A3B8", fontWeight: "500" },
});
