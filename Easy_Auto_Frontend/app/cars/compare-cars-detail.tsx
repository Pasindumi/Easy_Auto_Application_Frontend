import Header from '@/components/Header';
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
} from 'react-native';
import Loading from '@/components/ui/Loading';
import ComparisonSpecsTable from '../../components/cars/compare/ComparisonSpecsTable';
import ComparisonVehicleHeader from '../../components/cars/compare/ComparisonVehicleHeader';
import SimilarComparisonsSection from '../../components/cars/compare/SimilarComparisonsSection';
import { SIMILAR_COMPARISONS } from "../../constants/dummydata/compare-detail";
import { ENDPOINTS } from '../../constants/API';
import { ComparisonVehicle } from '../../types/compare-detail.types';

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
    try {
      console.log('Fetching comparison for IDs:', id1, id2);
      const url = `${ENDPOINTS.CARS}?ids=${id1},${id2}`;
      console.log('Fetch URL:', url);

      const response = await fetch(url);
      const json = await response.json();
      console.log('Comparison API Response:', JSON.stringify(json, null, 2));

      if (json.success && json.data.length > 0) { // Changed length check to > 0 to be more lenient for debugging
        // Map backend data to ComparisonVehicle format
        const mapToVehicle = (car: any): ComparisonVehicle => ({
          name: car.title,
          image: car.AdImage?.[0]?.image_url || 'https://via.placeholder.com/150',
          year: String(car.CarDetails?.year || 'N/A'),
          price: `LKR ${car.price?.toLocaleString()}`,
          km: `${car.CarDetails?.mileage?.toLocaleString()} km`,
          transmission: car.CarDetails?.transmission || 'N/A',
          fuelType: car.CarDetails?.fuel_type || 'N/A',
          condition: car.CarDetails?.condition || 'N/A',
          fuelEconomy: 'N/A', // Not in current backend data
          rating: 4, // Default rating as not in backend
        });

        // Ensure correct order based on IDs if needed, or just assign
        // Note: API might not return in requested order
        // Converting IDs to strings for comparison to avoid type mismatches
        const v1 = json.data.find((c: any) => String(c.id) === String(id1));
        const v2 = json.data.find((c: any) => String(c.id) === String(id2));

        console.log('Found Vehicle 1:', v1 ? 'Yes' : 'No');
        console.log('Found Vehicle 2:', v2 ? 'Yes' : 'No');

        if (v1) setVehicle1(mapToVehicle(v1));
        if (v2) setVehicle2(mapToVehicle(v2));
      } else {
        console.log('API success false or data empty');
      }
    } catch (error) {
      console.error("Error fetching comparison data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Loading />
      </View>
    );
  }

  if (!vehicle1 || !vehicle2) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Comparison data not available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Compare Cars" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.compareContainer}>
          <ComparisonVehicleHeader vehicle1={vehicle1} vehicle2={vehicle2} />
          <ComparisonSpecsTable vehicle1={vehicle1} vehicle2={vehicle2} />
        </View>

        {/* Similar Comparisons */}
        <SimilarComparisonsSection comparisons={SIMILAR_COMPARISONS} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  container: { paddingBottom: 50 },
  topicWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  topicTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  compareContainer: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  compareBtn: { marginTop: 16, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  compareText: { color: COLORS.white, marginLeft: 8, fontWeight: '700' },
});
