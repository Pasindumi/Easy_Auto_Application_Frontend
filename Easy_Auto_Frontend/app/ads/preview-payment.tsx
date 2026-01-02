import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PreviewPayment() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="receipt-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Preview Payment</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* 👉 CLOSE BUTTON (NOW BELOW HEADER) */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={16} color={COLORS.white} />
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
            <Ionicons name="person-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.infoText}>John Anderson</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.infoText}>
                John.anderson@gmail.com
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={20} color={COLORS.primary} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.infoText}>+94 77 123 4567</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
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
          <Ionicons name="download-outline" size={18} color={COLORS.white} />
          <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>
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
  closeBtn: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: COLORS.status.danger,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  closeText: {
    color: COLORS.white,
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  invoiceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.divider,
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
    color: COLORS.status.success,
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text.primary,
  },
  amount: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
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
    color: COLORS.text.primary,
    marginTop: 2,
  },
  planCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  planRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text.primary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
  },
  downloadBtn: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
