// PROJECT_ROOT/app/ratings.tsx

import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from "../../components/Header";

// ---- Review Data ----
const REVIEWS = [
  {
    id: '1',
    name: 'Martin Luthur',
    rating: 4.0,
    date: '2 week ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Best Seller, excellent communication, quick response',
  },
  {
    id: '2',
    name: 'Dilmin Ekanayaka',
    rating: 4.8,
    date: '3 week ago',
    image: require('@/assets/images/user1.jpg'),
    comment: 'Best Seller, excellent communication, quick response',
  },
  {
    id: '3',
    name: 'Ishini Gimhani',
    rating: 5.0,
    date: '4 week ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Best Seller, excellent communication, quick response',
  },
  {
    id: '4',
    name: 'Piumi Rajapakse',
    rating: 4.0,
    date: '1 month ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Best Seller, excellent communication, quick response',
  },
  {
    id: '5',
    name: 'Malsha Nethmini',
    rating: 4.0,
    date: '2 month ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Best Seller, excellent communication, quick response',
  },
];

// ---- Star Component ----
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Ionicons
        key={i}
        name={i <= rating ? 'star' : 'star-outline'}
        size={14}
        color="#F9C74F"
        style={{ marginRight: 2 }}
      />
    );
  }

  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

// ---- Main Screen ----
export default function RatingsScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <Header />
        <View style={localStyles.headerWrap}>
          <View style={localStyles.header}>
            <View style={localStyles.headerLeft}>
              <Ionicons name="star-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
              <Text style={localStyles.headerTitle}>Ratings</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.container}>

          {/* Overall Rating */}
          <View style={styles.overallContainer}>
            <Text style={styles.overallTitle}>Overall Ratings</Text>

            <Text style={styles.overallNumber}>4.9</Text>

            <View style={{ flexDirection: 'row', marginVertical: 6 }}>
              <StarRating rating={5} />
            </View>

            <Text style={styles.reviewText}>Based on 20 Reviews</Text>
          </View>

          {/* Reviews List */}
          <FlatList
            data={REVIEWS}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={styles.reviewCard}>
                <Image source={item.image} style={styles.avatar} />

                <View style={styles.reviewContent}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{item.name}</Text>
                    <Text style={styles.reviewDate}>{item.date}</Text>
                  </View>

                  <View style={styles.reviewStars}>
                    <StarRating rating={Math.round(item.rating)} />
                    <Text style={styles.ratingNum}>({item.rating})</Text>
                  </View>

                  <Text style={styles.comment}>"{item.comment}"</Text>
                </View>
              </View>
            )}
          />

          {/* View All Button */}
          <TouchableOpacity style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All Ratings</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  header: {
    height: 100,
    backgroundColor: '#235CF8',
    paddingTop: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  overallContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  overallTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },

  overallNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#235CF8',
  },

  reviewText: {
    fontSize: 12,
    color: '#666',
  },

  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  reviewContent: {
    flex: 1,
  },

  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  reviewName: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111',
  },

  reviewDate: {
    fontSize: 11,
    color: '#888',
  },

  reviewStars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },

  ratingNum: {
    fontSize: 12,
    marginLeft: 6,
    color: '#777',
  },

  comment: {
    fontSize: 12,
    color: '#444',
  },

  viewAllBtn: {
    marginTop: 16,
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },

  viewAllText: {
    fontWeight: '700',
    color: '#111',
  },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F5F5F5' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E5E5' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
