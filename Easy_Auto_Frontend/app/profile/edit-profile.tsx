import Header from "@/components/Header";
import COLORS from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfileScreen() {
  const router = useRouter();

  const [name, setName] = useState("Dilmin Ekanayaka");
  const [email, setEmail] = useState("dilmin@example.com");
  const [phone, setPhone] = useState("+94 77 123 4567");
  const [location, setLocation] = useState("Badulla, Sri Lanka");
  const [bio, setBio] = useState(
    "Car enthusiast and car collector. Looking for classic and modern vehicles"
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Edit Profile" />

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
            placeholderTextColor={COLORS.text.placeholder}
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor={COLORS.text.placeholder}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholderTextColor={COLORS.text.placeholder}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholderTextColor={COLORS.text.placeholder}
          />

          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
            value={bio}
            onChangeText={setBio}
            multiline
            placeholderTextColor={COLORS.text.placeholder}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

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
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
