import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
    Modal,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../utils/api';
import { ENDPOINTS } from '../../constants/API';

interface User {
    id: string;
    name: string;
    avatar: string | null;
    email: string;
}

interface UserSearchProps {
    visible: boolean;
    onClose: () => void;
    onSelectUser: (user: User) => void;
}

export default function UserSearch({ visible, onClose, onSelectUser }: UserSearchProps) {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query.length >= 2) {
            const delayDebounceFn = setTimeout(() => {
                searchUsers();
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setUsers([]);
        }
    }, [query]);

    const searchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get<{ success: boolean; data: User[] }>(
                `${ENDPOINTS.CHAT}/users/search?q=${query}`
            );
            if (response.success) {
                setUsers(response.data);
            }
        } catch (error) {
            console.error('Search Users Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderUser = ({ item }: { item: User }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => onSelectUser(item)}
        >
            <View style={styles.avatarContainer}>
                {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                        <Text style={styles.avatarText}>{item.name[0]}</Text>
                    </View>
                )}
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={28} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>New Message</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users by name..."
                        value={query}
                        onChangeText={setQuery}
                        autoFocus
                    />
                    {loading && <ActivityIndicator size="small" color="#235CF8" />}
                </View>

                <FlatList
                    data={users}
                    renderItem={renderUser}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {query.length < 2 ? 'Type at least 2 characters to search' : 'No users found'}
                            </Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    closeBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#111827',
    },
    listContent: {
        paddingHorizontal: 15,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F8FAFC',
    },
    avatarContainer: {
        marginRight: 15,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    placeholderAvatar: {
        backgroundColor: '#F0F4FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#235CF8',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    userEmail: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
    emptyContainer: {
        paddingTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 15,
    },
});
