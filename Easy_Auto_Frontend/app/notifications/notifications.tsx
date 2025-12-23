import COLORS from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "../../components/Header";

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: "New Car Listing",
      message: "A new car matching your preferences has been added",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Price Drop Alert",
      message: "The price of your saved car has been reduced",
      time: "5 hours ago",
      read: false,
    },
    {
      id: 3,
      title: "Dealer Response",
      message: "A dealer has responded to your inquiry",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      title: "Subscription Reminder",
      message: "Your premium subscription will expire in 3 days",
      time: "2 days ago",
      read: true,
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Notifications</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.notificationIcon}>
                <MaterialIcons
                  name="notifications"
                  size={24}
                  color={notification.read ? COLORS.text.muted : COLORS.primary}
                />
              </View>
              <View style={styles.notificationContent}>
                <Text
                  style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadTitle,
                  ]}
                >
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="notifications-none"
              size={64}
              color={COLORS.text.muted}
            />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              You&apos;re all caught up! Check back later for updates.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  unreadCard: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: "#F8F9FF",
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  unreadTitle: {
    color: COLORS.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
