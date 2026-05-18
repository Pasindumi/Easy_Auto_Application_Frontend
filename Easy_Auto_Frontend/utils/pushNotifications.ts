import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import api from './api';
import { API_URL } from '../constants/API';

// Debug: Log the API URL being used
console.log('[PushNotifications] API_URL:', API_URL);

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Register for push notifications and get the Expo push token
 * @returns {Promise<string | null>} The Expo push token or null if registration failed
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token: string | null = null;

  // Push notifications only work on physical devices
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device');
    return null;
  }

  // Check and request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return null;
  }

  try {
    // Get the Expo push token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    
    if (projectId) {
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      token = tokenData.data;
    } else {
      // For development without EAS, try without projectId
      console.log('Project ID not found. Trying without projectId for development...');
      const tokenData = await Notifications.getExpoPushTokenAsync();
      token = tokenData.data;
    }

    console.log('Expo Push Token:', token);
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }

  // Setup Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

/**
 * Register the device token with the backend
 * @param expoPushToken - The Expo push token
 * @returns Whether registration was successful
 */
export async function registerDeviceWithBackend(expoPushToken: string): Promise<boolean> {
  try {
    const fullUrl = `${API_URL}/api/devices/register`;
    console.log('[PushNotifications] Registering device at:', fullUrl);
    
    const response = await api.post<{ success: boolean; message: string }>(
      '/api/devices/register',
      {
        expoPushToken,
        platform: Platform.OS,
        deviceId: Device.modelId ?? Device.deviceName ?? undefined,
      }
    );

    console.log('Device registered with backend:', response.message);
    return response.success ?? false;
  } catch (error) {
    console.error('Error registering device with backend:', error);
    return false;
  }
}

/**
 * Unregister the device token from the backend
 * @param expoPushToken - The Expo push token to unregister
 */
export async function unregisterDeviceFromBackend(expoPushToken: string): Promise<boolean> {
  try {
    const response = await api.post<{ success: boolean }>(
      '/api/devices/unregister',
      { expoPushToken }
    );
    return response.success ?? false;
  } catch (error) {
    console.error('Error unregistering device:', error);
    return false;
  }
}

/**
 * Logout all devices (remove all push tokens for current user)
 */
export async function logoutAllDevices(): Promise<boolean> {
  try {
    const response = await api.post<{ success: boolean }>('/api/devices/logout');
    return response.success ?? false;
  } catch (error) {
    console.error('Error logging out devices:', error);
    return false;
  }
}

/**
 * Add a listener for when a notification is received while app is in foreground
 */
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Add a listener for when user taps on a notification
 */
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

/**
 * Get the last notification response (if app was opened from a notification)
 */
export async function getLastNotificationResponse() {
  return await Notifications.getLastNotificationResponseAsync();
}

/**
 * Schedule a local notification (for testing)
 */
export async function scheduleLocalNotification(
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<string> {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 1,
    },
  });
}

/**
 * Get current badge count
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Set badge count
 */
export async function setBadgeCount(count: number): Promise<boolean> {
  return await Notifications.setBadgeCountAsync(count);
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  await Notifications.dismissAllNotificationsAsync();
}

export default {
  registerForPushNotificationsAsync,
  registerDeviceWithBackend,
  unregisterDeviceFromBackend,
  logoutAllDevices,
  addNotificationReceivedListener,
  addNotificationResponseListener,
  getLastNotificationResponse,
  scheduleLocalNotification,
  getBadgeCount,
  setBadgeCount,
  clearAllNotifications,
};
