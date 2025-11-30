import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Switch,
         Text,
         TouchableOpacity,
         View,
} from "react-native";

export default function Notifications() {
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>

        <View style={{ width: 24 }} />
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
              trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
              thumbColor="#fff"
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
              trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
              thumbColor="#fff"
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
              trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
              thumbColor="#fff"
            />
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
  },

  header: {
    height: 110,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  content: {
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
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
    color: "#111827",
  },

  subText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
});
