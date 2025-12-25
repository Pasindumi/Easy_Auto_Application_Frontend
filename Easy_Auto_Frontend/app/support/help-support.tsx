import COLORS from "@/constants/Colors";
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Header from "../../components/Header";
import { headerSectionStyles } from '../../styles/headerSectionStyles';

export default function HelpSupport() {
  const router = useRouter();

  return (
    <View style={styles.safe}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header showBack={true} />

      {/* Unified Sub-Header */}
      <View style={headerSectionStyles.headerWrap}>
        <View style={headerSectionStyles.header}>
          <Ionicons name="help-circle-outline" size={22} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text style={headerSectionStyles.headerTitle}>Help and Support</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ---------- CONTENT ---------- */}
        <View style={styles.contentBox}>
          <Text style={styles.mainTitle}>How to use this app</Text>

          {/* 1 */}
          <View style={styles.stepRow}>
            <View style={styles.iconBox}>
              <Ionicons name="person-add" size={20} color={COLORS.primary} />
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
              <MaterialIcons name="assignment" size={20} color={COLORS.primary} />
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
              <Feather name="list" size={20} color={COLORS.primary} />
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
                color={COLORS.primary}
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
              <Ionicons name="mail" size={18} color={COLORS.primary} />
              <Text style={styles.contactText}>
                support@yourapp.com
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
              <Text style={styles.contactText}>
                +94 76 123 4567
              </Text>
            </View>

            <View style={styles.contactRow}>
              <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.primary} />
              <Text style={styles.contactText}>
                Live Chat (Coming Soon)
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    paddingBottom: 40,
  },
  contentBox: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.divider,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    color: COLORS.text.primary,
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
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.text.primary,
  },
  text: {
    fontSize: 13,
    color: COLORS.text.secondary,
    marginTop: 4,
    lineHeight: 20,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 12,
    color: COLORS.text.primary,
  },
  contactBox: {
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
