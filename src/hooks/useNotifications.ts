import { notifications } from "@/lib/mock-data";

// Notifications data hook (PRD §5.6 / topbar bell). Mock-backed for the UI pass.
export function useNotifications() {
  const unreadCount = notifications.filter((n) => n.unread).length;
  return { data: notifications, unreadCount, isLoading: false } as const;
}
