import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import StatusBadge from '../status/StatusBadge';
import { useTheme } from '@/contexts/ThemeContext';

interface AdCardProps {
  ad: any;
  selected: boolean;
  toggleSelect: (id: string) => void;
  onResume?: (ad: any) => void;
}

export default function AdCard({ ad, selected, toggleSelect, onResume }: AdCardProps) {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const mapStatus: 'active' | 'draft' | 'paused' | 'expired' | 'banned' | 'deleted' =
    ad.status === 'active'
      ? 'active'
      : (ad.status === 'draft' || ad.status === 'pending_payment')
        ? 'draft'
        : ad.status === 'paused'
          ? 'paused'
          : ad.status === 'deleted'
            ? 'deleted'
            : ad.status === 'banned'
              ? 'banned'
              : 'expired';

  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  return (
    <View style={[themeStyles.card, selected && themeStyles.cardSelected]}>
      <View style={themeStyles.mainContent}>
        {/* Image Section */}
        <View style={themeStyles.imageSection}>
          <Image
            source={typeof ad.image === 'string' ? { uri: ad.image } : ad.image}
            style={themeStyles.image}
          />

          {/* Selection Overlay */}
          <TouchableOpacity
            onPress={() => toggleSelect(ad.id)}
            style={[themeStyles.selectionOverlay, selected && themeStyles.selectionOverlayActive]}
          >
            <Ionicons
              name={selected ? "checkmark-circle" : "ellipse-outline"}
              size={22}
              color={selected ? colors.primary : "rgba(255,255,255,0.8)"}
            />
          </TouchableOpacity>

          {/* Featured/Urgent Badges */}
          <View style={themeStyles.badgesContainer}>
            {ad.is_urgent && (
              <View style={[themeStyles.badge, themeStyles.badgeUrgent]}>
                <Text style={themeStyles.badgeText}>URGENT</Text>
              </View>
            )}
            {ad.is_featured && (
              <View style={[themeStyles.badge, themeStyles.badgeFeatured]}>
                <Text style={themeStyles.badgeText}>FEATURED</Text>
              </View>
            )}
          </View>
        </View>

        {/* Info Section */}
        <View style={themeStyles.infoSection}>
          <View style={themeStyles.headerRow}>
            <Text style={themeStyles.title} numberOfLines={2}>{ad.title}</Text>
          </View>

          <Text style={themeStyles.price}>{ad.price}</Text>

          <View style={themeStyles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.text.muted} />
            <Text style={themeStyles.locationText} numberOfLines={1}>{ad.location || "Sri Lanka"}</Text>
          </View>

          <View style={themeStyles.statsRow}>
            <View style={themeStyles.stat}>
              <Ionicons name="eye-outline" size={14} color={colors.text.muted} />
              <Text style={themeStyles.statText}>{ad.views || 0}</Text>
            </View>
            <View style={themeStyles.statDivider} />
            <View style={themeStyles.stat}>
              <Ionicons name="heart-outline" size={14} color={colors.text.muted} />
              <Text style={themeStyles.statText}>{ad.likes || 0}</Text>
            </View>
            <View style={themeStyles.statDivider} />
            <StatusBadge status={mapStatus} />
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={themeStyles.actionSection}>
        {ad.status === 'pending_payment' ? (
          <TouchableOpacity
            style={themeStyles.mainAction}
            onPress={() => router.push({
              pathname: '/payments/payment' as any,
              params: ad.adType === 'rental' ? { rentalAdId: ad.id } : { adId: ad.id }
            })}
          >
            <Ionicons name="card-outline" size={18} color={colors.primary} />
            <Text style={themeStyles.mainActionText}>Resume Payment</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={themeStyles.mainAction}
              onPress={() => router.push(ad.adType === 'rental' ? (`/cars/rental/${ad.id}` as any) : (`/cars/review?id=${ad.id}` as any))}
            >
              <Ionicons name="eye-outline" size={18} color={colors.primary} />
              <Text style={themeStyles.mainActionText}>View Ad</Text>
            </TouchableOpacity>

            <View style={themeStyles.actionDivider} />

            {mapStatus === 'active' ? (
              <TouchableOpacity
                style={[themeStyles.mainAction, themeStyles.boostAction]}
                onPress={() => router.push({ pathname: '/ads/boost/[id]' as any, params: { id: ad.id } })}
              >
                <View style={themeStyles.boostIconContainer}>
                  <Ionicons name="rocket" size={16} color="#0891B2" />
                </View>
                <Text style={[themeStyles.mainActionText, { color: '#0891B2' }]}>Boost Ad</Text>
              </TouchableOpacity>
            ) : mapStatus === 'paused' ? (
              <TouchableOpacity
                style={[themeStyles.mainAction, themeStyles.resumeAction]}
                onPress={() => onResume?.(ad)}
              >
                <Ionicons name="play-circle-outline" size={18} color={colors.status.success} />
                <Text style={[themeStyles.mainActionText, { color: colors.status.success }]}>Resume Ad</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={themeStyles.mainAction}
                onPress={() => router.push(ad.adType === 'rental' ? (`/cars/create-rental-ad?id=${ad.id}` as any) : (`/ads/edit-car?id=${ad.id}` as any))}
              >
                <Ionicons name="create-outline" size={18} color={colors.text.muted} />
                <Text style={[themeStyles.mainActionText, { color: colors.text.muted }]}>Edit</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={themeStyles.actionDivider} />

        <TouchableOpacity
          style={themeStyles.deleteAction}
          onPress={() => router.push(ad.adType === 'rental' ? (`/ads/delete-rental?id=${ad.id}` as any) : (`/ads/delete-car?id=${ad.id}` as any))}
        >
          <Ionicons name="trash-outline" size={18} color={colors.status.danger} />
        </TouchableOpacity>
      </View>

      {/* Banned Info */}
      {ad.status === 'banned' && (
        <View style={themeStyles.warningBox}>
          <Ionicons name="alert-circle" size={16} color={colors.status.danger} />
          <Text style={themeStyles.warningText}>
            Ad Banned: {ad.ban_reason || "Policy violation"}
          </Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#E0F2FE',
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: isDarkMode ? colors.backgroundMuted : '#FBFCFF',
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
    borderRadius: 5,
    backgroundColor: colors.backgroundMuted,
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
    borderRadius: 5,
  },
  badgeUrgent: {
    backgroundColor: colors.status.danger,
  },
  badgeFeatured: {
    backgroundColor: colors.status.warning,
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
    color: colors.text.primary,
    lineHeight: 20,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
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
    color: colors.text.muted,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.text.muted,
    fontWeight: '600',
  },
  statDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  actionSection: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: isDarkMode ? colors.backgroundMuted : '#FAFBFF',
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
    color: colors.primary,
  },
  deleteAction: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    alignSelf: 'center',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
  },
  warningText: {
    fontSize: 11,
    color: colors.status.danger,
    fontWeight: '600',
    flex: 1,
  },
  boostAction: {
    backgroundColor: isDarkMode ? 'rgba(8, 145, 178, 0.1)' : '#0891B208',
    borderRadius: 5,
    marginHorizontal: 4,
    paddingVertical: 4,
  },
  boostIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 5,
    backgroundColor: isDarkMode ? 'rgba(8, 145, 178, 0.2)' : '#0891B215',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumeAction: {
    backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : colors.status.successLight,
    borderRadius: 5,
    marginHorizontal: 4,
    paddingVertical: 4,
  },
});

