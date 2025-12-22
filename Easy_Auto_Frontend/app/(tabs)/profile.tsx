// app/(tabs)/profile.tsx
import ProfileHeader from '@/components/ProfileHeader';
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

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={20} color="#235CF8" />
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
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
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ProfileHeader title="Profile" showProfileCard={true} />
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >

          {/* Quick Stats Section */}
          <View style={[styles.statsSection, { marginTop: 20 }]}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Views</Text>
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <MenuItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Update your profile information"
              onPress={() => handleMenuItemPress('/profile/edit-profile')}
            />

            <MenuItem
              icon="location-outline"
              title="Address"
              subtitle="Update your location"
              onPress={() => handleMenuItemPress('/profile/address')}
            />
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage alerts and updates"
              onPress={() => handleMenuItemPress('/notifications/notifications-setting')}
            />

            <MenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your payments"
              onPress={() => handleMenuItemPress('/payments/payment-methods')}
            />

            <MenuItem
              icon="lock-closed-outline"
              title="Privacy and Security"
              subtitle="Control your data"
              onPress={() => handleMenuItemPress('/settings/privacy-policy')}
            />

            <MenuItem
              icon="globe-outline"
              title="Language"
              subtitle="English (US)"
              onPress={() => handleMenuItemPress('/settings/select-language')}
            />

            <MenuItem
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

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>

            <MenuItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => handleMenuItemPress('/support/help-support')}
            />

            <MenuItem
              icon="information-circle-outline"
              title="About this App"
              onPress={() => handleMenuItemPress('/settings/about-app')}
            />

            <MenuItem
              icon="people-outline"
              title="Invite Friends"
              onPress={() => handleMenuItemPress('/support/invite-friend')}
            />

            <MenuItem
              icon="repeat-outline"
              title="Switch Accounts"
              onPress={() => handleMenuItemPress('/settings/switch-account')}
            />
          </View>

          {/* Logout Button */}
          <View style={styles.logoutSection}>
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
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    paddingTop: 180, // Account for header with profile card
    paddingBottom: 100, // Account for tab bar
  },
  // Quick Stats Section
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#235CF8',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  // Sections
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  // Menu Items
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Logout Section
  logoutSection: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    letterSpacing: -0.2,
  },
});
