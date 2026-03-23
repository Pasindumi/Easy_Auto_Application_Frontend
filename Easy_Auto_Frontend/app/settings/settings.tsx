import Header from "@/components/Header";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useTheme } from "../../contexts/ThemeContext";

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { isDarkMode: darkMode, toggleTheme: setDarkMode } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const themeConfig = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : '#fff',
    text: darkMode ? '#f8fafc' : '#1e293b',
    textMuted: darkMode ? '#94a3b8' : '#64748b',
    border: darkMode ? '#334155' : '#f1f5f9',
    iconBgMod: darkMode ? '20' : '10', // hex opacity
  };

  const clearCache = () => { };

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
        <View style={[styles.settingIcon, { backgroundColor: isDestructive ? '#FEF2F2' : `${color}${themeConfig.iconBgMod}` }]}>
          <Ionicons name={icon} size={20} color={isDestructive ? '#EF4444' : color} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: themeConfig.text }, isDestructive && { color: '#EF4444' }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: themeConfig.textMuted }]}>{subtitle}</Text>}
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
    <View style={[styles.outerContainer, { backgroundColor: themeConfig.bg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title={t('settings_screen.title')} showBack={true} />

      <SafeAreaView style={[styles.safe, { backgroundColor: themeConfig.bg }]}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('settings_screen.personal_account')}</Text>
            <View style={[styles.card, { backgroundColor: themeConfig.cardBg, borderColor: themeConfig.border }]}>
              <SettingItem
                icon="person-outline"
                title={t('settings_screen.edit_profile')}
                subtitle={t('settings_screen.edit_profile_sub')}
                onPress={() => router.push('/profile/edit-profile')}
                color="#3b82f6"
              />
              <View style={[styles.divider, { backgroundColor: themeConfig.border }]} />
              <SettingItem
                icon="location-outline"
                title={t('settings_screen.addresses')}
                subtitle={t('settings_screen.addresses_sub')}
                onPress={() => router.push('/profile/address')}
                color="#6366f1"
              />
              <View style={[styles.divider, { backgroundColor: themeConfig.border }]} />
              <SettingItem
                icon="shield-checkmark-outline"
                title={t('settings_screen.security')}
                subtitle={t('settings_screen.security_sub')}
                onPress={() => router.push('/settings/security')}
                color="#10b981"
              />
            </View>
          </View>

          {/* Notifications Section */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('settings_screen.communication')}</Text>
            <View style={[styles.card, { backgroundColor: themeConfig.cardBg, borderColor: themeConfig.border }]}>
              <SettingItem
                icon="notifications-outline"
                title={t('settings_screen.push_notifications')}
                subtitle={t('settings_screen.push_notifications_sub')}
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
            </View>
          </View>

          {/* App Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('settings_screen.app_preferences')}</Text>
            <View style={[styles.card, { backgroundColor: themeConfig.cardBg, borderColor: themeConfig.border }]}>
              <SettingItem
                icon="globe-outline"
                title={t('settings_screen.language')}
                subtitle={i18n.language === 'si' ? 'Sinhala' : i18n.language === 'ta' ? 'Tamil' : 'English (US)'}
                onPress={() => router.push('/settings/select-language')}
                color="#8b5cf6"
              />
              <View style={[styles.divider, { backgroundColor: themeConfig.border }]} />
              <SettingItem
                icon="moon-outline"
                title={t('settings_screen.appearance')}
                subtitle={t('settings_screen.appearance_sub')}
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
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('settings_screen.more_about', "More about Easy Auto")}</Text>
            <View style={[styles.card, { backgroundColor: themeConfig.cardBg, borderColor: themeConfig.border }]}>
              <SettingItem
                icon="document-text-outline"
                title={t('settings_screen.privacy_policy')}
                onPress={() => router.push('/support/privacy-policy')}
                color="#94a3b8"
              />
              <View style={[styles.divider, { backgroundColor: themeConfig.border }]} />
              <SettingItem
                icon="information-circle-outline"
                title={t('settings_screen.about_version')}
                subtitle={t('settings_screen.about_version_sub')}
                onPress={() => router.push('/settings/about-app')}
                color="#64748b"
              />
              <View style={[styles.divider, { backgroundColor: themeConfig.border }]} />
              <SettingItem
                icon="help-circle-outline"
                title={t('settings_screen.help_center')}
                onPress={() => router.push('/support/help-center')}
                color="#64748b"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.logoutBtn, { backgroundColor: themeConfig.cardBg, borderColor: themeConfig.border }]}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)}
            >
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutBtnText}>{t('settings_screen.sign_out')}</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('settings_screen.made_with_love')}</Text>
            <Text style={styles.footerSub}>{t('settings_screen.all_rights')}</Text>
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