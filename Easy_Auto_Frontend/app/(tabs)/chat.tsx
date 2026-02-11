import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl, Platform, StatusBar as RNStatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../constants/API';
import socketService from '../../utils/socket';
import UserSearch from '../../components/chat/UserSearch';
import Header from '@/components/Header';
import COLORS from '@/constants/Colors';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Conversation {
  id: string;
  other_user: User;
  last_message: {
    content: string;
    created_at: string;
  } | null;
  unread_count: number;
}

export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, accessToken } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    if (user?.id && accessToken) {
      console.log('Connecting to socket with user ID:', user.id);
      socketService.connect(user.id);
      fetchConversations();

      socketService.onNotification((notification) => {
        if (notification.type === 'new_message') {
          fetchConversations();
        }
      });

      return () => {
        socketService.removeListeners();
        // socketService.disconnect(); // Keep connection alive while in app?
      };
    }
  }, [user?.id, accessToken]);

  const fetchConversations = async () => {
    try {
      const response = await api.get<{ success: boolean; data: Conversation[] }>(
        `${ENDPOINTS.CHAT}/conversations`
      );
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Fetch Conversations Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, []);

  const handleStartChat = async (selectedUser: User) => {
    setSearchVisible(false);
    try {
      const response = await api.post<{ success: boolean; data: { id: string } }>(
        `${ENDPOINTS.CHAT}/conversations`,
        { participantId: selectedUser.id }
      );

      if (response.success) {
        router.push(`/chat/${response.data.id}` as any);
      }
    } catch (error) {
      console.error('Start Chat Error:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return weekdays[date.getDay()];
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => {
        // Mark as read locally and navigate
        const updatedConversations = conversations.map(c =>
          c.id === item.id ? { ...c, unread_count: 0 } : c
        );
        setConversations(updatedConversations);
        router.push(`/chat/${item.id}` as any);
      }}
    >
      <View style={styles.avatarContainer}>
        {item.other_user.avatar ? (
          <Image source={{ uri: item.other_user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.avatarText}>{item.other_user.name[0]}</Text>
          </View>
        )}
        <View style={styles.onlineStatusRing}>
          <View style={styles.onlineDot} />
        </View>
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.name} numberOfLines={1}>{item.other_user.name}</Text>
          {item.last_message && (
            <Text style={[styles.time, item.unread_count > 0 && styles.unreadTime]}>
              {formatTime(item.last_message.created_at)}
            </Text>
          )}
        </View>
        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              item.unread_count > 0 && styles.lastMessageBold
            ]}
            numberOfLines={1}
          >
            {item.last_message?.content || 'No messages yet'}
          </Text>
          {item.unread_count > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.unreadText}>{item.unread_count > 9 ? '9+' : item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Header
        title="Messages"
        showBack={true}
      />

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList
            data={conversations}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubbles-outline" size={80} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No messages yet</Text>
                <Text style={styles.emptySubtitle}>Start a conversation with a buyer or seller!</Text>
                <TouchableOpacity
                  style={[styles.startBtn, { backgroundColor: COLORS.primary }]}
                  onPress={() => setSearchVisible(true)}
                >
                  <Text style={styles.startBtnText}>Start Chatting</Text>
                </TouchableOpacity>
              </View>
            )}
            ListHeaderComponent={() => <View style={{ height: 15 }} />}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => setSearchVisible(true)}
      >
        <View
          style={[styles.fabGradient, { backgroundColor: COLORS.primary }]}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </View>
      </TouchableOpacity>

      <UserSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelectUser={handleStartChat}
      />
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -5,
  },

  listContainer: {
    flex: 1,
    marginTop: 10, // Adjusted to prevent covering the header
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 24,
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
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#F8FAFC',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 20, // Premium squircle look
  },
  placeholderAvatar: {
    backgroundColor: '#F1F5F9', // Subtle neutral background
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
  },
  onlineStatusRing: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981', // Premium emerald green
  },

  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A', // Deep slate for better contrast
    letterSpacing: -0.3,
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  unreadTime: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    flex: 1,
    marginRight: 10,
  },
  lastMessageBold: {
    color: '#1E293B',
    fontWeight: '700',
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#fff',
    includeFontPadding: false,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 24,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 48,
    lineHeight: 24,
  },
  startBtn: {
    marginTop: 36,
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },

  fab: {
    position: 'absolute',
    bottom: 100, // Above tab bar
    right: 20,
    width: 62,
    height: 62,
    borderRadius: 31,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
