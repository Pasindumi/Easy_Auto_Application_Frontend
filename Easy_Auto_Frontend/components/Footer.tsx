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
          source={require('@/assets/images/logo.png')}
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
    backgroundColor: '#111',
    paddingVertical: 18,
    alignItems: 'center',

  },
  fixedFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: FOOTER_HEIGHT,
    backgroundColor: '#111',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    paddingBottom: 50,
  },
  logo: { width: 120, height: 40, marginBottom: 12 },
  fallbackLogo: { marginBottom: 12, alignItems: 'center' },
  footerText: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  footerSmall: { color: '#bbb', fontSize: 12, marginTop: 6, textAlign: 'center' },
  fullScreen: {
    position: 'relative',
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingVertical: 18,
  },
});
