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
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loading from "../../components/ui/Loading";
import Header from "../../components/Header";
import { useAuth } from '../../contexts/AuthContext';
import { api } from '@/utils/api';
import { COLORS } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

import CurrentPlanCard from '../../components/packages/subscription/CurrentPlanCard';
import PaymentHistorySection from '../../components/packages/subscription/PaymentHistorySection';
import SupportHelpCard from '../../components/packages/subscription/SupportHelpCard';

const { width } = Dimensions.get('window');

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

  const UsageItem = ({ label, used, limit, icon, color }: any) => (
    <View style={styles.usageItem}>
      <View style={styles.usageHeader}>
        <View style={styles.usageLabelRow}>
          <Ionicons name={icon} size={20} color={color} />
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
      
      <View style={styles.safe}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {loading ? (
            <View style={styles.heroSection}>
              <Loading size="large" message="Syncing subscription..." />
            </View>
          ) : activeSub ? (
            <View style={styles.heroSection}>
              <View style={styles.heroCardContent}>
                 <CurrentPlanCard
                  planName={activeSub.plan}
                  expiryDate={`Next Renewal: ${new Date(activeSub.endDate).toLocaleDateString()}`}
                  price={activeSub.amount}
                  onManagePlan={handleManagePlan}
                  onUnsubscribe={handleUnsubscribe}
                />
              </View>

              <View style={styles.usageCard}>
                <Text style={styles.insightsTitle}>Plan Insights</Text>
                <View style={styles.usageGrid}>
                  <UsageItem
                    label="Ad Listings"
                    used={activeSub.usedAds || 2}
                    limit={activeSub.adLimit || 5}
                    icon="car-outline"
                    color={COLORS.primary}
                  />
                  <UsageItem
                    label="Featured Slots"
                    used={activeSub.usedFeatured || 1}
                    limit={activeSub.featuredLimit || 2}
                    icon="star-outline"
                    color={COLORS.primary}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.heroSection}>
              <View style={styles.emptyCard}>
                <View style={styles.giftIconCircle}>
                    <Ionicons name="gift-outline" size={40} color={COLORS.primary} />
                </View>
                <Text style={styles.emptyTitle}>Standard Free Plan</Text>
                <Text style={styles.emptySubtitle}>Upgrade to Pro to unlock premium selling tools and reach 3x more buyers.</Text>
                <TouchableOpacity
                  style={styles.upgradeBtn}
                  onPress={() => router.push('/packages/packages')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradients.primary as any}
                    style={styles.upgradeBtnGradient}
                  >
                    <Text style={styles.upgradeBtnText}>Explore Pro Plans</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.historyContainer}>
            <PaymentHistorySection
              payments={history}
              onDownload={handleDownload}
              onDownloadAll={handleDownloadAll}
              onViewAll={handleViewAll}
            />
            
            <SupportHelpCard onContactSupport={handleContactSupport} />
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 24,
  },
  heroCardContent: {
      marginBottom: 24,
  },
  usageCard: {
      backgroundColor: '#F8FAFC',
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: '#F1F5F9',
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
  },
  usageGrid: {
    gap: 20,
  },
  usageItem: {
    gap: 12,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  usageText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  giftIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#EFF6FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 20,
  },
  upgradeBtn: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  upgradeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  upgradeBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  historyContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
});
