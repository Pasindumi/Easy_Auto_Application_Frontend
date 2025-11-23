// PROJECT_ROOT/app/reset-password.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import shared components
import Footer, { FOOTER_HEIGHT } from '../components/Footer';
import Header, { HEADER_HEIGHT } from '../components/Header';

export default function ResetPasswordScreen() {
  const router = useRouter(); // Router for navigation
  const [contact, setContact] = useState(''); // State for email/phone input

  // Handle Continue button press
  const handleContinue = () => {
    if (!contact) {
      Alert.alert('Validation', 'Please enter your email or phone.');
      return;
    }
    Alert.alert(
      'Reset link sent',
      `If ${contact} is registered, you will receive instructions to reset your password.`,
      [{ text: 'OK', onPress: () => router.push('/login') }]
    );
  };

  return (
    <>
      {/* Hide default header */}
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        {/* Top shared header */}
        <Header />

        {/* KeyboardAvoidingView moves form above keyboard */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* ScrollView to allow scrolling if keyboard overlaps */}
          <ScrollView
            contentContainerStyle={[
              styles.container,
              { paddingTop: HEADER_HEIGHT, paddingBottom: FOOTER_HEIGHT + 24 },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Toggle bar: Login / Reset Password */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, styles.toggleInactive]}
                onPress={() => router.push('/login')}
              >
                <Text style={[styles.toggleText, styles.toggleTextBlue]}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.toggleButton, styles.toggleActiveBlue]}>
                <Text style={[styles.toggleText, styles.toggleTextWhite]}>Reset Password</Text>
              </TouchableOpacity>
            </View>

            {/* Centered Form Container */}
            <View style={styles.centeredFormWrapper}>
              <View style={styles.form}>
                {/* Email / Phone label */}
                <Text style={styles.label}>Email or Phone Number</Text>

                {/* Input row */}
                <View style={styles.inputRow}>
                  <Text style={styles.inputIcon}>📧</Text>
                  <TextInput
                    placeholder="Enter your email or phone"
                    value={contact}
                    onChangeText={setContact}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {/* Continue button */}
                <TouchableOpacity activeOpacity={0.9} onPress={handleContinue}>
                  <LinearGradient
                    colors={['#4E9FE5', '#235CF8', '#4E9FE5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.loginButton}
                  >
                    <Text style={styles.loginButtonText}>Continue</Text>
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign in link */}
                <View style={styles.loginRow}>
                  <Text style={styles.smallText}>Remember your password?</Text>
                  <TouchableOpacity onPress={() => router.push('/login')}>
                    <Text style={styles.loginLink}> Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Fixed Footer at bottom */}
        <View style={styles.footerWrapper}>
          <Footer fixed />
        </View>
      </SafeAreaView>
    </>
  );
}

// ---------------------------
// Styles
// ---------------------------
const styles = StyleSheet.create({
  // Main container
  safe: { flex: 1, backgroundColor: '#fff' },

  // ScrollView container padding
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
  },

  // Toggle bar row at top
  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
    borderRadius: 28,
    overflow: 'hidden',
  },
  toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  toggleActiveBlue: { backgroundColor: '#235CF8' },
  toggleInactive: { backgroundColor: '#fff' },
  toggleText: { fontWeight: '700', fontSize: 14 },
  toggleTextWhite: { color: '#fff' },
  toggleTextBlue: { color: '#235CF8' },

  // Wrapper to center the form vertically and horizontally
  centeredFormWrapper: {
    flex: 1,
    justifyContent: 'center', // Vertical center
    alignItems: 'center',     // Horizontal center
    marginTop: 24,            // Optional top spacing below toggle
  },

  // Form card
  form: {
    width: '100%',
    maxWidth: 400, // Optional max width for tablet/desktop
  },

  // Label text
  label: { fontSize: 12, color: '#333', marginBottom: 6 },

  // Input row
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
  },
  inputIcon: { marginRight: 8, fontSize: 18 },
  input: { flex: 1, height: 36 },

  // Continue button
  loginButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Sign-in link row
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginLink: { color: '#235CF8', fontWeight: '700' },
  smallText: { color: '#444' },

  // Footer wrapper fixed at bottom
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
