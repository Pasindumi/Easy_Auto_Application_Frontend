import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Ad } from '@/constants/dummydata/ads';
import StatusBadge from '../status/StatusBadge';

interface AdCardProps {
  ad: Ad;
  selected: boolean;
  toggleSelect: (id: string) => void;
}

export default function AdCard({ ad, selected, toggleSelect }: AdCardProps) {
  const router = useRouter();

  const mapStatus: 'active' | 'draft' | 'paused' | 'expired' =
    ad.status === 'active'
      ? 'active'
      : ad.status === 'draft'
        ? 'draft'
        : ad.status === 'paused'
          ? 'paused'
          : 'expired';

  return (
    <View style={styles.card}>

      {/* Top Content Row */}
      <View style={styles.topRow}>

        {/* Image & Checkbox */}
        <View>
          <Image
            source={typeof ad.image === 'string' ? { uri: ad.image } : ad.image}
            style={styles.image}
          />


          {/* Checkbox */}
          <TouchableOpacity
            onPress={() => toggleSelect(ad.id)}
            style={styles.checkboxWrap}
          >
            <View style={[styles.checkbox, selected && styles.checkboxActive]}>
              {selected && (
                <Ionicons name="checkmark" color="#fff" size={14} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Right content */}
        <View style={styles.infoContainer}>

          {/* Boost Badges */}
          {(ad.is_featured || ad.is_urgent) && (
            <View style={{ flexDirection: 'row', marginBottom: 6, gap: 6 }}>
              {ad.is_urgent && (
                <View style={{ backgroundColor: '#EF4444', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>URGENT</Text>
                </View>
              )}
              {ad.is_featured && (
                <View style={{ backgroundColor: '#F59E0B', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>FEATURED</Text>
                </View>
              )}
            </View>
          )}

          {/* Title + Status */}
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {ad.title}
            </Text>

            <StatusBadge status={mapStatus} />
          </View>

          {/* Price */}
          <Text style={styles.price}>{ad.price}</Text>

          {/* Location */}
          <Text style={styles.location}>
            {ad.location}
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}> {ad.views}</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}> {ad.likes}</Text>
            </View>

            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#6B7280" />
              <Text style={styles.statText}> {ad.messages}</Text>
            </View>
          </View>

        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => router.push(`/cars/review?id=${ad.id}`)}
          style={styles.actionBtn}
        >
          <Ionicons name="eye-outline" size={16} color="#2563EB" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>

        {/* Edit Button hidden as per request (available in Review page) */}
        {/* <TouchableOpacity
          onPress={() => router.push(`/ads/edit-car?id=${ad.id}`)}
          style={styles.actionBtn}
        >
          <Ionicons name="create-outline" size={16} color="#2563EB" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity> */}

        {mapStatus === 'active' && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/ads/boost/[id]', params: { id: ad.id } })}
            style={styles.actionBtn}
          >
            <Ionicons name="rocket-outline" size={16} color="#2563EB" />
            <Text style={styles.actionText}>Boost</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => router.push(`/ads/delete-car?id=${ad.id}`)}
          style={styles.actionBtn}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={[styles.actionText, { color: '#EF4444' }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  image: {
    width: 100,
    height: 80,
    borderRadius: 10,
  },

  checkboxWrap: {
    position: 'absolute',
    top: 4,
    left: 4,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },

  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 6,
  },

  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },

  location: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 12,
  },

  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statText: {
    fontSize: 12,
    color: '#6B7280',
  },

  actionRow: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  actionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2563EB',
  },
});
