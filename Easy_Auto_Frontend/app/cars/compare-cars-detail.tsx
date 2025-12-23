import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Components
import ComparisonSpecsTable from '../../components/cars/compare/ComparisonSpecsTable';
import ComparisonVehicleHeader from '../../components/cars/compare/ComparisonVehicleHeader';
import SimilarComparisonsSection from '../../components/cars/compare/SimilarComparisonsSection';

// Data
import { SIMILAR_COMPARISONS, VEHICLE_1, VEHICLE_2 } from "../../constants/dummydata/compare-detail";

export default function CompareCars() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Compare Cars" />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

          {/* Main Card */}
          <View style={styles.compareContainer}>
            <ComparisonVehicleHeader vehicle1={VEHICLE_1} vehicle2={VEHICLE_2} />
            <ComparisonSpecsTable vehicle1={VEHICLE_1} vehicle2={VEHICLE_2} />

            <TouchableOpacity style={styles.compareBtn}>
              <Ionicons name="git-compare" size={18} color="#fff" />
              <Text style={styles.compareText}>Compare</Text>
            </TouchableOpacity>
          </View>

          {/* Similar Comparisons */}
          <SimilarComparisonsSection comparisons={SIMILAR_COMPARISONS} />

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F2' },
  container: { paddingBottom: 50 },
  compareContainer: { margin: 16, backgroundColor: '#fff', borderRadius: 18, padding: 16 },
  compareBtn: { marginTop: 16, backgroundColor: '#235CF8', paddingVertical: 14, borderRadius: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  compareText: { color: '#fff', marginLeft: 8, fontWeight: '700' },
});
