import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
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

const { width } = Dimensions.get("window");
const DRAWER_W = width * 0.88;

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "car" | "price" | "message" | "alert" | "promo" | "system";
}

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

// ── Type metadata ─────────────────────────────────────────────────────────────
const TYPE_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  car:     { icon: "car-sport",              color: "#235CF8", bg: "#EEF2FF", label: "New Listing"   },
  price:   { icon: "pricetag",               color: "#10B981", bg: "#ECFDF5", label: "Price Drop"    },
  message: { icon: "chatbubble-ellipses",    color: "#7C3AED", bg: "#F5F3FF", label: "Message"       },
  alert:   { icon: "alert-circle",           color: "#EF4444", bg: "#FEF2F2", label: "Alert"         },
  promo:   { icon: "gift",                    color: "#F59E0B", bg: "#FFFBEB", label: "Promotion"     },
  system:  { icon: "settings",              color: "#64748B", bg: "#F8FAFC", label: "System"         },
};

// ── Initial data ──────────────────────────────────────────────────────────────
const INITIAL: NotificationItem[] = [
  { id: 1, type: "car",     title: "New Listing Match",          message: "A 2022 Toyota Corolla matching your search was just listed in Colombo.",       time: "Just now",    read: false },
  { id: 2, type: "price",   title: "Price Drop Alert 🎉",        message: "Your saved BMW 3 Series dropped by LKR 500,000. Check it out now!",            time: "2 hrs ago",   read: false },
  { id: 3, type: "message", title: "Dealer Replied",             message: "Auto Lanka Motors responded to your inquiry about the Nissan GTR 2021.",        time: "5 hrs ago",   read: false },
  { id: 4, type: "alert",   title: "Subscription Expiring",      message: "Your Premium plan expires in 3 days. Renew to keep your ads boosted.",          time: "1 day ago",   read: true  },
  { id: 5, type: "promo",   title: "Weekend Special Offer",      message: "Get 30% off on Premium listings this weekend. Limited time deal!",              time: "2 days ago",  read: true  },
  { id: 6, type: "system",  title: "Profile Verified ✅",        message: "Your account has been verified. You can now post unlimited ads.",               time: "3 days ago",  read: true  },
];

