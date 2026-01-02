import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Header from "../../components/Header";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function Invoice() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    Alert.alert('Download', 'Invoice PDF is being prepared...');
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="document-text-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Invoice</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Invoice Details */}
        <View style={styles.card}>
          <Text style={styles.text}>Date: 2025-11-04 T14:22:00+05:30</Text>
          <Text style={styles.text}>
            Settle Pending ( expected payout : 2025-12-15 )
          </Text>
          <Text style={styles.text}>Invoice : #INV00256</Text>
        </View>

        {/* Seller Information */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Seller Information</Text>

          <Text style={styles.text}>Seller : TechGadget Hub</Text>
          <Text style={styles.text}>Contact : +94 771234567</Text>
          <Text style={styles.text}>Address : No,10, Galle Road, Colombo</Text>
          <Text style={styles.text}>Email : sachini@gmail.com</Text>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <Text style={styles.sectionTitle}>Price (LKR)</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.text}>Premium Listing - 30 days</Text>
            <Text style={styles.text}>LKR 2000.00</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.text}>Extra Visibility package</Text>
            <Text style={styles.text}>LKR 600.00</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.text}>Featured Product Boost</Text>
            <Text style={styles.text}>LKR 1500.00</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={[styles.text, { color: "#DC2626" }]}>
              Seasonal Discount
            </Text>
            <Text style={[styles.text, { color: "#DC2626" }]}>
              - LKR 250.00
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.textBold}>Subtotal</Text>
            <Text style={styles.textBold}>LKR 3850.00</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.text}>Estimated Tax (5%)</Text>
            <Text style={styles.text}>LKR 192.50</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.rowBetween}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>LKR 4042.50</Text>
          </View>
        </View>

        {/* Important note */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Important Note</Text>
          <Text style={styles.text}>
            Your Listing will be active for 30 days from payment confirmation.
            Refunds permitted within 24 hours of purchase (see policy).{"\n"}
            Contact : support@techgadgethub.com for disputes
          </Text>
        </View>

        {/* Download PDF */}
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPdf}>
          <Ionicons name="download-outline" size={18} color="#fff" />
          <Text style={styles.downloadText}>Download PDF</Text>
        </TouchableOpacity>

        {/* Go to Posted Ad */}
        <TouchableOpacity style={styles.goPostedBtn} onPress={() => router.push('/ads/posted-ad' as any)}>
          <Text style={styles.goPostedText}>Go to Posted Ad</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  textBold: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  downloadBtn: {
    marginTop: 16,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  downloadText: {
    color: '#fff',
    fontWeight: '700',
  },
  goPostedBtn: {
    marginTop: 10,
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  goPostedText: {
    color: '#fff',
    fontWeight: '700',
  },
});
