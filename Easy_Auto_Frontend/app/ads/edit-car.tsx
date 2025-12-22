// app/edit-car.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get car ID from URL params

  // Sample data (You can replace with backend data)
  const [title, setTitle] = useState("BMW 3 Series 2021");
  const [location, setLocation] = useState("Malabe, Sri Lanka");
  const [price, setPrice] = useState("$45,000");

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* ---------- HEADER ---------- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>EDIT CAR</Text>

            <View style={{ width: 22 }} />
          </View>

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
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },

  container: {
    paddingBottom: 50,
  },

  /* HEADER */
  header: {
    backgroundColor: "#235CF8",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  /* CAR IMAGE */
  carImage: {
    width: "92%",
    height: 180,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 16,
  },

  /* FORM CARD */
  formCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },

  inputLabel: {
    fontWeight: "700",
    fontSize: 13,
    marginTop: 10,
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 6,
    fontSize: 14,
  },

  saveBtn: {
    backgroundColor: "#235CF8",
    paddingVertical: 14,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
  },

  saveText: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
