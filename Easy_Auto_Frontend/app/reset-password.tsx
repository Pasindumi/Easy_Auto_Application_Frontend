// PROJECT_ROOT/app/reset-password.tsx

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
         Alert,
         KeyboardAvoidingView,
         Platform,
         ScrollView,
         StatusBar,
         StyleSheet,
         Text,
         TextInput,
         TouchableOpacity,
         View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import shared components
import Footer, { FOOTER_HEIGHT } from '../components/Footer';
import Header from '../components/Header';

export default function ResetPasswordScreen() {
  const router = useRouter(); // Router to navigate between screens
  const [contact, setContact] = useState(''); // State to store email or phone input

  // Handle continue button press
  const handleContinue = () => {
    if (!contact) {
      // Validate input
      Alert.alert('Validation', 'Please enter your email or phone.');
      return;
    }

    // Show alert and navigate back to login
    Alert.alert(
      'Reset link sent',
      `If ${contact} is registered, you will receive instructions to reset your password.`,
      [{ text: 'OK', onPress: () => router.push('/login') }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Status bar with blue background */}
      <StatusBar backgroundColor="#235CF8" barStyle="light-content" />

      {/* KeyboardAvoidingView shifts content above keyboard */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Shared header component with back button */}
        <Header />

        {/* Scrollable content */}
        <ScrollView contentContainerStyle={[styles.container, { paddingBottom: FOOTER_HEIGHT + 24 }]} keyboardShouldPersistTaps="handled">
          {/* Toggle buttons row: Login / Reset Password */}
          <View style={styles.toggleRow}>
            {/* Navigate to Login screen */}
            <TouchableOpacity
              style={[styles.toggleButton, styles.toggleInactive]}
              onPress={() => router.push('/login')}
            >
              <Text style={[styles.toggleText, styles.toggleTextBlue]}>Login</Text>
            </TouchableOpacity>

            {/* Active tab: Reset Password */}
            <TouchableOpacity style={[styles.toggleButton, styles.toggleActiveBlue]}>
              <Text style={[styles.toggleText, styles.toggleTextWhite]}>Reset Password</Text>
            </TouchableOpacity>
          </View>

          {/* Form card */}
          <View style={styles.form}>
            {/* Label */}
            <Text style={styles.label}>Email or Phone Number</Text>

            {/* Input field */}
            <View style={styles.inputRow}>
              {/* Icon left side */}
              <Text style={styles.inputIcon}>📧</Text>

              {/* TextInput */}
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

            {/* Link to login screen */}
            <View style={styles.loginRow}>
              <Text style={styles.smallText}>Remember your password?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fixed full-width footer */}
          <Footer fixed />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' }, // Main container

  container: {
    padding: 16,
    paddingTop: 32,
    paddingBottom: 40,
    backgroundColor: '#F5F5F5',
  },

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

  form: { marginTop: 18 },
  label: { fontSize: 12, color: '#333', marginBottom: 6 },

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

  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  loginLink: { color: '#235CF8', fontWeight: '700' },
  smallText: { color: '#444' },
});
