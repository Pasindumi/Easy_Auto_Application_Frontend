import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
         Image,
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native';

export default function CompareCars() {
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

            <Text style={styles.headerTitle}>COMPARE CARS</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* ---------- MAIN COMPARE CARD ---------- */}
          <View style={styles.compareContainer}>
            {/* TOP CAR IMAGES */}
            <View style={styles.imageRow}>
              {/* Car 1 */}
              <View style={styles.carImageBox}>
                <Image
                  source={{ uri: 'https://i.ibb.co/HK5N2H0/juke.png' }}
                  style={styles.carImage}
                />
                <Text style={styles.carTitle}>Nissan Juke</Text>
                <Text style={styles.carYear}>2020</Text>
              </View>

              {/* VS */}
              <View style={styles.vsCircle}>
                <Text style={styles.vsText}>VS</Text>
              </View>

              {/* Car 2 */}
              <View style={styles.carImageBox}>
                <Image
                  source={{ uri: 'https://i.ibb.co/XytkH9z/pajero.png' }}
                  style={styles.carImage}
                />
                <Text style={styles.carTitle}>Mitsubishi Pajero</Text>
                <Text style={styles.carYear}>2017</Text>
              </View>
            </View>

            {/* COMPARISON DETAILS */}
            <View style={styles.detailRow}>
              {/* LEFT SIDE */}
              <View style={styles.detailColumn}>
                <Text style={styles.price}>Rs. 9,800,000</Text>
                <Text style={styles.greenText}>● Lower price</Text>

                <Text style={styles.spec}>38,000 km</Text>
                <Text style={styles.greenText}>● Less driven</Text>

                <Text style={styles.spec}>Automatic Transmission</Text>
                <Text style={styles.spec}>Fuel Type - Petrol</Text>
                <Text style={styles.spec}>Condition - Used (Excellent)</Text>
                <Text style={styles.spec}>Year - 2020</Text>
                <Text style={styles.spec}>Fuel Economy - 16 km/l</Text>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  <Text style={styles.spec}>Seller Rating</Text>
                  <Text style={styles.star}>★★★★☆</Text>
                </View>
              </View>

              {/* RIGHT SIDE */}
              <View style={styles.detailColumn}>
                <Text style={styles.price}>Rs. 11,500,000</Text>
                <Text style={styles.redText}>● Higher price</Text>

                <Text style={styles.spec}>62,000 km</Text>
                <Text style={styles.redText}>● More driven</Text>

                <Text style={styles.spec}>Automatic Transmission</Text>
                <Text style={styles.spec}>Fuel Type - Diesel</Text>
                <Text style={styles.spec}>Condition - Used (Good)</Text>
                <Text style={styles.spec}>Year - 2017</Text>
                <Text style={styles.spec}>Fuel Economy - 9 km/l</Text>

                {/* Rating */}
                <View style={styles.ratingRow}>
                  <Text style={styles.spec}>Seller Rating</Text>
                  <Text style={styles.star}>★★★★☆</Text>
                </View>
              </View>
            </View>

            {/* COMPARE BUTTON */}
            <TouchableOpacity style={styles.compareBtn}>
              <Ionicons name="git-compare" size={18} color="#fff" />
              <Text style={styles.compareText}>Compare</Text>
            </TouchableOpacity>
          </View>

          {/* ---------- SIMILAR COMPARISONS ---------- */}
          <Text style={styles.similarTitle}>SIMILAR CAR COMPARISONS</Text>

          <View style={styles.similarGrid}>
            {[1, 2, 3, 4].map((item) => (
              <View key={item} style={styles.similarCard}>
                <Image
                  source={{ uri: 'https://i.ibb.co/YtPvCqN/range.png' }}
                  style={styles.similarImage}
                />

                <View style={styles.vsSmall}>
                  <Text style={styles.vsTextSmall}>VS</Text>
                </View>

                <Image
                  source={{ uri: 'https://i.ibb.co/YtPvCqN/range.png' }}
                  style={styles.similarImage}
                />

                <View style={styles.similarNames}>
                  <Text style={styles.similarName}>Range Rover Sport</Text>
                  <Text style={styles.similarName}>Range Rover Evoque</Text>
                </View>
              </View>
            ))}
          </View>
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
    paddingBottom: 50,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* MAIN CARD */
  compareContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
  },

  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  carImageBox: {
    alignItems: 'center',
    width: '40%',
  },

  carImage: {
    width: '100%',
    height: 70,
    resizeMode: 'cover',
    borderRadius: 10,
  },

  carTitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },

  carYear: {
    fontSize: 11,
    color: '#777',
  },

  vsCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },

  vsText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  detailRow: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
  },

  detailColumn: {
    width: '48%',
  },

  price: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 3,
  },

  greenText: {
    color: 'green',
    fontSize: 11,
    marginBottom: 8,
  },

  redText: {
    color: 'red',
    fontSize: 11,
    marginBottom: 8,
  },

  spec: {
    fontSize: 11,
    marginBottom: 6,
    color: '#222',
  },

  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  star: {
    color: '#F59E0B',
    fontSize: 12,
  },

  compareBtn: {
    marginTop: 16,
    backgroundColor: '#235CF8',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  compareText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '700',
  },

  similarTitle: {
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 10,
    fontWeight: '700',
  },

  similarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },

  similarCard: {
    width: '46%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    marginBottom: 14,
  },

  similarImage: {
    width: '100%',
    height: 60,
    resizeMode: 'cover',
    borderRadius: 10,
  },

  vsSmall: {
    marginVertical: 5,
    backgroundColor: '#000',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },

  vsTextSmall: {
    color: '#fff',
    fontSize: 10,
  },

  similarNames: {
    marginTop: 5,
    alignItems: 'center',
  },

  similarName: {
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
});
