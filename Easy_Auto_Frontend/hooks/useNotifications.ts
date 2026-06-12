import { useNotifications as useNotificationContext } from '../contexts/NotificationContext';

export type { AppNotification } from '../contexts/NotificationContext';

export function useNotifications() {
    return useNotificationContext();
}

export default useNotifications;
