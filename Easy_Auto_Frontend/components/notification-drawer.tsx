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

const TYPE_META: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  car:     { icon: "car",                   color: "#235CF8", bg: "#EEF2FF", label: "Listing"    },
  price:   { icon: "trending-down",         color: "#10B981", bg: "#ECFDF5", label: "Price Drop" },
  message: { icon: "chatbubbles",           color: "#7C3AED", bg: "#F5F3FF", label: "Message"    },
  alert:   { icon: "warning",               color: "#F59E0B", bg: "#FFFBEB", label: "Alert"      },
  promo:   { icon: "star",                  color: "#DB2777", bg: "#FDF2F8", label: "Promo"      },
  system:  { icon: "construct",             color: "#64748B", bg: "#F1F5F9", label: "System"     },
};

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
        Animated.timing(slideAnim, { toValue: 0,        duration: 380, easing: Easing.out(Easing.bezier(0.25, 0.1, 0.25, 1)), useNativeDriver: true }),
        Animated.timing(bgOpacity,  { toValue: 1,        duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: DRAWER_W, duration: 300, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
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
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert("Clear All", "Remove all notifications?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => setItems([]) },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} pointerEvents={visible ? "auto" : "none"}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header Area */}
          <View style={styles.aestheticHeader}>
            <LinearGradient
              colors={["#235CF8", "#0D3AAD"]}
              style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}
            >
              <View style={styles.headerTop}>
                <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                  <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitleText}>Notifications</Text>
                <TouchableOpacity onPress={clearAll} style={styles.iconCircleBtn}>
                  <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCountText}>{unreadCount} New</Text>
                </View>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={readAll} style={styles.textBtn}>
                    <Text style={styles.textBtnText}>Mark all as read</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Sub-tabs */}
              <View style={styles.tabsContainer}>
                <TouchableOpacity 
                  onPress={() => { Haptics.selectionAsync(); setFilter("all"); }}
                  style={[styles.tab, filter === "all" && styles.tabActive]}
                >
                  <Text style={[styles.tabText, filter === "all" && styles.tabTextActive]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => { Haptics.selectionAsync(); setFilter("unread"); }}
                  style={[styles.tab, filter === "unread" && styles.tabActive]}
                >
                  <Text style={[styles.tabText, filter === "unread" && styles.tabTextActive]}>Unread</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <ScrollView 
            style={styles.list} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
          >
            {displayed.length === 0 ? (
               <View style={styles.modernEmpty}>
                 <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
                 <Text style={styles.emptyH}>Nothing to show</Text>
                 <Text style={styles.emptyS}>You're all caught up! New updates will appear here.</Text>
               </View>
            ) : (
              displayed.map((n) => {
                const meta = TYPE_META[n.type] || TYPE_META.system;
                return (
                  <TouchableOpacity
                    key={n.id}
                    onPress={() => read(n.id)}
                    activeOpacity={0.7}
                    style={[styles.aestheticCard, !n.read && styles.unreadCard]}
                  >
                    {!n.read && <View style={styles.aestheticUnreadDot} />}
                    <View style={[styles.aestheticIconBox, { backgroundColor: meta.bg }]}>
                      <Ionicons name={meta.icon} size={18} color={meta.color} />
                    </View>
                    <View style={styles.aestheticCardInfo}>
                      <View style={styles.metaLabelRow}>
                        <Text style={[styles.metaLabel, { color: meta.color }]}>{meta.label}</Text>
                        <Text style={styles.aestheticTime}>{n.time}</Text>
                      </View>
                      <Text style={[styles.aestheticCardTitle, !n.read && styles.boldText]}>{n.title}</Text>
                      <Text style={styles.aestheticCardMsg} numberOfLines={2}>{n.message}</Text>
                    </View>
                    <TouchableOpacity onPress={() => remove(n.id)} style={styles.itemClose}>
                       <Ionicons name="close" size={14} color="#94A3B8" />
                    </TouchableOpacity>
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

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row-reverse" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    width: DRAWER_W,
    height: "100%",
    backgroundColor: "#FDFDFD",
    shadowColor: "#000",
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 24,
  },
  aestheticHeader: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  iconCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  unreadBadge: {
    backgroundColor: "#FCD34D", // Amber-400 for contrast
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unreadCountText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#92400E",
  },
  textBtn: {
    paddingVertical: 4,
  },
  textBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  tabsContainer: {
    flexDirection: "row",
    marginTop: 18,
    gap: 24,
  },
  tab: {
    paddingBottom: 10,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  list: { flex: 1 },
  modernEmpty: {
    marginTop: 80,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyH: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyS: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
  },
  aestheticCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  unreadCard: {
    backgroundColor: "#F8FAFF",
    borderColor: "#E0E7FF",
  },
  aestheticUnreadDot: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#235CF8",
  },
  aestheticIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  aestheticCardInfo: {
    flex: 1,
  },
  metaLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  aestheticTime: {
    fontSize: 11,
    color: "#94A3B8",
    marginRight: 20,
  },
  aestheticCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 4,
  },
  aestheticCardMsg: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  boldText: {
    fontWeight: "700",
    color: "#0F172A",
  },
  itemClose: {
    position: "absolute",
    bottom: 12,
    right: 12,
    padding: 4,
  },
});
