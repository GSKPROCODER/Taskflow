import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronsUpDown } from "lucide-react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { formatDate } from "@/lib/format";
import { userById } from "@/lib/mock-data";
import type { Task } from "@/types";

const COLUMNS = [
  "Task ID",
  "Task Name",
  "Description",
  "Status",
  "Priority",
  "Due date",
  "People",
] as const;

/** List/table view (matches the ManageAxis "List" reference). */
export function TaskList({ tasks }: { tasks: Task[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="overflow-x-auto rounded-[1rem] border border-border bg-card shadow-sm shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
      <table className="w-full min-w-[920px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="w-10 px-4 py-3" />
            {COLUMNS.map((c) => (
              <th key={c} className="px-4 py-3 font-medium">
                <span className="inline-flex items-center gap-1">
                  {c}
                  <ChevronsUpDown className="size-3.5 opacity-50" />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const assignee = userById(task.assignee_id);
            const people = assignee
              ? [assignee.name, "Marcus Lee", "Sofia Rossi"]
              : [];
            return (
              <tr
                key={task.id}
                className="border-b border-border last:border-0 hover:bg-accent/40"
              >
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selected.has(task.id)}
                    onCheckedChange={() => toggle(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {task.id.toUpperCase()}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium">{task.title}</td>
                <td className="max-w-xs px-4 py-3 text-muted-foreground">
                  <span className="line-clamp-2">{task.description}</span>
                </td>
                <td className="px-4 py-3">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {task.due_date ? formatDate(task.due_date) : "—"}
                </td>
                <td className="px-4 py-3">
                  <AvatarStack names={people} max={3} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
