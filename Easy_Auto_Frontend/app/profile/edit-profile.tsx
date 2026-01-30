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
} from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/constants/API";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load user data on mount and when user changes
  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      console.log('[EditProfile] Loading user data from auth context');
      
      // Use user info from auth context
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      // Location and bio can be added later when user updates profile
      
    } catch (error) {
      console.error('[EditProfile] Error loading user data:', error);
      // Fallback: use user info from auth context
      if (user) {
        setName(user.name || '');
        setEmail(user.email || '');
        setPhone(user.phone || '');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in name and email fields');
      return;
    }

    try {
      setSaving(true);

      if (!accessToken || !user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const userData = {
        fullName: name,
        email,
        phone,
        location,
        bio,
      };

      console.log('[EditProfile] Saving user data:', userData);

      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to update profile');
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
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          {/* Profile Image */}
          <View style={styles.photoContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={require("@/assets/images/user.jpeg")}
                style={styles.profilePhoto}
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={18} color={COLORS.primary} />
              </View>
            </View>

            <TouchableOpacity>
              <Text style={styles.changePhotoText}>Change Profile Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor={COLORS.text.placeholder}
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor={COLORS.text.placeholder}
            />

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              placeholderTextColor={COLORS.text.placeholder}
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter your location"
              placeholderTextColor={COLORS.text.placeholder}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: "top" }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              multiline
              placeholderTextColor={COLORS.text.placeholder}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]} 
            activeOpacity={0.8}
            onPress={handleSaveChanges}
            disabled={saving}
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color={COLORS.white} style={{ marginRight: 8 }} />
                <Text style={styles.saveBtnText}>Saving...</Text>
              </>
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* BOTTOM NAVIGATION BAR */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push("/(tabs)")}>
          <Ionicons name="home-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/compare")}>
          <Ionicons name="albums-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Ionicons name="person-circle-outline" size={26} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },
  photoContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  imageWrapper: {
    position: 'relative',
  },
  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  changePhotoText: {
    color: COLORS.primary,
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  label: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.divider,
    color: COLORS.text.primary,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: COLORS.divider,
    paddingBottom: 10,
  },
});
