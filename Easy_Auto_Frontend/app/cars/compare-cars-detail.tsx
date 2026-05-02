import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '@/components/Header';
import COLORS from '@/constants/Colors';
import Loading from '@/components/ui/Loading';
import ComparisonSpecsTable from '../../components/cars/compare/ComparisonSpecsTable';
import ComparisonVehicleHeader from '../../components/cars/compare/ComparisonVehicleHeader';
import SimilarComparisonsSection from '../../components/cars/compare/SimilarComparisonsSection';
import { ENDPOINTS } from '../../constants/API';
import { ComparisonVehicle, SimilarComparison } from '../../types/compare-detail.types';
import { saveComparisonToHistory, getComparisonHistory } from '../../utils/comparisonHistory';

const { width } = Dimensions.get('window');

export default function CompareCars() {
   const router = useRouter();
   const { id1, id2 } = useLocalSearchParams();
   const [vehicle1, setVehicle1] = useState<ComparisonVehicle | null>(null);
   const [vehicle2, setVehicle2] = useState<ComparisonVehicle | null>(null);
   const [history, setHistory] = useState<SimilarComparison[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadHistory();
   }, []);

   const loadHistory = async () => {
      const h = await getComparisonHistory();
      setHistory(h);
   };

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
            const mapToVehicle = (car: any): ComparisonVehicle => {
               const details = Array.isArray(car.CarDetails) ? car.CarDetails[0] : (car.CarDetails || {});
               const carAttributes: { [key: string]: string } = {};

               if (Array.isArray(car.attributes)) {
                  car.attributes.forEach((attr: any) => {
                     const name = attr.attribute?.attribute_name;
                     const value = attr.value;
                     if (name && value && value !== 'false' && value !== 'null' && value !== 'undefined') {
                        carAttributes[name] = value === 'true' ? 'Yes' : value;
                     }
                  });
               }

               return {
                  name: car.title,
                  image: car.AdImage?.[0]?.image_url || 'https://via.placeholder.com/150',
                  year: String(details.year || 'N/A'),
                  price: `LKR ${car.price?.toLocaleString()}`,
                  km: (details.mileage !== undefined && details.mileage !== null && details.mileage !== '')
                     ? `${Number(details.mileage).toLocaleString()} km`
                     : 'N/A',
                  transmission: details.transmission || 'N/A',
                  fuelType: details.fuel_type || 'N/A',
                  condition: details.condition || 'N/A',
                  fuelEconomy: 'N/A',
                  rating: car.users?.rating || 0,
                  location: car.location || 'Sri Lanka',
                  sellerVerified: car.users?.verification_status === 'VERIFIED',
                  brand: details.brand || 'N/A',
                  model: details.model || 'N/A',
                  attributes: carAttributes,
               };
            };

            const v1 = json.data.find((c: any) => String(c.id) === String(id1));
            const v2 = json.data.find((c: any) => String(c.id) === String(id2));

            if (v1 && v2) {
               const veh1 = mapToVehicle(v1);
               const veh2 = mapToVehicle(v2);
               setVehicle1(veh1);
               setVehicle2(veh2);

               // Save to history
               await saveComparisonToHistory({
                  id1: String(id1),
                  id2: String(id2),
                  leftName: veh1.name,
                  rightName: veh2.name,
                  leftImage: veh1.image,
                  rightImage: veh2.image
               });
               loadHistory(); // Refresh history
            }
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
               <SimilarComparisonsSection comparisons={history} />
            </View>

            <View style={{ height: 100 }} />
         </ScrollView>

      </View>
   );
}

// Global helper for price comparison inside verdict
const parsePrice = (priceStr: string) => parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;

const styles = StyleSheet.create({
   safe: {
      flex: 1,
      backgroundColor: '#fff'
   },
   container: {
      paddingBottom: 100
   },
   analysisHero: {
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingTop: 4,
      paddingBottom: 8,
      borderRadius: 0,
      borderBottomWidth: 1,
      borderColor: '#F1F5F9',
      width: '100%',
      marginTop: 0,
   },
   contentWrap: {
      marginTop: 8,
      width: '100%',
   },
   specsCard: {
      backgroundColor: '#fff',
      borderRadius: 0,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderColor: '#F1F5F9',
      overflow: 'hidden',
   },
   verdictSection: {
      marginTop: 20,
      paddingHorizontal: 20,
      width: '100%',
   },
   verdictCard: {
      flexDirection: 'row',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderRadius: 5,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      backgroundColor: '#fff',
   },
   verdictIcon: {
      width: 36,
      height: 36,
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
      width: 60,
      height: 60,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#F1F5F9',
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
      height: 44,
      borderRadius: 5,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#F1F5F9',
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
      paddingVertical: 10,
      backgroundColor: COLORS.primary,
      borderRadius: 5,
   },
   backBtnText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 14,
   },
});
