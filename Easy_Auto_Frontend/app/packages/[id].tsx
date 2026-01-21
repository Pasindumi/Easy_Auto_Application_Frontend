import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Header from '../../components/Header';
import { ENDPOINTS } from '../../constants/API';
import COLORS from '../../constants/Colors';

export default function PackageDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id as string;

  const [pkg, setPkg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchPackage();
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
      setLoading(false);
    }
  };

  const getPrice = () => {
    const rule = pkg?.rules?.[0];
    return rule ? parseFloat(rule.price) : 0;
  };

  const getDuration = () => parseInt(pkg?.config?.DURATION_DAYS || '0');

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

          <TouchableOpacity
            style={[styles.buyButton, { backgroundColor: pkg.config?.COLOR_THEME || COLORS.primary }]}
            onPress={() => router.push({ pathname: '/payments/invoice', params: { plan: pkg.name, price: price, days: duration, packageId: pkg.id } })}
          >
            <Text style={styles.buyText}>Buy Now</Text>
          </TouchableOpacity>
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

          {pkg.ad_limits && pkg.ad_limits.length > 0 ? (
            <View style={styles.gridContainer}>
              {pkg.ad_limits.map((l: any) => (
                <View key={l.id} style={styles.limitCard}>
                  <Text style={styles.limitValue}>
                    {l.is_unlimited ? '∞' : l.quantity}
                  </Text>
                  <Text style={styles.limitLabel}>
                    {l.vehicle_types?.type_name || 'All Vehicles'}
                  </Text>
                </View>
              ))}
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
