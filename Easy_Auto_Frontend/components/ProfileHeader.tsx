import COLORS from "@/constants/Colors";
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors, isDarkMode } = useTheme();

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/profile/edit-profile');
    }
  };

  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  return (
    <View style={themeStyles.container} pointerEvents="box-none">
      {/* Status Bar */}
      {Platform.OS === 'android' ? (
        <RNStatusBar backgroundColor={isDarkMode ? colors.backgroundSecondary : colors.primary} barStyle="light-content" />
      ) : null}

      <LinearGradient
        colors={isDarkMode ? [colors.backgroundSecondary, colors.background] : [colors.primary, '#1E40AF', '#111827']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[themeStyles.header, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View style={themeStyles.decorCircle1} />
        <View style={themeStyles.decorCircle2} />

        <View style={themeStyles.topRow}>
          <Text style={themeStyles.headerTitle}>{title}</Text>
          <TouchableOpacity style={themeStyles.headerHelpBtn} onPress={() => router.push('/support/contact-us')}>
            <Ionicons name="help-circle-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {showProfileCard && (
          <TouchableOpacity
            style={themeStyles.profileCard}
            onPress={handleProfilePress}
            activeOpacity={0.9}
          >
            <View style={themeStyles.profileCardGlass}>
              <View style={themeStyles.profileCardContent}>
                <View style={themeStyles.avatarContainer}>
                  <Image
                    source={
                      user?.avatar
                        ? { uri: user.avatar }
                        : require('@/assets/images/user.jpeg')
                    }
                    style={themeStyles.avatar}
                  />
                  <LinearGradient
                    colors={user?.is_premium ? ["#FCD34D", "#F59E0B"] : ["#10B981", "#059669"]}
                    style={themeStyles.statusDot}
                  />
                </View>

                <View style={themeStyles.profileInfo}>
                  <View style={themeStyles.nameRow}>
                    <Text style={themeStyles.username} numberOfLines={1}>
                      {user?.name || 'User'}
                    </Text>
                    {user?.is_premium && (
                      <View style={themeStyles.proTag}>
                        <Ionicons name="star" size={10} color="#fff" />
                        <Text style={themeStyles.proTagText}>PRO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={themeStyles.email} numberOfLines={1}>
                    {user?.email || 'No email'}
                  </Text>

                  <View style={themeStyles.memberSinceContainer}>
                    <Text style={themeStyles.memberSinceText}>Member since 2024</Text>
                  </View>
                </View>

                <View style={themeStyles.chevronFrame}>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 50,
    elevation: 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: "absolute",
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: -50, right: -50,
  },
  decorCircle2: {
    position: "absolute",
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.03)",
    bottom: -20, left: -20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -1,
  },
  headerHelpBtn: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  profileCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: isDarkMode ? colors.border : 'rgba(255, 255, 255, 0.2)',
    backgroundColor: isDarkMode ? colors.backgroundSecondary : 'rgba(255, 255, 255, 0.08)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  profileCardGlass: {
    flex: 1,
    backgroundColor: isDarkMode ? 'transparent' : 'rgba(255, 255, 255, 0.12)',
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: isDarkMode ? colors.border : 'rgba(255,255,255,0.25)',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2, right: 2,
    width: 16, height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: isDarkMode ? colors.backgroundSecondary : '#1E40AF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  username: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  proTag: {
    flexDirection: 'row',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignItems: 'center',
    gap: 4,
  },
  proTagText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  email: {
    color: isDarkMode ? colors.text.muted : 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  memberSinceContainer: {
    alignSelf: 'flex-start',
    backgroundColor: isDarkMode ? colors.backgroundMuted : 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  memberSinceText: {
    color: isDarkMode ? colors.text.muted : 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
  },
  chevronFrame: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 8,
  },
});

