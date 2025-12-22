import { MaterialIcons } from "@expo/vector-icons";
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

interface NotificationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationDrawer({
  visible,
  onClose,
}: NotificationDrawerProps) {
  const drawerWidth = width * 0.7;
  const slideAnim = React.useRef(new Animated.Value(drawerWidth)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;
  const [notifications, setNotifications] = useState([

    {
      id: 1,
      title: "New Car Listing",
      message: "A new car matching your preferences has been added",
      time: "2 hours ago",
      read: false,
      type: "info",
    },
    {
      id: 2,
      title: "Price Drop Alert",
      message: "The price of your saved car has been reduced by $5,000",
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
      type: "reminder",
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
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
      case "price":
        return "local-offer";
      case "message":
        return "message";
      case "reminder":
        return "schedule";
      default:
        return "notifications";
    }
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
                <Text style={styles.drawerTitle}>Notifications</Text>
                <View style={styles.headerCountBadge}>
                  <Text style={styles.headerCount}>{unreadCount}</Text>
                </View>
              </View>
              {unreadCount > 0 && (
                <TouchableOpacity
                  style={styles.markAllButton}
                  onPress={markAllAsRead}
                  activeOpacity={0.7}
                >
                  <Text style={styles.markAllText}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {notifications.length > 0 ? (
                <View style={styles.notificationsContainer}>
                  {notifications.map((notification) => (
                    <TouchableOpacity
                      key={notification.id}
                      style={[
                        styles.notificationCard,
                        !notification.read && styles.unreadCard,
                      ]}
                      onPress={() => markAsRead(notification.id)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.notificationIconContainer,
                          !notification.read && styles.unreadIconContainer,
                        ]}
                      >
                        <MaterialIcons
                          name={getNotificationIcon(notification.type) as any}
                          size={20}
                          color={notification.read ? "#9BA1A6" : "#235CF8"}
                        />
                      </View>
                      <View style={styles.notificationContent}>
                        <View style={styles.notificationHeader}>
                          <Text
                            style={[
                              styles.notificationTitle,
                              !notification.read && styles.unreadTitle,
                            ]}
                            numberOfLines={1}
                          >
                            {notification.title}
                          </Text>
                          {!notification.read && (
                            <View style={styles.unreadDot} />
                          )}
                        </View>
                        <Text
                          style={styles.notificationMessage}
                          numberOfLines={2}
                        >
                          {notification.message}
                        </Text>
                        <View style={styles.notificationFooter}>
                          <Text style={styles.notificationTime}>
                            {notification.time}
                          </Text>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => deleteNotification(notification.id)}
                            activeOpacity={0.7}
                          >
                            <MaterialIcons
                              name="delete-outline"
                              size={16}
                              color="#9BA1A6"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <MaterialIcons
                      name="notifications-none"
                      size={48}
                      color="#D1D5DB"
                    />
                  </View>
                  <Text style={styles.emptyText}>No notifications</Text>
                  <Text style={styles.emptySubtext}>
                    You&apos;re all caught up! Check back later for updates.
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
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
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
  markAllButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  unreadCard: {
    borderColor: "#235CF8",
    borderWidth: 1.5,
    backgroundColor: "#F0F4FF",
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  unreadIconContainer: {
    backgroundColor: "#EEF4FF",
  },
  notificationContent: {
    flex: 1,
    gap: 8,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  notificationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    letterSpacing: -0.2,
  },
  unreadTitle: {
    color: "#235CF8",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    fontWeight: "400",
  },
  notificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9BA1A6",
    fontWeight: "400",
  },
  deleteButton: {
    padding: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#235CF8",
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
