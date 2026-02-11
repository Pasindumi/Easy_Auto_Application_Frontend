import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, accessToken, updateUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      if (!user) {
        setLoading(false);
        return;
      }

      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      
    } catch (error) {
      console.error('[EditProfile] Error loading user data:', error);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('[EditProfile] Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in name and email fields');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setSaving(true);

      if (!accessToken || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      if (profilePhoto) {
        const formData = new FormData();
        
        if (name.trim()) formData.append('name', name.trim());
        if (email.trim()) formData.append('email', email.trim());
        if (phone.trim()) formData.append('phone', phone.trim());

        const filename = profilePhoto.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // @ts-ignore
        formData.append('avatar', {
          uri: profilePhoto,
          name: filename,
          type,
        });

        const response = await api.put<{ success: boolean; data: any; message?: string }>(
          `/api/users/${user.id}`,
          formData
        );

        if (response.success) {
          if (response.data) {
            await updateUser({
              name: response.data.name,
              email: response.data.email,
              phone: response.data.phone,
              avatar: response.data.avatar,
            });
          }
          Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
          setProfilePhoto(null);
        } else {
          Alert.alert('Error', response.message || 'Failed to update profile');
        }
      } else {
        const userData: any = {};
        if (name.trim()) userData.name = name.trim();
        if (email.trim()) userData.email = email.trim();
        if (phone.trim()) userData.phone = phone.trim();

        if (Object.keys(userData).length === 0) {
          Alert.alert('Error', 'Please provide at least one field to update');
          setSaving(false);
          return;
        }

        const response = await api.put<{ success: boolean; data: any; message?: string }>(
          `/api/users/${user.id}`,
          userData
        );

        if (response.success) {
          if (response.data) {
            await updateUser({
              name: response.data.name,
              email: response.data.email,
              phone: response.data.phone,
            });
          }
          Alert.alert('Success', 'Profile updated successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        } else {
          Alert.alert('Error', response.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      console.error('[EditProfile] Error saving profile:', error);
      Alert.alert('Error', 'An error occurred while saving the profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Edit Profile" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
          >
            {/* Profile Image Section */}
            <View style={styles.photoSection}>
              <LinearGradient
                colors={[COLORS.primary + '10', COLORS.primary + '05']}
                style={styles.photoBackground}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={
                      profilePhoto 
                        ? { uri: profilePhoto }
                        : user?.avatar
                        ? { uri: user.avatar }
                        : require("@/assets/images/user.jpeg")
                    }
                    style={styles.profilePhoto}
                  />
                  <TouchableOpacity 
                    style={styles.cameraButton} 
                    onPress={pickImage}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, '#1E40AF']}
                      style={styles.cameraGradient}
                    >
                      <Ionicons name="camera" size={20} color={COLORS.white} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
                  <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.text.muted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={COLORS.text.placeholder}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.text.muted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.text.placeholder}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color={COLORS.text.muted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor={COLORS.text.placeholder}
                  />
                </View>
              </View>

              <Text style={styles.helperText}>* Required fields</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity 
                style={[styles.saveButton, saving && styles.saveButtonDisabled]} 
                activeOpacity={0.8}
                onPress={handleSaveChanges}
                disabled={saving}
              >
                <LinearGradient
                  colors={saving ? ['#9CA3AF', '#6B7280'] : [COLORS.primary, '#1E40AF']}
                  style={styles.saveGradient}
                >
                  {saving ? (
                    <>
                      <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 8 }} />
                      <Text style={styles.saveButtonText}>Saving...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.back();
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.text.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoSection: {
    marginTop: 20,
    marginBottom: 32,
  },
  photoBackground: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 20,
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cameraGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  changePhotoText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  formSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: "700",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: COLORS.text.muted,
    fontStyle: 'italic',
    marginTop: -8,
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  saveButton: {
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.7,
    elevation: 2,
  },
  saveGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  cancelButtonText: {
    color: COLORS.text.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
});
