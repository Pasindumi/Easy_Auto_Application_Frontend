import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [title, setTitle] = useState("BMW 3 Series 2021");
  const [location, setLocation] = useState("Malabe, Sri Lanka");
  const [price, setPrice] = useState("$45,000");

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="create-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Edit Car</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- CAR IMAGE ---------- */}
        <Image
          source={require('@/assets/images/car.jpg')}
          style={styles.carImage}
        />

        {/* ---------- FORM ---------- */}
        <View style={styles.formCard}>
          <Text style={styles.inputLabel}>Car Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter car title"
          />

          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
          />

          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder="Price"
          />

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => {
              alert("Car details updated!");
              router.back();
            }}
          >
            <Ionicons name="save-outline" size={18} color={COLORS.white} />
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  container: {
    paddingBottom: 50,
  },
  carImage: {
    width: "92%",
    height: 180,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 16,
  },
  formCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  inputLabel: {
    fontWeight: "700",
    fontSize: 13,
    marginTop: 10,
    color: COLORS.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 14,
    backgroundColor: '#FAFAFA',
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },
  saveText: {
    marginLeft: 6,
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
