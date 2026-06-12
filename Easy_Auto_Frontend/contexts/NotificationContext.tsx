import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { socketService } from '../utils/socket';
import { useAuth } from './AuthContext';

export interface AppNotification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    data: Record<string, any> | null;
    is_read: boolean;
    created_at: string;
}

interface NotificationsResponse {
    success: boolean;
    data: AppNotification[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasMore: boolean;
    };
}

interface UnreadCountResponse {
    success: boolean;
    count: number;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    isLoading: boolean;
    isRefreshing: boolean;
    hasMore: boolean;
    refresh: () => Promise<void>;
    loadMore: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuth();

    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get<UnreadCountResponse>('/api/notifications/unread-count');
            if (res.success && isMounted.current) {
                setUnreadCount(res.count);
            }
        } catch (err) {
            // Silently fail
        }
    }, [isAuthenticated]);

    const fetchNotifications = useCallback(async (pageNum: number, replace: boolean) => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get<NotificationsResponse>(
                `/api/notifications?page=${pageNum}&limit=20`
            );
            if (res.success && isMounted.current) {
                setNotifications(prev =>
                    replace ? res.data : [...prev, ...res.data]
                );
                setHasMore(res.pagination.hasMore);
                setPage(pageNum);
            }
        } catch (err) {
            console.warn('[useNotifications] fetch error:', err);
        }
    }, [isAuthenticated]);

    // Initial load
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            setUnreadCount(0);
            return;
        }

        const load = async () => {
            setIsLoading(true);
            await Promise.all([
                fetchNotifications(1, true),
                fetchUnreadCount(),
            ]);
            if (isMounted.current) setIsLoading(false);
        };

        load();
    }, [isAuthenticated]);

    // Socket listener (shared, only runs once because provider stays mounted)
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        socketService.connect(user.id);

        socketService.onNotification((newNotification: AppNotification) => {
            if (!isMounted.current) return;

            setNotifications(prev => {
                // Prevent duplicate socket notifications in list
                if (prev.some(n => n.id === newNotification.id)) return prev;
                return [newNotification, ...prev];
            });
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socketService.removeListeners();
        };
    }, [isAuthenticated, user?.id]);

    const refresh = useCallback(async () => {
        setIsRefreshing(true);
        await Promise.all([
            fetchNotifications(1, true),
            fetchUnreadCount(),
        ]);
        if (isMounted.current) setIsRefreshing(false);
    }, [fetchNotifications, fetchUnreadCount]);

    const loadMore = useCallback(async () => {
        if (!hasMore) return;
        await fetchNotifications(page + 1, false);
    }, [hasMore, page, fetchNotifications]);

    const markAsRead = useCallback(async (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.patch(`/api/notifications/${id}/read`);
        } catch (err) {
            // Revert
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await api.patch('/api/notifications/read-all');
        } catch (err) {
            await refresh();
        }
    }, [refresh]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            isLoading,
            isRefreshing,
            hasMore,
            refresh,
            loadMore,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
