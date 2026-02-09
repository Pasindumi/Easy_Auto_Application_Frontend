import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Safe Dummy Data

const CHAT_LIST = [
  {
    id: '1',
    name: 'Toyota Care',
    lastMessage: 'Is there anything we can do to help?',
    time: '09:42',
    unread: 2,
    avatar: 'https://img.icons8.com/color/48/toyota.png',
    isOnline: true,
  },
  {
    id: '2',
    name: 'John Seller',
    lastMessage: 'The car is available for inspection.',
    time: 'Yesterday',
    unread: 0,
    avatar: null,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Support Team',
    lastMessage: 'Your issue has been resolved.',
    time: 'Mon',
    unread: 0,
    avatar: null,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Mike Mechanic',
    lastMessage: 'I can fix that transmission issue.',
    time: 'Sun',
    unread: 5,
    avatar: null,
    isOnline: false,
  },
];

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();


  const renderItem = ({ item }: { item: typeof CHAT_LIST[0] }) => (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => console.log('Open chat', item.id)}
    >
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
        )}
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.lastMessageBold,
              { flex: 1, marginRight: 10 } // Added flex and margin
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          <View style={styles.rightInfo}>
            {item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
            <Ionicons name="chevron-forward" size={16} color="#CBD5E1" style={{ marginLeft: 4 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Area */}
      <LinearGradient
        colors={['#235CF8', '#1A4ADB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 20) + 10 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      </LinearGradient>

      {/* Main Chat List Container */}
      <View style={styles.listContainer}>
        <FlatList
          data={CHAT_LIST}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <View style={{ height: 15 }} />} // Added top spacing inside card
        />
      </View>

      {/* Floating Action Button for New Chat */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <LinearGradient
          colors={['#235CF8', '#1A4ADB']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  headerGradient: {
    paddingBottom: 60, // Deep padding for card overlap
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    marginBottom: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  listContainer: {
    flex: 1,
    marginTop: -40, // Deeper overlap
    backgroundColor: '#fff',
    paddingTop: 10,
    marginHorizontal: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden', // Contain the list items
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
  },
  placeholderAvatar: {
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#235CF8',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E', // Green
    borderWidth: 2,
    borderColor: '#fff',
  },

  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  lastMessageBold: {
    color: '#1F2937',
    fontWeight: '600',
  },

  unreadBadge: {
    backgroundColor: '#FF3B30',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#fff',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  fab: {
    position: 'absolute',
    bottom: 100, // Above tab bar
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#235CF8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
