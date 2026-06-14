import { m } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MoreHorizontal } from "lucide-react";
import { PriorityBadge } from "./PriorityBadge";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Progress } from "@/components/ui/progress";
import { staggerItem, hoverLift } from "@/lib/motion";
import { STATUS_BAR } from "@/lib/ui";
import { formatDate } from "@/lib/format";
import { taskProgress, userById } from "@/lib/mock-data";
import type { Task } from "@/types";

/** Kanban card: priority badge, title, progress, due date + assignee avatars. */
export function TaskCard({ task }: { task: Task }) {
  const navigate = useNavigate();
  const assignee = userById(task.assignee_id);
  const progress = taskProgress(task.status);
  const people = assignee ? [assignee.name, "Priya Shah", "Marcus Lee"] : [];

  return (
    <m.button
      type="button"
      variants={staggerItem}
      {...hoverLift}
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="w-full rounded-xl border border-border bg-card p-3.5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <MoreHorizontal className="size-4 text-muted-foreground" />
      </div>

      <p className="mt-2.5 line-clamp-2 text-sm font-medium leading-snug">
        {task.title}
      </p>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} barClassName={STATUS_BAR[task.status]} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {task.due_date ? formatDate(task.due_date) : "—"}
        </span>
        <AvatarStack names={people} max={3} />
      </div>
    </m.button>
  );
}
