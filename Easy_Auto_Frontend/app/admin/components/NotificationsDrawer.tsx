import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Notification {
  id: string;
  title: string;
  time: string;
  unread: boolean;
  icon: string;
  color: string;
  category?: string;
}

interface NotificationsDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  topPosition: number;
  notifications: Notification[];
  onNotificationPress: (id: string) => void;
}

export default function NotificationsDrawer({
  isVisible,
  onClose,
  topPosition,
  notifications,
  onNotificationPress,
}: NotificationsDrawerProps) {
  if (!isVisible) return null;

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement mark all as read
  };

  return (
    <TouchableOpacity
      style={styles.overlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={[styles.container, { top: topPosition }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconWrapper}>
              <Ionicons name="notifications" size={22} color="#3B82F6" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.title}>Notifications</Text>
          </View>
          <View style={styles.headerRight}>
            {unreadCount > 0 && (
              <TouchableOpacity
                onPress={handleMarkAllRead}
                style={styles.markReadBtn}
              >
                <Text style={styles.markReadText}>Mark all read</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications List */}
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No notifications</Text>
              <Text style={styles.emptySubtitle}>You're all caught up!</Text>
            </View>
          ) : (
            notifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                style={[
                  styles.notificationItem,
                  notif.unread && styles.notificationItemUnread,
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onNotificationPress(notif.id);
                }}
                activeOpacity={0.7}
              >
                {/* Icon */}
                <View
                  style={[
                    styles.notificationIcon,
                    { backgroundColor: `${notif.color}15` },
                  ]}
                >
                  <Ionicons name={notif.icon as any} size={20} color={notif.color} />
                </View>

                {/* Content */}
                <View style={styles.notificationContent}>
                  <Text
                    style={[
                      styles.notificationTitle,
                      notif.unread && styles.notificationTitleUnread,
                    ]}
                    numberOfLines={2}
                  >
                    {notif.title}
                  </Text>
                  <Text style={styles.notificationTime}>{notif.time}</Text>
                </View>

                {/* Unread Indicator */}
                {notif.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Footer */}
        {notifications.length > 0 && (
          <View style={styles.footer}>
            <TouchableOpacity style={styles.viewAllBtn}>
              <Text style={styles.viewAllText}>View all notifications</Text>
              <Ionicons name="arrow-forward" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 2000,
    elevation: 2000,
  },
  container: {
    position: "absolute",
    right: 16,
    width: 360,
    maxHeight: 520,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    position: "relative",
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  markReadBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3B82F6",
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
  },
  list: {
    maxHeight: 400,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyState: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#94A3B8",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  notificationItemUnread: {
    backgroundColor: "#F0F9FF",
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTitleUnread: {
    fontWeight: "600",
    color: "#0F172A",
  },
  notificationTime: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginTop: 6,
    flexShrink: 0,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
});
