import Header from "@/components/Header";
import { typography } from "@/components/theme";
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

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
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
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <View style={localStyles.headerWrap}>
        <View style={localStyles.header}>
          <View style={localStyles.headerLeft}>
            <Ionicons name="settings-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={localStyles.headerTitle}>Settings</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <SettingItem
              icon="person-outline"
              title="Edit Profile"
              subtitle="Name, Email, Phone number"
              onPress={() => router.push('/profile/edit-profile')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="location-outline"
              title="Manage Address"
              subtitle="Shipping and billing addresses"
              onPress={() => router.push('/profile/address')}
            />
          </View>
        </View>

        {/* Notifications & Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Notifications</Text>
          <View style={styles.card}>
            <SettingItem
              icon="notifications-outline"
              title="Push Notifications"
              rightElement={
                <Switch
                  value={notifications}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setNotifications(val);
                  }}
                  thumbColor="#fff"
                  trackColor={{ true: '#235CF8', false: '#d1d5db' }}
                />
              }
            />
            <View style={styles.divider} />
            <SettingItem
              icon="lock-closed-outline"
              title="Privacy Policy"
              subtitle="Manage your privacy settings"
              onPress={() => router.push('/settings/privacy-policy')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="shield-checkmark-outline"
              title="Security Settings"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* Preference */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <View style={styles.card}>
            <SettingItem
              icon="globe-outline"
              title="Language"
              subtitle="English (US)"
              onPress={() => router.push('/settings/select-language')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="moon-outline"
              title="Dark Mode"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setDarkMode(val);
                  }}
                  thumbColor="#fff"
                  trackColor={{ true: '#235CF8', false: '#d1d5db' }}
                />
              }
            />
          </View>
        </View>

        {/* Support & Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          <View style={styles.card}>
            <SettingItem
              icon="help-circle-outline"
              title="Help & Support"
              onPress={() => router.push('/support/help-support')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="information-circle-outline"
              title="About Easy Auto"
              onPress={() => router.push('/settings/about-app')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="star-outline"
              title="Rate our App"
              onPress={() => { }}
            />
          </View>
        </View>

        {/* More */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          <View style={styles.card}>
            <SettingItem
              icon="people-outline"
              title="Invite Friends"
              onPress={() => router.push('/settings/invite-friends')}
            />
            <View style={styles.divider} />
            <SettingItem
              icon="repeat-outline"
              title="Switch Account"
              onPress={() => router.push('/settings/switch-account')}
            />
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
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
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    ...typography.body,
    fontWeight: '700',
    color: '#EF4444',
  },
  deleteButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 8,
  },
  deleteText: {
    ...typography.caption,
    color: '#EF4444',
    fontWeight: '600',
  },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});