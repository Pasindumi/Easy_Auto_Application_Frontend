import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import { Stack, useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Image as RNImage,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import { SAMPLE_COMPARISONS } from "../../constants/dummydata/compare";
import CarSelectionModal from "../../components/cars/compare/CarSelectionModal";
import ComparisonCard from "../../components/cars/compare/ComparisonCard";

const { width } = Dimensions.get('window');

export default function CompareScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [selectedCar1, setSelectedCar1] = useState<any>(null);
  const [selectedCar2, setSelectedCar2] = useState<any>(null);

  // Reset selection when screen gains focus
  useFocusEffect(
    useCallback(() => {
      setSelectedCar1(null);
      setSelectedCar2(null);
    }, [])
  );

  const openSelection = (slot: 1 | 2) => {
    setActiveSlot(slot);
    setModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSelect = (car: any) => {
    if (activeSlot === 1) {
      setSelectedCar1(car);
    } else {
      setSelectedCar2(car);
    }
  };

  const handleCompare = () => {
    if (!selectedCar1 || !selectedCar2) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Selection Required", "Please select two cars to compare.");
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/cars/compare-cars-detail",
      params: { id1: selectedCar1.id, id2: selectedCar2.id }
    });
  };

  const renderSelectionHeader = () => (
    <View style={styles.selectionHero}>
      <Text style={styles.heroTitle}>Compare & Decide</Text>
      <Text style={styles.heroSub}>Select two vehicles to see a side-by-side comparison of features, performance and value.</Text>
      
      <View style={styles.selectorRow}>
        {/* Slot 1 */}
        <TouchableOpacity 
          style={[styles.slot, selectedCar1 && styles.slotActive]} 
          onPress={() => openSelection(1)}
        >
          {selectedCar1 ? (
            <View style={styles.selectedContainer}>
               <Image 
                source={{ uri: selectedCar1.AdImage?.[0]?.image_url }} 
                style={styles.selectedImg} 
               />
               <Text style={styles.selectedName} numberOfLines={1}>{selectedCar1.title}</Text>
               <View style={styles.changeBadge}>
                 <Text style={styles.changeText}>Change</Text>
               </View>
            </View>
          ) : (
            <View style={styles.emptySlot}>
               <View style={styles.addIconCircle}>
                 <Ionicons name="add" size={24} color={COLORS.primary} />
               </View>
               <Text style={styles.addLabel}>Add Car 1</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.vsBadgeContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryDark]}
              style={styles.vsBadge}
            >
              <Text style={styles.vsBadgeText}>VS</Text>
            </LinearGradient>
        </View>

        {/* Slot 2 */}
        <TouchableOpacity 
          style={[styles.slot, selectedCar2 && styles.slotActive]} 
          onPress={() => openSelection(2)}
        >
          {selectedCar2 ? (
            <View style={styles.selectedContainer}>
               <Image 
                source={{ uri: selectedCar2.AdImage?.[0]?.image_url }} 
                style={styles.selectedImg} 
               />
               <Text style={styles.selectedName} numberOfLines={1}>{selectedCar2.title}</Text>
               <View style={styles.changeBadge}>
                 <Text style={styles.changeText}>Change</Text>
               </View>
            </View>
          ) : (
            <View style={styles.emptySlot}>
               <View style={styles.addIconCircle}>
                 <Ionicons name="add" size={24} color={COLORS.primary} />
               </View>
               <Text style={styles.addLabel}>Add Car 2</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.compareActionBtn, (!selectedCar1 || !selectedCar2) && styles.compareActionBtnDisabled]} 
        onPress={handleCompare}
        disabled={!selectedCar1 || !selectedCar2}
      >
        <LinearGradient
          colors={(!selectedCar1 || !selectedCar2) ? ['#CBD5E1', '#94A3B8'] : [COLORS.primary, COLORS.primaryDark]}
          style={styles.compareBtnGradient}
        >
          <Text style={styles.compareBtnText}>Analyze Comparison</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* ─── NEW PREMIUM BRANDED HEADER ─── */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        style={[styles.header, { paddingTop: insets.top + 8 }]}
      >
        <View style={styles.headerTopRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="white" />
          </TouchableOpacity>
          
          <View pointerEvents="none" style={styles.logoCentre}>
            <RNImage
              source={require("@/assets/logoHome.png")}
              resizeMode="contain"
              style={styles.logoImg}
            />
          </View>

          <View style={styles.headerRightSpacer} />
        </View>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitleText}>Car Comparison</Text>
        </View>
      </LinearGradient>

      <FlatList
        data={SAMPLE_COMPARISONS}
        keyExtractor={(item: any) => item.id}
        renderItem={useCallback(({ item }: any) => <ComparisonCard item={item} />, [])}
        ListHeaderComponent={
          <>
            {renderSelectionHeader()}
            <Text style={styles.sectionHeading}>Popular Comparisons</Text>
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <CarSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
        title={activeSlot === 1 ? "Choose First Vehicle" : "Choose Second Vehicle"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },
  listContent: {
    paddingBottom: 40
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    zIndex: 100,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    marginBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  logoCentre: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    width: 100,
    height: 24,
  },
  headerRightSpacer: {
    width: 40,
  },
  headerTitleArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  selectionHero: {
    backgroundColor: '#fff',
    padding: 24,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    position: 'relative',
  },
  slot: {
    width: (width - 80) / 2,
    height: 150,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  slotActive: {
    borderStyle: 'solid',
    borderColor: COLORS.primary + '30',
    backgroundColor: '#fff',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptySlot: {
    alignItems: 'center',
  },
  addIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  selectedContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: 12,
  },
  selectedImg: {
    width: '100%',
    height: 70,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  changeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  changeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  vsBadgeContainer: {
    zIndex: 10,
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
  },
  vsBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  vsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  compareActionBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  compareActionBtnDisabled: {
    shadowColor: '#94A3B8',
  },
  compareBtnGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
});
