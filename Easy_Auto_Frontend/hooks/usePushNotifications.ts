import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import {
  registerForPushNotificationsAsync,
  registerDeviceWithBackend,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
} from '../utils/pushNotifications';

interface UsePushNotificationsOptions {
  /** Whether to automatically register for push notifications */
  autoRegister?: boolean;
  /** Callback when a notification is received while app is in foreground */
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  /** Callback when user taps on a notification */
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
}

interface UsePushNotificationsReturn {
  /** The Expo push token */
  expoPushToken: string | null;
  /** Whether push notifications are enabled */
  isEnabled: boolean;
  /** Whether we're currently registering */
  isLoading: boolean;
  /** Any error that occurred */
  error: string | null;
  /** Manually trigger registration */
  register: () => Promise<void>;
}

/**
 * Hook to manage push notifications in the app
 */
export function usePushNotifications(
  options: UsePushNotificationsOptions = {}
): UsePushNotificationsReturn {
  const {
    autoRegister = true,
    onNotificationReceived,
    onNotificationTapped,
  } = options;

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notificationListenerRef = useRef<Notifications.Subscription | null>(null);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Handle navigation based on notification data
  const handleNotificationNavigation = useCallback((data: Record<string, unknown> | undefined) => {
    if (!data) return;

    const notificationData = data as { type?: string; screen?: string };
    const { type, screen } = notificationData;

    // Navigate based on notification type or screen
    if (screen) {
      // Direct screen navigation
      switch (screen) {
        case 'Dashboard':
          router.push('/(tabs)');
          break;
        case 'Packages':
          router.push('/packages/packages');
          break;
        case 'Notifications':
          router.push('/notifications/notifications');
          break;
        default:
          // Try to navigate to the screen if it's a valid route
          try {
            router.push(screen as never);
          } catch (e) {
            console.log('Unknown screen:', screen);
          }
      }
    } else if (type) {
      // Navigate based on notification type
      switch (type) {
        case 'PACKAGE_PURCHASE':
          router.push('/(tabs)');
          break;
        case 'PACKAGE_EXPIRY':
        case 'AD_LIMIT_WARNING':
          router.push('/packages/packages');
          break;
        default:
          router.push('/notifications/notifications');
      }
    }
  }, []);

  // Register for push notifications
  const register = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await registerForPushNotificationsAsync();

      if (token) {
        setExpoPushToken(token);
        setIsEnabled(true);

        // Register with backend
        const registered = await registerDeviceWithBackend(token);
        if (!registered) {
          console.warn('Failed to register device with backend');
        }
      } else {
        setIsEnabled(false);
        setError('Could not get push token');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsEnabled(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Setup notification listeners
  useEffect(() => {
    // Auto-register if enabled
    if (autoRegister) {
      register();
    }

    // Listen for notifications received while app is in foreground
    const notificationSubscription = addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });
    notificationListenerRef.current = notificationSubscription;

    // Listen for notification taps
    const responseSubscription = addNotificationResponseListener((response) => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;

      if (onNotificationTapped) {
        onNotificationTapped(response);
      } else {
        // Default navigation handling
        handleNotificationNavigation(data);
      }
    });
    responseListenerRef.current = responseSubscription;

    // Check if app was opened from a notification
    getLastNotificationResponse().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;
        handleNotificationNavigation(data);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListenerRef.current) {
        notificationListenerRef.current.remove();
      }
      if (responseListenerRef.current) {
        responseListenerRef.current.remove();
      }
    };
  }, [autoRegister, onNotificationReceived, onNotificationTapped, register, handleNotificationNavigation]);

  // Re-register when app comes back to foreground (token might have changed)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isEnabled
      ) {
        // App has come to foreground, re-validate token
        register();
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isEnabled, register]);

  return {
    expoPushToken,
    isEnabled,
    isLoading,
    error,
    register,
  };
}

export default usePushNotifications;
