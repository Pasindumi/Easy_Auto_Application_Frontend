  import { Ionicons } from '@expo/vector-icons';
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


  import Footer, { FOOTER_HEIGHT } from '../components/Footer';
import Header, { HEADER_HEIGHT } from '../components/Header';


  export default function LoginScreen() {
    const router = useRouter();

    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);

    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={styles.safe}>
          {/* Header component */}
          <Header />
        {/* KeyboardAvoidingView ensures inputs move up when keyboard appears */}
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          

          {/* Scrollable content */}
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: FOOTER_HEIGHT + 24, paddingTop: HEADER_HEIGHT }]}
            keyboardShouldPersistTaps="handled"
          >
            {/* Toggle buttons row: Signup / Login */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleButton, styles.toggleInactive]}
                onPress={() => router.push('/signup')}
              >
                <Text style={[styles.toggleText, styles.toggleTextBlue]}>Signup</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.toggleButton, styles.toggleActiveBlue]}>
                <Text style={[styles.toggleText, styles.toggleTextWhite]}>Login</Text>
              </TouchableOpacity>
            </View>

            {/* Form section */}
            <View style={styles.form}>
              {/* Email input */}
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color="#9AA0A6" style={styles.inputIcon} />
                <TextInput
                  placeholder="Email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Password input */}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color="#9AA0A6"
                  style={styles.inputIcon}
                />
                <TextInput
                  secureTextEntry
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              {/* Remember Me and Forgot Password row */}
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRemember(!remember)}
                >
                  <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
                    {remember && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  <Text style={styles.smallText}>Remember Me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.push('/reset-password')}>
                  <Text style={styles.forgot}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login button with gradient */}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (!email || !password) {
                    Alert.alert('Validation', 'Please enter email and password.');
                    return;
                  }
                  Alert.alert('Front-end only', 'Login pressed');
                }}
              >
                <LinearGradient
                  colors={['#4E9FE5', '#235CF8', '#4E9FE5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* OR separator */}
              <View style={styles.orRow}>
                <View style={styles.orLine} />
                <Text style={styles.orText}>OR</Text>
                <View style={styles.orLine} />
              </View>

              {/* Social login buttons */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert('Apple Sign in')}
              >
                <Ionicons name="logo-apple" size={18} color="#000" style={{ marginRight: 10 }} />
                <Text style={styles.socialText}>Sign in With Apple</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => Alert.alert('Google Sign in')}
              >
                <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 10 }} />
                <Text style={styles.socialText}>Sign in With Google</Text>
              </TouchableOpacity>

              {/* Signup link */}
              <View style={styles.loginRow}>
                <Text style={styles.smallText}>Don’t have an account?</Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.loginLink}> Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fixed full-width footer (does not overlap because of paddingBottom) */}
            <Footer fixed />
          </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    );
  }

  const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },

    // ScrollView content container ensures footer scrolls with content
    scrollContent: { padding: 16, flexGrow: 1, paddingBottom: 40 },

    // (kept for backward-compat) wrapper no longer required when using fixed footer
    footerWrap: { width: '100%', marginHorizontal: -16 },

    // Toggle buttons row
    toggleRow: { flexDirection: 'row', alignSelf: 'center', marginTop: 12, borderRadius: 28, overflow: 'hidden' },
    toggleButton: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    toggleActiveBlue: { backgroundColor: '#235CF8' },
    toggleInactive: { backgroundColor: '#fff' },
    toggleText: { fontWeight: '700', fontSize: 14 },
    toggleTextWhite: { color: '#fff' },
    toggleTextBlue: { color: '#235CF8' },

    // Form styles
    form: { marginTop: 18 },
    label: { fontSize: 12, color: '#333', marginBottom: 6 },
    inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 12 },
    inputIcon: { marginRight: 8 },
    input: { flex: 1, height: 36 },

    // Row for Remember Me & Forgot Password
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    rememberRow: { flexDirection: 'row', alignItems: 'center' },
    checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: '#ccc', marginRight: 8, alignItems: 'center', justifyContent: 'center' },
    checkboxChecked: { backgroundColor: '#235CF8', borderColor: '#235CF8' },
    smallText: { color: '#444' },
    forgot: { color: '#235CF8', fontWeight: '700' },

    // Login button
    loginButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
    loginButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    // OR separator
    orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
    orLine: { flex: 1, height: 1, backgroundColor: '#E6E6E6' },
    orText: { marginHorizontal: 12, color: '#9AA0A6', fontWeight: '700' },

    // Social login buttons
    socialButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#eee' },
    socialText: { fontWeight: '700' },

    // Signup row
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
    loginLink: { color: '#235CF8', fontWeight: '700' },
  });
