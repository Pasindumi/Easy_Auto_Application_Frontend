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
import { SafeAreaView } from "react-native-safe-area-context";

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
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>EDIT PROFILE</Text>
          </View>

          {/* Profile Image */}
          <View style={styles.photoContainer}>
            <Image
              source={require("@/assets/images/user.jpeg")}
              style={styles.profilePhoto}
            />

            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#235CF8" />
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
            />

            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 90, textAlignVertical: "top" }]}
              value={bio}
              onChangeText={setBio}
              multiline
            />

          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => router.push("./(tabs)/index")}>
            <Ionicons name="home-outline" size={26} color="#235CF8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./(tabs)/compare")}>
            <Ionicons name="albums-outline" size={26} color="#235CF8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("./(tabs)/profile")}>
            <Ionicons name="person-circle-outline" size={26} color="#235CF8" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    backgroundColor: "#235CF8",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 24,
  },

  photoContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  profilePhoto: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 10,
    right: 130,
    backgroundColor: "#fff",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  changePhotoText: {
    color: "#235CF8",
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
    color: "#111",
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#F2F2F2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 14,
  },

  saveBtn: {
    backgroundColor: "#235CF8",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    elevation: 10,
  },
});
