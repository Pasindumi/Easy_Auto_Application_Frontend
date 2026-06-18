import Header from '@/components/Header';
import ProfileHeader from '@/components/ProfileHeader';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import COLORS from "@/constants/Colors";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect, useMemo } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  useProtectedRoute();

  const { isDarkMode, toggleTheme, colors } = useTheme();
  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  const router = useRouter();
  const { user, logout } = useAuth();
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
    color = colors.primary,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
  }) => (
    <TouchableOpacity
      style={themeStyles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={themeStyles.settingLeft}>
        <View style={themeStyles.settingIconBox}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={themeStyles.settingTextContainer}>
          <Text style={themeStyles.settingTitle}>{title}</Text>
          {subtitle && <Text style={themeStyles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <View style={themeStyles.chevronBox}>
          <Ionicons name="chevron-forward" size={14} color={isDarkMode ? colors.text.muted : "#CBD5E1"} />
        </View>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={themeStyles.statCard}>
      <MaterialCommunityIcons name={icon} size={24} color={color} style={{ marginBottom: 8 }} />
      <View style={themeStyles.statContent}>
        <Text style={themeStyles.statValueMinimal}>{value}</Text>
        <Text style={themeStyles.statLabelMinimal}>{label}</Text>
      </View>
    </View>
  );

  return (
    <View style={themeStyles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="My Profile" showBack={true} />

      <BrandedRefreshOverlay refreshing={refreshing} top={180} />
      <ScrollView
        style={themeStyles.scrollView}
        contentContainerStyle={themeStyles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            progressBackgroundColor={colors.white}
          />
        }
      >
        {/* Blue Header Section with Overlapping White Card */}
        <View style={themeStyles.headerHero}>
          <LinearGradient
            colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : ['#235CF8', '#1A4BD3']}
            style={themeStyles.headerBackground}
          />
          <View style={themeStyles.profileInfoCard}>
            <View style={themeStyles.profileMasterContent}>
              <View style={themeStyles.avatarWrapper}>
                <Image
                  source={user?.avatar ? { uri: user.avatar } : require('@/assets/images/user.jpeg')}
                  style={themeStyles.masterAvatar}
                />
              </View>
              <View style={themeStyles.masterInfo}>
                <Text style={themeStyles.masterName}>{user?.name || 'EasyAuto User'}</Text>
                <Text style={themeStyles.masterEmail}>{user?.email}</Text>
                <TouchableOpacity
                  style={themeStyles.editProfilePill}
                  onPress={() => handleMenuItemPress('/profile/edit-profile')}
                >
                  <Ionicons name="create-outline" size={12} color={colors.primary} />
                  <Text style={themeStyles.editProfilePillText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Packed Stats Section */}
        <View style={themeStyles.statsPackedCard}>
          <View style={themeStyles.statItemPacked}>
            <Text style={themeStyles.statValuePacked}>{loading ? '..' : stats.listings}</Text>
            <Text style={themeStyles.statLabelPacked}>Ads</Text>
          </View>
          <View style={themeStyles.statLine} />
          <View style={themeStyles.statItemPacked}>
            <Text style={themeStyles.statValuePacked}>{loading ? '..' : stats.saved}</Text>
            <Text style={themeStyles.statLabelPacked}>Saved</Text>
          </View>
          <View style={themeStyles.statLine} />
          <View style={themeStyles.statItemPacked}>
            <Text style={themeStyles.statValuePacked}>{loading ? '..' : stats.views}</Text>
            <Text style={themeStyles.statLabelPacked}>Views</Text>
          </View>
        </View>

        {/* Clean Settings List */}
        <View style={themeStyles.settingsWrapper}>
          <View style={themeStyles.card}>
            <SettingItem
              icon="location-outline"
              title="Saved Addresses"
              onPress={() => handleMenuItemPress('/profile/address')}
            />
            <View style={themeStyles.itemDivider} />

            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
            />
            <View style={themeStyles.itemDivider} />

            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              rightElement={
                <Switch
                  value={isDarkMode}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleTheme(value);
                  }}
                  thumbColor="#fff"
                  trackColor={{ true: colors.primary, false: isDarkMode ? '#1E293B' : '#E2E8F0' }}
                />
              }
            />
            <View style={themeStyles.itemDivider} />

            <SettingItem
              icon="globe-outline"
              title="App Language"
              onPress={() => handleMenuItemPress('/settings/select-language')}
            />
            <View style={themeStyles.itemDivider} />

            <SettingItem
              icon="lock-closed-outline"
              title="Privacy & Security"
              onPress={() => handleMenuItemPress('/settings/privacy-policy')}
            />
            <View style={themeStyles.itemDivider} />

            <SettingItem
              icon="chatbubbles-outline"
              title="Help & Support"
              onPress={() => handleMenuItemPress('/support/contact-us')}
            />
          </View>

          <TouchableOpacity style={themeStyles.logoutFullBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={themeStyles.logoutFullText}>Sign Out</Text>
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
        <View style={themeStyles.versionContainer}>
          <Text style={themeStyles.versionText}>EasyAuto Enterprise v1.2.0</Text>
          <Text style={themeStyles.versionSubtext}>Crafted for Excellence • Sri Lanka 🇱🇰</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerHero: {
    position: 'relative',
    marginBottom: 16,
  },
  headerBackground: {
    position: 'absolute',
    top: -100,
    left: 0,
    right: 0,
    height: 180,
  },
  profileInfoCard: {
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 5,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
    marginTop: -15,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
  },
  masterStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  masterStatusDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
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
    fontSize: 15,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.4,
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
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '500',
    marginBottom: 4,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? colors.backgroundMuted : '#EBF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    alignSelf: 'flex-start',
    gap: 4,
  },
  editProfilePillText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    alignSelf: 'flex-start',
    gap: 4,
    marginTop: 4,
  },
  premiumBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
  },
  editProfileText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  statsPackedCard: {
    flexDirection: 'row',
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 12,
    backgroundColor: isDarkMode ? colors.backgroundSecondary : '#EFF6FF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
    alignItems: 'center',
  },
  statCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  statItemPacked: {
    flex: 1,
    alignItems: 'center',
  },
  statValuePacked: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
  },
  statLabelPacked: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statLine: {
    width: 1,
    height: '60%',
    backgroundColor: isDarkMode ? colors.border : '#BFDBFE',
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
    color: colors.text.primary,
  },
  statLabelMinimal: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text.muted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '800',
    marginBottom: 14,
    marginLeft: 4,
  },
  settingsWrapper: {
    marginHorizontal: 10,
    marginBottom: 24,
  },
  card: {
    paddingVertical: 8,
    borderRadius: 5,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
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
    borderRadius: 5,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.primary,
  },
  settingSubtitle: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 2,
    fontWeight: '500',
  },
  chevronBox: {
    width: 24, height: 24,
    borderRadius: 6,
    backgroundColor: isDarkMode ? colors.backgroundMuted : '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutFullBtn: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#FEF2F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#FEE2E2',
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
    color: colors.text.muted,
  },
  versionSubtext: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 4,
    fontWeight: '600',
  },
});

