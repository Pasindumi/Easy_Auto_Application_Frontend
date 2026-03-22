import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    Modal,
    Alert,
    Platform as RNPlatform,
    StatusBar
} from 'react-native';
import Header from '@/components/Header';
import Loading from '@/components/ui/Loading';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../constants/API';
import * as Haptics from 'expo-haptics';
import socketService from '../../utils/socket';
import COLORS from '@/constants/Colors';

interface Message {
    id: string;
    sender_id: string;
    content: string;
    created_at: string;
    type: string;
    is_read: boolean;
    metadata?: any;
}

interface User {
    id: string;
    name: string;
    avatar: string | null;
}

export default function ChatRoomScreen() {
    const { id: conversationId, adId, adTitle, adImage } = useLocalSearchParams<{
        id: string;
        adId?: string;
        adTitle?: string;
        adImage?: string;
    }>();
    const router = useRouter();
    const { user } = useAuth();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [otherUser, setOtherUser] = useState<User | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [autoMessageSent, setAutoMessageSent] = useState(false);
    const [adAttached, setAdAttached] = useState<any>(null);
    const [showNegotiationModal, setShowNegotiationModal] = useState(false);
    const [proposedPrice, setProposedPrice] = useState('');

    useEffect(() => {
        if (adId && adTitle) {
            setAdAttached({ id: adId, title: adTitle, image: adImage });
        }
    }, [adId, adTitle, adImage]);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        if (conversationId && user?.id) {
            fetchMessages();
            socketService.joinConversation(conversationId);

            socketService.onNewMessage((message) => {
                setMessages((prev) => [...prev, message]);
                // Scroll to bottom
                setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
            });

            socketService.onTyping((data) => {
                if (data.userId !== user.id) {
                    setIsTyping(data.isTyping);
                }
            });

            return () => {
                // Leave room or stop listening
            };
        }
    }, [conversationId, user?.id]);

    const fetchMessages = async () => {
        try {
            // 1. Get messages
            const response = await api.get<{ success: boolean; data: Message[] }>(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`
            );
            if (response.success) {
                setMessages(response.data);

                // Auto-send contextual message if it's a new conversation and we have ad context
                if (response.data.length === 0 && adId && adTitle && !autoMessageSent) {
                    setAutoMessageSent(true);
                    sendAutoInquiry(adTitle);
                }
            }

            // 2. Get conversation details (to get other user info)
            const convResponse = await api.get<{ success: boolean; data: any[] }>(
                `${ENDPOINTS.CHAT}/conversations`
            );
            if (convResponse.success) {
                const currentConv = convResponse.data.find((c: any) => c.id === conversationId);
                if (currentConv) {
                    setOtherUser(currentConv.other_user);
                }
            }
        } catch (error) {
            console.error('Fetch Messages Error:', error);
        } finally {
            setLoading(false);
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 200);
        }
    };

    const handleSendMessage = async () => {
        if (!inputText.trim()) return;

        const content = inputText.trim();
        const metadata = adAttached ? { ad: adAttached } : null;

        setInputText('');
        setAdAttached(null);
        handleTyping(false);

        try {
            const response = await api.post<{ success: boolean; data: Message }>(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`,
                { content, metadata }
            );
        } catch (error) {
            console.error('Send Message Error:', error);
        }
    };

    const handleAttachDocument = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                // In a real app, you'd upload the image to storage (Supabase/S3) first
                // For now, we'll send it as a message with the local URI as metadata
                const metadata = { image: asset.uri };
                await api.post<{ success: boolean; data: Message }>(
                    `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`,
                    { content: 'Sent a photo', metadata, type: 'image' }
                );
            }
        } catch (error) {
            console.error('Pick Image Error:', error);
            Alert.alert("Error", "Failed to pick image.");
        }
    };

    const handleSendNegotiation = async () => {
        if (!proposedPrice.trim()) return;

        const amount = proposedPrice.trim();
        const content = `Proposing a price of Rs. ${amount}`;
        const metadata = {
            negotiation: {
                amount,
                status: 'pending'
            }
        };

        setProposedPrice('');
        setShowNegotiationModal(false);

        try {
            await api.post<{ success: boolean; data: Message }>(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`,
                { content, metadata, type: 'negotiation' }
            );
        } catch (error) {
            console.error('Send Negotiation Error:', error);
            Alert.alert("Error", "Failed to send proposal.");
        }
    };

    const handleNegotiationAction = async (messageId: string, action: 'accepted' | 'declined') => {
        // In a real app, this would be a PATCH to update the message metadata
        // For now, we'll send a follow-up message
        const content = action === 'accepted' ? "I've accepted your offer!" : "I'm sorry, I cannot accept that price.";
        try {
            await api.post(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`,
                { content }
            );
            Alert.alert("Success", `Offer ${action}`);
        } catch (error) {
            console.error('Negotiation Action Error:', error);
        }
    };

    const sendAutoInquiry = async (title: string) => {
        const content = `Hi, I am interested in your ad: ${title}`;
        try {
            await api.post<{ success: boolean; data: Message }>(
                `${ENDPOINTS.CHAT}/conversations/${conversationId}/messages`,
                { content }
            );
        } catch (error) {
            console.error('Send Auto Inquiry Error:', error);
        }
    };

    const handleTyping = (typing: boolean) => {
        if (user?.id && conversationId) {
            socketService.emitTyping(conversationId, user.id, typing);
        }
    };

    const handleDeleteMessage = async (messageId: string) => {
        Alert.alert(
            "Delete Message",
            "Are you sure you want to delete this message?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await api.delete<{ success: boolean; message: string }>(
                                `${ENDPOINTS.CHAT}/messages/${messageId}`
                            );
                            if (response.success) {
                                setMessages(prev => prev.filter(m => m.id !== messageId));
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            } else {
                                Alert.alert("Error", response.message || "Failed to delete message");
                            }
                        } catch (error) {
                            console.error('Delete Message Error:', error);
                            Alert.alert("Error", "An error occurred while deleting the message");
                        }
                    }
                }
            ]
        );
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.sender_id === user?.id;
        const metadata = item.metadata;

        return (
            <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.otherMessageWrapper]}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        handleDeleteMessage(item.id);
                    }}
                    style={[styles.messageBubble, isMe ? styles.myBubble : styles.otherBubble]}
                >
                    {metadata?.ad && (
                        <TouchableOpacity
                            style={styles.quotedAdContainer}
                            onPress={() => router.push(`/cars/${metadata.ad.id}`)}
                            activeOpacity={0.8}
                        >
                            <Image
                                source={{ uri: metadata.ad.image }}
                                style={styles.quotedAdImage}
                                resizeMode="cover"
                            />
                            <View style={styles.quotedAdInfo}>
                                <Text style={styles.quotedAdLabel}>Inquiry Regarding</Text>
                                <Text style={styles.quotedAdTitle} numberOfLines={1}>{metadata.ad.title}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#64748B" />
                        </TouchableOpacity>
                    )}

                    {metadata?.negotiation && (
                        <View style={styles.negotiationCard}>
                            <View style={styles.negotiationHeader}>
                                <MaterialCommunityIcons name="handshake" size={24} color="#235CF8" />
                                <Text style={styles.negotiationTitle}>Price Proposal</Text>
                            </View>
                            <Text style={styles.negotiationAmount}>Rs. {metadata.negotiation.amount}</Text>
                            {!isMe && metadata.negotiation.status === 'pending' && (
                                <View style={styles.negotiationActions}>
                                    <TouchableOpacity
                                        style={[styles.negBtn, styles.acceptBtn]}
                                        onPress={() => handleNegotiationAction(item.id, 'accepted')}
                                    >
                                        <Text style={styles.negBtnText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.negBtn, styles.declineBtn]}
                                        onPress={() => handleNegotiationAction(item.id, 'declined')}
                                    >
                                        <Text style={styles.negBtnText}>Decline</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                            {metadata.negotiation.status !== 'pending' && (
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusBadgeText}>
                                        {metadata.negotiation.status.toUpperCase()}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    {metadata?.image && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: metadata.image }} style={styles.messageImage} resizeMode="cover" />
                        </View>
                    )}

                    {(!metadata?.negotiation || item.content !== `Proposing a price of Rs. ${metadata.negotiation.amount}`) && (
                        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
                            {item.content}
                        </Text>
                    )}
                    <View style={styles.messageBottom}>
                        <Text style={[styles.messageTime, isMe ? styles.myTime : styles.otherTime]}>
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {isMe && (
                            <Ionicons
                                name={item.is_read ? "checkmark-done" : "checkmark"}
                                size={14}
                                color={item.is_read ? "#fff" : "rgba(255,255,255,0.7)"}
                                style={styles.statusIcon}
                            />
                        )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Standardized Header */}
            <Header
                showBack={true}
                centerElement={
                    <View style={styles.headerUserInfo}>
                        <View style={styles.avatarContainer}>
                            {otherUser?.avatar ? (
                                <Image source={{ uri: otherUser.avatar }} style={styles.avatarImage} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarInitial}>
                                        {otherUser?.name?.charAt(0) || 'U'}
                                    </Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerName} numberOfLines={1}>
                                {otherUser?.name || 'Loading...'}
                            </Text>
                            {isTyping ? (
                                <Text style={styles.typingText}>typing...</Text>
                            ) : (
                                <Text style={styles.statusText}>Online</Text>
                            )}
                        </View>
                    </View>
                }
                rightElement={
                    <View style={styles.headerActions}>
                        <TouchableOpacity
                            style={styles.headerActionBtn}
                            onPress={() => setShowNegotiationModal(true)}
                        >
                            <MaterialCommunityIcons name="handshake-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerActionBtn}>
                            <Ionicons name="call-outline" size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>
                }
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={RNPlatform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={RNPlatform.OS === 'ios' ? 0 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                {adAttached && (
                    <View style={styles.replyAdBanner}>
                        <View style={styles.replyAdThumbnail}>
                            <Image source={{ uri: adAttached.image }} style={styles.replyAdImage} />
                        </View>
                        <View style={styles.replyAdInfo}>
                            <Text style={styles.replyAdLabel}>Replying to Ad</Text>
                            <Text style={styles.replyAdTitle} numberOfLines={1}>{adAttached.title}</Text>
                        </View>
                        <TouchableOpacity onPress={() => setAdAttached(null)} style={styles.closeReplyBtn}>
                            <Ionicons name="close-circle" size={24} color="#64748B" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachBtn} onPress={handleAttachDocument}>
                        <Feather name="paperclip" size={22} color="#64748B" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        value={inputText}
                        onChangeText={(text) => {
                            setInputText(text);
                            handleTyping(text.length > 0);
                        }}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>



            <Modal
                visible={showNegotiationModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowNegotiationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.negotiationModal}>
                        <Text style={styles.modalTitle}>Propose a Price</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="Enter amount"
                            keyboardType="numeric"
                            value={proposedPrice}
                            onChangeText={setProposedPrice}
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowNegotiationModal(false)}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={handleSendNegotiation}
                            >
                                <Text style={styles.confirmBtnText}>Send Proposal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View >
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    // Custom Header Styles
    customHeader: {
        backgroundColor: COLORS.primary,
        width: "100%",
        paddingBottom: 24,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        zIndex: 100,
    },
    headerSafeArea: {
        width: '100%',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        gap: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerUserInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    avatarInitial: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerTextContainer: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 2,
    },
    statusText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.7)',
    },
    typingText: {
        fontSize: 11,
        color: '#4ADE80',
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerActionBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
    },
    // End Custom Header Styles

    adContextBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#EFF6FF',
        borderBottomWidth: 1,
        borderBottomColor: '#DBEAFE',
        gap: 8
    },
    adContextText: {
        fontSize: 13,
        color: '#1E40AF',
    },
    replyAdBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#F8F9FA',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingHorizontal: 15,
    },
    replyAdThumbnail: {
        width: 40,
        height: 40,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#E2E8F0',
    },
    replyAdImage: {
        width: '100%',
        height: '100%',
    },
    replyAdInfo: {
        flex: 1,
        marginLeft: 12,
    },
    replyAdLabel: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    replyAdTitle: {
        fontSize: 14,
        color: '#1E293B',
        fontWeight: '500',
    },
    closeReplyBtn: {
        padding: 5,
    },
    quotedAdContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        padding: 8,
        marginBottom: 8,
        alignItems: 'center',
        borderLeftWidth: 3,
        borderLeftColor: '#235CF8',
    },
    quotedAdImage: {
        width: 40,
        height: 40,
        borderRadius: 6,
    },
    quotedAdInfo: {
        flex: 1,
        marginLeft: 10,
    },
    quotedAdLabel: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    quotedAdTitle: {
        fontSize: 13,
        color: '#1E293B',
        fontWeight: '600',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    listContent: {
        padding: 15,
        paddingBottom: 20,
    },
    messageWrapper: {
        marginBottom: 10,
        maxWidth: '80%',
    },
    myMessageWrapper: {
        alignSelf: 'flex-end',
    },
    otherMessageWrapper: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 22,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    myBubble: {
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: 6,
    },
    otherBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 6,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
        flexShrink: 1,
    },
    myMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#1E293B',
    },
    messageTime: {
        fontSize: 10,
    },
    messageBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: 4,
        gap: 4,
    },
    statusIcon: {
        marginLeft: 2,
    },
    myTime: {
        color: 'rgba(255,255,255,0.7)',
    },
    otherTime: {
        color: '#94A3B8',
    },
    imageContainer: {
        width: 200,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    messageImage: {
        width: '100%',
        height: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12, // Better padding for modern screens
    },
    attachBtn: {
        padding: 5,
    },
    input: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginHorizontal: 12,
        maxHeight: 120,
        fontSize: 16,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sendBtn: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    sendBtnDisabled: {
        backgroundColor: '#CBD5E1',
    },
    // Negotiation Styles
    negotiationCard: {
        backgroundColor: '#F0F7FF',
        borderRadius: 15,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#D0E4FF',
    },
    negotiationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    negotiationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#235CF8',
    },
    negotiationAmount: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
        marginVertical: 10,
    },
    negotiationActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 5,
    },
    negBtn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptBtn: {
        backgroundColor: '#235CF8',
    },
    declineBtn: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    negBtnText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#fff',
    },
    statusBadge: {
        alignSelf: 'center',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E2E8F0',
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    negotiationModal: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 20,
    },
    priceInput: {
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        padding: 15,
        fontSize: 20,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F1F5F9',
    },
    confirmBtn: {
        backgroundColor: '#235CF8',
    },
    cancelBtnText: {
        color: '#64748B',
        fontWeight: 'bold',
    },
    confirmBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
