import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { notifications, MOCK_NOW } from "@/lib/mock-data";

/** Recent activity widget (PRD FR-DASH-04) — reuses notification feed data. */
export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.slice(0, 5).map((n) => (
          <div key={n.id} className="flex gap-3">
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
                avatarColor(n.actor),
              )}
            >
              {initials(n.actor)}
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-snug">
                <span className="font-medium">{n.actor}</span>{" "}
                <span className="text-muted-foreground">{n.action}</span>{" "}
                <span className="font-medium">{n.target}</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {relativeTime(n.created_at, MOCK_NOW)}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
