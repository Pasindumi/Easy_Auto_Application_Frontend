// app/profile/address.tsx

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
  const { user, accessToken, updateUser } = useAuth();

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
  const [isEditing, setIsEditing] = useState(false);

  const [showDistrictModal, setShowDistrictModal] = useState(false);

  useEffect(() => {
    loadUserAddress();
  }, [user]);

  const loadUserAddress = async () => {
    try {
      setLoading(true);
      if (user) {
        setFullName(user.name || '');
        setMobile(user.phone || '');
        setAddressLine1(user.address_line1 || '');
        setAddressLine2(user.address_line2 || '');
        setCity(user.city || '');
        setDistrict(user.district || '');
        setPostalCode(user.postal_code || '');
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
      if (!accessToken || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: fullName,
          phone: mobile,
          addressLine1,
          addressLine2,
          city,
          district,
          postalCode
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          await updateUser(result.data);
        }
        Alert.alert('Success', 'Profile updated successfully!');
        setIsEditing(false);
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
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="My Address"
        showBack={true}
        rightElement={
          !isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          )
        }
      />

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Loading />
            </View>
          ) : (
            <>
              {renderSectionHeader("LOCATION")}
              <View style={styles.sectionCard}>
                <TouchableOpacity
                  style={[styles.selectorRow, !isEditing && styles.rowDisabled]}
                  onPress={() => isEditing && setShowDistrictModal(true)}
                  activeOpacity={0.7}
                  disabled={!isEditing}
                >
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="location-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>District</Text>
                    </View>
                    <Text style={[styles.rowValueText, !district && styles.placeholder]}>
                      {district || "Choose District"}
                    </Text>
                  </View>
                  {isEditing && <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />}
                </TouchableOpacity>

                <View style={styles.divider} />

                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="business-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>City / Area</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Enter city or area"
                        value={city}
                        onChangeText={setCity}
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !city && styles.placeholder]}>
                        {city || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {renderSectionHeader("CONTACT DETAILS")}
              <View style={styles.sectionCard}>
                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="person-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>Full Name</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Enter full name"
                        value={fullName}
                        onChangeText={setFullName}
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !fullName && styles.placeholder]}>
                        {fullName || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="call-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>Mobile Number</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Enter mobile number"
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType="phone-pad"
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !mobile && styles.placeholder]}>
                        {mobile || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {renderSectionHeader("ADDRESS DETAILS")}
              <View style={styles.sectionCard}>
                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="home-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>Address Line 1</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Street, House No"
                        value={addressLine1}
                        onChangeText={setAddressLine1}
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !addressLine1 && styles.placeholder]}>
                        {addressLine1 || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="map-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>Address Line 2 (Optional)</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Enter locality details"
                        value={addressLine2}
                        onChangeText={setAddressLine2}
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !addressLine2 && styles.placeholder]}>
                        {addressLine2 || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.divider} />
                <View style={[styles.inputRow, !isEditing && styles.rowDisabled]}>
                  <View style={styles.inputContent}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="mail-unread-outline" size={14} color={COLORS.primary} />
                      <Text style={styles.rowLabel}>Postal Code</Text>
                    </View>
                    {isEditing ? (
                      <TextInput
                        style={styles.rowInput}
                        placeholder="Enter postal code"
                        value={postalCode}
                        onChangeText={setPostalCode}
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                      />
                    ) : (
                      <Text style={[styles.rowValueText, !postalCode && styles.placeholder]}>
                        {postalCode || "Not set"}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {isEditing && (
                <View style={{ padding: 24 }}>
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
                        <Text style={styles.saveButtonText}>{saving ? "Updating..." : "Update Address"}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.cancelButtonText}>Discard Changes</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

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
            />
          </View>
        </View>
      </Modal>
    </View>
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
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginHorizontal: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  selectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  rowDisabled: {
    backgroundColor: '#F8FAFC',
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
  labelIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rowLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rowInput: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
    padding: 0,
    height: 22,
  },
  rowValueText: {
    fontSize: 15,
    color: '#334155',
    fontWeight: '700',
    height: 22,
    lineHeight: 22,
  },
  placeholder: {
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  saveButton: {
    borderRadius: 5,
    height: 56,
    overflow: 'hidden',
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
    marginTop: 16,
    height: 50,
    borderRadius: 5,
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
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
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
