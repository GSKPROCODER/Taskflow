import { useState } from "react";
import { m } from "framer-motion";
import { CheckCheck, Settings2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { popIn } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { notifications, MOCK_NOW, type AppNotification } from "@/lib/mock-data";

const TABS = ["View All", "Files", "Jobs", "Invites"] as const;

function NotificationRow({ n }: { n: AppNotification }) {
  return (
    <div className="flex gap-3 px-4 py-3">
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
          {relativeTime(n.created_at, MOCK_NOW)}
        </p>
        {n.kind === "invite" && (
          <div className="mt-2 flex gap-2">
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
    </div>
  );
}

export function NotificationsPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("View All");
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <m.div
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
            className="rounded-md p-1.5 hover:bg-accent"
            title="Mark all read"
          >
            <CheckCheck className="size-4" />
          </button>
          <button className="rounded-md p-1.5 hover:bg-accent" title="Settings">
            <Settings2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-2">
        {TABS.map((t) => {
          const active = t === tab;
          const count = t === "View All" ? notifications.length : undefined;
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
              {count !== undefined && ` (${count})`}
              {t === "Invites" && ` (${unread})`}
            </button>
          );
        })}
      </div>

      <div className="mt-1 max-h-[340px] divide-y divide-border overflow-y-auto border-t border-border">
        {notifications.map((n) => (
          <NotificationRow key={n.id} n={n} />
        ))}
      </div>

      <Link
        to="/notifications"
        className="flex items-center justify-center gap-1 border-t border-border py-3 text-sm font-medium text-primary hover:underline"
      >
        See More <ChevronRight className="size-4" />
      </Link>
    </m.div>
  );
}
