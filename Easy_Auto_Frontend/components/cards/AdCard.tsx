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
import COLORS from '@/constants/Colors';
import StatusBadge from '../status/StatusBadge';

interface AdCardProps {
  ad: any;
  selected: boolean;
  toggleSelect: (id: string) => void;
}

export default function AdCard({ ad, selected, toggleSelect }: AdCardProps) {
  const router = useRouter();

  const mapStatus: 'active' | 'draft' | 'paused' | 'expired' | 'banned' =
    ad.status === 'active'
      ? 'active'
      : (ad.status === 'draft' || ad.status === 'pending_payment')
        ? 'draft'
        : ad.status === 'paused'
          ? 'paused'
          : ad.status === 'banned'
            ? 'banned'
            : 'expired';

  return (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.mainContent}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={typeof ad.image === 'string' ? { uri: ad.image } : ad.image}
            style={styles.image}
          />

          {/* Selection Overlay */}
          <TouchableOpacity
            onPress={() => toggleSelect(ad.id)}
            style={[styles.selectionOverlay, selected && styles.selectionOverlayActive]}
          >
            <Ionicons
              name={selected ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={selected ? COLORS.primary : "rgba(255,255,255,0.8)"}
            />
          </TouchableOpacity>

          {/* Featured/Urgent Badges */}
          <View style={styles.badgesContainer}>
            {ad.is_urgent && (
              <View style={[styles.badge, styles.badgeUrgent]}>
                <Text style={styles.badgeText}>URGENT</Text>
              </View>
            )}
            {ad.is_featured && (
              <View style={[styles.badge, styles.badgeFeatured]}>
                <Text style={styles.badgeText}>FEATURED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={2}>{ad.title}</Text>
          </View>

          <Text style={styles.price}>{ad.price}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color="#94A3B8" />
            <Text style={styles.locationText} numberOfLines={1}>{ad.location || "Sri Lanka"}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={14} color="#64748B" />
              <Text style={styles.statText}>{ad.views || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="heart-outline" size={14} color="#64748B" />
              <Text style={styles.statText}>{ad.likes || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <StatusBadge status={mapStatus} />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        {ad.status === 'pending_payment' ? (
          <TouchableOpacity
            style={styles.mainAction}
            onPress={() => router.push({
              pathname: '/payments/payment' as any,
              params: ad.adType === 'rental' ? { rentalAdId: ad.id } : { adId: ad.id }
            })}
          >
            <Ionicons name="card-outline" size={18} color={COLORS.primary} />
            <Text style={styles.mainActionText}>Resume Payment</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={styles.mainAction}
              onPress={() => router.push(ad.adType === 'rental' ? (`/cars/rental/${ad.id}` as any) : (`/cars/review?id=${ad.id}` as any))}
            >
              <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
              <Text style={styles.mainActionText}>View Ad</Text>
            </TouchableOpacity>

            <View style={styles.actionDivider} />

            {mapStatus === 'active' ? (
              <TouchableOpacity
                style={[styles.mainAction, styles.boostAction]}
                onPress={() => router.push({ pathname: '/ads/boost/[id]' as any, params: { id: ad.id } })}
              >
                <View style={styles.boostIconContainer}>
                  <Ionicons name="rocket" size={16} color="#0891B2" />
                </View>
                <Text style={[styles.mainActionText, { color: '#0891B2' }]}>Boost Ad</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.mainAction}
                onPress={() => router.push(ad.adType === 'rental' ? (`/cars/create-rental-ad?id=${ad.id}` as any) : (`/ads/edit-car?id=${ad.id}` as any))}
              >
                <Ionicons name="create-outline" size={18} color="#64748B" />
                <Text style={[styles.mainActionText, { color: '#64748B' }]}>Edit</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.deleteAction}
          onPress={() => router.push(ad.adType === 'rental' ? (`/ads/delete-rental?id=${ad.id}` as any) : (`/ads/delete-car?id=${ad.id}` as any))}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Banned Info */}
      {ad.status === 'banned' && (
        <View style={styles.warningBox}>
          <Ionicons name="alert-circle" size={16} color="#B91C1C" />
          <Text style={styles.warningText}>
            Ad Banned: {ad.ban_reason || "Policy violation"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FBFCFF',
    borderWidth: 1.5,
  },
  mainContent: {
    flexDirection: 'row',
    padding: 14,
  },
  imageSection: {
    position: 'relative',
    width: 120,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectionOverlayActive: {
    shadowOpacity: 0,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeUrgent: {
    backgroundColor: '#EF4444',
  },
  badgeFeatured: {
    backgroundColor: '#F59E0B',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  infoSection: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  actionSection: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    backgroundColor: '#FAFBFF',
    paddingVertical: 10,
  },
  mainAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mainActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  deleteAction: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  warningText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '600',
    flex: 1,
  },
  boostAction: {
    backgroundColor: '#0891B208',
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  boostIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0891B215',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
