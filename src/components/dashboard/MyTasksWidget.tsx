import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { formatDate } from "@/lib/format";
import type { Task } from "@/types";

export function MyTasksWidget({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="shadow-sm shadow-slate-200/50 border-border bg-white rounded-[1rem] overflow-hidden">
      <CardHeader className="flex-row items-center justify-between border-b border-border/50 bg-white px-6 py-4">
        <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
        <Link
          to="/my-tasks"
          className="text-sm font-medium text-brand hover:text-brand-muted hover:underline"
        >
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Task</th>
                <th className="px-6 py-3 font-medium">Project</th>
                <th className="px-6 py-3 font-medium">Priority</th>
                <th className="px-6 py-3 font-medium">Due Date</th>
                <th className="px-6 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 bg-white">
              {tasks.slice(0, 5).map((task) => (
                <tr key={task.id} className="group transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-3">
                    <Link to={`/tasks/${task.id}`} className="font-medium text-foreground hover:text-brand transition-colors block truncate max-w-[200px]">
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-muted-foreground truncate max-w-[150px]">
                    {(task as Task & { projects?: { name: string } }).projects?.name ?? "—"}
                  </td>
                  <td className="px-6 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-6 py-3 text-muted-foreground">
                    {task.due_date ? formatDate(task.due_date) : "—"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end">
                      <TaskStatusBadge status={task.status} />
                    </div>
                  </td>
                </tr>
              ))}
              {tasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
