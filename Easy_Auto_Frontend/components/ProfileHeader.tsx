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
import { LinearGradient } from 'expo-linear-gradient';

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

      <LinearGradient
        colors={[COLORS.primary, '#1E40AF']}
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}
      >
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
                  source={
                    user?.avatar
                      ? { uri: user.avatar }
                      : require('@/assets/images/user.jpeg')
                  }
                  style={styles.avatar}
                />
                {user?.is_premium && (
                  <View style={styles.premiumBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                  </View>
                )}
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.profileHeader}>
                  <View style={styles.profileNames}>
                    <Text style={styles.username} numberOfLines={1}>
                      {user?.name || 'User'}
                    </Text>
                    <View style={styles.premiumTag}>
                      <Ionicons name="shield-checkmark" size={12} color={COLORS.white} />
                      <Text style={styles.premiumText}>
                        {user?.is_premium ? 'Premium Member' : 'Member'}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
                </View>
                <Text style={styles.email} numberOfLines={1}>
                  {user?.email || 'No email'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>
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
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 0,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 20,
    marginTop: 8,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  profileCard: {
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  premiumBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#1E40AF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  profileNames: {
    flex: 1,
  },
  username: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  premiumTag: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    gap: 5,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  email: {
    color: '#E0E7FF',
    fontSize: 14,
    fontWeight: '500',
  },
});
