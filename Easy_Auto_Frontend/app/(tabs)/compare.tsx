// app/(tabs)/compare.tsx
import ProfileHeader from "@/components/ProfileHeader";
import { Stack } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ComparisonCard from "../../components/compare/ComparisonCard";
import SelectCarsHeader from "../../components/compare/SelectCarsHeader";
import { SAMPLE_COMPARISONS } from "../../constants/dummydata/compare";

export default function CompareScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Compare Cars" showProfileCard={false} />
      <SafeAreaView style={styles.safe}>
        <FlatList
          data={SAMPLE_COMPARISONS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ComparisonCard item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListHeaderComponent={SelectCarsHeader}
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  listContent: { paddingTop: 80, paddingBottom: 100 },
});
