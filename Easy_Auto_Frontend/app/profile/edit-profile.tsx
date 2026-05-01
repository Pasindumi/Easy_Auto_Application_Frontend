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
import Loading from "@/components/ui/Loading";
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
  const [isEditing, setIsEditing] = useState(false);

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

  const handleBirthdayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 4) {
      formatted = cleaned.slice(0, 4) + '-' + cleaned.slice(4);
    }
    if (cleaned.length > 6) {
      formatted = formatted.slice(0, 7) + '-' + cleaned.slice(6, 8);
    }
    setBirthday(formatted);
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
            await updateUser(response.data);
          }
          showToast({ message: 'Profile updated successfully!', type: 'success' });
          setIsEditing(false); // Go back to read-only
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
            await updateUser(response.data);
          }
          showToast({ message: 'Profile updated successfully!', type: 'success' });
          setIsEditing(false); // Go back to read-only
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
      <Header
        showBack={true}
        title="Edit Profile"
        rightElement={
          !isEditing && (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          )
        }
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Loading />
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
              <View style={styles.photoPlate}>
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
                      <Ionicons name="camera" size={14} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={styles.photoInfo}>
                   <Text style={styles.photoHint}>High-resolution PNG or JPG preferred</Text>
                </View>
              </View>
            </View>

            {/* Form Sections */}
            <View style={styles.formFlow}>

              <View style={styles.formSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionBlueBar} />
                  <Text style={styles.sectionSlug}>Identity & Bio</Text>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="person" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Display Name</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your full name"
                        placeholderTextColor="#94A3B8"
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{name || "Not set"}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelRow}>
                    <View style={styles.labelIconRow}>
                      <Ionicons name="information-circle" size={14} color={COLORS.primary} />
                      <Text style={styles.fieldLabel}>Tell us about yourself</Text>
                    </View>
                    <Text style={styles.charCount}>{bio.length}/150</Text>
                  </View>
                  <View style={[styles.fieldBox, styles.bioBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={[styles.fieldInput, styles.bioInput]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Write a short bio..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        maxLength={150}
                      />
                    ) : (
                      <Text style={[styles.fieldInput, styles.bioInput]}>{bio || "No bio yet"}</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionBlueBar} />
                  <Text style={styles.sectionSlug}>Contact Details</Text>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="mail" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Email Address</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#94A3B8"
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{email || "Not set"}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="call" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Phone Number</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#94A3B8"
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{phone || "Not set"}</Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={styles.sectionHeaderRow}>
                  <View style={styles.sectionBlueBar} />
                  <Text style={styles.sectionSlug}>Regional & Preferences</Text>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="location" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Home/Office Location</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Colombo, Sri Lanka"
                        placeholderTextColor="#94A3B8"
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{location || "Not set"}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="people" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Gender</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={gender}
                        onChangeText={setGender}
                        placeholder="e.g. Male"
                        placeholderTextColor="#94A3B8"
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{gender || "Not set"}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldItem}>
                  <View style={styles.labelIconRow}>
                    <Ionicons name="calendar" size={14} color={COLORS.primary} />
                    <Text style={styles.fieldLabel}>Birthday</Text>
                  </View>
                  <View style={[styles.fieldBox, !isEditing && styles.fieldBoxReadOnly, isEditing && styles.fieldBoxEditing]}>
                    {isEditing ? (
                      <TextInput
                        style={styles.fieldInput}
                        value={birthday}
                        onChangeText={handleBirthdayChange}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#94A3B8"
                        keyboardType="numeric"
                        maxLength={10}
                      />
                    ) : (
                      <Text style={styles.fieldInput}>{birthday || "Not set"}</Text>
                    )}
                  </View>
                </View>
              </View>

            </View>

            {/* Action Buttons */}
            {isEditing && (
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
                    setIsEditing(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
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
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  photoPlate: {
    borderRadius: 5,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  avatarMaster: {
    position: 'relative',
  },
  photoInfo: {
    marginLeft: 16,
    flex: 1,
  },
  masterImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  camPill: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  camGrad: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  photoHint: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  formFlow: {
    paddingHorizontal: 0,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionBlueBar: {
    width: 4,
    height: 18,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sectionSlug: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  fieldItem: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  labelIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
    marginLeft: 2,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    height: 44,
  },
  fieldBoxEditing: {
    borderColor: `${COLORS.primary}80`, // subtle blue border when editing
    backgroundColor: '#FFFFFF',
  },
  fieldBoxReadOnly: {
    backgroundColor: '#F8FAFC',
    borderColor: '#BFDBFE',
  },

  fieldInput: {
    flex: 1,
    paddingLeft: 0,
    fontSize: 14,
    color: '#334155',
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
    paddingTop: 8,
  },
  bioInput: {
    height: '100%',
    paddingTop: 4,
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
    borderRadius: 5,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveGradient: {
    height: 48,
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
    height: 44,
    borderRadius: 5,
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
