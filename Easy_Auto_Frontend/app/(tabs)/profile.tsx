import Header from "@/components/Header";
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
} from 'react-native';
import { api } from '@/utils/api';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import { useToast } from '@/contexts/ToastContext';

export default function ProfileScreen() {
  useProtectedRoute();

  const router = useRouter();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    listings: 0,
    saved: 0,
    views: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get<any>('/api/users/stats');
      if (response.success) {
        setStats({
          listings: response.data.ads || 0,
          saved: response.data.saved || 0,
          views: response.data.views || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserStats();
  };

  const handleMenuItemPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowLogoutConfirm(true);
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = "#374151",
    noBorder = false
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
    noBorder?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, !noBorder && styles.itemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.settingIcon} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, rightElement && { color: '#111827' }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color, isLast }: any) => (
    <View style={[styles.statCard, !isLast && styles.statBorderRight]}>
      <MaterialCommunityIcons name={icon} size={26} color={color} style={{ marginBottom: 6 }} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="My Profile" showBack={true} />

      <BrandedRefreshOverlay refreshing={refreshing} top={120} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            progressBackgroundColor="#fff"
          />
        }
      >
        {/* Professional Full-Width Profile Card */}
        <View style={styles.profileSection}>
          <View style={styles.profileContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/user.jpeg')}
                style={styles.avatar}
              />
              <View style={[styles.statusIndicator, { backgroundColor: user?.is_premium ? '#F59E0B' : '#10B981' }]} />
            </View>
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user?.name || 'EasyAuto User'}</Text>
                {user?.is_premium && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proText}>PRO</Text>
                  </View>
                )}
              </View>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => handleMenuItemPress('/profile/edit-profile')}
          >
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Flat Stats Section */}
        <View style={styles.statsSection}>
          <StatCard
            icon="car-multiple"
            value={loading ? '..' : stats.listings}
            label="ADS"
            color={COLORS.primary}
          />
          <StatCard
            icon="heart"
            value={loading ? '..' : stats.saved}
            label="SAVED"
            color={COLORS.primary}
          />
          <StatCard
            icon="eye"
            value={loading ? '..' : stats.views}
            label="VIEWS"
            color={COLORS.primary}
            isLast
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* Clean, Full-Width Settings List */}
        <View style={styles.listSection}>
          <SettingItem
            icon="location-outline"
            title="Saved Addresses"
            onPress={() => handleMenuItemPress('/profile/address')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Identity Verification"
            onPress={() => { }}
            color={COLORS.primary}
          />
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            color={COLORS.primary}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDarkMode(value);
                }}
                thumbColor="#fff"
                trackColor={{ true: COLORS.primary, false: '#E5E7EB' }}
              />
            }
          />
          <SettingItem
            icon="globe-outline"
            title="App Language"
            onPress={() => handleMenuItemPress('/settings/select-language')}
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />

        <View style={styles.listSection}>
          <SettingItem
            icon="lock-closed-outline"
            title="Privacy & Security"
            onPress={() => handleMenuItemPress('/settings/privacy-policy')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="chatbubbles-outline"
            title="Help & Support"
            onPress={() => handleMenuItemPress('/support/contact-us')}
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />
        
        <View style={styles.listSection}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" style={styles.settingIcon} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          visible={showLogoutConfirm}
          title="Sign Out"
          message="Are you sure you want to sign out?"
          confirmText="Sign Out"
          cancelText="Cancel"
          type="danger"
          onConfirm={async () => {
            setShowLogoutConfirm(false);
            await logout();
            showToast({ message: "Successfully logged out.", type: "info" });
            router.replace("/(tabs)");
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>EasyAuto Enterprise v1.2.0</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  proBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editBtn: {
    width: '100%',
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBorderRight: {
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F3F4F6',
  },
  listSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
    textAlign: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
