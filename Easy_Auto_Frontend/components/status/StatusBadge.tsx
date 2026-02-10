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
    icon: 'checkmark-circle',
    color: '#10B981',
    bgColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  draft: {
    label: 'Draft',
    icon: 'document-text',
    color: '#FBBF24',
    bgColor: '#fff2beff',
    borderColor: '#ffe88dff',
  },
  paused: {
    label: 'Paused',
    // icon: 'alert-circle',
    icon: 'pause-circle',
    color: '#EF4444',
    bgColor: '#fff2f2ff',
    borderColor: '#FECACA',
  },
  expired: {
    label: 'Paused',
    icon: 'pause-circle',
    color: '#EF4444',
    bgColor: '#fff1f1ff',
    borderColor: '#ffbcbcff',
  },
  banned: {
    label: 'Banned',
    icon: 'close-circle',
    color: '#000000',
    bgColor: '#e5e7eb',
    borderColor: '#9ca3af',
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
      {/* Status icon */}
      <Ionicons
        name={cfg.icon}
        size={14}
        color={cfg.color}
        style={styles.icon}
      />

      {/* Status text */}
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});
