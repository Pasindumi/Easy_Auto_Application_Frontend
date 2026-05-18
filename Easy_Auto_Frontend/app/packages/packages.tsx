import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

// Components
import Header from '../../components/Header';
import BoostInfoCard from '../../components/packages/packages/BoostInfoCard';
import PackagePlanCard from '../../components/packages/packages/PackagePlanCard';
import Loading from '@/components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import { ENDPOINTS } from '../../constants/API';
import { COLORS } from '@/constants/Colors';

export default function PackagesScreen() {
  const { adId } = useLocalSearchParams();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.PRICING}/public-packages`);
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPackages();
  };

  const getPackagePriceInfo = (pkg: any) => {
    const rule = pkg.rules?.[0];
    if (!rule) return { price: 0, perDay: "" };

    const price = parseFloat(rule.price);
    const duration = parseInt(pkg.config?.DURATION_DAYS || "0");
    const perDay = duration > 0 ? `Rs. ${(price / duration).toFixed(2)} / day` : "";

    return { price, perDay };
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={adId ? "Boost Advertisement" : "Premium Packages"} showBack={true} />

      <SafeAreaView style={styles.safe}>
        <BrandedRefreshOverlay refreshing={refreshing} top={60} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          <BoostInfoCard />

          {loading && !refreshing ? (
            <View style={styles.loaderContainer}>
              <Loading />
              <Text style={styles.loaderText}>Curating best deals for you...</Text>
            </View>
          ) : packages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons name="gift-outline" size={40} color="#cbd5e1" />
              </View>
              <Text style={styles.emptyTitle}>No Packages Available</Text>
              <Text style={styles.emptyText}>We're currently updating our offers. Please check back later.</Text>
            </View>
          ) : (
            <View style={styles.packagesGrid}>
              {packages.map((pkg) => {
                const { price, perDay } = getPackagePriceInfo(pkg);
                const duration = parseInt(pkg.config?.DURATION_DAYS || "0");
                const features = pkg.features?.map((f: any) => f.feature_description || f.feature_key) || [];

                const pkgName = pkg.name?.toUpperCase() || '';
                const isNewGold = pkgName.includes('NEW GOLD');
                const isGold = pkgName === 'GOLD' || (pkgName.includes('GOLD') && !isNewGold);

                let cardBg = '#FFFFFF';
                let themeCol = COLORS.primary;

                if (isNewGold) {
                  cardBg = '#FFEDD5'; // Very pale warm orange/gold for New Gold
                  themeCol = '#C2410C'; // Deeper burnt orange accent
                } else if (isGold) {
                  cardBg = '#FFFBEB'; // Pale yellow/amber gold for standard Gold
                  themeCol = '#D97706'; // Rich amber gold accent
                }

                return (
                  <PackagePlanCard
                    key={pkg.id}
                    id={pkg.id}
                    title={pkg.name}
                    days={duration}
                    price={price}
                    perDay={perDay}
                    backgroundColor={cardBg}
                    themeColor={themeCol}
                    features={features}
                    adId={adId as string}
                    isPopular={pkg.code.includes('GOLD') || pkg.code.includes('POPULAR')}
                  />
                );
              })}
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
  loaderContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconBg: {
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  packagesGrid: {
    gap: 4,
  }
});
