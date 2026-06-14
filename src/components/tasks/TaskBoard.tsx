import { motion } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { staggerContainer } from "@/lib/motion";
import {
  STATUS_DOT,
  STATUS_LABELS,
  STATUS_COLUMN_TINT,
  TASK_STATUS_ORDER,
} from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types";

/** Kanban board: a tinted column per status with stacked TaskCards. */
export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const byStatus = (s: TaskStatus) => tasks.filter((t) => t.status === s);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {TASK_STATUS_ORDER.map((status) => {
        const items = byStatus(status);
        return (
          <div
            key={status}
            className={cn(
              "flex flex-col rounded-2xl border border-border p-3",
              STATUS_COLUMN_TINT[status],
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn("size-2 rounded-full", STATUS_DOT[status])}
                />
                <span className="text-sm font-semibold">
                  {STATUS_LABELS[status]}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({items.length})
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <button className="rounded-md p-1 hover:bg-accent">
                  <MoreHorizontal className="size-4" />
                </button>
                <button className="rounded-md p-1 hover:bg-accent">
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {items.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
              {items.length === 0 && (
                <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                  No tasks
                </p>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
