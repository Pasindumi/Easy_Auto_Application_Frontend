import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from "../../components/Header";
import { headerSectionStylesWhite } from '../../styles/headerSectionStyles';

// Modular Components
import CurrentPlanCard from '../../components/packages/subscription/CurrentPlanCard';
import PaymentHistorySection from '../../components/packages/subscription/PaymentHistorySection';
import SupportHelpCard from '../../components/packages/subscription/SupportHelpCard';

const payments = [
  { id: '1', date: 'Oct 15, 2025' },
  { id: '2', date: 'Sep 15, 2025' },
  { id: '3', date: 'Aug 15, 2025' },
];

export default function SubscriptionsScreen() {
  const router = useRouter();

  const handleManagePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDownload = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDownloadAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStylesWhite.headerWrap}>
        <View style={headerSectionStylesWhite.header}>
          <Ionicons name="people-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStylesWhite.headerTitle}>My Subscribers</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CurrentPlanCard onManagePlan={handleManagePlan} />

        <PaymentHistorySection
          payments={payments}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
          onViewAll={handleViewAll}
        />

        <SupportHelpCard onContactSupport={handleContactSupport} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
});
