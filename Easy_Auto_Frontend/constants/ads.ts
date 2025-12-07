import { AdStatus } from '@/types/ad.types';

export const STATUS_FILTERS: { key: AdStatus; label: string; icon: string; color: string; gradient: string[] }[] = [
  { key: 'all', label: 'All Ads', icon: 'grid-outline', color: '#3B82F6', gradient: ['#3B82F6', '#2563EB'] },
  { key: 'pending', label: 'Pending', icon: 'time-outline', color: '#F59E0B', gradient: ['#F59E0B', '#D97706'] },
  { key: 'active', label: 'Active', icon: 'checkmark-circle-outline', color: '#10B981', gradient: ['#10B981', '#059669'] },
  { key: 'rejected', label: 'Rejected', icon: 'close-circle-outline', color: '#EF4444', gradient: ['#EF4444', '#DC2626'] },
  { key: 'expired', label: 'Expired', icon: 'alert-circle-outline', color: '#6B7280', gradient: ['#6B7280', '#4B5563'] },
];
