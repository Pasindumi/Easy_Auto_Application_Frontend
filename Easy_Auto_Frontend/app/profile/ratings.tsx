import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import Header from "../../components/Header";
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const REVIEWS = [
  {
    id: '1',
    name: 'Martin Luther',
    rating: 4.0,
    date: '2 weeks ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Best Seller, excellent communication, quick response. Highly recommended!',
  },
  {
    id: '2',
    name: 'Dilmin Ekanayaka',
    rating: 4.8,
    date: '3 weeks ago',
    image: require('@/assets/images/user1.jpg'),
    comment: 'Professional and trustworthy. The car was exactly as described.',
  },
  {
    id: '3',
    name: 'Ishini Gimhani',
    rating: 5.0,
    date: '4 weeks ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Amazing experience! Very helpful and responsive throughout the process.',
  },
  {
    id: '4',
    name: 'Piumi Rajapakse',
    rating: 4.0,
    date: '1 month ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Good seller with fair pricing. Would do business again.',
  },
  {
    id: '5',
    name: 'Malsha Nethmini',
    rating: 4.5,
    date: '2 months ago',
    image: require('@/assets/images/user.jpeg'),
    comment: 'Very satisfied with the service. Quick and professional.',
  },
];

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={size}
          color="#FFB800"
          style={{ marginRight: 2 }}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <Ionicons
          key={i}
          name="star-half"
          size={size}
          color="#FFB800"
          style={{ marginRight: 2 }}
        />
      );
    } else {
      stars.push(
        <Ionicons
          key={i}
          name="star-outline"
          size={size}
          color="#D1D5DB"
          style={{ marginRight: 2 }}
        />
      );
    }
  }

  return <View style={{ flexDirection: 'row' }}>{stars}</View>;
};

export default function RatingsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const ratingBreakdown = [
    { stars: 5, count: 12, percentage: 60 },
    { stars: 4, count: 5, percentage: 25 },
    { stars: 3, count: 2, percentage: 10 },
    { stars: 2, count: 1, percentage: 5 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Ratings & Reviews" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Overall Rating Card */}
        <LinearGradient
          colors={[COLORS.primary, '#1E40AF']}
          style={styles.overallCard}
        >
          <View style={styles.overallContent}>
            <View style={styles.ratingNumberSection}>
              <Text style={styles.overallNumber}>4.9</Text>
              <StarRating rating={4.9} size={20} />
              <Text style={styles.reviewCount}>Based on 20 reviews</Text>
            </View>

            <View style={styles.ratingBreakdown}>
              {ratingBreakdown.map((item) => (
                <View key={item.stars} style={styles.breakdownRow}>
                  <Text style={styles.breakdownStars}>{item.stars}</Text>
                  <Ionicons name="star" size={12} color="#FFB800" />
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${item.percentage}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.breakdownCount}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Filter Tabs */}
        <View style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Customer Reviews</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterTabs}>
              {['All', '5 Star', '4 Star', '3 Star', 'Recent'].map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterTab,
                    filter === 'All' && styles.filterTabActive
                  ]}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      filter === 'All' && styles.filterTabTextActive
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Reviews List */}
        <View style={styles.reviewsList}>
          {REVIEWS.map((item) => (
            <View key={item.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={item.image} style={styles.avatar} />
                <View style={styles.reviewHeaderInfo}>
                  <Text style={styles.reviewName}>{item.name}</Text>
                  <View style={styles.reviewRating}>
                    <StarRating rating={item.rating} size={14} />
                    <Text style={styles.ratingValue}>{item.rating.toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={styles.reviewDate}>{item.date}</Text>
              </View>

              <Text style={styles.comment}>{item.comment}</Text>

              {/* Helpful Actions */}
              <View style={styles.reviewActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="thumbs-up-outline" size={16} color={COLORS.text.muted} />
                  <Text style={styles.actionText}>Helpful</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                  <Ionicons name="chatbubble-outline" size={16} color={COLORS.text.muted} />
                  <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Load More Button */}
        <TouchableOpacity
          style={styles.loadMoreBtn}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <LinearGradient
            colors={[COLORS.primary, '#1E40AF']}
            style={styles.loadMoreGradient}
          >
            <Text style={styles.loadMoreText}>Load More Reviews</Text>
            <Ionicons name="chevron-down" size={20} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingBottom: 20,
  },
  overallCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  overallContent: {
    flexDirection: 'row',
    gap: 24,
  },
  ratingNumberSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  overallNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    fontWeight: '600',
  },
  ratingBreakdown: {
    flex: 1,
    justifyContent: 'center',
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownStars: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
    width: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 3,
  },
  breakdownCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
    width: 20,
    textAlign: 'right',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.divider,
    backgroundColor: COLORS.white,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  reviewsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  reviewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewName: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text.secondary,
  },
  reviewDate: {
    fontSize: 11,
    color: COLORS.text.muted,
  },
  comment: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.muted,
  },
  loadMoreBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  loadMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});