/**
 * Notifications data hook (PRD §5.6 / topbar bell).
 *
 * There is no /notifications API endpoint yet (post-MVP, see AGENTS.md §12).
 * Returns an empty array so the UI renders a clean "no notifications" state
 * instead of lying with fake data.
 */

export interface Notification {
  id: string;
  title: string;
  body: string;
  kind: "update" | "mention" | "invite" | "document";
  unread: boolean;
  created_at: string;
  actor: string;
  action: string;
  target: string;
}

export function useNotifications() {
  const data: Notification[] = [];
  const unreadCount = 0;
  return { data, unreadCount, isLoading: false } as const;
}
