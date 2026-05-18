import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type StatusType = 'active' | 'draft' | 'paused' | 'expired' | 'banned';

interface StatusBadgeProps {
  status: StatusType;
}

interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const STATUS_CONFIG: Record<StatusType, StatusConfig> = {
  active: {
    label: 'Active',
    icon: 'checkmark-circle-outline',
    color: '#059669',
    bgColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  draft: {
    label: 'Draft',
    icon: 'document-outline',
    color: '#D97706',
    bgColor: '#FFFBEB',
    borderColor: '#FEF3C7',
  },
  paused: {
    label: 'Paused',
    icon: 'pause-circle-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  expired: {
    label: 'Paused',
    icon: 'pause-circle-outline',
    color: '#DC2626',
    bgColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  banned: {
    label: 'Banned',
    icon: 'close-circle-outline',
    color: '#111827',
    bgColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: cfg.bgColor,
          borderColor: cfg.borderColor,
        },
      ]}
    >
      <Ionicons
        name={cfg.icon}
        size={13}
        color={cfg.color}
        style={styles.icon}
      />
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});
