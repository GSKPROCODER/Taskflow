import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { STATUS_LABELS, STATUS_BAR, TASK_STATUS_ORDER } from "@/lib/ui";
import type { Task } from "@/types";

/** Status breakdown widget (PRD FR-DASH-02). */
export function StatusBreakdown({ tasks }: { tasks: Task[] }) {
  const total = tasks.length || 1;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {TASK_STATUS_ORDER.map((status) => {
          const count = tasks.filter((t) => t.status === status).length;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {STATUS_LABELS[status]}
                </span>
                <span className="font-medium">{count}</span>
              </div>
              <Progress value={pct} barClassName={STATUS_BAR[status]} />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
