import ProfileHeader from "@/components/ProfileHeader";
import COLORS from "@/constants/Colors";
import { Stack } from "expo-router";
import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import ComparisonCard from "../../components/compare/ComparisonCard";
import SelectCarsHeader from "../../components/compare/SelectCarsHeader";
import { SAMPLE_COMPARISONS } from "../../constants/dummydata/compare";

export default function CompareScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Compare Cars" showProfileCard={false} />

      <FlatList
        data={SAMPLE_COMPARISONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ComparisonCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={SelectCarsHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  listContent: {
    paddingTop: 80,
    paddingBottom: 100
  },
});
