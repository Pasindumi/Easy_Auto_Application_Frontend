import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from "react-native";

export default function PreviewPayment() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Preview Payment</Text>

        {/* Empty space for layout balance */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* 👉 CLOSE BUTTON (NOW BELOW HEADER) */}
        <TouchableOpacity style={styles.closeBtn}>
          <Ionicons name="close" size={16} color="#fff" />
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>

        {/* INVOICE CARD */}
        <View style={styles.invoiceCard}>
          <View>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={styles.invoiceNumber}>INV-1024</Text>
          </View>

          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>Paid</Text>
          </View>
        </View>

        <Text style={styles.label}>Amount</Text>
        <Text style={styles.amount}>$29.99</Text>

        {/* BILLING INFORMATION */}
        <Text style={styles.sectionTitle}>BILLING INFORMATION</Text>
        <View style={styles.infoCard}>

          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.infoText}>John Anderson</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>
                John.anderson@gmail.com
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.infoText}>+94 77 123 4567</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#2563EB" />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.infoText}>
                123 Main Street, Malabe, Colombo
              </Text>
            </View>
          </View>
        </View>

        {/* PLAN DETAILS */}
        <Text style={styles.sectionTitle}>PLAN DETAILS</Text>
        <View style={styles.planCard}>

          <View style={styles.planRow}>
            <Text style={styles.label}>Plan</Text>
            <Text style={styles.infoText}>Premium Plan</Text>
          </View>

          <View style={styles.planRow}>
            <Text style={styles.label}>Billing Date</Text>
            <Text style={styles.infoText}>November 15, 2025</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.planRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>$29.99</Text>
          </View>
        </View>

        {/* DOWNLOAD BUTTON */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

/* ================== STYLES ================== */

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
    fontSize: 18,
    fontWeight: "700",
  },

  closeBtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },

  closeText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },

  content: {
    padding: 20,
  },

  invoiceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  paidBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  paidText: {
    color: "#16A34A",
    fontWeight: "700",
    fontSize: 12,
  },

  label: {
    fontSize: 12,
    color: "#6B7280",
  },

  invoiceNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  amount: {
    color: "#2563EB",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "700",
  },

  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  infoTextWrap: {
    flex: 1,
  },

  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginTop: 2,
  },

  planCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },

  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2563EB",
  },

  downloadBtn: {
    marginTop: 25,
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  downloadText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
