import { Ionicons } from '@expo/vector-icons';
import Loading from '@/components/ui/Loading';
import BrandedRefreshOverlay from '@/components/ui/BrandedRefreshOverlay';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors, isDarkMode } = useTheme();

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

  const themeStyles = useMemo(() => getStyles(colors, isDarkMode), [colors, isDarkMode]);

  const renderRightActions = (conversationId: string, otherUserName: string) => {
    return (
      <RectButton
        style={themeStyles.deleteAction}
        onPress={() => handleDeleteConversation(conversationId, otherUserName)}
      >
        <Animated.View style={themeStyles.actionIcon}>
          <Ionicons name="trash-outline" size={30} color="#fff" />
          <Text style={themeStyles.actionText}>Delete</Text>
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
        style={themeStyles.chatItem}
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
        <View style={themeStyles.avatarContainer}>
          {item.other_user.avatar ? (
            <Image source={{ uri: item.other_user.avatar }} style={themeStyles.avatar} />
          ) : (
            <View style={[themeStyles.avatar, themeStyles.placeholderAvatar]}>
              <Text style={themeStyles.avatarText}>{item.other_user.name[0]}</Text>
            </View>
          )}
          <View style={themeStyles.onlineStatusRing}>
            <View style={themeStyles.onlineDot} />
          </View>
        </View>

        <View style={themeStyles.chatContent}>
          <View style={themeStyles.chatHeader}>
            <Text style={themeStyles.name} numberOfLines={1}>{item.other_user.name}</Text>
            {item.last_message && (
              <Text style={[themeStyles.time, item.unread_count > 0 && themeStyles.unreadTime]}>
                {formatTime(item.last_message.created_at)}
              </Text>
            )}
          </View>
          <View style={themeStyles.chatFooter}>
            {typingDict[item.id] ? (
              <Text style={[themeStyles.lastMessage, { color: colors.primary, fontWeight: '700', fontStyle: 'italic' }]} numberOfLines={1}>
                typing...
              </Text>
            ) : (
              <Text
                style={[
                  themeStyles.lastMessage,
                  item.unread_count > 0 && themeStyles.lastMessageBold
                ]}
                numberOfLines={1}
              >
                {item.last_message?.content || 'No messages yet'}
              </Text>
            )}

            {item.unread_count > 0 && (
              <View style={[themeStyles.unreadBadge, { backgroundColor: colors.primary }]}>
                <Text style={themeStyles.unreadText}>{item.unread_count > 9 ? '9+' : item.unread_count}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={themeStyles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

        <Header
          title="Messages"
          rightElement={
            <TouchableOpacity
              style={themeStyles.composeBtnHeader}
              onPress={() => setSearchVisible(true)}
            >
              <Ionicons name="create-outline" size={22} color="white" />
            </TouchableOpacity>
          }
        />


        <View style={themeStyles.listContainer}>
          <View style={themeStyles.searchBarWrapper}>
            <View style={themeStyles.searchBar}>
              <Ionicons name="search-outline" size={20} color={colors.text.muted} style={{ marginRight: 10 }} />
              <TextInput
                style={themeStyles.searchInput}
                placeholder="Search conversations..."
                placeholderTextColor={colors.text.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={18} color={isDarkMode ? colors.text.muted : "#CBD5E1"} />
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
                contentContainerStyle={themeStyles.listContent}
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
                    <View style={themeStyles.listHeaderContainer}>
                      <Text style={themeStyles.listHeaderTitle}>Active Conversations ({conversations.length})</Text>
                    </View>
                  ) : <View style={{ height: 10 }} />
                )}
              />
            </>
          )}
        </View>

        <TouchableOpacity
          style={themeStyles.fab}
          activeOpacity={0.9}
          onPress={() => setSearchVisible(true)}
        >
          <View
            style={[themeStyles.fabGradient, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="add" size={24} color="#fff" />
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

const getStyles = (colors: any, isDarkMode: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  composeBtnHeader: {
    padding: 8,
  },
  listHeaderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  listHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  deleteAction: {
    backgroundColor: colors.status.danger,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 5,
    marginBottom: 0,
    marginLeft: 0,
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
    backgroundColor: colors.background,
    paddingTop: 0,
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.border : '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 5,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 120,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? colors.border : '#F8FAFC',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
  },
  placeholderAvatar: {
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  onlineStatusRing: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.success,
  },

  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  time: {
    fontSize: 11,
    color: colors.text.muted,
    fontWeight: '600',
  },
  unreadTime: {
    color: colors.primary,
    fontWeight: '800',
  },
  lastMessage: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
    flex: 1,
    marginRight: 10,
  },
  lastMessageBold: {
    color: colors.text.primary,
    fontWeight: '700',
  },

  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 10,
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
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text.primary,
    marginTop: 20,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
    fontWeight: '500',
  },
  startBtn: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 5,
  },
  startBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.5,
  },

  fab: {
    position: 'absolute',
    bottom: 130,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: isDarkMode ? colors.border : '#BFDBFE',
    backgroundColor: colors.primary,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

