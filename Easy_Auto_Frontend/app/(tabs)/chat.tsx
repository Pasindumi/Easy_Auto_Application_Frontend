import { Ionicons } from '@expo/vector-icons';
import Loading from '@/components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback } from 'react';
import { Animated, FlatList, Image as RNImage, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, RefreshControl, Alert, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../constants/API';
import socketService from '../../utils/socket';
import UserSearch from '../../components/chat/UserSearch';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import COLORS from '@/constants/Colors';
import EmptyState from '@/components/ui/EmptyState';
import Header from '@/components/Header';
import { Swipeable, RectButton } from 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real-time typing states per conversation ID
  const [typingDict, setTypingDict] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.id && accessToken) {
      console.log('Connecting to socket with user ID:', user.id);
      socketService.connect(user.id);
      fetchConversations();

      socketService.onNotification((notification) => {
        if (notification.type === 'new_message') {
          fetchConversations();
        } else if (notification.type === 'typing') {
           const convId = notification.data?.conversationId;
           if (convId) {
             setTypingDict(prev => ({ ...prev, [convId]: true }));
             // clear typing after 3s
             setTimeout(() => {
               setTypingDict(prev => ({ ...prev, [convId]: false }));
             }, 3000);
           }
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

  const handleDeleteConversation = async (conversationId: string, otherUserName: string) => {
    Alert.alert(
      "Delete Conversation",
      `Are you sure you want to delete the conversation with ${otherUserName}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await api.delete<{ success: boolean; message: string }>(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}`
              );
              if (response.success) {
                setConversations(prev => prev.filter(c => c.id !== conversationId));
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } else {
                Alert.alert("Error", response.message || "Failed to delete conversation");
              }
            } catch (error) {
              console.error('Delete Conversation Error:', error);
              Alert.alert("Error", "An error occurred while deleting the conversation");
            }
          }
        }
      ]
    );
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

  const filteredConversations = conversations.filter(conv =>
    conv.other_user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRightActions = (conversationId: string, otherUserName: string) => {
    return (
      <RectButton
        style={styles.deleteAction}
        onPress={() => handleDeleteConversation(conversationId, otherUserName)}
      >
        <Animated.View style={styles.actionIcon}>
          <Ionicons name="trash-outline" size={30} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </Animated.View>
      </RectButton>
    );
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <Swipeable
      renderRightActions={() => renderRightActions(item.id, item.other_user.name)}
      friction={2}
      rightThreshold={40}
    >
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
            {typingDict[item.id] ? (
              <Text style={[styles.lastMessage, { color: COLORS.primary, fontWeight: '700', fontStyle: 'italic' }]} numberOfLines={1}>
                typing...
              </Text>
            ) : (
              <Text
                style={[
                  styles.lastMessage,
                  item.unread_count > 0 && styles.lastMessageBold
                ]}
                numberOfLines={1}
              >
                {item.last_message?.content || 'No messages yet'}
              </Text>
            )}
            
            {item.unread_count > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.unreadText}>{item.unread_count > 9 ? '9+' : item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Header
        title="Messages"
        rightElement={
          <TouchableOpacity
            style={styles.composeBtnHeader}
            onPress={() => setSearchVisible(true)}
          >
            <Ionicons name="create-outline" size={22} color="white" />
          </TouchableOpacity>
        }
      />


      <View style={styles.listContainer}>
        <View style={styles.searchBarWrapper}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {loading ? (
          <Loading size="medium" message="Loading conversations..." />
        ) : (
          <>
            <BrandedRefreshOverlay refreshing={refreshing} top={10} />
            <FlatList
              data={filteredConversations}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                  tintColor="transparent"
                  colors={["transparent"]}
                  progressBackgroundColor="transparent"
                />
              }
            ListEmptyComponent={() => (
              <EmptyState
                icon="chatbubbles-outline"
                title={searchQuery ? "No matches found" : "No messages yet"}
                subtitle={searchQuery ? `No conversations matched "${searchQuery}"` : "Start a conversation with a buyer or seller!"}
                ctaLabel="Start Chatting"
                onCta={() => setSearchVisible(true)}
              />
            )}
            ListHeaderComponent={() => (
              conversations.length > 0 ? (
                <View style={styles.listHeaderContainer}>
                  <Text style={styles.listHeaderTitle}>Active Conversations ({conversations.length})</Text>
                </View>
              ) : <View style={{ height: 10 }} />
            )}
          />
          </>
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
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },

  composeBtnHeader: {
    padding: 8,
  },
  listHeaderContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  listHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: '100%',
    borderRadius: 24,
    marginBottom: 12,
    // Add some margin to separate from the item being swiped
    marginLeft: 10,
  },
  actionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4,
  },

  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 16, 
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 120,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981', 
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
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 40,
    lineHeight: 22,
    fontWeight: '500',
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
    bottom: 140, // Moved higher to avoid floating nav bar conflict
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
