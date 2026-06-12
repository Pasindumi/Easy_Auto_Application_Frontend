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
<<<<<<< HEAD
  const router = useRouter();

=======
  const [pushEnabled, setPushEnabled] = useState(true);
>>>>>>> 9c8de36d9ebb0b832ade56713c55d32f04a892e4
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const NotificationItem = ({ icon, title, desc, value, onValueChange, isLast }: any) => (
    <View style={[styles.itemContainer, !isLast && styles.itemBorder]}>
      <View style={styles.iconWrapper}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
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
<<<<<<< HEAD
          {/* Email Alerts */}
          <View style={styles.row}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Email Alerts</Text>
              <Text style={styles.subText}>
                Weekly summaries and promotions
              </Text>
            </View>

            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: COLORS.divider, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.divider} />

          {/* SMS Alerts */}
          <View style={styles.row}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>SMS Alerts</Text>
              <Text style={styles.subText}>
                Price drops and bid updates
              </Text>
            </View>

            <Switch
              value={smsEnabled}
              onValueChange={setSmsEnabled}
              trackColor={{ false: COLORS.divider, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
=======
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
>>>>>>> 9c8de36d9ebb0b832ade56713c55d32f04a892e4
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
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
  headerSection: {
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#334155',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginHorizontal: 10,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: `${COLORS.primary}10`, // 10% opacity primary color
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: '#334155',
    marginBottom: 2,
  },
  subText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 18,
    opacity: 0.8,
  },
});
