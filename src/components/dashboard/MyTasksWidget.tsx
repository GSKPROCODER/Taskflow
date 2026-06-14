import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { formatDate } from "@/lib/format";
import type { Task } from "@/types";

/** "My tasks" widget (PRD FR-DASH-03). */
export function MyTasksWidget({ tasks }: { tasks: Task[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>My tasks</CardTitle>
        <Link
          to="/my-tasks"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          View all <ArrowUpRight className="size-4" />
        </Link>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {tasks.slice(0, 5).map((task) => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="-mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent/50"
          >
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {task.title}
            </span>
            <PriorityBadge priority={task.priority} />
            <TaskStatusBadge status={task.status} />
            <span className="hidden w-16 shrink-0 text-right text-xs text-muted-foreground sm:block">
              {task.due_date ? formatDate(task.due_date) : "—"}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
