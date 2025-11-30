// app/invite-friend.tsx
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import {
         Image,
         SafeAreaView,
         ScrollView,
         StyleSheet,
         Text,
         TouchableOpacity,
         View,
} from 'react-native'

export default function InviteFriend() {
  const router = useRouter()

  const totalInvites = 8
  const earnedPoints = 320

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* ---------- HEADER (UNCHANGED) ---------- */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>INVITE FRIEND</Text>
            <View style={{ width: 22 }} />
          </View>

          {/* ---------- TOP BRAND ---------- */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/images/blueLogo.png')}
                style={styles.logo}
              />
            </View>
            
            <Text style={styles.brandTag}>
              Invite friends & earn rewards
            </Text>
          </View>

          {/* ---------- STATS CARDS ---------- */}
          <View style={styles.statsRow}>
            <View style={styles.statsCard}>
              <Ionicons name="people-outline" size={26} color="#235CF8" />
              <Text style={styles.statsValue}>{totalInvites}</Text>
              <Text style={styles.statsLabel}>Invites</Text>
            </View>

            <View style={styles.statsCard}>
              <Ionicons name="trophy-outline" size={26} color="#235CF8" />
              <Text style={styles.statsValue}>{earnedPoints}</Text>
              <Text style={styles.statsLabel}>Points</Text>
            </View>
          </View>

          {/* ---------- INVITE CODE ---------- */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Your Personal Invite Code</Text>

            <View style={styles.codeBox}>
              <Text style={styles.inviteCode}>EASY-AUTO-245</Text>

              <TouchableOpacity style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.smallText}>
              Share this with your friends to earn rewards
            </Text>
          </View>

          {/* ---------- PROGRESS ---------- */}
          <View style={styles.cardContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.sectionTitle}>Reward Progress</Text>
              <Text style={styles.progressText}>8 / 10</Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={styles.progressFill} />
            </View>

            <Text style={styles.progressInfo}>
              Invite 2 more friends to unlock next reward 🎉
            </Text>
          </View>

          {/* ---------- QR CODE ---------- */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Quick Join QR</Text>

            <View style={styles.qrBox}>
              <Ionicons name="qr-code-outline" size={150} color="#235CF8" />
            </View>
          </View>

          {/* ---------- SHARE METHODS ---------- */}
          <View style={styles.cardContainer}>
            <Text style={styles.sectionTitle}>Share With</Text>

            <View style={styles.socialRow}>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-whatsapp" size={26} color="#25D366" />
                <Text style={styles.socialText}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-facebook" size={26} color="#1877F2" />
                <Text style={styles.socialText}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="mail-outline" size={26} color="#EF4444" />
                <Text style={styles.socialText}>Email</Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* ---------- MAIN BUTTON ---------- */}
          <TouchableOpacity style={styles.inviteBtn}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
            <Text style={styles.inviteBtnText}>INVITE NOW</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },

  container: {
    paddingBottom: 40,
  },

  /* HEADER */
  header: {
    backgroundColor: '#235CF8',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* LOGO */
  logoSection: {
    alignItems: 'center',
    marginVertical: 24,
  },

  logoCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E8EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },



  brandTag: {
    fontSize: 12,
    color: '#777',
  },

  /* STATS */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },

  statsCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 18,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 3,
  },

  statsValue: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 6,
    color: '#235CF8',
  },

  statsLabel: {
    fontSize: 12,
    color: '#777',
  },

  /* CARD */
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
    marginBottom: 10,
  },

  /* CODE */
  codeBox: {
    backgroundColor: '#F1F4FF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inviteCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#235CF8',
  },

  copyBtn: {
    backgroundColor: '#235CF8',
    padding: 10,
    borderRadius: 12,
  },

  smallText: {
    fontSize: 11,
    color: '#777',
    marginTop: 6,
  },

  /* PROGRESS */
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressBarBg: {
    height: 10,
    backgroundColor: '#E5EBFF',
    borderRadius: 8,
    marginTop: 10,
  },

  progressFill: {
    height: 10,
    width: '80%',
    backgroundColor: '#235CF8',
    borderRadius: 8,
  },

  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#235CF8',
  },

  progressInfo: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },

  /* QR */
  qrBox: {
    backgroundColor: '#F3F7FF',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
  },

  /* SOCIAL */
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  socialBtn: {
    width: '30%',
    backgroundColor: '#F8FAFF',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  socialText: {
    fontSize: 11,
    marginTop: 4,
    color: '#333',
    fontWeight: '600',
  },

  /* BUTTON */
  inviteBtn: {
    backgroundColor: '#235CF8',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 6,
  },

  inviteBtnText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
  },
})
