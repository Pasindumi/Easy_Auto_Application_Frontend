import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ComparisonSpecsTable from '../../components/cars/compare/ComparisonSpecsTable';
import ComparisonVehicleHeader from '../../components/cars/compare/ComparisonVehicleHeader';
import SimilarComparisonsSection from '../../components/cars/compare/SimilarComparisonsSection';
import { SIMILAR_COMPARISONS, VEHICLE_1, VEHICLE_2 } from "../../constants/dummydata/compare-detail";

export default function CompareCars() {
  const router = useRouter();

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="git-compare-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Compare Cars</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={styles.compareContainer}>
          <ComparisonVehicleHeader vehicle1={VEHICLE_1} vehicle2={VEHICLE_2} />
          <ComparisonSpecsTable vehicle1={VEHICLE_1} vehicle2={VEHICLE_2} />

          <TouchableOpacity style={styles.compareBtn}>
            <Ionicons name="git-compare" size={18} color={COLORS.white} />
            <Text style={styles.compareText}>Compare</Text>
          </TouchableOpacity>
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
    backgroundColor: COLORS.background
  },
  subHeaderWrap: {
    backgroundColor: COLORS.background
  },
  subHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  subHeaderTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600'
  },
  container: { paddingBottom: 50 },
  compareContainer: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  compareBtn: { marginTop: 16, backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  compareText: { color: COLORS.white, marginLeft: 8, fontWeight: '700' },
});