export default function NotificationDrawer({ visible, onClose }: NotificationDrawerProps) {
  const insets    = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(DRAWER_W)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const [items, setItems] = useState<NotificationItem[]>(INITIAL);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0,        duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgOpacity,  { toValue: 1,        duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: DRAWER_W, duration: 280, easing: Easing.in(Easing.cubic),  useNativeDriver: true }),
        Animated.timing(bgOpacity,  { toValue: 0,        duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const unreadCount = items.filter((n) => !n.read).length;
  const displayed   = filter === "unread" ? items.filter((n) => !n.read) : items;

  const read = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const readAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const remove = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Notification", "Remove this notification?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete",  style: "destructive", onPress: () => setItems((prev) => prev.filter((n) => n.id !== id)) },
    ]);
  };

  const clearAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Clear All", "Remove all notifications?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => setItems([]) },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>

        {/* ── Backdrop ──────────────────────────────────────────────────── */}
        <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} pointerEvents={visible ? "auto" : "none"}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* ── Drawer ────────────────────────────────────────────────────── */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

          {/* ── Header ──────────────────────────────────────────────────── */}
          <LinearGradient
            colors={["#235CF8", "#1346C8", "#0D3AAD"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.4 }}
            style={[styles.header, { paddingTop: insets.top + 14 }]}
          >
            {/* Decorative blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Close + clear all */}
            <View style={styles.headerTopRow}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
              </TouchableOpacity>
              {items.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
                  <Ionicons name="trash-outline" size={14} color="rgba(255,255,255,0.75)" />
                  <Text style={styles.clearBtnTxt}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Bell icon */}
            <View style={styles.bellWrap}>
              <Ionicons name="notifications" size={28} color="#FCD34D" />
              {unreadCount > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeTxt}>{unreadCount}</Text>
                </View>
              )}
            </View>

            {/* Title row */}
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.headerSub}>
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up 🎉"}
                </Text>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity style={styles.markAllBtn} onPress={readAll}>
                  <Ionicons name="checkmark-done" size={14} color="#fff" />
                  <Text style={styles.markAllTxt}>Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
              {(["all", "unread"] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, filter === f && styles.filterTabActive]}
                  onPress={() => { Haptics.selectionAsync(); setFilter(f); }}
                >
                  <Text style={[styles.filterTabTxt, filter === f && styles.filterTabTxtActive]}>
                    {f === "all" ? `All (${items.length})` : `Unread (${unreadCount})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>

          {/* ── List ──────────────────────────────────────────────────── */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          >
            {displayed.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyCircle}>
                  <Ionicons name="notifications-off-outline" size={44} color="#CBD5E1" />
                </View>
                <Text style={styles.emptyTitle}>
                  {filter === "unread" ? "No Unread Notifications" : "All Clear!"}
                </Text>
                <Text style={styles.emptyBody}>
                  {filter === "unread"
                    ? "You've read all your notifications. Great job!"
                    : "You have no notifications at the moment. Check back later."}
                </Text>
              </View>
            ) : (
              displayed.map((n, i) => {
                const meta = TYPE_META[n.type] || TYPE_META.system;
                return (
                  <TouchableOpacity
                    key={n.id}
                    style={[styles.card, !n.read && styles.cardUnread]}
                    onPress={() => read(n.id)}
                    activeOpacity={0.82}
                  >
                    {/* Unread left bar */}
                    {!n.read && <View style={styles.unreadBar} />}

                    {/* Icon */}
                    <View style={[styles.iconBox, { backgroundColor: meta.bg }]}>
                      <Ionicons name={meta.icon} size={20} color={meta.color} />
                    </View>

                    {/* Content */}
                    <View style={styles.cardContent}>
                      {/* Type label + unread dot */}
                      <View style={styles.cardTopRow}>
                        <View style={[styles.typePill, { backgroundColor: meta.bg }]}>
                          <Text style={[styles.typePillTxt, { color: meta.color }]}>{meta.label}</Text>
                        </View>
                        {!n.read && <View style={styles.unreadDot} />}
                      </View>

                      <Text style={[styles.cardTitle, !n.read && { color: "#0F172A" }]} numberOfLines={1}>
                        {n.title}
                      </Text>
                      <Text style={styles.cardMsg} numberOfLines={2}>{n.message}</Text>

                      {/* Footer */}
                      <View style={styles.cardFooter}>
                        <View style={styles.timeRow}>
                          <Ionicons name="time-outline" size={11} color="#94A3B8" />
                          <Text style={styles.timeTxt}>{n.time}</Text>
                        </View>
                        <TouchableOpacity style={styles.deleteBtn} onPress={() => remove(n.id)}>
                          <Ionicons name="trash-outline" size={15} color="#CBD5E1" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:    { flex: 1, flexDirection: "row-reverse" },
  backdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(15,23,42,0.55)",
  },

  drawer: {
    width: DRAWER_W,
    height: "100%",
    backgroundColor: "#F8FAFF",
    shadowColor: "#000",
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)", top: -80, right: -60,
  },
  blob2: {
    position: "absolute", width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.04)", bottom: -30, left: 0,
  },
  headerTopRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 16,
  },
  closeBtn: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  clearBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  clearBtnTxt: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "600" },

  bellWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14, position: "relative",
  },
  bellBadge: {
    position: "absolute", top: -4, right: -4,
    backgroundColor: "#EF4444",
    minWidth: 20, height: 20, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#235CF8",
    paddingHorizontal: 4,
  },
  bellBadgeTxt: { color: "#fff", fontSize: 10, fontWeight: "800" },

  headerTitleRow: {
    flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  headerSub:   { fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 },

  markAllBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    marginTop: 4,
  },
  markAllTxt: { color: "#fff", fontSize: 12, fontWeight: "700" },

  filterRow: { flexDirection: "row", gap: 8 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  filterTabActive: { backgroundColor: "#fff" },
  filterTabTxt:   { color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: "600" },
  filterTabTxtActive: { color: COLORS.primary, fontWeight: "700" },

  // ── Scroll ──────────────────────────────────────────
  scrollContent: { padding: 16, gap: 10 },

  // ── Empty ───────────────────────────────────────────
  emptyState: { paddingTop: 64, alignItems: "center", paddingHorizontal: 28 },
  emptyCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#F1F5F9",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B", letterSpacing: -0.4, marginBottom: 10 },
  emptyBody:  { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 22 },

  // ── Card ────────────────────────────────────────────
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
    position: "relative",
  },
  cardUnread: {
    backgroundColor: "#FAFBFF",
    borderColor: "#E0E8FF",
  },
  unreadBar: {
    position: "absolute", left: 0, top: 0, bottom: 0,
    width: 3, backgroundColor: COLORS.primary, borderRadius: 2,
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  cardContent: { flex: 1 },
  cardTopRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    marginBottom: 4,
  },
  typePill: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  typePillTxt: { fontSize: 10, fontWeight: "800", letterSpacing: 0.3 },
  unreadDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
  },
  cardTitle: {
    fontSize: 14, fontWeight: "700", color: "#334155",
    letterSpacing: -0.2, marginBottom: 4,
  },
  cardMsg: {
    fontSize: 13, color: "#64748B", lineHeight: 19, marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
  },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeTxt: { fontSize: 11, color: "#94A3B8", fontWeight: "500" },
  deleteBtn: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center", justifyContent: "center",
  },
});
