import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
   ScrollView,
   StyleSheet,
   Text,
   TouchableOpacity,
   View,
   Dimensions,
   Image,
} from 'react-native';
import { LinearGradient } from "expo-linear-gradient";
import Loading from '@/components/ui/Loading';
import ComparisonSpecsTable from '../../components/cars/compare/ComparisonSpecsTable';
import ComparisonVehicleHeader from '../../components/cars/compare/ComparisonVehicleHeader';
import SimilarComparisonsSection from '../../components/cars/compare/SimilarComparisonsSection';
import { SIMILAR_COMPARISONS } from "../../constants/dummydata/compare-detail";
import { ENDPOINTS } from '../../constants/API';
import { ComparisonVehicle } from '../../types/compare-detail.types';

const { width } = Dimensions.get('window');

export default function CompareCars() {
   const router = useRouter();
   const { id1, id2 } = useLocalSearchParams();
   const [vehicle1, setVehicle1] = useState<ComparisonVehicle | null>(null);
   const [vehicle2, setVehicle2] = useState<ComparisonVehicle | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (id1 && id2) {
         fetchComparisonData();
      }
   }, [id1, id2]);

   const fetchComparisonData = async () => {
      setLoading(true);
      try {
         const url = `${ENDPOINTS.CARS}?ids=${id1},${id2}`;
         const response = await fetch(url);
         const json = await response.json();

         if (json.success && json.data.length > 0) {
            const mapToVehicle = (car: any): ComparisonVehicle => ({
               name: car.title,
               image: car.AdImage?.[0]?.image_url || 'https://via.placeholder.com/150',
               year: String(car.CarDetails?.year || 'N/A'),
               price: `LKR ${car.price?.toLocaleString()}`,
               km: `${car.CarDetails?.mileage?.toLocaleString()} km`,
               transmission: car.CarDetails?.transmission || 'N/A',
               fuelType: car.CarDetails?.fuel_type || 'N/A',
               condition: car.CarDetails?.condition || 'N/A',
               fuelEconomy: 'N/A',
               rating: 4,
            });

            const v1 = json.data.find((c: any) => String(c.id) === String(id1));
            const v2 = json.data.find((c: any) => String(c.id) === String(id2));

            if (v1) setVehicle1(mapToVehicle(v1));
            if (v2) setVehicle2(mapToVehicle(v2));
         }
      } catch (error) {
         console.error("Error fetching comparison data:", error);
      } finally {
         setTimeout(() => setLoading(false), 1200); // Intentional delay for premium feel
      }
   };

   const renderLoading = () => (
      <View style={styles.loadingContainer}>
         <View style={styles.loaderGraphic}>
            <LinearGradient
               colors={[COLORS.primary, COLORS.primaryDark]}
               style={styles.loaderCircle}
            >
               <Ionicons name="swap-horizontal" size={32} color="#fff" />
            </LinearGradient>
         </View>
         <Text style={styles.loadingTitle}>Comparing Vehicles</Text>
         <Text style={styles.loadingSub}>Pulling live market data and specifications for a side-by-side analysis...</Text>

         <View style={styles.shimmerStack}>
            {[1, 2, 3].map(i => (
               <View key={i} style={styles.shimmerBar} />
            ))}
         </View>
      </View>
   );

   if (loading) {
      return (
         <View style={styles.safe}>
            <Stack.Screen options={{ headerShown: false }} />
            <Header showBack={true} />
            {renderLoading()}
         </View>
      );
   }

   if (!vehicle1 || !vehicle2) {
      return (
         <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="alert-circle-outline" size={64} color="#E2E8F0" />
            <Text style={styles.errorText}>No data matches these vehicles.</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
               <Text style={styles.backBtnText}>Select Different Cars</Text>
            </TouchableOpacity>
         </View>
      );
   }

   return (
      <View style={styles.safe}>
         <Stack.Screen options={{ headerShown: false }} />
         <Header showBack={true} title="Side-by-Side Analysis" />

         <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Dynamic Header */}
            <View style={styles.analysisHero}>
               <ComparisonVehicleHeader vehicle1={vehicle1} vehicle2={vehicle2} />
            </View>

            {/* Comparison Specs */}
            <View style={styles.contentWrap}>
               <View style={styles.specsCard}>
                  <ComparisonSpecsTable vehicle1={vehicle1} vehicle2={vehicle2} />
               </View>
            </View>

            {/* Market Verdict Badge */}
            <View style={styles.verdictSection}>
               <LinearGradient
                  colors={[COLORS.secondary, COLORS.primary]}
                  style={styles.verdictCard}
               >
                  <View style={styles.verdictIcon}>
                     <Ionicons name="ribbon" size={24} color="#F59E0B" />
                  </View>
                  <View style={styles.verdictInfo}>
                     <Text style={styles.verdictTitle}>Expert Market Verdict</Text>
                     <Text style={styles.verdictText}>
                        Based on current market trends in Sri Lanka, {parsePrice(vehicle1.price) < parsePrice(vehicle2.price) ? vehicle1.name : vehicle2.name} offers better value for money.
                     </Text>
                  </View>
               </LinearGradient>
            </View>

            {/* Discover More */}
            <View style={styles.similarWrap}>
               <SimilarComparisonsSection comparisons={SIMILAR_COMPARISONS} />
            </View>

            <View style={{ height: 100 }} />
         </ScrollView>

      </View>
   );
}

// Global helper for price comparison inside verdict
const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

import { Alert } from 'react-native';

const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: '#fff'
   },
   container: {
      paddingBottom: 40
   },
   analysisHero: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 24,
      borderBottomLeftRadius: 40,
      borderBottomRightRadius: 40,
   },
   contentWrap: {
      marginTop: -20,
      paddingHorizontal: 16,
   },
   specsCard: {
      backgroundColor: '#fff',
      borderRadius: 32,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 8,
      overflow: 'hidden',
   },
   verdictSection: {
      marginTop: 32,
      paddingHorizontal: 16,
   },
   verdictCard: {
      flexDirection: 'row',
      padding: 24,
      borderRadius: 24,
      alignItems: 'center',
      gap: 16,
   },
   verdictIcon: {
      width: 50,
      height: 50,
      borderRadius: 16,
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      alignItems: 'center',
      justifyContent: 'center',
   },
   verdictInfo: {
      flex: 1,
   },
   verdictTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: '#fff',
      marginBottom: 4,
   },
   verdictText: {
      fontSize: 12,
      color: '#94A3B8',
      lineHeight: 18,
   },
   similarWrap: {
      marginTop: 40,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
   },
   loaderGraphic: {
      marginBottom: 32,
   },
   loaderCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 10,
   },
   loadingTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: '#1E293B',
      marginBottom: 8,
      textAlign: 'center',
   },
   loadingSub: {
      fontSize: 14,
      color: '#64748B',
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 40,
   },
   shimmerStack: {
      width: '100%',
      gap: 12,
   },
   shimmerBar: {
      width: '100%',
      height: 48,
      borderRadius: 16,
      backgroundColor: '#F8FAFC',
   },
   errorText: {
      marginTop: 16,
      fontSize: 14,
      color: '#94A3B8',
      fontWeight: '600',
   },
   backBtn: {
      marginTop: 24,
      paddingHorizontal: 24,
      paddingVertical: 14,
      backgroundColor: COLORS.primary,
      borderRadius: 16,
   },
   backBtnText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 14,
   },
});
