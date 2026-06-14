import { motion } from "framer-motion";
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
  const { data: notifications, unreadCount } = useNotifications();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        subtitle={`You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`}
        actions={
          <Button variant="outline">
            <CheckCheck /> Mark all read
          </Button>
        }
      />

      <Card>
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="divide-y divide-border"
        >
          {notifications.map((n) => (
            <motion.li
              key={n.id}
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
                    <Button size="sm" variant="outline">
                      Cancel
                    </Button>
                    <Button size="sm">Approve</Button>
                  </div>
                )}
              </div>
              {n.unread && (
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
              )}
            </motion.li>
          ))}
        </motion.ul>
      </Card>
    </div>
  );
}
