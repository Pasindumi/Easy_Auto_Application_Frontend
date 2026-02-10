import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../constants/API';
import socketService from '../../utils/socket';
import UserSearch from '../../components/chat/UserSearch';

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
      activeOpacity={0.8}
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
        <View style={styles.onlineDot} />
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
            <View style={styles.unreadBadge}>
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

      <LinearGradient
        colors={['#235CF8', '#1A4ADB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 20) + 10 }]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setSearchVisible(true)}>
            <Ionicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#235CF8" />
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
                  style={styles.startBtn}
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
        <LinearGradient
          colors={['#235CF8', '#1A4ADB']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <UserSearch
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
        onSelectUser={handleStartChat}
      />
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
  unreadTime: {
    color: '#235CF8',
    fontWeight: '700',
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

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  startBtn: {
    marginTop: 30,
    backgroundColor: '#235CF8',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
