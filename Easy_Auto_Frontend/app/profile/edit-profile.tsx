import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { useToast } from "@/contexts/ToastContext";
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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Loading from "@/components/ui/Loading";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, accessToken, updateUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
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
      setBio(user.bio || '');
      setLocation(user.location || '');
      setGender(user.gender || '');
      setBirthday(user.birthday || '');
      
    } catch (error) {
      console.error('[EditProfile] Error loading user data:', error);
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
        setBio(user.bio || '');
        setLocation(user.location || '');
        setGender(user.gender || '');
        setBirthday(user.birthday || '');
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
      showToast({ message: 'Failed to select image', type: 'error' });
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      showToast({ message: 'Please fill in name and email fields', type: 'error' });
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      setSaving(true);

      if (!accessToken || !user) {
        showToast({ message: 'User not authenticated', type: 'error' });
        return;
      }

      if (profilePhoto) {
        const formData = new FormData();
        
        if (name.trim()) formData.append('name', name.trim());
        if (email.trim()) formData.append('email', email.trim());
        if (phone.trim()) formData.append('phone', phone.trim());
        if (bio.trim()) formData.append('bio', bio.trim());
        if (location.trim()) formData.append('location', location.trim());
        if (gender) formData.append('gender', gender);
        if (birthday) formData.append('birthday', birthday);

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
              bio: response.data.bio,
              location: response.data.location,
              gender: response.data.gender,
              birthday: response.data.birthday,
            });
          }
          showToast({ message: 'Profile updated successfully!', type: 'success' });
          router.back();
          setProfilePhoto(null);
        } else {
          showToast({ message: response.message || 'Failed to update profile', type: 'error' });
        }
      } else {
        const userData: any = {};
        if (name.trim()) userData.name = name.trim();
        if (email.trim()) userData.email = email.trim();
        if (phone.trim()) userData.phone = phone.trim();
        if (bio.trim()) userData.bio = bio.trim();
        if (location.trim()) userData.location = location.trim();
        if (gender) userData.gender = gender;
        if (birthday) userData.birthday = birthday;

        if (Object.keys(userData).length === 0) {
          showToast({ message: 'Please provide at least one field to update', type: 'error' });
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
              bio: response.data.bio,
              location: response.data.location,
              gender: response.data.gender,
              birthday: response.data.birthday,
            });
          }
          showToast({ message: 'Profile updated successfully!', type: 'success' });
          router.back();
        } else {
          showToast({ message: response.message || 'Failed to update profile', type: 'error' });
        }
      }
    } catch (error) {
      console.error('[EditProfile] Error saving profile:', error);
      showToast({ message: 'An error occurred while saving the profile', type: 'error' });
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
          <Loading />
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
            {/* Premium Photo Uploader */}
            <View style={styles.photoCanvas}>
              <LinearGradient
                colors={['#F1F5F9', '#F8FAFC']}
                style={styles.photoPlate}
              >
                <View style={styles.avatarMaster}>
                  <Image
                    source={
                      profilePhoto ? { uri: profilePhoto }
                      : user?.avatar ? { uri: user.avatar }
                      : require("@/assets/images/user.jpeg")
                    }
                    style={styles.masterImg}
                  />
                  <TouchableOpacity style={styles.camPill} onPress={pickImage}>
                    <LinearGradient colors={[COLORS.primary, '#1E40AF']} style={styles.camGrad}>
                      <Ionicons name="camera" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <Text style={styles.photoHint}>High-resolution PNG or JPG preferred</Text>
              </LinearGradient>
            </View>

            {/* Form Sections */}
            <View style={styles.formFlow}>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionSlug}>Identity & Bio</Text>
                
                <View style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>Display Name</Text>
                  <View style={styles.fieldBox}>
                    <Ionicons name="person-outline" size={18} color="#64748B" />
                    <TextInput
                      style={styles.fieldInput}
                      value={name}
                      onChangeText={setName}
                      placeholder="Your full name"
                    />
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelRow}>
                    <Text style={styles.fieldLabel}>Tell us about yourself</Text>
                    <Text style={styles.charCount}>{bio.length}/150</Text>
                  </View>
                  <View style={[styles.fieldBox, styles.bioBox]}>
                    <TextInput
                      style={[styles.fieldInput, styles.bioInput]}
                      value={bio}
                      onChangeText={setBio}
                      placeholder="Write a short bio..."
                      multiline
                      maxLength={150}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionSlug}>Contact Details</Text>

                <View style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>Email Address</Text>
                  <View style={styles.fieldBox}>
                    <Ionicons name="mail-outline" size={18} color="#64748B" />
                    <TextInput
                      style={styles.fieldInput}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <View style={styles.fieldBox}>
                    <Ionicons name="call-outline" size={18} color="#64748B" />
                    <TextInput
                      style={styles.fieldInput}
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionSlug}>Regional & Preferences</Text>

                <View style={styles.fieldItem}>
                  <Text style={styles.fieldLabel}>Home/Office Location</Text>
                  <View style={styles.fieldBox}>
                    <Ionicons name="location-outline" size={18} color="#64748B" />
                    <TextInput
                      style={styles.fieldInput}
                      value={location}
                      onChangeText={setLocation}
                      placeholder="Colombo, Sri Lanka"
                    />
                  </View>
                </View>

                <View style={styles.rowFieldContainer}>
                  <View style={[styles.fieldItem, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Gender</Text>
                    <View style={styles.fieldBox}>
                      <TextInput
                        style={styles.fieldInput}
                        value={gender}
                        onChangeText={setGender}
                        placeholder="e.g. Male"
                      />
                    </View>
                  </View>
                  <View style={[styles.fieldItem, { flex: 1 }]}>
                    <Text style={styles.fieldLabel}>Birthday</Text>
                    <View style={styles.fieldBox}>
                      <TextInput
                        style={styles.fieldInput}
                        value={birthday}
                        onChangeText={setBirthday}
                        placeholder="YYYY-MM-DD"
                      />
                    </View>
                  </View>
                </View>
              </View>

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
                    <Loading size="small" />
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
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  photoCanvas: {
    padding: 20,
    marginTop: 8,
  },
  photoPlate: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarMaster: {
    position: 'relative',
    marginBottom: 16,
  },
  masterImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  camPill: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  camGrad: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  photoHint: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  formFlow: {
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 28,
  },
  sectionSlug: {
    fontSize: 11,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 16,
    marginLeft: 4,
  },
  fieldItem: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 2,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    height: 54,
  },
  fieldInput: {
    flex: 1,
    paddingLeft: 12,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  bioBox: {
    height: 100,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  bioInput: {
    height: '100%',
    paddingTop: 0,
    textAlignVertical: 'top',
  },
  rowFieldContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  saveButton: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveGradient: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    marginTop: 12,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '700',
  },
});
