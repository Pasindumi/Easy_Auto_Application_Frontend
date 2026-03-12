// app/profile/edit-profile.tsx

import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "@/contexts/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { api } from "@/utils/api";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function EditProfileScreen() {
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
          Alert.alert('Success', 'Profile updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
        } else {
          Alert.alert('Error', response.message || 'Failed to update profile');
        }
      } else {
        const userData: any = { name: name.trim(), email: email.trim(), phone: phone.trim() };
        const response = await api.put<{ success: boolean; data: any; message?: string }>(
          `/api/users/${user.id}`,
          userData
        );

        if (response.success && response.data) {
          await updateUser({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
          });
          Alert.alert('Success', 'Profile updated successfully!', [{ text: 'OK', onPress: () => router.back() }]);
        } else {
          Alert.alert('Error', response.message || 'Failed to update profile');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while saving the profile');
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
      <Header showBack={true} title="Edit Profile Details" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          >
            {/* Avatar Section */}
            <View style={styles.avatarContainer}>
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
                    <Ionicons name="camera" size={18} color={COLORS.white} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <Text style={styles.avatarInstruction}>Tap camera to change photo</Text>
            </View>

            {/* Account Info Section */}
            {renderSectionHeader("ACCOUNT INFORMATION")}
            <View style={styles.sectionCard}>
              <View style={styles.inputRow}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                <View style={styles.inputContent}>
                  <Text style={styles.rowLabel}>Full Name</Text>
                  <TextInput
                    style={styles.rowInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter full name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                <View style={styles.inputContent}>
                  <Text style={styles.rowLabel}>Email Address</Text>
                  <TextInput
                    style={styles.rowInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            {/* Contact Info Section */}
            {renderSectionHeader("CONTACT DETAILS")}
            <View style={styles.sectionCard}>
              <View style={styles.inputRow}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.rowIcon} />
                <View style={styles.inputContent}>
                  <Text style={styles.rowLabel}>Mobile Number</Text>
                  <TextInput
                    style={styles.rowInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <Animated.View style={saveButtonStyle}>
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                activeOpacity={0.9}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleSaveChanges}
                disabled={saving}
              >
                <LinearGradient
                  colors={[COLORS.primary, '#1e3a8a']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonGradient}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Update Profile</Text>
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

          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 60,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#F8FAFC',
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    borderRadius: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  cameraGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  avatarInstruction: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
});
