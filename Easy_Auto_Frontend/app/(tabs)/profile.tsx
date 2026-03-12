import ProfileHeader from '@/components/ProfileHeader';
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
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from '@/utils/api';

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
          listings: response.data.listings || 0,
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
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = COLORS.primary,
    iconBg,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
    iconBg?: string;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <LinearGradient
          colors={iconBg ? [iconBg, iconBg] : [`${color}15`, `${color}25`]}
          style={styles.settingIcon}
        >
          <Ionicons name={icon} size={22} color={color} />
        </LinearGradient>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={20} color={COLORS.text.muted} />
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, color }: any) => (
    <View style={styles.statCard}>
      <LinearGradient
        colors={[`${color}15`, `${color}25`]}
        style={styles.statIconContainer}
      >
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </LinearGradient>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Profile" showProfileCard={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            progressViewOffset={180}
          />
        }
      >
        {/* Quick Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="car-multiple"
            value={loading ? '...' : stats.listings}
            label="My Listings"
            color={COLORS.primary}
          />
          <StatCard
            icon="heart"
            value={loading ? '...' : stats.saved}
            label="Saved"
            color="#3B82F6"
          />
          <StatCard
            icon="eye"
            value={loading ? '...' : stats.views}
            label="Profile Views"
            color="#60A5FA"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleMenuItemPress('/ads/my-ads')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="megaphone" size={28} color={COLORS.white} />
                <Text style={styles.quickActionText}>My Ads</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleMenuItemPress('/packages/subscriptions')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#60A5FA', '#3B82F6']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="ribbon" size={28} color={COLORS.white} />
                <Text style={styles.quickActionText}>Premium</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleMenuItemPress('/payments/payment-history')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="wallet" size={28} color={COLORS.white} />
                <Text style={styles.quickActionText}>Payments</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleMenuItemPress('/profile/ratings')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#2563EB', '#1D4ED8']}
                style={styles.quickActionGradient}
              >
                <Ionicons name="star" size={28} color={COLORS.white} />
                <Text style={styles.quickActionText}>Ratings</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your profile information"
              onPress={() => handleMenuItemPress('/profile/edit-profile')}
              color={COLORS.primary}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="location-outline"
              title="Address"
              subtitle="Manage your saved addresses"
              onPress={() => handleMenuItemPress('/profile/address')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Verification"
              subtitle="Verify your account"
              onPress={() => { }}
              color="#60A5FA"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage alerts and updates"
              onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => handleMenuItemPress('/payments/payment-methods')}
              color="#60A5FA"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy & Security"
              subtitle="Control your data and privacy"
              onPress={() => handleMenuItemPress('/settings/privacy-policy')}
              color="#93C5FD"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="globe-outline"
              title="Language"
              subtitle="English (US)"
              onPress={() => handleMenuItemPress('/settings/select-language')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              subtitle="Coming soon"
              color="#6B7280"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={(value) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDarkMode(value);
                  }}
                  thumbColor={COLORS.white}
                  trackColor={{ true: COLORS.primary, false: '#D1D5DB' }}
                  ios_backgroundColor="#D1D5DB"
                />
              }
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.card}>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              subtitle="Get help with your account"
              onPress={() => handleMenuItemPress('/support/help-support')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="chatbubble-ellipses-outline"
              title="Contact Us"
              subtitle="Reach out to our team"
              onPress={() => handleMenuItemPress('/support/contact-us')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle-outline"
              title="About EasyAuto"
              subtitle="Learn more about us"
              onPress={() => handleMenuItemPress('/settings/about-app')}
              color="#60A5FA"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="people-outline"
              title="Invite Friends"
              subtitle="Share and earn rewards"
              onPress={() => handleMenuItemPress('/support/invite-friend')}
              color="#93C5FD"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="document-text-outline"
              title="Terms & Conditions"
              onPress={() => handleMenuItemPress('/settings/terms-conditions')}
              color="#6B7280"
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>
          <View style={styles.card}>
            <SettingItem
              icon="repeat-outline"
              title="Switch Account"
              subtitle="Change to another account"
              onPress={() => handleMenuItemPress('/settings/switch-account')}
              color="#3B82F6"
            />
            <View style={styles.divider} />
            <SettingItem
              icon="log-out-outline"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              color="#EF4444"
            />
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>EasyAuto v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ in Sri Lanka</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingTop: 220,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.text.muted,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    color: COLORS.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.text.muted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginLeft: 74,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text.muted,
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
});
