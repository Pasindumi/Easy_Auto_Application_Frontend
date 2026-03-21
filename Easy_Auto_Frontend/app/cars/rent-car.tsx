// app/cars/rent-car.tsx
import Header from '@/components/Header';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RentCarLandingScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Rentals" />

      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>What would you like to do?</Text>
        <Text style={styles.headerSubtitle}>Choose an option below to proceed</Text>
      </View>

      <View style={styles.listContent}>
        {/* Option 1: Rent My Own Vehicle */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => {
            if (isAuthenticated) {
              router.push({
                pathname: '/cars/select-type',
                params: { mode: 'rent' }
              });
            } else {
              router.push('/auth/login');
            }
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COLORS.white, '#F8FAFC']}
            style={styles.cardGradient}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#FFFBEB', '#FEF3C7']}
                style={styles.iconBackground}
              >
                <Ionicons name="key-outline" size={36} color="#D97706" />
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Rent My Vehicle</Text>
              <Text style={styles.cardSubtitle}>Earn money by renting out your car securely</Text>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={24} color="#D97706" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Option 2: Find a Vehicle to Rent */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push('/cars/rental-ads-list')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[COLORS.white, '#F8FAFC']}
            style={styles.cardGradient}
          >
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#ECFDF5', '#D1FAE5']}
                style={styles.iconBackground}
              >
                <MaterialCommunityIcons name="car-search-outline" size={36} color="#059669" />
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Find a Vehicle to Rent</Text>
              <Text style={styles.cardSubtitle}>Browse available vehicles for your next trip</Text>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={24} color="#059669" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  listContent: {
    padding: 20,
    gap: 20,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    height: 140,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    marginRight: 20,
  },
  iconBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    color: COLORS.text.muted,
    lineHeight: 18,
  },
  arrowContainer: {
    opacity: 0.6,
  },
});
