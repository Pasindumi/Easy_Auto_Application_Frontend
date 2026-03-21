import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Loading from './Loading';

interface Props {
  refreshing: boolean;
  top?: number;
}

export default function BrandedRefreshOverlay({ refreshing, top = 20 }: Props) {
  if (!refreshing) return null;

  return (
    <View style={[styles.container, { top }]} pointerEvents="none">
      <View style={styles.pill}>
        <Loading size="small" style={{ paddingVertical: 0 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
});
