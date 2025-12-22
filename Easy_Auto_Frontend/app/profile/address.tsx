// app/address.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from "../../components/Header";

export default function Address() {
  const router = useRouter();

  const [fullName, setFullName] = useState('Dilmin Ekanayaka');
  const [mobile, setMobile] = useState('+94 77 123 4567');
  const [addressLine1, setAddressLine1] = useState('No 125, Main Road');
  const [addressLine2, setAddressLine2] = useState('Colombo 07');
  const [city, setCity] = useState('Colombo');
  const [postalCode, setPostalCode] = useState('00700');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* ---------- HEADER ---------- */}
          {/* ---------- HEADER ---------- */}
          <Header />
          <View style={localStyles.headerWrap}>
            <View style={localStyles.header}>
              <View style={localStyles.headerLeft}>
                <Ionicons name="location-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                <Text style={localStyles.headerTitle}>My Address</Text>
              </View>
            </View>
          </View>

          {/* ---------- ADDRESS CARD ---------- */}
          <View style={styles.cardContainer}>

            <Text style={styles.sectionTitle}>Personal Details</Text>

            {/* Full Name */}
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            {/* Mobile */}
            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>


            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
              Address Information
            </Text>

            {/* Address Line 1 */}
            <View style={styles.inputBox}>
              <Ionicons name="home-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="Address Line 1"
                value={addressLine1}
                onChangeText={setAddressLine1}
              />
            </View>

            {/* Address Line 2 */}
            <View style={styles.inputBox}>
              <Ionicons name="business-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="Address Line 2"
                value={addressLine2}
                onChangeText={setAddressLine2}
              />
            </View>

            {/* City */}
            <View style={styles.inputBox}>
              <Ionicons name="location-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
            </View>

            {/* Postal Code */}
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#235CF8" />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
              />
            </View>

          </View>


          {/* ---------- SAVE BUTTON ---------- */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={() => alert('Address Saved Successfully!')}
          >
            <Ionicons name="save-outline" size={18} color="#fff" />
            <Text style={styles.saveText}>Save Address</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* CARD */
  cardContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 14,
  },

  /* INPUT */
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },

  input: {
    marginLeft: 10,
    fontSize: 13,
    color: '#111',
    flex: 1,
  },

  /* BUTTON */
  saveBtn: {
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    flexDirection: 'row',
    marginHorizontal: 60,
    marginTop: 10,
    elevation: 4,
  },

  saveText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F2F2F2' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
