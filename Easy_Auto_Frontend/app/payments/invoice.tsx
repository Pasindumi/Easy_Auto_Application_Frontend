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
import { SafeAreaView } from "react-native-safe-area-context";

export default function Invoice() {
  const router = useRouter();

  const handleDownloadPdf = () => {
    Alert.alert('Download', 'Invoice PDF is being prepared...');
    // TODO: Integrate expo-print and expo-sharing to generate and save/share a real PDF
    // Example:
    // const { uri } = await Print.printToFileAsync({ html: '<html>...</html>' });
    // await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>INVOICE</Text>

        <View style={{ width: 24 }} />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
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
    paddingBottom: 40,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  previewText: {
    color: "#2563EB",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
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

  promoContainer: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  applyBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  applyText: {
    color: "#fff",
    fontWeight: "700",
  },

  methodBtn: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  payBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 10,
  },

  addBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },

  payText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
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
