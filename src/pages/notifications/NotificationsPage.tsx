import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { useNotifications } from "@/hooks/useNotifications";
import { MOCK_NOW } from "@/lib/mock-data";

export function NotificationsPage() {
  const { data: initialNotifications } = useNotifications();
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleInviteAction = (id: string, action: "Approve" | "Cancel") => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              kind: "update",
              action: action === "Approve" ? "accepted the invite for" : "declined the invite for",
              unread: false,
            }
          : n
      )
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`}
        actions={
          <Button variant="outline" onClick={markAllRead} disabled={unreadCount === 0}>
            <CheckCheck /> Mark all read
          </Button>
        }
      />

      <Card>
        <AnimatePresence>
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="divide-y divide-border"
          >
            {notifications.map((n) => (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                variants={staggerItem}
                className="flex items-start gap-3 p-5"
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white",
                    avatarColor(n.actor),
                  )}
                >
                  {initials(n.actor)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{n.actor}</span>{" "}
                    <span className="text-muted-foreground">{n.action}</span>{" "}
                    <span className="font-medium">{n.target}</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {relativeTime(n.created_at, MOCK_NOW)}
                  </p>
                  {n.kind === "invite" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleInviteAction(n.id, "Cancel")}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleInviteAction(n.id, "Approve")}>Approve</Button>
                    </div>
                  )}
                </div>
                {n.unread && (
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
                )}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </Card>
    </div>
  );
}
