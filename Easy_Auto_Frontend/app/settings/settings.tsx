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
  Alert
} from 'react-native';
import COLORS from "@/constants/Colors";

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
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
    color = "#374151",
    isDestructive = false,
    noBorder = false
  }: {
    icon: any;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    color?: string;
    isDestructive?: boolean;
    noBorder?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.settingItem, !noBorder && styles.itemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={isDestructive ? '#EF4444' : color} style={styles.settingIcon} />
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, isDestructive && { color: '#EF4444' }, rightElement && { color: '#111827' }]}>{title}</Text>
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

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="App Settings" showBack={true} />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionDivider} />

        {/* Account Section */}
        <View style={styles.listSection}>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Manage name, email and contact details"
            onPress={() => router.push('/profile/edit-profile')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="location-outline"
            title="Addresses"
            subtitle="Saved billing & shipping locations"
            onPress={() => router.push('/profile/address')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Security"
            subtitle="Password and biometric login"
            onPress={() => {}}
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* Notifications Section */}
        <View style={styles.listSection}>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Get alerts for messages and price drops"
            color={COLORS.primary}
            rightElement={
              <Switch
                value={notifications}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setNotifications(val);
                }}
                thumbColor="#fff"
                trackColor={{ true: COLORS.primary, false: '#E5E7EB' }}
              />
            }
          />
          <SettingItem
            icon="mail-outline"
            title="Email Marketing"
            color={COLORS.primary}
            noBorder
            rightElement={
              <Switch
                value={true}
                onValueChange={() => {}}
                thumbColor="#fff"
                trackColor={{ true: COLORS.primary, false: '#E5E7EB' }}
              />
            }
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* App Settings */}
        <View style={styles.listSection}>
          <SettingItem
            icon="globe-outline"
            title="Language"
            subtitle="English (US)"
            onPress={() => router.push('/settings/select-language')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="moon-outline"
            title="Appearance"
            subtitle="Dark mode & themes"
            color={COLORS.primary}
            rightElement={
              <Switch
                value={darkMode}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDarkMode(val);
                }}
                thumbColor="#fff"
                trackColor={{ true: COLORS.primary, false: '#E5E7EB' }}
              />
            }
          />
          <SettingItem
            icon="speedometer-outline"
            title="Units"
            subtitle="Kilometers (km)"
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* Privacy & Data */}
        <View style={styles.listSection}>
          <SettingItem
            icon="location-sharp"
            title="Location Access"
            color={COLORS.primary}
            rightElement={
              <Switch
                value={locationSharing}
                onValueChange={(val) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setLocationSharing(val);
                }}
                thumbColor="#fff"
                trackColor={{ true: COLORS.primary, false: '#E5E7EB' }}
              />
            }
          />
          <SettingItem
            icon="trash-outline"
            title="Clear Cache"
            subtitle="Free up 24.5 MB of space"
            onPress={clearCache}
            color={COLORS.primary}
          />
          <SettingItem
            icon="document-text-outline"
            title="Privacy Policy"
            onPress={() => router.push('/support/privacy-policy')}
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* About */}
        <View style={styles.listSection}>
          <SettingItem
            icon="information-circle-outline"
            title="About Version"
            subtitle="EasyAuto v2.4.1 (Stable)"
            onPress={() => router.push('/settings/about-app')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() => router.push('/support/contact-us')}
            color={COLORS.primary}
          />
          <SettingItem
            icon="share-outline"
            title="Share with Friends"
            onPress={() => router.push('/settings/invite-friends')}
            color={COLORS.primary}
            noBorder
          />
        </View>

        <View style={styles.sectionDivider} />

        {/* Actions */}
        <View style={styles.listSection}>
            <TouchableOpacity 
              style={styles.logoutBtn}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            >
              <Ionicons name="log-out-outline" size={22} color="#EF4444" style={styles.settingIcon} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ in Sri Lanka</Text>
          <Text style={styles.footerSub}>© 2024 EasyAuto Marketplace. All rights reserved.</Text>
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
    fontWeight: '700',
  },
  footerSub: {
    fontSize: 10,
    color: '#CBD5E1',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  }
});
