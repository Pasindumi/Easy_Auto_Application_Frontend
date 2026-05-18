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
                <Ionicons name="key-outline" size={18} color="#D97706" />
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Rent My Vehicle</Text>
              <Text style={styles.cardSubtitle}>Earn money by renting out your car securely</Text>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={16} color="#D97706" />
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
                <MaterialCommunityIcons name="car-search-outline" size={18} color="#059669" />
              </LinearGradient>
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.cardTitle}>Find a Vehicle to Rent</Text>
              <Text style={styles.cardSubtitle}>Browse available vehicles for your next trip</Text>
            </View>

            <View style={styles.arrowContainer}>
              <Ionicons name="arrow-forward" size={16} color="#059669" />
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
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: COLORS.text.muted,
    fontWeight: '500',
  },
  listContent: {
    padding: 15,
    gap: 12,
  },
  card: {
    width: '100%',
    borderRadius: 5,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    justifyContent: 'flex-start',
  },
  iconContainer: {
    marginRight: 10,
  },
  iconBackground: {
    width: 36,
    height: 36,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
    paddingRight: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 0,
  },
  cardSubtitle: {
    fontSize: 9,
    color: COLORS.text.muted,
    lineHeight: 12,
  },
  arrowContainer: {
    opacity: 0.6,
  },
});
