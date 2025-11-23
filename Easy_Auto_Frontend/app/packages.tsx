import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native';

const HEADER_HEIGHT = 140;


export default function PackagesScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>

        {/* TOP HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace("/my-ads")}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PACKAGES</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* SMALL INFO CARD */}
          <View style={styles.infoCard}>
            <Ionicons name="stats-chart" size={18} color="#235CF8" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.infoTitle}>Boost Your Visibility</Text>
              <Text style={styles.infoText}>
                List more vehicles and sell faster with our premium boost packages
              </Text>
            </View>
          </View>

          {/* BASIC BOOST */}
          <View style={styles.cardBlue}>
            <Text style={styles.cardTitle}>Basic Boost</Text>
            <Text style={styles.daysText}>3 days boost</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>$19.99</Text>
              <Text style={styles.perDay}>$6.66/day</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#235CF8" />
              <Text style={styles.featureText}>Highlighted in search results</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#235CF8" />
              <Text style={styles.featureText}>2x more visibility</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#235CF8" />
              <Text style={styles.featureText}>Priority in local searches</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#235CF8" />
              <Text style={styles.featureText}>Basic analytics</Text>
            </View>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Select Plan</Text>
            </TouchableOpacity>
          </View>

          {/* GOLD BOOST */}
          <View style={styles.cardGold}>
            <View style={styles.goldHeader}>
              <Text style={styles.cardTitle}>Gold Boost</Text>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            </View>

            <Text style={styles.daysText}>7 days boost</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>$39.99</Text>
              <Text style={styles.perDay}>$5.71/day</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#C59A00" />
              <Text style={styles.featureText}>Featured on homepage banner</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#C59A00" />
              <Text style={styles.featureText}>5x more visibility</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#C59A00" />
              <Text style={styles.featureText}>Priority in local searches</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#C59A00" />
              <Text style={styles.featureText}>Advanced analytics & reporting</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#C59A00" />
              <Text style={styles.featureText}>Targeted social media promotion</Text>
            </View>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Select Plan</Text>
            </TouchableOpacity>
          </View>

          {/* PLATINUM BOOST */}
          <View style={styles.cardPurple}>
            <Text style={styles.cardTitle}>Platinum Boost</Text>
            <Text style={styles.daysText}>14 days boost</Text>

            <View style={styles.priceRow}>
              <Text style={styles.price}>$69.99</Text>
              <Text style={styles.perDay}>$5.00/day</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#6B46C1" />
              <Text style={styles.featureText}>Pinned to top for 14 days</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#6B46C1" />
              <Text style={styles.featureText}>10x visibility with premium listing</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#6B46C1" />
              <Text style={styles.featureText}>Exclusive premium badge</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#6B46C1" />
              <Text style={styles.featureText}>Priority customer support 24/7</Text>
            </View>

            <View style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={16} color="#6B46C1" />
              <Text style={styles.featureText}>
                Cross-platform promotion (Google Ads)
              </Text>
            </View>

            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectText}>Select Plan</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },

 header: {
  height: HEADER_HEIGHT,
  backgroundColor: '#235CF8',
  flexDirection: 'row',
  alignItems: 'flex-end',   // pushes content down
  justifyContent: 'space-between',
  paddingHorizontal: 16,
  paddingBottom: 20,        // space from bottom
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
},


  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  container: {
    padding: 16,
  },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#EEF4FF',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  infoText: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },

  cardBlue: {
    backgroundColor: '#EAF2FF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },

  cardGold: {
    backgroundColor: '#FFF7D1',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },

  cardPurple: {
    backgroundColor: '#F3ECFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 40,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  goldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  popularBadge: {
    backgroundColor: '#FFD84D',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  popularText: {
    fontSize: 10,
    fontWeight: '700',
  },

  daysText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 10,
    gap: 8,
  },

  price: {
    fontSize: 22,
    fontWeight: '800',
  },

  perDay: {
    fontSize: 12,
    color: '#666',
  },

  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  featureText: {
    marginLeft: 8,
    fontSize: 12,
  },

  selectButton: {
    backgroundColor: '#235CF8',
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  selectText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
