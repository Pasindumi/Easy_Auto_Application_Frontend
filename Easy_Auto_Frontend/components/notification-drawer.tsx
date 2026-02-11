import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
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
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({
  visible,
  onClose,
}: NotificationDrawerProps) {
  const drawerWidth = width * 0.8;
  const slideAnim = React.useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Car Listing",
      message: "A new car matching your preferences has been added",
      time: "2 hours ago",
      read: false,
      type: "car",
    },
    {
      id: 2,
      title: "Price Drop Alert",
      message: "The price of your saved car has been reduced by LKR 500,000",
      time: "5 hours ago",
      read: false,
      type: "price",
    },
    {
      id: 3,
      title: "Dealer Response",
      message: "A dealer has responded to your inquiry about the Nissan GTR",
      time: "1 day ago",
      read: true,
      type: "message",
    },
    {
      id: 4,
      title: "Subscription Reminder",
      message: "Your premium subscription will expire in 3 days",
      time: "2 days ago",
      read: true,
      type: "alert",
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
  }, [visible, drawerWidth, slideAnim, backdropOpacity]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Remove",
      "Delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setNotifications(notifications.filter((n) => n.id !== id));
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "price": return "pricetag";
      case "message": return "chatbubble-ellipses";
      case "alert": return "alert-circle";
      case "car": return "car-sport";
      default: return "notifications";
    }
  };

  const getIconBgColor = (type: string, read: boolean) => {
      if (read) return '#F3F4F6';
      switch (type) {
          case "price": return 'rgba(16, 185, 129, 0.1)';
          case "alert": return 'rgba(239, 68, 68, 0.1)';
          case "message": return 'rgba(35, 92, 248, 0.1)';
          default: return 'rgba(35, 92, 248, 0.1)';
      }
  }

  const getIconColor = (type: string, read: boolean) => {
    if (read) return COLORS.text.muted;
    switch (type) {
        case "price": return '#10B981';
        case "alert": return '#EF4444';
        case "message": return COLORS.primary;
        default: return COLORS.primary;
    }
}

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
            <LinearGradient
                colors={[COLORS.primary, '#1E40AF']}
                style={styles.header}
            >
                <View style={styles.headerTitleRow}>
                    <Text style={styles.title}>Notifications</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countText}>{unreadCount}</Text>
                    </View>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
                        <Text style={styles.markAllText}>Clear All Unread</Text>
                    </TouchableOpacity>
                )}
            </LinearGradient>

            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {notifications.length > 0 ? (
                <View style={styles.container}>
                  {notifications.map((n) => (
                    <TouchableOpacity
                      key={n.id}
                      style={[
                        styles.card,
                        !n.read && styles.unreadCard,
                      ]}
                      onPress={() => markAsRead(n.id)}
                      activeOpacity={0.8}
                    >
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: getIconBgColor(n.type, n.read) }
                        ]}
                      >
                        <Ionicons
                          name={getNotificationIcon(n.type) as any}
                          size={20}
                          color={getIconColor(n.type, n.read)}
                        />
                      </View>

                      <View style={styles.content}>
                        <View style={styles.cardHeader}>
                          <Text
                            style={[
                              styles.cardTitle,
                              !n.read && styles.unreadTitle,
                            ]}
                            numberOfLines={1}
                          >
                            {n.title}
                          </Text>
                          {!n.read && <View style={styles.unreadDot} />}
                        </View>
                        
                        <Text style={styles.message} numberOfLines={2}>
                          {n.message}
                        </Text>
                        
                        <View style={styles.cardFooter}>
                          <Text style={styles.time}>{n.time}</Text>
                          <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => deleteNotification(n.id)}
                          >
                            <Ionicons name="trash-outline" size={16} color={COLORS.text.muted} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.empty}>
                  <View style={styles.emptyCircle}>
                    <Ionicons name="notifications-off-outline" size={48} color={COLORS.border} />
                  </View>
                  <Text style={styles.emptyTitle}>All Clear!</Text>
                  <Text style={styles.emptyText}>You have no new notifications at the moment.</Text>
                </View>
              )}
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
    flexDirection: "row-reverse",
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
    shadowOffset: { width: -10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 32,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 36,
    alignItems: "center",
  },
  countText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.white,
  },
  markAllBtn: {
      alignSelf: 'flex-start',
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  container: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  unreadCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F4FF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text.primary,
    letterSpacing: -0.3,
  },
  unreadTitle: {
    color: COLORS.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontWeight: "500",
  },
  deleteBtn: {
    padding: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text.primary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: "center",
    lineHeight: 22,
  },
});
