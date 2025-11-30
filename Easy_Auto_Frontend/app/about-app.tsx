// app/about-app.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
         Image,
         Linking,
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native';

export default function AboutApp() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* ---------- HEADER ---------- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>ABOUT EASYAUTO</Text>
            <View style={{ width: 22 }} />
          </View>


          {/* ---------- APP CARD ---------- */}
          <View style={styles.appCard}>

            <Image
              source={require('../assets/images/blueLogo.png')}
              style={styles.logo}
            />

            <Text style={styles.version}>Version 1.0.0</Text>

            <Text style={styles.description}>
              EasyAuto is a powerful and simple vehicle marketplace designed
              to help users buy, sell, and manage vehicles with ease. 
              Discover thousands of vehicles and connect with sellers instantly.
            </Text>

            {/* STATS */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>10K+</Text>
                <Text style={styles.statLabel}>Cars</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>5K+</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statValue}>4.9★</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>


          {/* ---------- FEATURES ---------- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Main Features</Text>

            <View style={styles.featureItem}>
              <Ionicons name="car-sport" size={20} color="#235CF8" />
              <Text style={styles.featureText}>Buy & Sell Vehicles Easily</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="heart" size={20} color="#235CF8" />
              <Text style={styles.featureText}>Save Favorite Vehicles</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#235CF8" />
              <Text style={styles.featureText}>Chat With Sellers</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="card" size={20} color="#235CF8" />
              <Text style={styles.featureText}>Fast & Secure Payments</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="stats-chart" size={20} color="#235CF8" />
              <Text style={styles.featureText}>Live Market Insights</Text>
            </View>
          </View>


          {/* ---------- WHY EASYAUTO ---------- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Why Choose EasyAuto?</Text>

            <Text style={styles.bulletText}>• Simple & clean interface</Text>
            <Text style={styles.bulletText}>• Thousands of verified sellers</Text>
            <Text style={styles.bulletText}>• Instant messaging support</Text>
            <Text style={styles.bulletText}>• Secure transactions</Text>
            <Text style={styles.bulletText}>• Works smoothly on all devices</Text>
          </View>


          {/* ---------- DEVELOPER ---------- */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Developer Information</Text>

            <View style={styles.devRow}>
              <Ionicons name="person" size={20} color="#235CF8" />
              <Text style={styles.devText}>Code Mates</Text>
            </View>

            <View style={styles.devRow}>
              <Ionicons name="mail" size={20} color="#235CF8" />
              <Text style={styles.devText}>codemates@gmail.com</Text>
            </View>

            <View style={styles.devRow}>
              <Ionicons name="globe" size={20} color="#235CF8" />
              <Text style={styles.devText}>www.codemates.lk</Text>
            </View>
          </View>


          {/* ---------- SOCIAL MEDIA ---------- */}
          <View style={styles.socialSection}>
            <Text style={styles.sectionTitle}>Follow Us On</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
                <Ionicons name="logo-facebook" size={26} color="#235CF8" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
                <Ionicons name="logo-instagram" size={26} color="#E1306C" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
                <Ionicons name="logo-twitter" size={26} color="#1DA1F2" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://wa.me/94700000000')}>
                <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://tiktok.com')}>
                <Ionicons name="logo-tiktok" size={26} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://youtube.com')}>
                <Ionicons name="logo-youtube" size={26} color="red" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com')}>
                <Ionicons name="logo-linkedin" size={26} color="#0A66C2" />
              </TouchableOpacity>
            </View>
          </View>


          {/* ---------- BUTTON ---------- */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* APP CARD */
  appCard: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: -40,
  },

  version: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },

  description: {
    fontSize: 13,
    textAlign: 'center',
    color: '#444',
    marginTop: 15,
    lineHeight: 21,
  },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
  },

  statBox: {
    backgroundColor: '#F1F4FF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#235CF8',
  },

  statLabel: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
  },

  /* SECTIONS */
  sectionContainer: {
    marginHorizontal: 16,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  featureText: {
    fontSize: 13,
    marginLeft: 10,
    color: '#333',
    fontWeight: '600',
  },

  bulletText: {
    fontSize: 13,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },

  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  devText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  /* SOCIAL */
  socialSection: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },

  /* BUTTON */
  backBtn: {
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
    flexDirection: 'row',
    marginHorizontal: 60,
    marginTop: 20,
    elevation: 4,
  },

  backText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});
