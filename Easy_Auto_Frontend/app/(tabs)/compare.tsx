import Header from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/Colors";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SelectCarsHeader from "../../components/cars/buy/SelectCarsHeader";
import { SAMPLE_COMPARISONS } from "../../constants/dummydata/compare";
import CarSelectionModal from "../../components/cars/compare/CarSelectionModal";
import ComparisonCard from "../../components/cars/compare/ComparisonCard";

export default function CompareScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [selectedCar1, setSelectedCar1] = useState<any>(null);
  const [selectedCar2, setSelectedCar2] = useState<any>(null);

  const openSelection = (slot: 1 | 2) => {
    setActiveSlot(slot);
    setModalVisible(true);
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
      Alert.alert("Selection Required", "Please select two cars to compare.");
      return;
    }
    console.log('Navigating to compare with IDs:', selectedCar1.id, selectedCar2.id);
    router.push({
      pathname: "/cars/compare-cars-detail",
      params: { id1: selectedCar1.id, id2: selectedCar2.id }
    });
  };

  return (
    <View style={styles.container}>
      <Header showBack={true} title="Compare Cars" />

      <FlatList
        data={SAMPLE_COMPARISONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ComparisonCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <SelectCarsHeader
            selectedCar1={selectedCar1}
            selectedCar2={selectedCar2}
            onSelectCar1={() => openSelection(1)}
            onSelectCar2={() => openSelection(2)}
            onCompare={handleCompare}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <CarSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleSelect}
        title={activeSlot === 1 ? "Select First Car" : "Select Second Car"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  topicWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  topicTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  listContent: {
    paddingBottom: 100
  },
});
