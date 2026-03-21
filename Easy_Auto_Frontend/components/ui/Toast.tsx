import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '@/contexts/ToastContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Toast() {
  const { toast, hideToast } = useToast();
  const insets = useSafeAreaInsets();
  
  // Use useRef to persist animated values across re-renders
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: insets.top + (Platform.OS === 'ios' ? 0 : 10),
          useNativeDriver: true,
          damping: 15,
          stiffness: 100,
          mass: 1,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -150,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast, insets.top]);

  if (!toast) return null;

  const getTypeConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          colors: ['#10B981', '#059669'],
          label: toast.title || 'Success',
          iconBg: '#ECFDF5'
        };
      case 'error':
        return {
          icon: 'alert-circle',
          colors: ['#EF4444', '#DC2626'],
          label: toast.title || 'Error',
          iconBg: '#FEF2F2'
        };
      case 'info':
      default:
        return {
          icon: 'information-circle',
          colors: [COLORS.primary, '#1E40AF'],
          label: toast.title || 'Info',
          iconBg: '#EFF6FF'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          transform: [{ translateY }],
          opacity,
        }
      ]}
    >
      <View style={styles.card}>
        {/* Left Accent Bar */}
        <LinearGradient
          colors={config.colors as [string, string]}
          style={styles.accentBar}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
            <Ionicons name={config.icon as any} size={22} color={config.colors[0]} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: config.colors[0] }]}>{config.label}</Text>
            <Text style={styles.message} numberOfLines={2}>{toast.message}</Text>
          </View>

          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Ionicons name="close" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)', // Light blue-grey border
  },
  accentBar: {
    width: 4,
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  message: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  }
});
