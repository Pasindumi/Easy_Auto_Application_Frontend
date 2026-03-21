// app/profile/address.tsx

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Loading from "../../components/ui/Loading";
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";
import COLORS from "../../constants/Colors";
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../constants/API';

const DISTRICTS = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", "Galle", "Matara", "Hambantota",
  "Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", "Moneragala", "Ratnapura", "Kegalle"
];

export default function Address() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuth();

  const scale = useSharedValue(1);

  const saveButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.96);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showDistrictModal, setShowDistrictModal] = useState(false);

  // Load user address on mount
  useEffect(() => {
    loadUserAddress();
  }, [user]);

  const loadUserAddress = async () => {
    try {
      setLoading(true);
      if (user) {
        setFullName(user.name || '');
        setMobile(user.phone || '');
        // In a real app, you'd fetch more details from API
      }
    } catch (error) {
      console.error('[Address] Error loading user address:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!fullName.trim() || !mobile.trim() || !city.trim()) {
      Alert.alert('Required Info', 'Full Name, Mobile, and City are mandatory.');
      return;
    }

    try {
      setSaving(true);
      // Simulating API call as requested "interfaces only" change mostly
      if (!accessToken || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ fullName, mobile, addressLine1, addressLine2, city, district, postalCode }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        const err = await response.json();
        Alert.alert('Error', err.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Delivery Address" showBack={true} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <Loading style={{ marginTop: 70 }} />
          ) : (
            <>
              {/* ---------- LOCATION ---------- */}
              {renderSectionHeader("LOCATION")}
              <View style={styles.sectionCard}>
                <TouchableOpacity
                  style={styles.selectorRow}
                  onPress={() => setShowDistrictModal(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.rowIconGroupSide}>
                    <Ionicons name="location-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                    <View style={styles.inputContent}>
                      <Text style={styles.rowLabel}>District</Text>
                      <Text style={[styles.rowValueText, !district && styles.placeholder]}>
                        {district || "Choose District"}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={styles.inputRow}>
                  <Ionicons name="business-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>City / Area</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Enter city or area"
                      value={city}
                      onChangeText={setCity}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* ---------- CONTACT DETAILS ---------- */}
              {renderSectionHeader("CONTACT DETAILS")}
              <View style={styles.sectionCard}>
                <View style={styles.inputRow}>
                  <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>Full Name</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Enter full name"
                      value={fullName}
                      onChangeText={setFullName}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.inputRow}>
                  <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>Mobile Number</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChangeText={setMobile}
                      keyboardType="phone-pad"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              {/* ---------- ADDRESS DETAILS ---------- */}
              {renderSectionHeader("ADDRESS DETAILS")}
              <View style={styles.sectionCard}>
                <View style={styles.inputRow}>
                  <Ionicons name="home-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>Address Line 1</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Street, House No"
                      value={addressLine1}
                      onChangeText={setAddressLine1}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.inputRow}>
                  <Ionicons name="map-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>Address Line 2 (Optional)</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Enter locality details"
                      value={addressLine2}
                      onChangeText={setAddressLine2}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={styles.inputRow}>
                  <Ionicons name="mail-unread-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                  <View style={styles.inputContent}>
                    <Text style={styles.rowLabel}>Postal Code</Text>
                    <TextInput
                      style={styles.rowInput}
                      placeholder="Enter postal code"
                      value={postalCode}
                      onChangeText={setPostalCode}
                      keyboardType="numeric"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              </View>

              <Animated.View style={saveButtonStyle}>
                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                  onPress={handleSaveAddress}
                  disabled={saving}
                  activeOpacity={0.9}
                  onPressIn={onPressIn}
                  onPressOut={onPressOut}
                >
                  <LinearGradient
                    colors={[COLORS.primary, '#1e3a8a']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    {saving ? (
                      <Loading size="small" />
                    ) : (
                      <Text style={styles.saveButtonText}>Update Address</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                activeOpacity={0.6}
              >
                <Text style={styles.cancelButtonText}>Discard Changes</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* District Picker Modal */}
      <Modal visible={showDistrictModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select District</Text>
              <TouchableOpacity onPress={() => setShowDistrictModal(false)}>
                <Ionicons name="close" size={24} color="#111" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DISTRICTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setDistrict(item);
                    setShowDistrictModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, district === item && styles.selectedItem]}>{item}</Text>
                  {district === item && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.divider} />}
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  sectionCard: {
    backgroundColor: '#F8FAFC',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowIconGroupSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIcon: {
    marginRight: 16,
    width: 20,
    textAlign: 'center',
  },
  inputContent: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rowInput: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '700',
    padding: 0,
    height: 22,
  },
  rowValueText: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '700',
    height: 22,
    lineHeight: 22,
  },
  placeholder: {
    color: '#94A3B8',
  },
  divider: {
    height: 0,
  },
  saveButton: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    marginHorizontal: 24,
    marginTop: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cancelButton: {
    marginHorizontal: 24,
    marginTop: 16,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '75%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingHorizontal: 24,
  },
  modalItemText: {
    fontSize: 15,
    color: '#475569',
    fontWeight: '600',
  },
  selectedItem: {
    color: COLORS.primary,
    fontWeight: '800',
  },
});
