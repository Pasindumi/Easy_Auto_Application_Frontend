import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const SkeletonAdCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.card}>
      {/* Image Placeholder */}
      <Animated.View style={[styles.imagePlaceholder, { opacity }]} />

      <View style={styles.content}>
        {/* Title Placeholder */}
        <Animated.View style={[styles.titlePlaceholder, { opacity }]} />
        <Animated.View style={[styles.pricePlaceholder, { opacity }]} />

        {/* Meta Placeholder */}
        <View style={styles.metaRow}>
          <Animated.View style={[styles.metaPlaceholder, { opacity }]} />
          <Animated.View style={[styles.metaPlaceholder, { opacity }]} />
        </View>

        {/* Stats Placeholder */}
        <View style={styles.statsRow}>
          <Animated.View style={[styles.statPlaceholder, { opacity }]} />
          <Animated.View style={[styles.statPlaceholder, { opacity }]} />
          <Animated.View style={[styles.statPlaceholder, { opacity }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },
  content: {
    padding: 18,
  },
  titlePlaceholder: {
    height: 20,
    width: '70%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
  },
  pricePlaceholder: {
    height: 24,
    width: '40%',
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metaPlaceholder: {
    height: 14,
    width: 80,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  statPlaceholder: {
    height: 14,
    width: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});

export default SkeletonAdCard;
