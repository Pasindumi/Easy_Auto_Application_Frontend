import COLORS from "@/constants/Colors";
import { api } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ActivityIndicator,
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
import Loading from "./ui/Loading";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const DRAWER_W = width * 0.88;

interface WishlistDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ visible, onClose }: WishlistDrawerProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(DRAWER_W)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchWishlist();
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 0, duration: 340, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: DRAWER_W, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
        Animated.timing(bgOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: any[] }>("/api/favorites");
      if (res.success) setItems(res.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  const removeItem = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Remove from Wishlist", "Are you sure you want to remove this car?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await api.post<{ success: boolean; isFavorite: boolean }>("/api/favorites/toggle", { ad_id: id });
            if (res.success && !res.isFavorite) setItems((prev) => prev.filter((i) => i.id !== id));
          } catch {
            Alert.alert("Error", "Could not remove item. Please try again.");
          }
        },
      },
    ]);
  };

  const viewCar = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => router.push(`/cars/${item.id}` as any), 260);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(price);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        {/* ── Backdrop ─────────────────────────────────────── */}
        <Animated.View style={[styles.backdrop, { opacity: bgOpacity }]} pointerEvents={visible ? "auto" : "none"}>
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
        </Animated.View>

        {/* ── Drawer (slides from right) ────────────────────── */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

          {/* ── Header ──────────────────────────────────────── */}
          <LinearGradient
            colors={["#235CF8", "#1346C8", "#0D3AAD"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1.2 }}
            style={[styles.header, { paddingTop: insets.top + 16 }]}
          >
            {/* Decorative blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>

            {/* Heart icon */}
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={28} color="#EF4444" />
            </View>

            {/* Title row */}
            <View style={styles.headerTitleRow}>
              <View>
                <Text style={styles.headerTitle}>Wishlist</Text>
                <Text style={styles.headerSub}>Your saved dream cars</Text>
              </View>
              {items.length > 0 && (
                <View style={styles.countPill}>
                  <Text style={styles.countTxt}>{items.length}</Text>
                </View>
              )}
            </View>
          </LinearGradient>

          {/* ── Content ─────────────────────────────────────── */}
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
          >
            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingTxt}>Loading your wishlist...</Text>
              </View>
            ) : items.length === 0 ? (
              /* Empty state */
              <View style={styles.emptyState}>
                <View style={styles.emptyCircle}>
                  <Ionicons name="heart-dislike-outline" size={44} color="#CBD5E1" />
                </View>
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptyBody}>
                  Tap the heart ♥ on any car listing to save it here for quick access.
                </Text>
                <TouchableOpacity
                  style={styles.browseBtn}
                  onPress={() => { onClose(); router.push("/cars/buy-car"); }}
                >
                  <Ionicons name="search" size={16} color="#fff" />
                  <Text style={styles.browseTxt}>Browse Cars</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Car cards */
              items.map((item) => {
                const img = item.AdImage?.find((i: any) => i.is_main)?.image_url || item.AdImage?.[0]?.image_url;
                const details = item.CarDetails?.[0] || item.CarDetails || {};
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    activeOpacity={0.93}
                    onPress={() => viewCar(item)}
                  >
                    {/* Image */}
                    <View style={styles.imageWrap}>
                      {img ? (
                        <Image source={{ uri: img }} style={styles.image} contentFit="cover" transition={300} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Ionicons name="car-outline" size={36} color="#CBD5E1" />
                        </View>
                      )}

                      {/* Overlay gradient */}
                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.5)"]}
                        style={StyleSheet.absoluteFillObject}
                      />

                      {/* Year badge */}
                      {details.year && (
                        <View style={styles.yearBadge}>
                          <Text style={styles.yearTxt}>{details.year}</Text>
                        </View>
                      )}

                      {/* Remove button */}
                      <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                        <Ionicons name="heart" size={18} color="#EF4444" />
                      </TouchableOpacity>

                      {/* Price overlay */}
                      <View style={styles.priceOverlay}>
                        <Text style={styles.priceOverlayTxt}>{formatPrice(item.price)}</Text>
                      </View>
                    </View>

                    {/* Info */}
                    <View style={styles.cardInfo}>
                      <Text style={styles.carTitle} numberOfLines={1}>{item.title}</Text>

                      {/* Specs row */}
                      <View style={styles.specsRow}>
                        {[
                          { icon: "location-outline", val: item.location || "—" },
                          { icon: "speedometer-outline", val: details.mileage ? `${Number(details.mileage).toLocaleString()} km` : "—" },
                          { icon: "color-palette-outline", val: details.color || "—" },
                        ].map((s, i) => (
                          <View key={i} style={styles.specChip}>
                            <Ionicons name={s.icon as any} size={11} color="#64748B" />
                            <Text style={styles.specTxt} numberOfLines={1}>{s.val}</Text>
                          </View>
                        ))}
                      </View>

                      {/* Actions */}
                      <View style={styles.actionBar}>
                        <TouchableOpacity style={styles.primaryAction} onPress={() => viewCar(item)}>
                          <Ionicons name="eye-outline" size={16} color="#fff" />
                          <Text style={styles.primaryActionTxt}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.secondaryAction}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            Alert.alert("Share", `Sharing ${item.title}...`);
                          }}
                        >
                          <Ionicons name="share-social-outline" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.secondaryAction}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            onClose();
                            setTimeout(() => router.push("/(tabs)/compare"), 260);
                          }}
                        >
                          <Ionicons name="git-compare-outline" size={16} color={COLORS.primary} />
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

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: "row-reverse" },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.55)" },

  drawer: {
    width: DRAWER_W,
    backgroundColor: "#F8FAFF",
    height: "100%",
    shadowColor: "#000",
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },

  // ── Header ──────────────────────────────────────────
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: "hidden",
  },
  blob1: {
    position: "absolute", width: 180, height: 180, borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)", top: -70, right: -50,
  },
  blob2: {
    position: "absolute", width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.04)", bottom: -20, left: 10,
  },
  closeBtn: {
    alignSelf: "flex-end",
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 12,
  },
  headerIcon: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between",
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 3 },
  countPill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  countTxt: { color: "#fff", fontWeight: "800", fontSize: 16 },

  // ── Scroll ──────────────────────────────────────────
  scrollContent: { padding: 16, gap: 14 },

  // ── Loading ─────────────────────────────────────────
  centerBox: { flex: 1, paddingTop: 100, alignItems: "center", gap: 16 },
  loadingTxt: { fontSize: 14, color: "#94A3B8", fontWeight: "500" },

  // ── Empty ───────────────────────────────────────────
  emptyState: { flex: 1, paddingTop: 64, alignItems: "center", paddingHorizontal: 28 },
  emptyCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#F1F5F9",
    alignItems: "center", justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B", letterSpacing: -0.5, marginBottom: 10 },
  emptyBody: { fontSize: 14, color: "#64748B", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  browseBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28, paddingVertical: 14, borderRadius: 16,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 6,
  },
  browseTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },

  // ── Card ────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  imageWrap: { width: "100%", height: 170, position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: {
    width: "100%", height: "100%", backgroundColor: "#F1F5F9",
    alignItems: "center", justifyContent: "center",
  },
  yearBadge: {
    position: "absolute", top: 10, left: 10,
    backgroundColor: COLORS.primary, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  yearTxt: { color: "#fff", fontSize: 11, fontWeight: "800" },
  removeBtn: {
    position: "absolute", top: 10, right: 10,
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
  },
  priceOverlay: {
    position: "absolute", bottom: 10, left: 10,
  },
  priceOverlayTxt: {
    fontSize: 17, fontWeight: "800", color: "#fff",
    textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },

  // Card info
  cardInfo: { padding: 14 },
  carTitle: { fontSize: 16, fontWeight: "700", color: "#1E293B", letterSpacing: -0.3, marginBottom: 10 },

  specsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  specChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#F8FAFF",
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: "#EDF2FF",
  },
  specTxt: { fontSize: 11, color: "#64748B", fontWeight: "500", maxWidth: 70 },

  actionBar: { flexDirection: "row", gap: 8, alignItems: "center" },
  primaryAction: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: COLORS.primary,
    paddingVertical: 10, borderRadius: 12,
  },
  primaryActionTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
  secondaryAction: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center", justifyContent: "center",
  },
});
