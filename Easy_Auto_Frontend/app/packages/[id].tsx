import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '../../components/ui/Loading';

import Header from '../../components/Header';
import { ENDPOINTS } from '../../constants/API';
import { COLORS } from '@/constants/Colors';

import { api } from '@/utils/api';

export default function PackageDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const [pkg, setPkg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentPlan, setIsCurrentPlan] = useState(false);
  const [activeSubId, setActiveSubId] = useState<string | null>(null);
  const [usageLimits, setUsageLimits] = useState<any[]>([]);
  const [globalLimit, setGlobalLimit] = useState<any | null>(null);

  useEffect(() => {
    if (id) {
      fetchPackage();
      checkActiveSubscription();
    }
  }, [id]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${ENDPOINTS.PRICING}/public-packages`);
      const data = await resp.json();
      const found = data.find((p: any) => String(p.id) === String(id));
      setPkg(found || null);
    } catch (err) {
      console.error('Error loading package detail', err);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveSubscription = async () => {
    try {
      const res: any = await api.get('/api/pricing/active-package');
      if (res.success && res.data) {
        const activePkgId = res.data.packageId;
        const isActive = String(activePkgId) === String(id);
        setIsCurrentPlan(isActive);
        if (isActive) {
          setActiveSubId(res.data.subscriptionId);
          setUsageLimits(res.data.limits || []);
          setGlobalLimit(res.data.global_limit || null);
        }
      } else {
        setIsCurrentPlan(false);
        setActiveSubId(null);
      }
    } catch (error) {
      console.log("Check sub failed:", error);
      setIsCurrentPlan(false);
    }
  };

  const handleUnsubscribe = async () => {
    Alert.alert(
      "Cancel Subscription",
      "Are you sure you want to stop your premium benefits? You'll lose access to advanced features at the end of this billing cycle.",
      [
        { text: "Go Back", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const res: any = await api.post('/api/payment/unsubscribe', { subscriptionId: activeSubId });
              if (res.success) {
                Alert.alert("Success", "Subscription cancelled successfully.");
                router.replace('/packages/subscriptions');
              } else {
                throw new Error(res.message || "Failed");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.outerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header title="Plan Detail" />
        <View style={styles.centered}>
          <Loading message="Fetching package details..." />
        </View>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.outerContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header title="Plan Detail" />
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={60} color="#cbd5e1" />
          <Text style={styles.errorText}>Package information unavailable.</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>View All Packages</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const price = pkg?.rules?.[0]?.price ? parseFloat(pkg.rules[0].price) : 0;
  const duration = parseInt(pkg?.config?.DURATION_DAYS || '0');
  const themeColor = pkg.config?.COLOR_THEME || COLORS.primary;

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Manage Plan" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
          {/* Top Banner Card */}
          <LinearGradient
            colors={[themeColor, themeColor + 'CC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroTop}>
                <View style={styles.statusBadge}>
                    <Ionicons name={isCurrentPlan ? "checkmark-circle" : "sparkles"} size={14} color="#fff" />
                    <Text style={styles.statusText}>{isCurrentPlan ? "Current Plan" : "Premium Upgrade"}</Text>
                </View>
                <View style={styles.heroIconBg}>
                    <Ionicons name="diamond-outline" size={24} color="#fff" />
                </View>
            </View>

            <Text style={styles.heroTitle}>{pkg.name}</Text>
            <Text style={styles.heroCode}>{pkg.code}</Text>

            <View style={styles.heroDivider} />

            <View style={styles.heroBottom}>
                <View>
                    <Text style={styles.priceLabel}>Package Value</Text>
                    <Text style={styles.priceValue}>Rs. {price.toLocaleString()}</Text>
                </View>
                <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{duration} Days Boost</Text>
                </View>
            </View>
          </LinearGradient>

          {/* Action Area */}
          <View style={styles.actionContainer}>
            {isCurrentPlan ? (
               <TouchableOpacity 
                    style={styles.cancelBtn} 
                    onPress={handleUnsubscribe}
                >
                    <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                    <Text style={styles.cancelBtnText}>Cancel Subscription</Text>
               </TouchableOpacity>
            ) : (
                <TouchableOpacity 
                    style={[styles.buyBtn, { backgroundColor: themeColor }]}
                    onPress={() => router.push({ 
                        pathname: '/payments/invoice', 
                        params: { 
                            packageId: pkg.id,
                            plan: pkg.name,
                            price: price,
                            days: duration
                        } 
                    })}
                >
                    <Text style={styles.buyBtnText}>Upgrade Now</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
            )}
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Key Benefits</Text>
                <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>{pkg.features?.length || 0}</Text>
                </View>
            </View>
            <View style={styles.featuresList}>
                {pkg.features?.map((f: any, idx: number) => (
                    <View key={idx} style={styles.featureItem}>
                        <View style={[styles.checkBg, { backgroundColor: themeColor + '15' }]}>
                            <Ionicons name="checkmark" size={14} color={themeColor} />
                        </View>
                        <View style={styles.featureContent}>
                            <Text style={styles.featureTitle}>{f.feature_description || f.feature_key}</Text>
                            {f.feature_value && <Text style={styles.featureValue}>{f.feature_value}</Text>}
                        </View>
                    </View>
                ))}
            </View>
          </View>

          {/* Ad Limits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publishing Limits</Text>
            <Text style={styles.sectionSubtitle}>Categorized posting limits for your account</Text>
            
            <View style={styles.limitsGrid}>
                {pkg.config?.IS_UNLIMITED_ADS === 'true' ? (
                    <View style={styles.unlimitedBox}>
                        <Ionicons name="infinite-outline" size={32} color={themeColor} />
                        <Text style={styles.unlimitedText}>Unlimited Ad Postings</Text>
                    </View>
                ) : pkg.ad_limits?.map((l: any) => {
                    const usage = usageLimits.find(u => String(u.vehicle_type_id) === String(l.vehicle_type_id));
                    return (
                        <View key={l.id} style={styles.limitCard}>
                            <View style={styles.limitTag}>
                                <Text style={styles.limitTagText}>{l.vehicle_types?.type_name || 'General'}</Text>
                            </View>
                            <Text style={styles.limitMainValue}>{l.is_unlimited ? '∞' : l.quantity}</Text>
                            {isCurrentPlan && usage && (
                                <Text style={styles.usageStat}>{usage.remaining_count} Remaining</Text>
                            )}
                        </View>
                    );
                })}
            </View>
          </View>

          {/* Extra Items Section */}
          {pkg.included_items?.length > 0 && (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Included Bundles</Text>
                <View style={styles.bundlesList}>
                    {pkg.included_items.map((it: any) => (
                        <View key={it.id} style={styles.bundleItem}>
                            <View style={styles.bundleIconBg}>
                                <Ionicons name="gift-outline" size={20} color={COLORS.primary} />
                            </View>
                            <View style={styles.bundleInfo}>
                                <Text style={styles.bundleName}>{it.price_items?.name || 'Bundle Item'}</Text>
                                <Text style={styles.bundleDetail}>For {it.vehicle_types?.type_name || 'All Categories'}</Text>
                            </View>
                            <View style={styles.bundleValue}>
                                <Text style={styles.bundleValueText}>{it.is_unlimited ? '∞' : `x${it.quantity}`}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
          )}

          {pkg.description && (
            <View style={styles.descriptionBox}>
                <Text style={styles.descTitle}>About this Package</Text>
                <Text style={styles.descText}>{pkg.description}</Text>
            </View>
          )}

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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.text.muted,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.text.muted,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  heroCard: {
    borderRadius: 32,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  heroIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  heroCode: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginTop: 2,
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 20,
  },
  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  durationBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  durationText: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '800',
  },
  actionContainer: {
    marginBottom: 32,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
  },
  buyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fee2e2',
    backgroundColor: '#fff',
    gap: 10,
  },
  cancelBtnText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  sectionBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.text.muted,
    marginBottom: 20,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 14,
  },
  checkBg: {
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  featureValue: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginTop: 2,
  },
  limitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  unlimitedBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
  },
  unlimitedText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 12,
  },
  limitCard: {
    width: '48%',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  limitTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 10,
  },
  limitTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  limitMainValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
  },
  usageStat: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '700',
    marginTop: 4,
  },
  bundlesList: {
    gap: 12,
  },
  bundleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
  },
  bundleIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  bundleDetail: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  bundleValue: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bundleValueText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
  },
  descriptionBox: {
    paddingHorizontal: 4,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    fontWeight: '500',
  }
});
