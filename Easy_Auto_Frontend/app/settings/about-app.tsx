import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { View as RNView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, type SharedValue } from 'react-native-reanimated';
import Header from "../../components/Header";
import COLORS from "../../constants/Colors";

const { width } = Dimensions.get('window');

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function AboutApp() {
  const router = useRouter();

  const scale = useSharedValue(1);
  const backBtnScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backBtnScale.value }],
  }));

  const onPressIn = (sv: SharedValue<number>) => {
    sv.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onPressOut = (sv: SharedValue<number>) => {
    sv.value = withSpring(1);
  };

  const renderSocialIcon = (name: any, color: string, url: string) => {
    const iconScale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: iconScale.value }],
    }));

    return (
      <AnimatedTouchableOpacity
        style={[styles.socialIconWrapper, animatedStyle]}
        onPressIn={() => onPressIn(iconScale)}
        onPressOut={() => onPressOut(iconScale)}
        onPress={() => Linking.openURL(url)}
        activeOpacity={0.8}
      >
        <Ionicons name={name} size={24} color={color} />
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="About Easy Auto" showBack={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topSpacer} />

        {/* ---------- BRANDING SECTION ---------- */}
        <LinearGradient
          colors={[COLORS.primary, '#1E40AF']}
          style={styles.brandingCard}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Image
              source={require('@/assets/applogonew.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.appNameText}>Easy Auto Marketplace</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>VERSION 1.0.0</Text>
          </View>

          <Text style={styles.brandingDescription}>
            The ultimate platform for vehicle enthusiasts. Buy, sell, and discover thousands
            of verified vehicles with professional confidence.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>10K+</Text>
              <Text style={styles.statLabel}>Cars</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5K+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9★</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ---------- MISSION SECTION ---------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.normalText}>
            To provide a transparent, secure, and luxury-grade car buying experience for everyone in Sri Lanka.
            We ensure every transaction is backed by quality and trust.
          </Text>
        </View>

        {/* ---------- KEY FEATURES ---------- */}
        <View style={styles.featureGrid}>
          <View style={[styles.featureCard, { borderRightWidth: 1, borderRightColor: '#F3F4F6' }]}>
            <View style={styles.featureIconBox}>
              <MaterialCommunityIcons name="check-decagram" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Verified</Text>
            <Text style={styles.featureDesc}>All vehicles checked</Text>
          </View>
          <View style={styles.featureCard}>
            <View style={styles.featureIconBox}>
              <MaterialCommunityIcons name="shield-lock" size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.featureTitle}>Secure</Text>
            <Text style={styles.featureDesc}>Safe transactions</Text>
          </View>
        </View>

        {/* ---------- DEVELOPER INFO ---------- */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support & Development</Text>

          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('https://codemates.lk')}>
            <View style={styles.infoIconBox}>
              <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Website</Text>
              <Text style={styles.infoValue}>www.codemates.lk</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.miniDivider} />

          <TouchableOpacity style={styles.infoRow} onPress={() => Linking.openURL('mailto:support@codemates.lk')}>
            <View style={styles.infoIconBox}>
              <Ionicons name="mail-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.infoLabel}>Support Email</Text>
              <Text style={styles.infoValue}>support@codemates.lk</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ---------- SOCIAL CONNECT ---------- */}
        <View style={styles.socialCard}>
          <Text style={styles.sectionTitleCenter}>Connect With Us</Text>
          <View style={styles.socialGrid}>
            {renderSocialIcon('logo-facebook', '#1877F2', 'https://facebook.com')}
            {renderSocialIcon('logo-instagram', '#E4405F', 'https://instagram.com')}
            {renderSocialIcon('logo-twitter', '#1DA1F2', 'https://twitter.com')}
            {renderSocialIcon('logo-whatsapp', '#25D366', 'https://wa.me/94700000000')}
          </View>
        </View>

        {/* ---------- BACK BUTTON ---------- */}
        <Animated.View style={[styles.bottomButtonContainer, backButtonStyle]}>
          <TouchableOpacity
            style={styles.backButton}
            onPressIn={() => onPressIn(backBtnScale)}
            onPressOut={() => onPressOut(backBtnScale)}
            onPress={() => router.back()}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, '#1E3A8A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.white} />
              <Text style={styles.backButtonText}>Return to Settings</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.copyrightText}>© 2024 Easy Auto. All rights reserved.</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.white, // Advanced professional: white background
  },
  container: {
    paddingBottom: 20,
  },
  brandingCard: {
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
  appNameText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
    marginTop: 10,
  },
  versionBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  versionText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 1,
  },
  brandingDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 20,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    paddingVertical: 16,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  topSpacer: {
    height: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionTitleCenter: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  normalText: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 24,
    fontWeight: '500',
  },
  featureGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  featureCard: {
    flex: 1,
    paddingVertical: 32,
    alignItems: 'center',
  },
  featureIconBox: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#F3F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoIconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
    marginTop: 1,
  },
  miniDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 16,
  },
  socialCard: {
    backgroundColor: COLORS.white,
    paddingVertical: 40,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  socialGrid: {
    flexDirection: 'row',
    gap: 32,
  },
  socialIconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtonContainer: {
    padding: 24,
  },
  backButton: {
    borderRadius: 16,
    height: 56,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  copyrightText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
    paddingBottom: 40,
  },
});
