import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { api } from "@/utils/api";
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type AdStatus = 'ACTIVE' | 'DRAFT' | 'EXPIRED' | 'PENDING' | 'REJECTED';

type Ad = {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  status: string;
  description?: string;
};

export default function DeleteCar() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [verifyingPassword, setVerifyingPassword] = useState(false);

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ success: boolean; data: any }>(`/api/cars/${id}`);
      if (response.success) {
        const data = response.data;
        setAd({
          id: data.id,
          title: data.title,
          location: data.location,
          price: data.price ? `$${Number(data.price).toLocaleString()}` : "Contact for Price",
          image: data.AdImage?.[0]?.image_url || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=300&h=200",
          status: data.status,
          description: data.description,
        });
      }
    } catch (error) {
      console.error("Error fetching ad details:", error);
      Alert.alert("Error", "Could not load ad details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!password) {
      Alert.alert("Error", "Please enter your password to confirm deletion.");
      return;
    }

    setVerifyingPassword(true);
    try {
      // 1. Verify Password
      const verifyRes = await api.post<{ success: boolean; error?: string }>('/api/auth/verify-password', { password });

      if (!verifyRes.success) {
        Alert.alert("Verification Failed", verifyRes.error || "Incorrect password. Please try again.");
        setVerifyingPassword(false);
        return;
      }

      // 2. Perform Deletion
      setVerifyingPassword(false); // Done verifying
      setDeleting(true); // Now deleting
      setShowPasswordModal(false); // Close modal

      const deleteRes = await api.delete<{ success: boolean; message?: string }>(`/api/cars/${id}`);

      if (deleteRes.success) {
        Alert.alert("Deleted", "The ad has been permanently removed from the system.");
        router.replace('/ads/my-ads');
      } else {
        Alert.alert("Error", deleteRes.message || "Failed to delete the ad.");
      }
    } catch (error: any) {
      console.error("Delete sequence error:", error);
      const msg = error.response?.data?.error || error.response?.data?.message || "An unexpected error occurred.";
      Alert.alert("Error", msg);
    } finally {
      setVerifyingPassword(false);
      setDeleting(false);
      setPassword('');
    }
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!ad) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.text.muted }}>Ad not found</Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => router.back()}>
          <Text style={{ color: COLORS.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={styles.subHeaderWrap}>
        <View style={styles.subHeader}>
          <Ionicons name="trash-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={styles.subHeaderTitle}>Delete Car</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGE */}
        <Image source={{ uri: ad.image }} style={styles.carImage} />

        {/* INFO CARD */}
        <View style={styles.infoCard}>
          <Text style={styles.warnTitle}>This action cannot be undone</Text>

          <Text style={styles.label}>Title</Text>
          <Text style={styles.value}>{ad.title}</Text>

          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{ad.location}</Text>

          <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>{ad.price}</Text>

          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{ad.description ?? 'No description'}</Text>

          {/* Buttons */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={() => router.back()}
              disabled={deleting}
            >
              <Ionicons name="close-outline" size={18} color={COLORS.primary} />
              <Text style={[styles.btnText, { color: COLORS.primary }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={handleOpenPasswordModal}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="trash-outline" size={18} color={COLORS.white} />
                  <Text style={[styles.btnText, { color: COLORS.white }]}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Password Confirmation Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Security Step</Text>
            <Text style={styles.modalText}>
              To delete this ad, please enter your login password to confirm your identity.
            </Text>

            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              autoFocus={true}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                }}
                disabled={verifyingPassword}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={handleConfirmDelete}
                disabled={verifyingPassword}
              >
                {verifyingPassword ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.modalConfirmText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
  },
  carImage: {
    width: '92%',
    height: 180,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 16,
    backgroundColor: COLORS.divider,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  warnTitle: {
    color: COLORS.status.danger,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
    color: COLORS.text.primary,
  },
  value: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelBtn: {
    backgroundColor: COLORS.primaryLight,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: COLORS.status.danger,
    marginLeft: 10,
  },
  btnText: {
    marginLeft: 8,
    fontWeight: '700',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  passwordInput: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.divider,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  modalConfirmBtn: {
    backgroundColor: COLORS.status.danger,
  },
  modalCancelText: {
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  modalConfirmText: {
    color: COLORS.white,
    fontWeight: '700',
  }
});
