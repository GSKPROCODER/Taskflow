import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { notifications, MOCK_NOW } from "@/lib/mock-data";

/** Recent activity widget (PRD FR-DASH-04) — reuses notification feed data. */
export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <a href="#" className="text-sm font-medium text-brand hover:underline">View all</a>
      </CardHeader>
      <CardContent className="space-y-6">
        {notifications.slice(0, 5).map((n) => (
          <div key={n.id} className="flex justify-between items-start">
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
                  avatarColor(n.actor),
                )}
              >
                {initials(n.actor)}
              </div>
              <div className="min-w-0">
                <p className="text-sm">
                  <span className="font-semibold text-foreground">{n.actor}</span>{" "}
                  <span className="text-muted-foreground">{n.action}</span>
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {n.target}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
              {relativeTime(n.created_at, MOCK_NOW)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
