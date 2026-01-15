import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { DUMMY_CHAT } from '../../constants/dummydata/chat-dummy';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { Stack } from 'expo-router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

const Chat = () => {
  // Protect this route - require authentication
  useProtectedRoute();
  
  // Get the heading from the first chat message sender, fallback to default
  const heading = DUMMY_CHAT[0]?.sender || 'Chat';
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{heading}</Text>
          <Ionicons name="checkmark-circle" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="call-outline" size={22} color="#fff" style={styles.headerIcon} />
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" style={styles.headerIcon} />
        </View>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.dateWrap}>
          <Text style={styles.dateText}>Today</Text>
        </View>
        {DUMMY_CHAT.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrap,
              msg.type === 'sent' ? styles.sent : styles.received,
            ]}
          >
            {msg.message ? (
              <Text style={msg.type === 'sent' ? styles.sentMessageText : styles.messageText}>{msg.message}</Text>
            ) : null}
            {msg.images && (
              <View style={styles.imageRow}>
                {msg.images.map((img, idx) => (
                  <Image
                    key={idx}
                    source={img}
                    style={styles.image}
                    resizeMode="cover"
                  />
                ))}
              </View>
            )}
            <Text style={styles.time}>{msg.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8, // increased
    paddingBottom: 8, // increased
    minHeight: 120, // increased height
    backgroundColor: '#235CF8',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22
    ,
    letterSpacing: 0.5,
    marginLeft: 12,
  },
  headerIcon: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  messageWrap: {
    maxWidth: '80%',
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#454545ff',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
  },
  messageText: {
    color: '#111',
    fontSize: 15,
    marginBottom: 4,
  },
  sentMessageText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
  imageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  image: {
    width: 90,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
  },
  time: {
    fontSize: 11,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  dateWrap: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  dateText: {
    backgroundColor: '#E5E7EB',
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 14,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    letterSpacing: 0.2,
  },
});

export default Chat;
