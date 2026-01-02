import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function NotificationsSetting() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Notifications Setting</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Notifications Card */}
        <View style={styles.card}>
          {/* Push Notifications */}
          <View style={styles.row}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Push Notifications</Text>
              <Text style={styles.subText}>
                New messages, offers and updates
              </Text>
            </View>

            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: COLORS.divider, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>

          <View style={styles.divider} />

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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  textGroup: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  subText: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 10,
  },
});
