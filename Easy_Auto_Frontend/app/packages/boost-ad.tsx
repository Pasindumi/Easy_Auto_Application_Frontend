import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image
} from 'react-native';
import Header from "../../components/Header";
import { api } from "@/utils/api";
import { COLORS } from "@/constants/Colors";
import * as Haptics from 'expo-haptics';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function BoostAdScreen() {
  useProtectedRoute();
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: any[] }>(`/api/cars/my-ads`);
      if (response.success) {
        // Only show active ads that aren't already featured (ideally)
        // For now, show all active ones
        const activeAds = response.data.filter((ad: any) => ad.status === 'ACTIVE' || ad.status === 'active');
        setAds(activeAds);
      }
    } catch (error) {
      console.error("Error fetching ads for boost:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyAds();
  };

  const handleBoost = (adId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: '/packages/packages',
      params: { adId }
    });
  };

  const renderAdItem = ({ item }: { item: any }) => (
    <View style={styles.adCard}>
      <Image 
        source={{ uri: item.AdImage?.[0]?.image_url || 'https://via.placeholder.com/150' }} 
        style={styles.adImage} 
      />
      <View style={styles.adInfo}>
        <Text style={styles.adTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.adPrice}>Rs. {Number(item.price).toLocaleString()}</Text>
        <View style={styles.adMeta}>
            <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.viewsText}>{item.views_count || 0} views</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.boostBtn}
        onPress={() => handleBoost(item.id)}
      >
        <Ionicons name="rocket" size={20} color="#fff" />
        <Text style={styles.boostBtnText}>Boost</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Boost an Ad" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.instructionCard}>
            <View style={styles.iconCircle}>
                <Ionicons name="flash-sharp" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.instructionTexts}>
                <Text style={styles.instructionTitle}>Select an Ad to Boost</Text>
                <Text style={styles.instructionSub}>Choose a listing to increase its visibility and reach more buyers.</Text>
            </View>
        </View>

        {loading && !refreshing ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loaderText}>Fetching your listings...</Text>
          </View>
        ) : ads.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
                <Ionicons name="megaphone-outline" size={48} color="#cbd5e1" />
            </View>
            <Text style={styles.emptyTitle}>No Active Ads Found</Text>
            <Text style={styles.emptyText}>You need an active advertisement to apply a boost. Post an ad first or check your drafts.</Text>
            <TouchableOpacity 
                style={styles.postAdBtn}
                onPress={() => router.push('/cars/select-type')}
            >
                <Text style={styles.postAdBtnText}>Create Advertisement</Text>
                <Ionicons name="add-circle" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={ads}
            renderItem={renderAdItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
            }
          />
        )}
      </SafeAreaView>
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
    backgroundColor: '#f8fafc',
  },
  instructionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  instructionTexts: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  instructionSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
    lineHeight: 18,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  adCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  adImage: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
  },
  adInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  adTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  adPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  adMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10b981',
    textTransform: 'uppercase',
  },
  viewsText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  boostBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  boostBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loaderText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: -40,
  },
  emptyIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    marginBottom: 24,
    fontWeight: '500',
  },
  postAdBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  postAdBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  }
});
