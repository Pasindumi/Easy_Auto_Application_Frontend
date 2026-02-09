import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import Header from "../../components/Header";
import { headerSectionStylesWhite } from '../../styles/headerSectionStyles';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/utils/api';

// Modular Components
import CurrentPlanCard from '../../components/packages/subscription/CurrentPlanCard';
import PaymentHistorySection from '../../components/packages/subscription/PaymentHistorySection';
import SupportHelpCard from '../../components/packages/subscription/SupportHelpCard';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { user } = useAuth(); // Assuming useAuth provides context
  const [activeSub, setActiveSub] = React.useState<any>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      // Fetch active subscription
      const sectionRes: any = await api.get('/api/payment/active-subscription');
      if (sectionRes.success && sectionRes.data) {
        setActiveSub(sectionRes.data);
      } else {
        setActiveSub(null);
      }

      // Fetch history
      const historyRes: any = await api.get('/api/payment/my-history');
      if (historyRes.success && historyRes.data) {
        setHistory(historyRes.data);
      }
    } catch (error) {
      console.error("Failed to fetch subscription", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManagePlan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (activeSub && (activeSub.package_id || activeSub.packageId || activeSub.id)) {
      const pkgId = activeSub.package_id || activeSub.packageId || activeSub.id;
      // If we have a package ID, navigate to it. 
      // If activeSub.packageId is distinct from activeSub.id (subscription ID), assume packageId works.
      router.push(`/packages/${pkgId}`);
    } else {
      router.push('/packages/packages');
    }
  };

  const handleUnsubscribe = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // Add confirmation if needed, but for now just execute
    try {
      const res: any = await api.post('/api/payment/unsubscribe', {
        subscriptionId: activeSub?.id
      });
      if (res.success) {
        alert("Unsubscribed successfully");
        fetchSubscription(); // Refresh to update UI
      } else {
        alert("Failed to unsubscribe");
      }
    } catch (e) {
      console.error("Unsubscribe error", e);
      alert("An error occurred while unsubscribing");
    }
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
    router.push('/payments/payment-history');
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      {/* Inline Sub-Header Section */}
      <View style={headerSectionStylesWhite.headerWrap}>
        <View style={headerSectionStylesWhite.header}>
          <Ionicons name="people-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
          <Text style={headerSectionStylesWhite.headerTitle}>My Subscription</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#235CF8" />
        ) : activeSub ? (
          <CurrentPlanCard
            planName={activeSub.plan}
            expiryDate={`Active Until ${new Date(activeSub.endDate).toLocaleDateString()}`}
            price={activeSub.amount}
            onManagePlan={handleManagePlan}
            onUnsubscribe={handleUnsubscribe}
          />
        ) : (
          <View style={{ padding: 20, backgroundColor: '#f9f9f9', borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666' }}>No active subscription found.</Text>
            <TouchableOpacity onPress={() => router.push('/packages/packages')} style={{ marginTop: 10, alignSelf: 'center' }}>
              <Text style={{ color: '#235CF8', fontWeight: 'bold' }}>Browse Packages</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment History Section - visible even if no active sub, to see past packages */}
        <PaymentHistorySection
          payments={history}
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
