import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCheck, Settings2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { popIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useNotifications, type Notification } from "@/hooks/useNotifications";

const TABS = ["View All", "Files", "Jobs", "Invites"] as const;

function NotificationRow({
  n,
  onAction,
}: {
  n: Notification;
  onAction: (id: string, action: "Approve" | "Cancel") => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex gap-3 px-4 py-3"
    >
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
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
          {relativeTime(n.created_at, new Date())}
        </p>
        {n.kind === "invite" && (
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAction(n.id, "Cancel")}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={() => onAction(n.id, "Approve")}>
              Approve
            </Button>
          </div>
        )}
      </div>
      {n.unread && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-500" />
      )}
    </motion.div>
  );
}

export function NotificationsPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("View All");
  const { data: initialNotifications } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications as Notification[]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (tab === "View All") return true;
      if (tab === "Files") return n.kind === "document";
      if (tab === "Jobs") return n.kind === "update";
      if (tab === "Invites") return n.kind === "invite";
      return true;
    });
  }, [notifications, tab]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleInviteAction = (id: string, action: "Approve" | "Cancel") => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              kind: "update", // update kind to hide buttons
              action:
                action === "Approve"
                  ? "accepted the invite for"
                  : "declined the invite for",
              unread: false,
            }
          : n,
      ),
    );
  };

  return (
    <motion.div
      variants={popIn}
      initial="hidden"
      animate="show"
      exit="exit"
      className="w-[380px] overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
    >
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-semibold">Notifications</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="rounded-md p-1.5 hover:bg-accent disabled:opacity-50"
            title="Mark all read"
          >
            <CheckCheck className="size-4" />
          </button>
          <Link
            to="/settings"
            className="rounded-md p-1.5 hover:bg-accent"
            title="Settings"
          >
            <Settings2 className="size-4" />
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-1 px-2">
        {TABS.map((t) => {
          const active = t === tab;
          const count =
            t === "View All"
              ? notifications.length
              : t === "Files"
                ? notifications.filter((n) => n.kind === "document").length
                : t === "Jobs"
                  ? notifications.filter((n) => n.kind === "update").length
                  : t === "Invites"
                    ? notifications.filter((n) => n.kind === "invite").length
                    : 0;

          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
              {count !== undefined && count > 0 && ` (${count})`}
            </button>
          );
        })}
      </div>

      <div className="mt-1 max-h-[340px] divide-y divide-border overflow-y-auto border-t border-border">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <NotificationRow key={n.id} n={n} onAction={handleInviteAction} />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center text-sm text-muted-foreground"
            >
              No {tab.toLowerCase()} notifications found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Link
        to="/notifications"
        className="flex items-center justify-center gap-1 border-t border-border py-3 text-sm font-medium text-primary hover:underline"
      >
        See More <ChevronRight className="size-4" />
      </Link>
    </motion.div>
  );
}
