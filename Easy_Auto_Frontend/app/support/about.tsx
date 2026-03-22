import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Header from "../../components/Header";
import { COLORS } from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Active Listings', value: '15K+' },
  { label: 'Happy Users', value: '50K+' },
  { label: 'Dealers', value: '200+' },
  { label: 'Top Cities', value: '25+' },
];

export default function AboutAppScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="About EasyAuto" showBack={true} />

      <View style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          {/* Brand Identity */}
          <View style={styles.brandCard}>
             <View style={styles.logoCircle}>
                <Image 
                    source={require("@/assets/logoHome.png")} 
                    style={styles.logoImg} 
                    resizeMode="contain" 
                />
             </View>
             <Text style={styles.brandTitle}>Sri Lanka's #1 Car Marketplace</Text>
             <Text style={styles.brandDesc}>
                EasyAuto is the fastest growing automotive marketplace in Sri Lanka, 
                connecting thousands of buyers and sellers through technology and trust.
             </Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {STATS.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                    <Text style={styles.statVal}>{stat.value}</Text>
                    <Text style={styles.statLbl}>{stat.label}</Text>
                </View>
            ))}
          </View>

          {/* Mission & Vision */}
          <View style={styles.missionCard}>
             <LinearGradient
                colors={['#fff', '#f8fafc']}
                style={styles.missionInner}
             >
                <View style={styles.missionItem}>
                    <View style={styles.iconBg}>
                        <Ionicons name="eye-outline" size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.missionText}>
                        <Text style={styles.missionTitle}>Our Vision</Text>
                        <Text style={styles.missionDesc}>To redefine the vehicle buying experience through transparency, security, and digital innovation.</Text>
                    </View>
                </View>
                
                <View style={styles.missionDivider} />
                
                <View style={styles.missionItem}>
                    <View style={styles.iconBg}>
                        <Ionicons name="flash-outline" size={24} color="#10b981" />
                    </View>
                    <View style={styles.missionText}>
                        <Text style={styles.missionTitle}>Our Mission</Text>
                        <Text style={styles.missionDesc}>Empowering Sri Lankans to buy and sell cars with confidence, speed, and absolute ease.</Text>
                    </View>
                </View>
             </LinearGradient>
          </View>

          {/* Core Values */}
          <Text style={styles.sectionTitle}>What We Stand For</Text>
          <View style={styles.valuesList}>
             <View style={styles.valueRow}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
                <Text style={styles.valueText}>Verified Sellers & Listings</Text>
             </View>
             <View style={styles.valueRow}>
                <Ionicons name="cash" size={20} color={COLORS.primary} />
                <Text style={styles.valueText}>Fair & Transparent Pricing</Text>
             </View>
             <View style={styles.valueRow}>
                <Ionicons name="chatbubbles" size={20} color={COLORS.primary} />
                <Text style={styles.valueText}>24/7 Dedicated Support Hub</Text>
             </View>
          </View>

          {/* Contact CTA */}
          <TouchableOpacity 
            style={styles.ctaCard} 
            onPress={() => router.push('/support/contact-us')}
          >
             <Text style={styles.ctaTitle}>Have Questions?</Text>
             <Text style={styles.ctaSub}>Our team is always here to help you navigate your car journey.</Text>
             <View style={styles.ctaBtn}>
                <Text style={styles.ctaBtnText}>Contact Support</Text>
                <Ionicons name="call" size={16} color="#fff" />
             </View>
          </TouchableOpacity>

          <View style={styles.footer}>
             <Text style={styles.footerText}>EasyAuto v2.4.1 (Stable Build)</Text>
             <Text style={styles.footerSub}>Colombo, Sri Lanka 🇱🇰</Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  brandCard: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  logoImg: {
    width: 60,
    height: 60,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 12,
  },
  brandDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
  },
  statLbl: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  missionCard: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  missionInner: {
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  missionItem: {
    flexDirection: 'row',
    gap: 16,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  missionText: {
    flex: 1,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    fontWeight: '500',
  },
  missionDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  valuesList: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  valueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  ctaCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 15,
    elevation: 2,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 8,
  },
  ctaSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 20,
  },
  ctaBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
  },
  ctaBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  footerSub: {
    fontSize: 10,
    color: '#e2e8f0',
    fontWeight: '600',
    marginTop: 4,
  }
});
