import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from "../../components/Header";
import { typography } from "../../components/theme";
import { headerSectionStyles } from '../../styles/headerSectionStyles';
import {useAuth} from "../../contexts/AuthContext";

export default function SwitchAccountScreen() {
  const router = useRouter();

  const handleGoToAdmin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('');
  };
   

  const { user } = useAuth();

  if (!user) return null;
  
  const AccountCard = ({
    name,
    email,
    role,
    isActive,
    onPress,
  }: {
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.accountCard, isActive && styles.accountCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.accountCardContent}>
        <View style={styles.accountInfo}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountName}>{name}</Text>
            {isActive && (
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Active</Text>
              </View>
            )}
          </View>
          <Text style={styles.accountEmail}>{email}</Text>
          <Text style={styles.accountRole}>{role}</Text>
        </View>
        <Ionicons
          name={isActive ? 'checkmark-circle' : 'chevron-forward'}
          size={24}
          color={isActive ? '#235CF8' : '#9CA3AF'}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header />

      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <View style={headerSectionStyles.headerLeft}>
            <Ionicons name="repeat-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
            <Text style={headerSectionStyles.headerTitle}>Switch Accounts</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Account</Text>
        <AccountCard
          name={user.name}
          email={user.email ?? 'No email'}
          role={user.is_premium ? 'Premium Member' : 'Normal User'}
          isActive={true}
        />
        </View>

        {/* Other Accounts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Other Accounts</Text>
          <AccountCard
            name="John Doe"
            email="john.doe@example.com"
            role="Standard Member"
            isActive={false}
          />
          <AccountCard
            name="Jane Smith"
            email="jane.smith@example.com"
            role="Premium Member"
            isActive={false}
          />
        </View>

        {/* Admin Dashboard Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.adminButton}
            onPress={handleGoToAdmin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#235CF8', '#1E4ED8', '#1A3FD0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.adminButtonGradient}
            >
              <View style={styles.adminButtonContent}>
                <View style={styles.adminIconContainer}>
                  <Ionicons name="settings" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.adminButtonTextContainer}>
                  <Text style={styles.adminButtonTitle}>Admin Dashboard</Text>
                  <Text style={styles.adminButtonSubtitle}>
                    Access admin controls and management
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Add Account Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.addAccountButton}
            activeOpacity={0.7}
          >
            <View style={styles.addAccountContent}>
              <View style={styles.addAccountIconContainer}>
                <Ionicons name="add-circle-outline" size={24} color="#235CF8" />
              </View>
              <Text style={styles.addAccountText}>Add Another Account</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
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
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    ...typography.subheading,
    fontSize: 20,
    marginBottom: 12,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  accountCardActive: {
    borderColor: '#235CF8',
    borderWidth: 2,
    backgroundColor: '#F0F4FF',
  },
  accountCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountInfo: {
    flex: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  accountName: {
    ...typography.subheading,
    fontSize: 16,
  },
  activeBadge: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  accountEmail: {
    ...typography.body,
    marginBottom: 4,
  },
  accountRole: {
    ...typography.caption,
    fontWeight: '500',
  },
  adminButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  adminButtonGradient: {
    padding: 20,
  },
  adminButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  adminIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonTextContainer: {
    flex: 1,
  },
  adminButtonTitle: {
    ...typography.subheading,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  adminButtonSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  addAccountButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addAccountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addAccountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#235CF8',
    letterSpacing: -0.2,
  },
});