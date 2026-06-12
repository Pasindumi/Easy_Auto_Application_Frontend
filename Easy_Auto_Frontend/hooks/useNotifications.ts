import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../utils/api';
import { socketService } from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface UseNotificationsReturn {
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useNotifications(): UseNotificationsReturn {
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

    // ── Fetch unread count ─────────────────────────────────────────────────

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get<UnreadCountResponse>('/api/notifications/unread-count');
            if (res.success && isMounted.current) {
                setUnreadCount(res.count);
            }
        } catch (err) {
            // Silently fail — badge just stays as-is
        }
    }, [isAuthenticated]);

    // ── Fetch page of notifications ────────────────────────────────────────

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

    // ── Initial load ───────────────────────────────────────────────────────

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

    // ── Socket.IO real-time listener ───────────────────────────────────────

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        // Connect socket with user ID so the backend emits to this user's room
        socketService.connect(user.id);

        // Listen for new in-app notifications pushed from the backend
        socketService.onNotification((newNotification: AppNotification) => {
            if (!isMounted.current) return;

            // Prepend to top of list
            setNotifications(prev => [newNotification, ...prev]);
            // Increment badge
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socketService.removeListeners();
        };
    }, [isAuthenticated, user?.id]);

    // ── Public API ─────────────────────────────────────────────────────────

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
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));

        try {
            await api.patch(`/api/notifications/${id}/read`);
        } catch (err) {
            // Revert on failure
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        try {
            await api.patch('/api/notifications/read-all');
        } catch (err) {
            // Refresh from server on failure
            await refresh();
        }
    }, [refresh]);

    return {
        notifications,
        unreadCount,
        isLoading,
        isRefreshing,
        hasMore,
        refresh,
        loadMore,
        markAsRead,
        markAllAsRead,
    };
}

export default useNotifications;
