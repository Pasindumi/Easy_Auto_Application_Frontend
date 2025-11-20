import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Footer, { FOOTER_HEIGHT } from '../../components/Footer';
import Header from '../../components/Header';

export default function SignupScreen() {
  const router = useRouter();

  // --- Form state ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [location, setLocation] = useState('');
  const [agree, setAgree] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Header />

      {/* KeyboardAvoidingView ensures keyboard does not overlap inputs */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ScrollView allows scrolling if content is longer than screen */}
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: FOOTER_HEIGHT + 24 }]} keyboardShouldPersistTaps="handled">
          
          {/* Toggle Row: Signup / Login */}
          <View style={styles.toggleRow}>
            {/* Active Signup */}
            <TouchableOpacity style={[styles.toggleButton, styles.toggleActiveBlue]}>
              <Text style={[styles.toggleText, styles.toggleTextWhite]}>Signup</Text>
            </TouchableOpacity>

            {/* Navigate to Login */}
            <TouchableOpacity style={styles.toggleButton} onPress={() => router.push('/login')}>
              <Text style={[styles.toggleText, styles.toggleTextBlue]}>Login</Text>
            </TouchableOpacity>
          </View>

          {/* === Form Inputs === */}
          <View style={styles.form}>
            {/* Full Name */}
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <Ionicons name="person-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput placeholder="Dilmin Ekanayaka" value={fullName} onChangeText={setFullName} style={styles.input} />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Ionicons name="mail-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput placeholder="dilmin@example.com" keyboardType="email-address" value={email} onChangeText={setEmail} style={styles.input} />
            </View>

            {/* Phone */}
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputRow}>
              <Ionicons name="call-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput placeholder="+94 77 123 4567" keyboardType="phone-pad" value={phone} onChangeText={setPhone} style={styles.input} />
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput secureTextEntry placeholder="Enter your password" value={password} onChangeText={setPassword} style={styles.input} />
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputRow}>
              <Ionicons name="lock-closed-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput secureTextEntry placeholder="●●●●●●●●" value={confirm} onChangeText={setConfirm} style={styles.input} />
            </View>

            {/* Location */}
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputRow}>
              <Ionicons name="location-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
              <TextInput placeholder="Colombo" value={location} onChangeText={setLocation} style={styles.input} />
            </View>

            {/* Terms & Conditions */}
            <TouchableOpacity style={styles.termsRow} onPress={() => setAgree(!agree)}>
              <View style={[styles.checkbox, agree && styles.checkboxChecked]}>
                {agree && <Ionicons name="checkmark" size={14} color="#fff" />}
              </View>
              <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
            </TouchableOpacity>

            {/* Signup Button */}
            <TouchableOpacity onPress={() => alert('Front-end only: signup pressed')} activeOpacity={0.9}>
              <LinearGradient colors={['#4E9FE5', '#235CF8', '#4E9FE5']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity style={styles.socialButton} onPress={() => alert('Apple signin - front-end only')}>
              <Ionicons name="logo-apple" size={18} color="#000" style={{ marginRight: 10 }} />
              <Text style={styles.socialText}>Sign in With Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} onPress={() => alert('Google signin - front-end only')}>
              <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 10 }} />
              <Text style={styles.socialText}>Sign in With Google</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.smallText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fixed full-width footer (does not overlap because of paddingBottom) */}
          <Footer fixed />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // Scrollable container content
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 }, // paddingBottom ensures footer has space

  // Neutralize ScrollView padding so footer reaches screen edges
  footerWrap: { width: '100%', marginHorizontal: -16 },

  // Toggle buttons
  toggleRow: { flexDirection: 'row', alignSelf: 'center', marginTop: 12, borderRadius: 28, overflow: 'hidden' },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  toggleActiveBlue: { backgroundColor: '#235CF8' },
  toggleText: { fontWeight: '700', fontSize: 14 },
  toggleTextWhite: { color: '#fff' },
  toggleTextBlue: { color: '#235CF8' },

  // Form container
  form: { marginTop: 18 },
  label: { fontSize: 12, color: '#333', marginBottom: 6 },

  // Input fields
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 36 },

  // Terms
  termsRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: '#235CF8', borderColor: '#235CF8' },
  termsText: { color: '#444' },

  // Buttons
  gradientButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  signupButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // OR Divider
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  orLine: { flex: 1, height: 1, backgroundColor: '#E6E6E6' },
  orText: { marginHorizontal: 12, color: '#9AA0A6', fontWeight: '700' },

  // Social Buttons
  socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
  socialText: { fontWeight: '700' },

  // Login redirect
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  smallText: { color: '#666' },
  loginLink: { color: '#235CF8', fontWeight: '700' },
});
