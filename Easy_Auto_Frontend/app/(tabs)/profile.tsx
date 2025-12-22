// app/(tabs)/profile.tsx
import ProfileHeader from '@/components/ProfileHeader';
import { typography } from '@/components/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handleMenuItemPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Handle logout logic
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = "#235CF8"
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
        <View style={[styles.settingIcon, { backgroundColor: `${color}10` }]}>
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
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Profile" showProfileCard={true} />

      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Stats Section */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>8</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Views</Text>
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
              />
              <View style={styles.divider} />
              <SettingItem
                icon="location-outline"
                title="Address"
                subtitle="Update your location"
                onPress={() => handleMenuItemPress('/profile/address')}
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
              />
              <View style={styles.divider} />
              <SettingItem
                icon="card-outline"
                title="Payment Methods"
                subtitle="Manage your payments"
                onPress={() => handleMenuItemPress('/payments/payment-methods')}
              />
              <View style={styles.divider} />
              <SettingItem
                icon="lock-closed-outline"
                title="Privacy and Security"
                subtitle="Control your data"
                onPress={() => handleMenuItemPress('/settings/privacy-policy')}
              />
              <View style={styles.divider} />
              <SettingItem
                icon="globe-outline"
                title="Language"
                subtitle="English (US)"
                onPress={() => handleMenuItemPress('/settings/select-language')}
              />
              <View style={styles.divider} />
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
                    thumbColor="#FFFFFF"
                    trackColor={{ true: '#235CF8', false: '#D1D5DB' }}
                  />
                }
              />
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.card}>
              <SettingItem
                icon="help-circle-outline"
                title="Help & Support"
                onPress={() => handleMenuItemPress('/support/help-support')}
              />
              <View style={styles.divider} />
              <SettingItem
                icon="information-circle-outline"
                title="About this App"
                onPress={() => handleMenuItemPress('/settings/about-app')}
              />
              <View style={styles.divider} />
              <SettingItem
                icon="people-outline"
                title="Invite Friends"
                onPress={() => handleMenuItemPress('/settings/invite-friends')}
              />
              <View style={styles.divider} />
              <SettingItem
                icon="repeat-outline"
                title="Switch Accounts"
                onPress={() => handleMenuItemPress('/settings/switch-account')}
              />
            </View>
          </View>

          {/* Logout Button */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.logoutIconContainer}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingTop: 180, // Account for header with profile card
    paddingBottom: 100, // Account for tab bar
  },
  // Quick Stats Card
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.subheading,
    fontSize: 20,
    color: '#235CF8',
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  // Sections
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...typography.subheading,
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '600',
    color: '#111827',
  },
  settingSubtitle: {
    ...typography.caption,
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 64,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    ...typography.body,
    fontWeight: '700',
    color: '#EF4444',
  },
});
