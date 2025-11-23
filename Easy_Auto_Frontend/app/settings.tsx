import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

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
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={18} color="#235CF8" />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>

      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#B0B6C3" />}
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <Image
                source={require('../assets/images/user.jpeg')}
                style={styles.avatar}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.username}>Dilmin Ekanayaka</Text>
                <Text style={styles.email}>dilmin@yahoo.com</Text>

                <View style={styles.premiumTag}>
                  <Ionicons name="star" size={12} color="#fff" />
                  <Text style={styles.premiumText}>Premium Member</Text>
                </View>
              </View>

              <View style={styles.profileBadge}>
                <Text style={styles.badgeText}>2</Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#fff" />
            </View>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>

            <MenuItem
              icon="person-outline"
              title="Edit profile"
              subtitle="Update Your profile"
              onPress={() => router.push('/edit-profile')}
            />

            <MenuItem
              icon="location-outline"
              title="Address"
              subtitle="Update your location"
              onPress={() => router.push('/address')}
            />
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              subtitle="Manage Alerts and Updates"
            />

            <MenuItem
              icon="card-outline"
              title="Payment Methods"
              subtitle="Manage your Payments"
            />

            <MenuItem
              icon="lock-closed-outline"
              title="Privacy and Security"
              subtitle="Control your Data"
            />

            <MenuItem
              icon="globe-outline"
              title="Language"
              subtitle="English (US)"
            />

            <MenuItem
              icon="moon-outline"
              title="Dark Mode"
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  thumbColor="#fff"
                  trackColor={{ true: '#235CF8', false: '#d1d5db' }}
                />
              }
            />
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>

            <MenuItem icon="help-circle-outline" title="Help & Support" />
            <MenuItem icon="information-circle-outline" title="About this app" />
            <MenuItem icon="people-outline" title="Invite Friends" />
            <MenuItem icon="repeat-outline" title="Switch Accounts" />

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={18} color="#E53935" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
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

  container: {
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingTop: 30,
  },

  profileCard: {
    backgroundColor: '#356DFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },

  username: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  email: {
    color: '#DDE7FF',
    fontSize: 12,
  },

  premiumTag: {
    flexDirection: 'row',
    backgroundColor: '#235CF8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 6,
    alignItems: 'center',
  },

  premiumText: {
    color: '#fff',
    fontSize: 10,
    marginLeft: 4,
    fontWeight: '600',
  },

  profileBadge: {
    position: 'absolute',
    left: 44,
    top: 8,
    backgroundColor: '#235CF8',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111',
  },

  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },

  menuSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },

  logoutBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
  },

  logoutText: {
    marginLeft: 10,
    color: '#E53935',
    fontWeight: '700',
  },
});
