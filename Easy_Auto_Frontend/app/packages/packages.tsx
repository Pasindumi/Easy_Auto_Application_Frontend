import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Components
import Header from '../../components/Header';
import BoostInfoCard from '../../components/packages/packages/BoostInfoCard';
import PackagePlanCard from '../../components/packages/packages/PackagePlanCard';

export default function PackagesScreen() {
  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Inline Sub-Header Section */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="gift-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Packages</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <BoostInfoCard />

        <PackagePlanCard
          title="Basic Boost"
          days={3}
          price={19.99}
          perDay="$6.66/day"
          backgroundColor="#EAF2FF"
          themeColor="#235CF8"
          features={[
            "Highlighted in search results",
            "2x more visibility",
            "Priority in local searches",
            "Basic analytics"
          ]}
        />

        <PackagePlanCard
          title="Gold Boost"
          days={7}
          price={39.99}
          perDay="$5.71/day"
          backgroundColor="#FFF7D1"
          themeColor="#C59A00"
          isPopular={true}
          features={[
            "Featured on homepage banner",
            "5x more visibility",
            "Priority in local searches",
            "Advanced analytics & reporting",
            "Targeted social media promotion"
          ]}
        />

        <PackagePlanCard
          title="Platinum Boost"
          days={14}
          price={69.99}
          perDay="$5.00/day"
          backgroundColor="#F3ECFF"
          themeColor="#6B46C1"
          features={[
            "Pinned to top for 14 days",
            "10x visibility with premium listing",
            "Exclusive premium badge",
            "Priority customer support 24/7",
            "Cross-platform promotion (Google Ads)"
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  subHeaderWrap: {
    backgroundColor: '#F9FAFB'
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subHeaderTitle: {
    color: '#235CF8',
    fontSize: 18,
    fontWeight: '600'
  },
  container: {
    padding: 16,
  },
});
