import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';

const { width } = Dimensions.get('window');

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
  secondaryActionText?: string;
  onSecondaryActionPress?: () => void;
}

export default function EmptyState({
  icon = 'search-outline',
  title,
  description,
  actionText,
  onActionPress,
  secondaryActionText,
  onSecondaryActionPress,
}: EmptyStateProps) {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  }, []);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ scale }] }]}>
      {/* Multi-layered Animated Icon Background */}
      <View style={styles.iconContainer}>
        <View style={[styles.circle, styles.circleLarge]} />
        <View style={[styles.circle, styles.circleMedium]} />
        <LinearGradient
          colors={[COLORS.primary + '20', COLORS.primary + '05']}
          style={styles.circleSmall}
        >
          <Ionicons name={icon} size={48} color={COLORS.primary} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.actionContainer}>
        {actionText && onActionPress && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onActionPress}
            style={styles.primaryButton}
          >
            <LinearGradient
              colors={[COLORS.primary, '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            >
              <Text style={styles.primaryButtonText}>{actionText}</Text>
              <Ionicons name="chevron-forward" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {secondaryActionText && onSecondaryActionPress && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onSecondaryActionPress}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>{secondaryActionText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  iconContainer: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary + '10',
  },
  circleLarge: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.primary + '03',
  },
  circleMedium: {
    width: 130,
    height: 130,
    backgroundColor: COLORS.primary + '05',
    borderColor: COLORS.primary + '15',
  },
  circleSmall: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  primaryButton: {
    width: '80%',
    height: 56,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
