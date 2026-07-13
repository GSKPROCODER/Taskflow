import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { useDashboardActivity } from "@/hooks/useDashboard";

type Activity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  created_at: string;
};

/** Recent activity widget (PRD FR-DASH-04) — renders system_log feed data. */
export function RecentActivity() {
  const { data: notifications = [] } = useDashboardActivity();
  return (
    <Card className="shadow-sm shadow-slate-200/50 border-border bg-card rounded-[1rem] h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-card px-6 py-4 rounded-t-[1rem]">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-brand hover:text-brand-muted hover:underline"
        >
          View all
        </a>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 overflow-y-auto p-6">
        {notifications.slice(0, 5).map((n: Activity) => (
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
                  <span className="font-semibold text-foreground">
                    {n.actor}
                  </span>{" "}
                  <span className="text-muted-foreground">{n.action}</span>
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {n.target}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground whitespace-nowrap mt-0.5">
              {relativeTime(n.created_at, new Date())}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
