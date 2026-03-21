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
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import COLORS from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

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
  const [selectedFilter, setSelectedFilter] = useState('All');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredReviews = REVIEWS.filter(review => {
    if (selectedFilter === 'All' || selectedFilter === 'Recent') return true;
    const stars = Math.floor(review.rating);
    if (selectedFilter === '5 Star') return stars === 5;
    if (selectedFilter === '4 Star') return stars === 4;
    if (selectedFilter === '3 Star') return stars === 3;
    return true;
  });

  const ratingBreakdown = [
    { stars: 5, count: 12, percentage: 60 },
    { stars: 4, count: 5, percentage: 25 },
    { stars: 3, count: 2, percentage: 10 },
    { stars: 2, count: 1, percentage: 5 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onPressIn = () => { scale.value = withSpring(0.96); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };
  const onPressOut = () => { scale.value = withSpring(1); };

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} title="Ratings & Reviews" />

      <BrandedRefreshOverlay refreshing={refreshing} top={100} />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
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
                    filter === selectedFilter && styles.filterTabActive
                  ]}
                  onPress={() => {
                    setSelectedFilter(filter);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      filter === selectedFilter && styles.filterTabTextActive
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
          {filteredReviews.length > 0 ? (
            filteredReviews.map((item) => (
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
                    <Ionicons name="thumbs-up-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.actionText}>Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.actionText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Ionicons name="star-outline" size={48} color="#D1D5DB" />
              <Text style={{ marginTop: 10, color: '#6B7280', fontWeight: '600' }}>No reviews found for this filter</Text>
            </View>
          )}
        </View>

        {/* Load More Button */}
        <Animated.View style={buttonStyle}>
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.primary, '#1E40AF']}
              style={styles.loadMoreGradient}
            >
              <Text style={styles.loadMoreText}>Load More Reviews</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.white} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    paddingBottom: 30,
  },
  overallCard: {
    margin: 16,
    borderRadius: 24,
    padding: 18,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  overallContent: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingNumberSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  overallNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -1,
  },
  reviewCount: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  ratingBreakdown: {
    flex: 1.4,
    justifyContent: 'center',
    gap: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownStars: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    width: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFB800',
    borderRadius: 2,
  },
  breakdownCount: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
    width: 18,
    textAlign: 'right',
  },
  filterSection: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
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
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  reviewHeaderInfo: {
    flex: 1,
  },
  reviewName: {
    fontWeight: '800',
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 0,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  reviewDate: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  comment: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
  },
  loadMoreBtn: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  loadMoreGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
});
