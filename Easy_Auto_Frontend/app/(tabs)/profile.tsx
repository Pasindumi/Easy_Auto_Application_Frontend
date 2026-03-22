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
  Image as RNImage,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
        <View style={[styles.settingIconBox, { backgroundColor: `${color}10` }]}>
          <Ionicons name={icon} size={20} color={color} />
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
          <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
        </View>
      )}
    </TouchableOpacity>
  );

  const StatCard = ({ icon, value, label, colors }: any) => (
    <LinearGradient colors={colors} style={styles.statCardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={styles.statIconBoxPremium}>
        <MaterialCommunityIcons name={icon} size={24} color={colors[0]} />
      </View>
      <View style={styles.statContentPremium}>
        <Text style={styles.statValuePremium}>{value}</Text>
        <Text style={styles.statLabelPremium}>{label}</Text>
      </View>
    </LinearGradient>
  );

  const insets = useSafeAreaInsets();

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ProfileHeader title="My Profile" />

      <BrandedRefreshOverlay refreshing={refreshing} top={180} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingTop: 200 }]} // Offset for absolute ProfileHeader
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="transparent"
            colors={["transparent"]}
            progressBackgroundColor="transparent"
          />
        }
      >
        {/* User Identity Card (Clean & Modern) - REMOVED since ProfileHeader has it */}
        <View style={{ height: 10 }} />

        {/* Aesthetic Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard
            icon="car-multiple"
            value={loading ? '..' : stats.listings}
            label="Ads"
            colors={["#6366F1", "#818CF8"]}
          />
          <StatCard
            icon="heart"
            value={loading ? '..' : stats.saved}
            label="Saved"
            colors={["#EC4899", "#F472B6"]}
          />
          <StatCard
            icon="eye"
            value={loading ? '..' : stats.views}
            label="Views"
            colors={["#10B981", "#34D399"]}
          />
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsWrapper}>
          <Text style={styles.sectionLabel}>Account Settings</Text>
          <View style={styles.card}>
            <SettingItem
              icon="location-outline"
              title="Saved Addresses"
              onPress={() => handleMenuItemPress('/profile/address')}
              color="#8B5CF6"
            />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Identity Verification"
              onPress={() => {}}
              color="#10B981"
            />
          </View>

          <Text style={styles.sectionLabel}>Preferences</Text>
          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              title="Notifications"
              onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
              color="#F59E0B"
            />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              color="#64748B"
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
              color="#3B82F6"
            />
          </View>

          <Text style={styles.sectionLabel}>Support & Legal</Text>
          <View style={styles.card}>
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy & Security"
              onPress={() => handleMenuItemPress('/settings/privacy-policy')}
              color="#EF4444"
            />
            <SettingItem
              icon="chatbubbles-outline"
              title="Help & Support"
              onPress={() => handleMenuItemPress('/support/contact-us')}
              color="#10B981"
            />
          </View>

          <TouchableOpacity style={styles.logoutFullBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  profileMasterCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    marginBottom: 20,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#F8FAFC',
  },
  masterStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
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
    fontSize: 20,
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
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 12,
  },
  editProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  editProfileText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCardGradient: {
    flex: 1,
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  statIconBoxPremium: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statContentPremium: {
    alignItems: 'center',
  },
  statValuePremium: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statLabelPremium: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginLeft: 8,
    marginBottom: 10,
    marginTop: 18,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconBox: {
    width: 42, height: 42,
    borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '500',
  },
  chevronBox: {
    width: 28, height: 28,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center', justifyContent: 'center',
  },
  logoutFullBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    height: 56,
    borderRadius: 20,
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
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 40,
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
