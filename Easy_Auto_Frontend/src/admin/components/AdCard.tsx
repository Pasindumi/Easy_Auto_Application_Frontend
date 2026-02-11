
import { Ad } from '@/types/ad.types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { STATUS_FILTERS } from '@/constants/ads';

interface AdCardProps {
  item: Ad;
  isSelected: boolean;
  isLast: boolean;
  onToggleSelect: (id: string) => void;
  onView: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const AdCard = ({ 
  item, 
  isSelected, 
  isLast, 
  onToggleSelect, 
  onView,
  onApprove,
  onReject,
  onDelete 
}: AdCardProps) => {
  const statusConfig = STATUS_FILTERS.find(f => f.key === item.status) || STATUS_FILTERS[0];

  return (
    <View style={[styles.adCard, isLast && styles.lastCard]}>
      <TouchableOpacity
        style={styles.adCardTouchable}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onView(item.id);
        }}
        activeOpacity={0.95}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onToggleSelect(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
            {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
        </TouchableOpacity>

        <Image source={item.image} style={styles.adImage} resizeMode="cover" />

        <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
          <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
        </View>

        <View style={styles.adContent}>
          <View style={styles.adHeader}>
            <View style={styles.adTitleSection}>
              <Text style={styles.adTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.adPrice}>{item.price}</Text>
            </View>
          </View>

          <View style={styles.adMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color="#6B7280" />
              <Text style={styles.metaText} numberOfLines={1}>{item.userName}</Text>
            </View>
          </View>

          <View style={styles.adStats}>
            <View style={styles.statItem}>
              <Ionicons name="eye-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{item.views.toLocaleString()}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="heart-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{item.messages}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
              <Text style={styles.statText}>{new Date(item.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            {item.status === 'pending' && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.approveButton]}
                  onPress={() => onApprove?.(item.id)}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={() => onReject?.(item.id)}
                >
                  <Ionicons name="close-circle" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Reject</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => onView(item.id)}
            >
              <Ionicons name="eye-outline" size={16} color="#235CF8" />
              <Text style={[styles.actionButtonText, { color: '#235CF8' }]}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete?.(item.id)}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  adCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  lastCard: {
    marginBottom: 0,
  },
  adCardTouchable: {
    position: 'relative',
  },
  checkboxContainer: {
    position: 'absolute',
    top: 14,
    left: 14,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#235CF8',
    borderColor: '#235CF8',
  },
  adImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F3F4F6',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  adContent: {
    padding: 18,
  },
  adHeader: {
    marginBottom: 14,
  },
  adTitleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  adTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  adPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#235CF8',
    letterSpacing: -0.5,
  },
  adMeta: {
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  adStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 6,
  },
  approveButton: {
    backgroundColor: '#10B981',
  },
  rejectButton: {
    backgroundColor: '#F59E0B',
  },
  viewButton: {
    backgroundColor: '#EEF2FF',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
    flex: 0,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

export default memo(AdCard);
