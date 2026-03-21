import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

type Props = {
  version?: string;
  tagline?: string;
  fullScreen?: boolean;
  /** When true the footer is fixed to the bottom and overlays content */
  fixed?: boolean;
};

export const FOOTER_HEIGHT = 180;

export default function Footer({
  version = 'easyauto v1.0',
  tagline = 'Your Dream ride is just a click away',
  fullScreen = false,
  fixed = false,
}: Props) {
  const [imgError, setImgError] = useState(false);

  // Get full device width
  return (
    <View style={[fixed ? styles.fixedFooter : styles.footer, fullScreen && styles.fullScreen]}>
      {/* Logo or fallback icon */}
      {!imgError ? (
        <Image
          source={require('@/assets/applogonew.png')}
          style={styles.logo}
          resizeMode="contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={styles.fallbackLogo}>
          <Ionicons name="car-sport" size={36} color="#fff" />
        </View>
      )}

      {/* Tagline */}
      <Text style={styles.footerText}>{tagline}</Text>

      {/* Version */}
      <Text style={styles.footerSmall}>{version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    backgroundColor: '#0F172A', // Premium dark slate instead of harsh black
    paddingVertical: 32,
    paddingBottom: 48,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FOOTER_HEIGHT,
    backgroundColor: '#0F172A',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: { width: 160, height: 50, marginBottom: 16 },
  fallbackLogo: { marginBottom: 16, alignItems: 'center' },
  footerText: { color: '#F8FAFC', fontSize: 13, fontWeight: '600', textAlign: 'center', letterSpacing: 0.3 },
  footerSmall: { color: '#94A3B8', fontSize: 11, marginTop: 8, textAlign: 'center', fontWeight: '500', letterSpacing: 0.5 },
  fullScreen: {
    position: 'relative',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 18,
  },
});
