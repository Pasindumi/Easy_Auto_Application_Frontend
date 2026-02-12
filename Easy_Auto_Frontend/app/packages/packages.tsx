import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Components
import Header from '../../components/Header';
import BoostInfoCard from '../../components/packages/packages/BoostInfoCard';
import PackagePlanCard from '../../components/packages/packages/PackagePlanCard';
import { ENDPOINTS } from '../../constants/API';
import COLORS from '../../constants/Colors';


export default function PackagesScreen() {
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
    // Find the default rule (all types) or the first one
    const rule = pkg.rules?.[0];
    if (!rule) return { price: 0, perDay: "" };

    const price = parseFloat(rule.price);
    const duration = parseInt(pkg.config?.DURATION_DAYS || "0");
    const perDay = duration > 0 ? `$${(price / duration).toFixed(2)}/day` : "";

    return { price, perDay };
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Packages" />
      <View style={styles.mainContainer}>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
          }
        >
          <BoostInfoCard />

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loaderText}>Loading packages...</Text>
            </View>
          ) : packages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#999" />
              <Text style={styles.emptyText}>No packages available at the moment.</Text>
            </View>
          ) : (
            packages.map((pkg) => {
              const { price, perDay } = getPackagePriceInfo(pkg);
              // Parse duration
              const duration = parseInt(pkg.config?.DURATION_DAYS || "0");

              // Collect features
              const features = pkg.features?.map((f: any) => f.feature_description || f.feature_key) || [];

              return (
                <PackagePlanCard
                  key={pkg.id}
                  id={pkg.id}
                  title={pkg.name}
                  days={duration}
                  price={price}
                  perDay={perDay}
                  backgroundColor={pkg.config?.COLOR_THEME ? `${pkg.config.COLOR_THEME}15` : "#EAF2FF"} // 15 is hex for ~8% opacity
                  themeColor={pkg.config?.COLOR_THEME || "#235CF8"}
                  features={features}
                  isPopular={pkg.code.includes('GOLD') || pkg.code.includes('POPULAR')}
                />
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  mainContainer: {
    flex: 1,
    marginTop: 10,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  loaderContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 12,
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
  },
});
