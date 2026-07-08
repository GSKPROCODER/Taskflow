import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/ui";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

/** Status breakdown widget (PRD FR-DASH-02). */
export function StatusBreakdown({ tasks }: { tasks: Task[] }) {
  const total = tasks.length || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "text-slate-200";
      case "in_progress": return "text-blue-500";
      case "testing": return "text-amber-500";
      case "done": return "text-emerald-500";
      default: return "text-slate-200";
    }
  };

  const getLegendColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-slate-200";
      case "in_progress": return "bg-blue-500";
      case "testing": return "bg-amber-500";
      case "done": return "bg-emerald-500";
      default: return "bg-slate-200";
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle>Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between flex-1">
        <div className="relative flex items-center justify-center h-40 w-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {TASK_STATUS_ORDER.map((status) => {
              const count = tasks.filter((t) => t.status === status).length;
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
        </div>
        <div className="flex flex-col space-y-3 mr-4">
          {TASK_STATUS_ORDER.map((status) => {
            const count = tasks.filter((t) => t.status === status).length;
            return (
              <div key={status} className="flex items-center text-sm">
                <span className={cn("w-2.5 h-2.5 rounded-full mr-2", getLegendColor(status))} />
                <span className="text-muted-foreground w-20">{STATUS_LABELS[status]}</span>
                <span className="font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
