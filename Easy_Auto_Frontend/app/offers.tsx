import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import Header from "../components/Header";
import { COLORS } from "@/constants/Colors";
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OFFERS = [
  {
    id: '1',
    title: 'New Year Mega Deal',
    description: 'Get up to 15% off on vehicle inspection reports and premium listings.',
    code: 'NY2024',
    expiry: 'Expires in 5 days',
    color: ['#FF6B6B', '#EE5253'],
    icon: 'gift-outline'
  },
  {
    id: '2',
    title: 'Fuel Efficiency Pro',
    description: 'Free fuel economy check-up with every hybrid car purchase via EasyAuto.',
    code: 'FUELSAFE',
    expiry: 'Limited Time Only',
    color: ['#1DD1A1', '#10AC84'],
    icon: 'leaf-outline'
  },
  {
    id: '3',
    title: 'Premium Boost Pack',
    description: 'Buy 2 "Gold" boosts and get 1 "Silver" boost absolutely free.',
    code: 'BOOSTUP',
    expiry: 'Ongoing',
    color: ['#54A0FF', '#2E86DE'],
    icon: 'rocket-outline'
  },
];

export default function OffersScreen() {
  const router = useRouter();

  const copyToClipboard = (code: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // In a real app, use Clipboard.setString(code)
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Latest Offers" showBack={true} />

      <View style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          {/* Hero Promo Section */}
          <View style={styles.heroPromo}>
             <LinearGradient
                colors={[COLORS.primary, '#1D4ED8']}
                style={styles.heroGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
             >
                <View style={styles.heroTextContainer}>
                    <Text style={styles.heroTitle}>Unlock Exclusive Savings</Text>
                    <Text style={styles.heroSub}>Find the best deals and coupons to save on your next vehicle or service.</Text>
                </View>
                <View style={styles.couponBadge}>
                    <Ionicons name="pricetags" size={42} color="rgba(255,255,255,0.3)" />
                </View>
             </LinearGradient>
          </View>

          {/* Offers List */}
          <Text style={styles.sectionTitle}>Available Coupons</Text>
          <View style={styles.offersContainer}>
            {OFFERS.map((offer) => (
                <View key={offer.id} style={styles.offerCard}>
                    <LinearGradient
                        colors={offer.color as any}
                        style={styles.cardHeader}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Ionicons name={offer.icon as any} size={24} color="#fff" />
                        <Text style={styles.offerTitle}>{offer.title}</Text>
                    </LinearGradient>
                    
                    <View style={styles.cardBody}>
                        <Text style={styles.offerDesc}>{offer.description}</Text>
                        
                        <View style={styles.couponRow}>
                            <View style={styles.codeBox}>
                                <Text style={styles.codeText}>{offer.code}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.copyBtn}
                                onPress={() => copyToClipboard(offer.code)}
                            >
                                <Ionicons name="copy-outline" size={18} color={COLORS.primary} />
                                <Text style={styles.copyBtnText}>Copy Code</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.cardFooter}>
                            <View style={styles.expiryBadge}>
                                <Ionicons name="time-outline" size={12} color="#64748b" />
                                <Text style={styles.expiryText}>{offer.expiry}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}
          </View>

          {/* Loyalty Section */}
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyInfo}>
                <Text style={styles.loyaltyTitle}>Join our Loyalty Program</Text>
                <Text style={styles.loyaltySub}>Sign up today to receive personalized offers directly in your inbox.</Text>
                <TouchableOpacity 
                    style={styles.joinBtn}
                    onPress={() => router.push('/auth/signup')}
                >
                    <Text style={styles.joinBtnText}>Join Now</Text>
                    <Ionicons name="arrow-forward" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
            <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1554224155-1696413575b9?w=400&h=400&fit=crop' }} 
                style={styles.loyaltyImg} 
            />
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
  heroPromo: {
    padding: 20,
    marginTop: 8,
  },
  heroGradient: {
    borderRadius: 32,
    padding: 28,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroTextContainer: {
    flex: 1,
    zIndex: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    fontWeight: '500',
  },
  couponBadge: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  offersContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  cardBody: {
    padding: 20,
  },
  offerDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 20,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  codeBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1e293b',
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expiryText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
  },
  loyaltyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    alignItems: 'center',
  },
  loyaltyInfo: {
    flex: 1,
    padding: 24,
  },
  loyaltyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  loyaltySub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  joinBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  loyaltyImg: {
    width: 120,
    height: 180,
    backgroundColor: '#f1f5f9',
  }
});
