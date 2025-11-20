// PROJECT_ROOT/components/Header.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderProps = {
  // optional title shown centered under logo (if provided)
  title?: string;
  // show/hide back button (default true)
  showBack?: boolean;
  // optionally hide logo (default false)
  hideLogo?: boolean;
};

export default function Header({ title, showBack = true, hideLogo = false }: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {/* back button left */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityLabel="Back"
      >
        {showBack ? <Ionicons name="arrow-back" size={22} color="#fff" /> : <View style={{ width: 22 }} />}
      </TouchableOpacity>

      {/* logo (center) */}
      <View style={styles.logoWrap}>
        {!hideLogo && (
          <Image
            // adjust this path if your logo is elsewhere
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        )}
        {/* optional small title below logo */}
        {title ? <Text style={styles.title}>{title}</Text> : null}
      </View>

      {/* right spacer to keep logo centered */}
      <View style={styles.rightSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 120,
    backgroundColor: '#235CF8',
    paddingTop: 18,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { padding: 8, width: 40, alignItems: 'flex-start', justifyContent: 'center' },
  logoWrap: { flex: 1, alignItems: 'center' },
  logoImage: { width: 120, height: 48 },
  title: { color: '#fff', marginTop: 6, fontWeight: '700' },
  rightSpacer: { width: 40 },
});
