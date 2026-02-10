import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from '../../components/Header';
import { ENDPOINTS } from '../../constants/API';
import COLORS from '../../constants/Colors';

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
      const resp = await fetch(`${ENDPOINTS.PRICING}/public-packages`);
      const data = await resp.json();
      const found = data.find((p: any) => String(p.id) === String(id));
      setPkg(found || null);
    } catch (err) {
      console.error('Error loading package detail', err);
    } finally {
      // Logic handled in separate calls, but loading state might need coordination.
      // We'll let `loading` turn false after package is found, 
      // isCurrentPlan can update independently or we can group them.
      setLoading(false);
    }
  };

  const checkActiveSubscription = async () => {
    try {
      // 1. Get detailed active package context (includes limits/usage)
      const res: any = await api.get('/api/pricing/active-package');
      if (res.success && res.data) {
        const activePkgId = res.data.packageId;
        const isActive = String(activePkgId) === String(id);
        setIsCurrentPlan(isActive);
        if (isActive) {
          setActiveSubId(res.data.subscriptionId);
          setUsageLimits(res.data.limits || []);
          setGlobalLimit(res.data.global_limit || null);
        } else {
          setActiveSubId(null);
          setUsageLimits([]);
          setGlobalLimit(null);
        }
      } else {
        // Fallback or No Active Package
        setIsCurrentPlan(false);
        setActiveSubId(null);
        setUsageLimits([]);
        setGlobalLimit(null);
      }
    } catch (error) {
      console.log("Check sub failed:", error);
      setIsCurrentPlan(false);
      setUsageLimits([]);
    }
  };

  const getPrice = () => {
    const rule = pkg?.rules?.[0];
    return rule ? parseFloat(rule.price) : 0;
  };

  const getDuration = () => parseInt(pkg?.config?.DURATION_DAYS || '0');

  const handleUnsubscribe = async () => {
    Alert.alert(
      "Unsubscribe",
      "Are you sure you want to cancel your subscription? You may lose access to premium features immediately.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unsubscribe",
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              const res: any = await api.post('/api/payment/unsubscribe', { subscriptionId: activeSubId });
              if (res.success) {
                Alert.alert("Success", "Subscription cancelled successfully.");
                setIsCurrentPlan(false); // Update local state immediately
                router.replace('/packages/subscriptions');
              } else {
                throw new Error(res.message || "Failed");
              }
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to unsubscribe.");
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
      <View style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ marginTop: 12, color: '#666' }}>Loading package...</Text>
        </View>
      </View>
    );
  }

  if (!pkg) {
    return (
      <View style={styles.safe}>
        <Stack.Screen options={{ headerShown: false }} />
        <Header />
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={48} color="#999" />
          <Text style={{ marginTop: 12, color: '#999' }}>Package not found.</Text>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: COLORS.primary }]} onPress={() => router.back()}>
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const price = getPrice();
  const duration = getDuration();
  const perDay = duration > 0 ? `$${(price / duration).toFixed(2)}/day` : '';

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
            <Ionicons name="chevron-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>{pkg.name}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}15` : '#EAF2FF' }]}>
          <Text style={styles.cardTitle}>{pkg.name}</Text>
          <Text style={styles.cardSubtitle}>{pkg.code}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${price}</Text>
            <Text style={styles.perDay}>{perDay}</Text>
          </View>

          <Text style={styles.durationText}>{duration} days boost</Text>

          {isCurrentPlan ? (
            <View>
              <View
                style={[styles.buyButton, { backgroundColor: '#10B981', opacity: 1, marginBottom: 10 }]}
              >
                <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buyText}>Active Current Plan</Text>
              </View>

              <TouchableOpacity
                style={[styles.buyButton, { backgroundColor: '#EF4444', marginTop: 0 }]}
                onPress={handleUnsubscribe}
              >
                <Text style={styles.buyText}>Unsubscribe</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.buyButton, { backgroundColor: pkg.config?.COLOR_THEME || COLORS.primary }]}
              onPress={() => router.push({ pathname: '/payments/invoice', params: { plan: pkg.name, price: price, days: duration, packageId: pkg.id } })}
            >
              <Text style={styles.buyText}>Buy Now</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          {pkg.features && pkg.features.length > 0 ? (
            pkg.features.map((f: any, idx: number) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons name="checkmark-circle" size={18} color={pkg.config?.COLOR_THEME || COLORS.primary} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.featureTitle}>{f.feature_description || f.feature_key}</Text>
                  {f.feature_value ? <Text style={styles.featureMeta}>{f.feature_value}</Text> : null}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No features listed for this package.</Text>
          )}
        </View>

        {/* Ad Limits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="car-sport-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Ad Posting Limits</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Maximum ads you can post with this package</Text>

          {pkg.config?.FREE_ADS_LIMIT || pkg.config?.IS_UNLIMITED_ADS === 'true' ? (
            <View style={[styles.limitCard, { width: '100%', borderColor: COLORS.primary, backgroundColor: COLORS.primary + '05', padding: 20 }]}>
              <Text style={styles.limitValue}>
                {pkg.config?.IS_UNLIMITED_ADS === 'true' ? '∞' : pkg.config?.FREE_ADS_LIMIT}
              </Text>
              {isCurrentPlan && globalLimit && (
                <View style={{ alignItems: 'center', marginVertical: 8 }}>
                  <Text style={{ fontSize: 16, color: '#10B981', fontWeight: 'bold' }}>
                    Remaining Ads: {globalLimit.is_unlimited ? '∞' : globalLimit.total_remaining}
                  </Text>
                  {globalLimit.total_used > 0 && (
                    <Text style={{ fontSize: 12, color: '#666' }}>
                      {globalLimit.total_used} Slot{globalLimit.total_used > 1 ? 's' : ''} Used
                    </Text>
                  )}
                </View>
              )}
              <Text style={[styles.limitLabel, { fontSize: 16, color: COLORS.primary }]}>
                Global Ad Pool
              </Text>
              <Text style={{ fontSize: 11, color: '#64748B', textAlign: 'center', marginTop: 4 }}>
                Usable for ANY vehicle category
              </Text>
            </View>
          ) : pkg.ad_limits && pkg.ad_limits.length > 0 ? (
            <View style={styles.gridContainer}>
              {pkg.ad_limits.map((l: any) => {
                // Find matching usage limit if this is the active plan
                const usage = usageLimits.find(u =>
                  String(u.vehicle_type_id || '').toLowerCase() === String(l.vehicle_type_id || '').toLowerCase()
                );
                const remaining = usage ? usage.remaining_count : null;
                const usedDisplay = usage ? usage.used_count : 0;

                return (
                  <View key={l.id} style={styles.limitCard}>
                    <Text style={styles.limitValue}>
                      {l.is_unlimited ? '∞' : l.quantity}
                    </Text>
                    {isCurrentPlan && (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 11, color: '#10B981', fontWeight: 'bold' }}>
                          Remaining: {l.is_unlimited ? '∞' : (remaining ?? l.quantity)}
                        </Text>
                        {usedDisplay > 0 && (
                          <Text style={{ fontSize: 9, color: '#666' }}>
                            {usedDisplay} Slot{usedDisplay > 1 ? 's' : ''} Used
                          </Text>
                        )}
                      </View>
                    )}
                    <Text style={styles.limitLabel}>
                      {l.vehicle_types?.type_name || 'All Vehicles'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No ad limits defined.</Text>
            </View>
          )}
        </View>

        {/* Included Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Included Extras</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Additional benefits bundled with this package</Text>

          {pkg.included_items && pkg.included_items.length > 0 ? (
            pkg.included_items.map((it: any) => (
              <View key={it.id} style={styles.featureRowItem}>
                <View style={[styles.iconBox, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="gift-outline" size={18} color="#0284C7" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{it.price_items?.name || 'Bonus Item'}</Text>
                  {it.vehicle_types?.type_name && (
                    <Text style={styles.itemSubDetail}>For {it.vehicle_types.type_name}</Text>
                  )}
                </View>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {it.is_unlimited ? 'Unlimited' : `x${it.quantity}`}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No extra items included.</Text>
            </View>
          )}
        </View>

        {/* Admin description if present */}
        {pkg.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{pkg.description}</Text>
          </View>
        ) : null}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { padding: 16, paddingBottom: 40 },
  centered: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  backButton: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  backText: { color: '#fff', fontWeight: '700' },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  iconWrap: { padding: 6, borderRadius: 10, backgroundColor: '#fff', elevation: 2 },
  title: { fontSize: 18, fontWeight: '800' },
  card: { padding: 16, borderRadius: 16, marginBottom: 18 },
  cardTitle: { fontSize: 20, fontWeight: '900' },
  cardSubtitle: { marginTop: 4, color: '#666', fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, marginTop: 12 },
  price: { fontSize: 28, fontWeight: '900' },
  perDay: { fontSize: 12, color: '#666' },
  durationText: { marginTop: 8, color: '#555', fontSize: 13 },
  buyButton: { marginTop: 14, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  buyText: { color: '#fff', fontWeight: '800' },
  section: { marginTop: 8, padding: 14, backgroundColor: '#fff', borderRadius: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  featureTitle: { fontWeight: '700' },
  featureMeta: { color: '#666', fontSize: 12 },
  emptyText: { color: '#999' },
  rowItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  itemName: { fontWeight: '700' },
  itemMeta: { color: '#666' },
  descriptionText: { color: '#444', lineHeight: 22, fontSize: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sectionSubtitle: { color: '#666', fontSize: 13, marginBottom: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  limitCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center'
  },
  limitValue: { fontSize: 24, fontWeight: '800', color: COLORS.primary },
  limitLabel: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 4, textAlign: 'center' },
  emptyWrap: { padding: 8, alignItems: 'center' },
  featureRowItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  itemSubDetail: { fontSize: 12, color: '#94A3B8' },
  badge: { backgroundColor: '#F0F9FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#BAE6FD' },
  badgeText: { color: '#0369A1', fontSize: 12, fontWeight: '700' },
});
