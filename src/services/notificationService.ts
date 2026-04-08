import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

export interface NotificationItem {
  id: string;
  type: "transaction" | "accounting" | "system";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedId?: string;
}

const NOTIFICATIONS_KEY = "koperasi_notifications";

export function getNotifications(): NotificationItem[] {
  return getFromLocalStorage<NotificationItem[]>(NOTIFICATIONS_KEY, []);
}

export function addNotification(notification: Omit<NotificationItem, "id" | "timestamp" | "isRead">): void {
  const notifications = getNotifications();
  const newNotification: NotificationItem = {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  notifications.unshift(newNotification);
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  saveToLocalStorage(NOTIFICATIONS_KEY, notifications);
}

export function markNotificationAsRead(id: string): void {
  const notifications = getNotifications();
  const notification = notifications.find(n => n.id === id);
  if (notification) {
    notification.isRead = true;
    saveToLocalStorage(NOTIFICATIONS_KEY, notifications);
  }
}

export function markAllNotificationsAsRead(): void {
  const notifications = getNotifications();
  notifications.forEach(n => n.isRead = true);
  saveToLocalStorage(NOTIFICATIONS_KEY, notifications);
}

export function getUnreadNotificationsCount(): number {
  const notifications = getNotifications();
  return notifications.filter(n => !n.isRead).length;
}

export function clearAllNotifications(): void {
  saveToLocalStorage(NOTIFICATIONS_KEY, []);
}
