import COLORS from "@/constants/Colors";
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
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();

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
        <RNStatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
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
                    <Text style={styles.username}>{user?.name || 'User'}</Text>
                    <View style={styles.premiumTag}>
                      <Ionicons name="star" size={12} color={COLORS.white} />
                      <Text style={styles.premiumText}>
                        {user?.is_premium ? 'Premium Member' : 'Normal User'}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                </View>
                <Text style={styles.email}>{user?.email || 'No email'}</Text>
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
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 0,
    marginTop: 4,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  profileCard: {
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
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
    borderColor: COLORS.white,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.status.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.white,
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
    color: COLORS.white,
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
    color: COLORS.white,
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
