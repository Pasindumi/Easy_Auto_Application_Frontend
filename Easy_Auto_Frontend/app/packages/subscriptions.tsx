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
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import Loading from "../../components/ui/Loading";
import Header from "../../components/Header";
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/utils/api';
import { COLORS } from '@/constants/Colors';

// Modular Components
import CurrentPlanCard from '../../components/packages/subscription/CurrentPlanCard';
import PaymentHistorySection from '../../components/packages/subscription/PaymentHistorySection';
import SupportHelpCard from '../../components/packages/subscription/SupportHelpCard';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeSub, setActiveSub] = React.useState<any>(null);
  const [history, setHistory] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const sectionRes: any = await api.get('/api/payment/active-subscription');
      if (sectionRes.success && sectionRes.data) {
        setActiveSub(sectionRes.data);
      } else {
        setActiveSub(null);
      }

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
      router.push(`/packages/${pkgId}`);
    } else {
      router.push('/packages/packages');
    }
  };

  const handleUnsubscribe = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to cancel your current premium subscription? You will lose access to premium features at the end of your billing cycle.",
      [
        {
          text: "Keep Plan",
          style: "cancel"
        },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              const res: any = await api.post('/api/payment/unsubscribe', {
                subscriptionId: activeSub?.id
              });
              if (res.success) {
                Alert.alert("Success", "Your subscription has been cancelled successfully.");
                fetchSubscription();
              } else {
                Alert.alert("Error", "Failed to cancel subscription. Please try again.");
              }
            } catch (e) {
              console.error("Unsubscribe error", e);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          }
        }
      ]
    );
  };

  const handleDownload = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDownloadAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/support/contact-us');
  };

  const handleViewAll = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/payments/payment-history');
  };

  const handleRowPress = (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: '/payments/payment-detail',
      params: {
        id: item.id,
        date: item.date,
        amount: item.amount,
        plan: item.plan,
        status: item.status,
        adId: item.adId,
        rentalAdId: item.rentalAdId,
        packageId: item.packageId,
        rawAmount: item.rawAmount
      }
    });
  };

  const UsageItem = ({ label, used, limit, icon, color }: any) => (
    <View style={styles.usageItem}>
      <View style={styles.usageHeader}>
        <View style={styles.usageLabelRow}>
          <View style={[styles.usageIconBg, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <Text style={styles.usageLabel}>{label}</Text>
        </View>
        <Text style={styles.usageText}>{used} / {limit}</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            { backgroundColor: color, width: `${Math.min((used / limit) * 100, 100)}%` }
          ]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="My Subscription" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={styles.loaderContainer}>
              <Loading />
              <Text style={styles.loaderText}>Syncing subscription...</Text>
            </View>
          ) : activeSub ? (
            <>
              <CurrentPlanCard
                planName={activeSub.plan}
                expiryDate={`Next Renewal: ${new Date(activeSub.endDate).toLocaleDateString()}`}
                price={activeSub.amount}
                onManagePlan={handleManagePlan}
                onUnsubscribe={handleUnsubscribe}
              />

              {/* Plan Insights Card */}
              <View style={styles.insightsCard}>
                <Text style={styles.insightsTitle}>Plan Insights</Text>
                <View style={styles.usageGrid}>
                  <UsageItem
                    label="Ad Listings"
                    used={activeSub.usedAds || 2}
                    limit={activeSub.adLimit || 5}
                    icon="car-outline"
                    color="#3b82f6"
                  />
                  <UsageItem
                    label="Featured Slots"
                    used={activeSub.usedFeatured || 1}
                    limit={activeSub.featuredLimit || 2}
                    icon="star-outline"
                    color="#f59e0b"
                  />
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="gift-outline" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>Standard Free Plan</Text>
              <Text style={styles.emptySubtitle}>You're currently on the basic plan. Upgrade now to unlock premium selling tools and reach more buyers.</Text>
              <TouchableOpacity
                style={styles.upgradeBtn}
                onPress={() => router.push('/packages/packages')}
              >
                <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
                <Ionicons name="rocket" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <PaymentHistorySection
            payments={history}
            onDownload={handleDownload}
            onDownloadAll={handleDownloadAll}
            onViewAll={handleViewAll}
            onRowPress={handleRowPress}
          />
          <SupportHelpCard onContactSupport={handleContactSupport} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  loaderContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontWeight: '600',
  },
  insightsCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 20,
  },
  usageGrid: {
    gap: 20,
  },
  usageItem: {
    gap: 8,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  usageIconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  usageText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontWeight: '500',
  },
  upgradeBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
