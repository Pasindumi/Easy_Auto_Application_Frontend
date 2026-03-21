import Header from "@/components/Header";
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
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { COLORS } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [locationSharing, setLocationSharing] = useState(true);

  const clearCache = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear app cache? This will free up 24.5 MB of space.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          onPress: () => Alert.alert("Success", "Cache cleared successfully.") 
        }
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
    isDestructive = false
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
    isDestructive?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, { backgroundColor: isDestructive ? '#FEF2F2' : `${color}10` }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : color} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, isDestructive && { color: '#EF4444' }]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? (
        rightElement
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="App Settings" showBack={true} />

      <SafeAreaView style={styles.safe}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Personal & Account</Text>
            <View style={styles.card}>
              <SettingItem
                icon="person-outline"
                title="Edit Profile"
                subtitle="Manage name, email and contact details"
                onPress={() => router.push('/profile/edit-profile')}
                color="#3b82f6"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="location-outline"
                title="Addresses"
                subtitle="Saved billing & shipping locations"
                onPress={() => router.push('/profile/address')}
                color="#6366f1"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="shield-checkmark-outline"
                title="Security"
                subtitle="Password and biometric login"
                onPress={() => {}}
                color="#10b981"
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Communication Preferences</Text>
            <View style={styles.card}>
              <SettingItem
                icon="notifications-outline"
                title="Push Notifications"
                subtitle="Get alerts for messages and price drops"
                color="#f59e0b"
                rightElement={
                  <Switch
                    value={notifications}
                    onValueChange={(val) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setNotifications(val);
                    }}
                    thumbColor="#fff"
                    trackColor={{ true: COLORS.primary, false: '#E2E8F0' }}
                  />
                }
              />
              <View style={styles.divider} />
              <SettingItem
                icon="mail-outline"
                title="Email Marketing"
                color="#06b6d4"
                rightElement={
                    <Switch
                      value={true}
                      onValueChange={() => {}}
                      thumbColor="#fff"
                      trackColor={{ true: COLORS.primary, false: '#E2E8F0' }}
                    />
                }
              />
            </View>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>App Preferences</Text>
            <View style={styles.card}>
              <SettingItem
                icon="globe-outline"
                title="Language"
                subtitle="English (US)"
                onPress={() => router.push('/settings/select-language')}
                color="#8b5cf6"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="moon-outline"
                title="Appearance"
                subtitle="Dark mode & themes"
                color="#475569"
                rightElement={
                  <Switch
                    value={darkMode}
                    onValueChange={(val) => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setDarkMode(val);
                    }}
                    thumbColor="#fff"
                    trackColor={{ true: COLORS.primary, false: '#E2E8F0' }}
                  />
                }
              />
              <View style={styles.divider} />
              <SettingItem
                icon="speedometer-outline"
                title="Units"
                subtitle="Kilometers (km)"
                onPress={() => {}}
                color="#ec4899"
              />
            </View>
          </View>

          {/* Privacy & Data */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Privacy & Data</Text>
            <View style={styles.card}>
              <SettingItem
                icon="location-sharp"
                title="Location Access"
                color="#f43f5e"
                rightElement={
                    <Switch
                      value={locationSharing}
                      onValueChange={(val) => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setLocationSharing(val);
                      }}
                      thumbColor="#fff"
                      trackColor={{ true: COLORS.primary, false: '#E2E8F0' }}
                    />
                }
              />
              <View style={styles.divider} />
              <SettingItem
                icon="trash-outline"
                title="Clear Cache"
                subtitle="Free up 24.5 MB of space"
                onPress={clearCache}
                color="#64748b"
              />
              <View style={styles.divider} />
              <SettingItem
                icon="document-text-outline"
                title="Privacy Policy"
                onPress={() => router.push('/support/privacy-policy')}
                color="#94a3b8"
              />
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
             <Text style={styles.sectionLabel}>More about EasyAuto</Text>
             <View style={styles.card}>
               <SettingItem
                 icon="information-circle-outline"
                 title="About Version"
                 subtitle="EasyAuto v2.4.1 (Stable)"
                 onPress={() => router.push('/settings/about-app')}
                 color="#64748b"
               />
               <View style={styles.divider} />
               <SettingItem
                 icon="help-circle-outline"
                 title="Help Center"
                 onPress={() => router.push('/support/help-center')}
                 color="#64748b"
               />
               <View style={styles.divider} />
               <SettingItem
                 icon="share-outline"
                 title="Share with Friends"
                 onPress={() => router.push('/settings/invite-friends')}
                 color="#64748b"
               />
             </View>
          </View>

          {/* Actions */}
          <View style={styles.actionSection}>
             <TouchableOpacity 
                style={styles.logoutBtn}
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
             >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text style={styles.logoutBtnText}>Sign Out</Text>
             </TouchableOpacity>

          </View>

          <View style={styles.footer}>
             <Text style={styles.footerText}>Made with ❤️ in Sri Lanka</Text>
             <Text style={styles.footerSub}>© 2024 EasyAuto Marketplace. All rights reserved.</Text>
          </View>
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  settingSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 78,
  },
  actionSection: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fee2e2',
    gap: 10,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  footerSub: {
    fontSize: 10,
    color: '#cbd5e1',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  }
});