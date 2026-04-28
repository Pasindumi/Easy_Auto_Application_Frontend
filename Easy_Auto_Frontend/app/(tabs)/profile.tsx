import Header from '@/components/Header';
import ProfileHeader from '@/components/ProfileHeader';
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
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
      // Fetch user statistics from API
      // This is a placeholder - adjust based on your API
      const response = await api.get<any>('/api/users/stats');
      if (response.success) {
        setStats({
          listings: response.data.ads || 0,  // ✅ backend returns `ads`, not `listings`
          saved: response.data.saved || 0,
          views: response.data.views || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use default values on error
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
    color = COLORS.primary,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIconBox}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <View style={styles.chevronBox}>
          <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
        </View>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={styles.statCard}>
      <MaterialCommunityIcons name={icon} size={24} color={color} style={{ marginBottom: 8 }} />
      <View style={styles.statContent}>
        <Text style={styles.statValueMinimal}>{value}</Text>
        <Text style={styles.statLabelMinimal}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="My Profile" showBack={true} />

      <BrandedRefreshOverlay refreshing={refreshing} top={180} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
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
        {/* User Identity Card (Clean & Modern) */}
        <View style={styles.profileMasterCard}>
          <View style={styles.profileMasterContent}>
            <View style={styles.avatarWrapper}>
              <Image
                source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/user.jpeg')}
                style={styles.masterAvatar}
              />
              <LinearGradient
                colors={user?.is_premium ? ["#FCD34D", "#F59E0B"] : ["#10B981", "#059669"]}
                style={styles.masterStatusDot}
              />
            </View>
            <View style={styles.masterInfo}>
              <View style={styles.masterNameRow}>
                <Text style={styles.masterName}>{user?.name || 'EasyAuto User'}</Text>
                {user?.is_premium && (
                  <LinearGradient colors={["#FCD34D", "#F59E0B"]} style={styles.masterProTag}>
                    <Ionicons name="star" size={10} color="#fff" />
                    <Text style={styles.masterProText}>PRO</Text>
                  </LinearGradient>
                )}
              </View>
              <Text style={styles.masterEmail}>{user?.email}</Text>
              <TouchableOpacity
                style={styles.editProfilePill}
                onPress={() => handleMenuItemPress('/profile/edit-profile')}
              >
                <Ionicons name="create-outline" size={12} color={COLORS.primary} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Aesthetic Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="car-multiple"
            value={loading ? '..' : stats.listings}
            label="Ads"
            color={COLORS.primary}
          />
          <StatCard
            icon="heart"
            value={loading ? '..' : stats.saved}
            label="Saved"
            color={COLORS.primary}
          />
          <StatCard
            icon="eye"
            value={loading ? '..' : stats.views}
            label="Views"
            color={COLORS.primary}
          />
        </View>

        {/* Clean Settings List */}
        <View style={styles.settingsWrapper}>
          <View style={styles.card}>
            <SettingItem
              icon="location-outline"
              title="Saved Addresses"
              onPress={() => handleMenuItemPress('/profile/address')}
            />

            <View style={styles.itemDivider} />
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
            />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDarkMode(value);
                  }}
                  thumbColor="#fff"
                  trackColor={{ true: COLORS.primary, false: '#E2E8F0' }}
                />
              }
            />
            <SettingItem
              icon="globe-outline"
              title="App Language"
              onPress={() => handleMenuItemPress('/settings/select-language')}
            />
            <View style={styles.itemDivider} />
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy & Security"
              onPress={() => handleMenuItemPress('/settings/privacy-policy')}
            />
            <SettingItem
              icon="chatbubbles-outline"
              title="Help & Support"
              onPress={() => handleMenuItemPress('/support/contact-us')}
            />
          </View>

          <TouchableOpacity style={styles.logoutFullBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.logoutFullText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <ConfirmationModal
          visible={showLogoutConfirm}
          title="Sign Out"
          message="Are you sure you want to sign out? We'll miss you!"
          confirmText="Sign Out"
          cancelText="Stay Logged In"
          type="danger"
          onConfirm={async () => {
            setShowLogoutConfirm(false);
            await logout();
            showToast({ message: "Successfully logged out. See you soon!", type: "info" });
            router.replace("/(tabs)");
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>EasyAuto Enterprise v1.2.0</Text>
          <Text style={styles.versionSubtext}>Crafted for Excellence • Sri Lanka 🇱🇰</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileMasterCard: {
    marginHorizontal: 16,
    padding: 24,
    marginBottom: 24,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  profileMasterContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  masterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
  masterStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#fff',
  },
  masterInfo: {
    flex: 1,
  },
  masterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  masterName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  masterProTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  masterProText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  masterEmail: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  editProfileText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconBoxMinimal: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'center',
  },
  statValueMinimal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  statLabelMinimal: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 14,
    marginLeft: 4,
  },
  settingsWrapper: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBox: {
    width: 36, height: 36,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  chevronBox: {
    width: 24, height: 24,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutFullBtn: {
    marginTop: 16,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutFullText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  versionSubtext: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 4,
    fontWeight: '600',
  },
});
