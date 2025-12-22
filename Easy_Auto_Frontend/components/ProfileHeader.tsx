// components/ProfileHeader.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProfileHeaderProps = {
  title: string;
  showProfileCard?: boolean;
  onProfilePress?: () => void;
};

export default function ProfileHeader({
  title,
  showProfileCard = true,
  onProfilePress,
}: ProfileHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile/edit-profile');
    }
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Status Bar */}
      {Platform.OS === 'android' ? (
        <RNStatusBar backgroundColor="#235CF8" barStyle="light-content" />
      ) : null}

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Text style={styles.headerTitle}>{title}</Text>

        {showProfileCard && (
          <TouchableOpacity
            style={styles.profileCard}
            onPress={handleProfilePress}
            activeOpacity={0.9}
          >
            <View style={styles.profileCardContent}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require('@/assets/images/user.jpeg')}
                  style={styles.avatar}
                />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>2</Text>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileNames}>
                    <Text style={styles.username}>Dilmin Ekanayaka</Text>
                    <View style={styles.premiumTag}>
                      <Ionicons name="star" size={12} color="#FFFFFF" />
                      <Text style={styles.premiumText}>Premium Member</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.email}>dilmin@yahoo.com</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 20, // Increased for better spacing
    paddingBottom: 24, // Increased for better visual balance
    paddingTop: 0, // PaddingTop is handled by safe area insets
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden', // Ensure rounded corners are visible
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0, // Removed bottom margin for better spacing
    marginTop: 4, // Added top margin for better visual balance
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  // Profile Card - Fixed to stand out from header
  profileCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white for distinction
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#235CF8',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  profileNames: {
    flex: 1,
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  premiumTag: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignItems: 'center',
    gap: 4,
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  email: {
    color: '#DDE7FF',
    fontSize: 13,
    fontWeight: '500',
  },
});

