import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

export default function NotificationsSetting() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const NotificationItem = ({ icon, title, desc, value, onValueChange, isLast }: any) => (
    <View style={[styles.itemContainer, !isLast && styles.itemBorder]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subText}>{desc}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#E2E8F0', true: COLORS.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E2E8F0"
        style={{ transform: [{ scale: 0.95 }] }} // slightly smaller native switch for elegance
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Notifications" showBack={true} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Notification Preferences</Text>
          <Text style={styles.subTitle}>Choose how you want to receive updates, promotions, and important alerts from EasyAuto.</Text>
        </View>

        <View style={styles.card}>
          <NotificationItem
            icon="notifications"
            title="Push Notifications"
            desc="New messages, offers and app updates"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <NotificationItem
            icon="mail"
            title="Email Alerts"
            desc="Weekly summaries and special promotions"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <NotificationItem
            icon="chatbubble-ellipses"
            title="SMS Alerts"
            desc="Price drops and critical security updates"
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            isLast={true}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Sleek off-white app background
  },
  content: {
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Subtle crisp border
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${COLORS.primary}10`, // 10% opacity primary color
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: '#1E293B',
    marginBottom: 4,
  },
  subText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 18,
  },
});
