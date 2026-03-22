import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Platform
} from 'react-native';
import Header from "../../components/Header";
import { COLORS } from "@/constants/Colors";
import * as Haptics from 'expo-haptics';

const FAQ_CATEGORIES = [
  { id: '1', title: 'Getting Started', icon: 'rocket-outline', color: '#3b82f6', count: 12 },
  { id: '2', title: 'Account & Safety', icon: 'shield-checkmark-outline', color: '#10b981', count: 8 },
  { id: '3', title: 'Payments & Fees', icon: 'card-outline', color: '#f59e0b', count: 6 },
  { id: '4', title: 'Selling Cars', icon: 'megaphone-outline', color: '#ef4444', count: 15 },
  { id: '5', title: 'Buying Guide', icon: 'cart-outline', color: '#8b5cf6', count: 10 },
  { id: '6', title: 'Technical Support', icon: 'construct-outline', color: '#64748b', count: 5 },
];

const TOP_FAQS = [
  { question: "How do I list my car for sale?", answer: "Go to 'Sell a car' from the bottom navigation or sidebar, fill in your car details, upload high-quality photos, and submit." },
  { question: "Is my payment information secure?", answer: "Yes, we use bank-level encryption (SSL) and partner with trusted payment gateways to ensure your transactions are 100% safe." },
  { question: "What are the benefits of a Pro package?", answer: "Pro packages give you higher listing limits, exclusive boost options, and featured badges to help you sell 3x faster." },
];

export default function HelpCenterScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <View style={styles.outerContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header title="Help Center" showBack={true} />

      <View style={styles.safe}>
        <ScrollView 
            style={styles.container} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
          {/* Search Header */}
          <View style={styles.searchSection}>
            <Text style={styles.heroTitle}>How can we help you?</Text>
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="#94a3b8" />
                <TextInput 
                    placeholder="Search for articles, guides..." 
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholderTextColor="#94a3b8"
                />
            </View>
          </View>

          {/* Categories Grid */}
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          <View style={styles.categoriesGrid}>
            {FAQ_CATEGORIES.map((cat) => (
                <TouchableOpacity 
                    key={cat.id} 
                    style={styles.categoryCard}
                    onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                >
                    <View style={[styles.categoryIconBg, { backgroundColor: cat.color + '15' }]}>
                        <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                    </View>
                    <Text style={styles.categoryTitle}>{cat.title}</Text>
                    <Text style={styles.categoryCount}>{cat.count} articles</Text>
                </TouchableOpacity>
            ))}
          </View>

          {/* Top FAQs */}
          <View style={styles.faqSection}>
            <Text style={styles.sectionTitle}>Popular Questions</Text>
            <View style={styles.faqList}>
                {TOP_FAQS.map((faq, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={styles.faqItem}
                        onPress={() => toggleFaq(index)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.faqHeader}>
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Ionicons 
                                name={expandedFaq === index ? "chevron-up" : "chevron-down"} 
                                size={20} 
                                color="#64748b" 
                            />
                        </View>
                        {expandedFaq === index && (
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
          </View>

          {/* Contact Channels */}
          <View style={styles.contactSection}>
             <Text style={styles.sectionTitle}>Still need assistance?</Text>
             <View style={styles.contactGrid}>
                <TouchableOpacity style={styles.contactCard} onPress={() => router.push('/support/contact-us')}>
                    <View style={[styles.contactIconBg, { backgroundColor: '#eff6ff' }]}>
                        <Ionicons name="mail-outline" size={22} color={COLORS.primary} />
                    </View>
                    <Text style={styles.contactLabel}>Email Support</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactCard} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
                    <View style={[styles.contactIconBg, { backgroundColor: '#ecfdf5' }]}>
                        <Ionicons name="chatbubbles-outline" size={22} color="#10b981" />
                    </View>
                    <Text style={styles.contactLabel}>Live Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactCard} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
                    <View style={[styles.contactIconBg, { backgroundColor: '#fff7ed' }]}>
                        <Ionicons name="call-outline" size={22} color="#f59e0b" />
                    </View>
                    <Text style={styles.contactLabel}>Call Center</Text>
                </TouchableOpacity>
             </View>
          </View>

          <View style={styles.footer}>
             <Text style={styles.footerText}>EasyAuto Support Hub v2.0</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryIconBg: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  faqSection: {
    marginBottom: 32,
  },
  faqList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 12,
    lineHeight: 22,
    fontWeight: '500',
  },
  contactSection: {
    marginBottom: 32,
  },
  contactGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  contactIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '600',
  }
});
