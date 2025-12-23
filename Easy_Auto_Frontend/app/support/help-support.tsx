import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../../components/Header";

export default function HelpSupport() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>

          {/* ---------- HEADER ---------- */}
          {/* ---------- HEADER ---------- */}
          <Header />
          <View style={localStyles.headerWrap}>
            <View style={localStyles.header}>
              <View style={localStyles.headerLeft}>
                <Ionicons name="help-circle-outline" size={22} color="#235CF8" style={{ marginRight: 8 }} />
                <Text style={localStyles.headerTitle}>Help and Support</Text>
              </View>
            </View>
          </View>

          {/* ---------- CONTENT ---------- */}
          <View style={styles.contentBox}>

            <Text style={styles.mainTitle}>How to use this app</Text>

            {/* 1 */}
            <View style={styles.stepRow}>
              <View style={styles.iconBox}>
                <Ionicons name="person-add" size={20} color="#235CF8" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.stepTitle}>Create an account</Text>
                <Text style={styles.text}>
                  Sign up using your email and phone number to get started.
                </Text>
              </View>
            </View>

            {/* 2 */}
            <View style={styles.stepRow}>
              <View style={styles.iconBox}>
                <MaterialIcons name="assignment" size={20} color="#235CF8" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.stepTitle}>Add your details</Text>
                <Text style={styles.text}>
                  Complete your profile and add required information.
                </Text>
              </View>
            </View>

            {/* 3 */}
            <View style={styles.stepRow}>
              <View style={styles.iconBox}>
                <Feather name="list" size={20} color="#235CF8" />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.stepTitle}>
                  Post / Browse listings
                </Text>
                <Text style={styles.text}>
                  Add new listings or browse items using filters.
                </Text>
              </View>
            </View>

            {/* 4 */}
            <View style={styles.stepRow}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color="#235CF8"
                />
              </View>
              <View style={styles.textBox}>
                <Text style={styles.stepTitle}>Make payments</Text>
                <Text style={styles.text}>
                  Pay securely using saved cards or add a new one.
                </Text>
              </View>
            </View>

            {/* Contact section */}
            <Text style={styles.helpTitle}>Need more help?</Text>

            <View style={styles.contactBox}>

              <View style={styles.contactRow}>
                <Ionicons name="mail" size={18} color="#235CF8" />
                <Text style={styles.contactText}>
                  support@yourapp.com
                </Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="call" size={18} color="#235CF8" />
                <Text style={styles.contactText}>
                  +94 76 123 4567
                </Text>
              </View>

              <View style={styles.contactRow}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#235CF8" />
                <Text style={styles.contactText}>
                  Live Chat (Coming Soon)
                </Text>
              </View>

            </View>

          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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

  /* CONTENT */
  contentBox: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
  },

  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  textBox: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  text: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },

  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 12,
    color: '#111',
  },

  contactBox: {
    backgroundColor: '#F1F4FF',
    borderRadius: 14,
    padding: 14,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  contactText: {
    marginLeft: 10,
    color: '#235CF8',
    fontSize: 13,
    fontWeight: '600',
  },
});

const localStyles = StyleSheet.create({
  headerWrap: { backgroundColor: '#F9FAFB' },
  header: { paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#E0E0E0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { color: '#235CF8', fontSize: 18, fontWeight: '600' },
});
