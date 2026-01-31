// app/address.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants/API';

export default function Address() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user address on mount and when user changes
  useEffect(() => {
    loadUserAddress();
  }, [user]);

  const loadUserAddress = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      console.log('[Address] Loading user address from auth context');
      
      // Use user info from auth context
      setFullName(user.name || '');
      setMobile(user.phone || '');
      
      // In the future, you can add localStorage/AsyncStorage to persist address data
      // For now, we use auth context data which is already loaded and verified
      
    } catch (error) {
      console.error('[Address] Error loading user address:', error);
      // Fallback: use user info from auth context
      if (user) {
        setFullName(user.name || '');
        setMobile(user.phone || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!fullName.trim() || !mobile.trim() || !addressLine1.trim() || !city.trim()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      if (!accessToken || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const addressData = {
        fullName,
        mobile,
        addressLine1,
        addressLine2,
        city,
        postalCode,
      };

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(addressData),
      });

      if (response.status === 401) {
        console.log('[Address] Access token expired, logging out...');
        await logout();
        throw new Error('SESSION_EXPIRED');
      }

      if (response.ok) {
        Alert.alert('Success', 'Address saved successfully!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'An error occurred while saving the address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* ---------- HEADER ---------- */}
          {/* ---------- HEADER ---------- */}
          <Header />
          <View style={headerSectionStyles.headerWrap}>
            <View style={headerSectionStyles.header}>
              <View style={headerSectionStyles.headerLeft}>
                <Ionicons name="location-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                <Text style={headerSectionStyles.headerTitle}>My Address</Text>
              </View>
            </View>
          </View>

          {/* ---------- LOADING STATE ---------- */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#235CF8" />
              <Text style={styles.loadingText}>Loading your address...</Text>
            </View>
          ) : (
            <>
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
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSaveAddress}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.saveText}>Saving...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="save-outline" size={18} color="#fff" />
                    <Text style={styles.saveText}>Save Address</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },

  container: {
    paddingBottom: 40,
  },

  /* LOADING */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 400,
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
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

  saveBtnDisabled: {
    opacity: 0.7,
  },

  saveText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});