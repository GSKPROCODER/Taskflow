import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/ui";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export interface DashboardMetrics {
  totalTasks?: number;
  inProgress?: number;
  testing?: number;
  done?: number;
  todo?: number;
  priority?: Record<string, number>;
  [key: string]: unknown;
}

export function TaskOverview({
  tasks,
  metrics,
}: {
  tasks?: Task[];
  metrics?: DashboardMetrics;
}) {
  const total = metrics?.totalTasks || tasks?.length || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "text-slate-200";
      case "in_progress":
        return "text-blue-500";
      case "testing":
        return "text-amber-500";
      case "done":
        return "text-emerald-500";
      default:
        return "text-slate-200";
    }
  };

  const getLegendColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-slate-200";
      case "in_progress":
        return "bg-blue-500";
      case "testing":
        return "bg-amber-500";
      case "done":
        return "bg-emerald-500";
      default:
        return "bg-slate-200";
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-sm shadow-slate-200/50 border-border bg-card rounded-[1rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
      <CardHeader className="pb-2 flex flex-row items-center justify-between border-b border-border/50 bg-card px-6 py-4 rounded-t-[1rem]">
        <CardTitle>Task Overview</CardTitle>
        <span className="text-sm font-medium text-brand hover:text-brand-muted hover:underline cursor-pointer">
          View all
        </span>
      </CardHeader>
      <CardContent className="flex items-center justify-between flex-1 p-6">
        <div className="relative flex items-center justify-center h-48 w-48">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {TASK_STATUS_ORDER.map((status) => {
              const count = metrics
                ? ((metrics as Record<string, number>)[
                    status === "in_progress" ? "inProgress" : status
                  ] ?? 0)
                : (tasks?.filter((t) => t.status === status).length ?? 0);
              if (count === 0) return null;

              const pct = count / total;
              const strokeDasharray = `${pct * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += pct * circumference;

              return (
                <circle
                  key={status}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  strokeWidth="15"
                  className={cn("stroke-current", getStatusColor(status))}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold text-foreground">
              {metrics?.totalTasks ?? tasks?.length ?? 0}
            </span>
            <span className="text-sm font-medium text-muted-foreground mt-0.5">
              Total
            </span>
          </div>
        </div>
        <div className="flex flex-col space-y-4 mr-6">
          {TASK_STATUS_ORDER.map((status) => {
            const count = metrics
              ? ((metrics as Record<string, number>)[
                  status === "in_progress" ? "inProgress" : status
                ] ?? 0)
              : (tasks?.filter((t) => t.status === status).length ?? 0);
            return (
              <div key={status} className="flex items-center text-sm">
                <span
                  className={cn(
                    "w-2.5 h-2.5 rounded-full mr-3",
                    getLegendColor(status),
                  )}
                />
                <span className="text-muted-foreground font-medium w-24">
                  {STATUS_LABELS[status]}
                </span>
                <div className="flex items-center justify-end w-16">
                  <span className="font-semibold">{count}</span>
                  <span className="text-xs text-muted-foreground ml-2 w-8 text-right">
                    {total > 0 ? Math.round((count / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
