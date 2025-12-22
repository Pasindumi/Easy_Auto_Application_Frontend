// app/invite-friend.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InviteFriend() {
  const router = useRouter();

  const totalInvites = 8;
  const earnedPoints = 320;
  const inviteCode = 'EASY-AUTO-245';
  const progressCurrent = 8;
  const progressTarget = 10;
  const progressPct = Math.min(100, Math.round((progressCurrent / progressTarget) * 100));

  const handleCopy = () => {
    console.log('copy invite code', inviteCode);
  };

  const handleShareNow = () => {
    console.log('share now');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>INVITE FRIEND</Text>
            <View style={{ width: 18 }} />
          </View>

          {/* SMALL LOGO + TAGLINE */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image source={require('@/assets/images/blueLogo.png')} style={styles.logo} />
            </View>
            <Text style={styles.brandTag}>Invite friends & earn rewards</Text>
          </View>

          {/* STATS ROW */}
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <Ionicons name="people-outline" size={20} color="#235CF8" />
              <Text style={styles.statsValue}>{totalInvites}</Text>
              <Text style={styles.statsLabel}>Invites</Text>
            </View>

            <View style={styles.statsCard}>
              <Ionicons name="trophy-outline" size={20} color="#235CF8" />
              <Text style={styles.statsValue}>{earnedPoints}</Text>
              <Text style={styles.statsLabel}>Points</Text>
            </View>
          </View>

          {/* INVITE CODE CARD */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Your Personal Invite Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.inviteCode}>{inviteCode}</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                <Ionicons name="copy-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.smallText}>Share this with your friends to earn rewards</Text>
          </View>

          {/* PROGRESS CARD */}
          <View style={styles.cardContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Reward Progress</Text>
              <Text style={styles.progressText}>
                {progressCurrent} / {progressTarget}
              </Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
            <Text style={styles.progressInfo}>
              Invite {Math.max(0, progressTarget - progressCurrent)} more friends to unlock next reward 🎉
            </Text>
          </View>

          {/* QR CARD */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Quick Join QR</Text>
            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={120} color="#235CF8" />
            </View>
          </View>

          {/* SHARE METHODS */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Share With</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text style={styles.socialText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="mail-outline" size={20} color="#EF4444" />
                <Text style={styles.socialText}>Email</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity style={styles.inviteBtn} onPress={handleShareNow}>
            <Ionicons name="share-social-outline" size={16} color="#fff" />
            <Text style={styles.inviteBtnText}>INVITE NOW</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F2F2' },
  container: { paddingBottom: 30 },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },

  /* LOGO */
  logoSection: { alignItems: 'center', marginVertical: 16 },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 60, height: 60, resizeMode: 'contain' },
  brandTag: { fontSize: 12, color: '#777', marginTop: 8 },

  /* STATS */
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, justifyContent: 'space-between' },
  statsCard: { backgroundColor: '#fff', width: '48%', borderRadius: 16, paddingVertical: 14, alignItems: 'center', elevation: 3 },
  statsValue: { fontSize: 18, fontWeight: '700', marginTop: 4, color: '#235CF8' },
  statsLabel: { fontSize: 12, color: '#777' },

  /* CARD */
  cardContainer: { marginHorizontal: 16, marginTop: 14, backgroundColor: '#fff', borderRadius: 14, padding: 12, elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#111', marginBottom: 6 },

  /* CODE */
  codeBox: { backgroundColor: '#F1F4FF', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  inviteCode: { fontSize: 16, fontWeight: '700', color: '#235CF8' },
  copyBtn: { backgroundColor: '#235CF8', padding: 6, borderRadius: 8 },
  smallText: { fontSize: 11, color: '#777', marginTop: 6 },

  /* PROGRESS */
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressBarBg: { height: 8, backgroundColor: '#E5EBFF', borderRadius: 6, marginTop: 8, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: '#22C55E', borderRadius: 6 }, // green
  progressText: { fontSize: 12, fontWeight: '600', color: '#235CF8' },
  progressInfo: { fontSize: 11, color: '#666', marginTop: 6 },

  /* QR */
  qrBox: { backgroundColor: '#F3F7FF', borderRadius: 10, paddingVertical: 14, alignItems: 'center' },

  /* SOCIAL */
  socialRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  socialBtn: { width: '30%', backgroundColor: '#F8FAFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  socialText: { fontSize: 11, marginTop: 4, color: '#333', fontWeight: '600' },

  /* CTA BUTTON */
  inviteBtn: { backgroundColor: '#235CF8', paddingVertical: 12, marginHorizontal: 16, marginTop: 18, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', elevation: 4 },
  inviteBtnText: { marginLeft: 6, color: '#fff', fontWeight: '700', letterSpacing: 0.5 },
});
