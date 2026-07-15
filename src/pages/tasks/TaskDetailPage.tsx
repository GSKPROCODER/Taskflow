import { useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Flag, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { CommentFeed } from "@/components/comments/CommentFeed";
import { CommentForm } from "@/components/comments/CommentForm";
import { NameAvatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/ui";
import { formatDateLong } from "@/lib/format";
import { useTask } from "@/hooks/useTasks";
import { useComments } from "@/hooks/useComments";
import { useProject } from "@/hooks/useProjects";

import { NotFoundPage } from "@/pages/NotFoundPage";
import type { TaskStatus } from "@/types";

export function TaskDetailPage() {
  const { id } = useParams();
  const { data: task, isLoading } = useTask(id!);
  const { data: comments } = useComments(id);
  const { data: project } = useProject(task?.project_id ?? "");
  const [status, setStatus] = useState<TaskStatus | undefined>(task?.status);

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading task...
      </div>
    );
  if (!task) return <NotFoundPage />;

  const current = status ?? task.status;
  // Assignee/creator names require a /users/:id endpoint (not yet built).
  // Show truncated IDs as a graceful fallback.
  const assigneeName = task.assignee_id
    ? task.assignee_id.slice(0, 8)
    : null;
  const creatorName = task.created_by
    ? task.created_by.slice(0, 8)
    : "Unknown";

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        subtitle={`${task.id.toUpperCase()} · ${project?.name ?? ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-[1rem] bg-card border border-border shadow-sm shadow-slate-200/50 overflow-hidden">
            <div className="border-b border-border/50 px-6 py-4 bg-card">
              <h3 className="font-semibold text-lg">Description</h3>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="rounded-[1rem] bg-card border border-border shadow-sm shadow-slate-200/50 overflow-hidden">
            <div className="border-b border-border/50 px-6 py-4 bg-card">
              <h3 className="font-semibold text-lg">Comments &amp; Activity</h3>
            </div>
            <div className="p-6 space-y-5 bg-slate-50/30">
              <CommentFeed comments={comments} />
              <Separator className="bg-border/60" />
              <CommentForm taskId={task.id} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-[1rem] bg-card border border-border shadow-sm shadow-slate-200/50 p-6 space-y-6">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <Select
                value={current}
                onValueChange={(v) => setStatus(v as TaskStatus)}
              >
                <SelectTrigger className="w-full bg-slate-50 border-border/50 shadow-sm focus:ring-brand">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Flag className="size-4" /> Priority
                </span>
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <FolderKanban className="size-4" /> Project
                </span>
                <span className="font-medium text-foreground truncate max-w-[140px]">
                  {project?.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" /> Due Date
                </span>
                <span className="font-medium text-foreground">
                  {task.due_date ? formatDateLong(task.due_date) : "—"}
                </span>
              </div>
            </div>

            <Separator className="bg-border/60" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assignee</span>
                {assigneeName ? (
                  <span className="flex items-center gap-2">
                    <NameAvatar name={assigneeName} className="size-6" />
                    <span className="font-medium text-foreground">
                      {assigneeName}
                    </span>
                  </span>
                ) : (
                  <span className="text-muted-foreground italic">
                    Unassigned
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reporter</span>
                <span className="font-medium text-foreground">
                  {creatorName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
