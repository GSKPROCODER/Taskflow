import { useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarDays, Flag, FolderKanban } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { CommentFeed } from "@/components/comments/CommentFeed";
import { CommentForm } from "@/components/comments/CommentForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { projectById, userById } from "@/lib/mock-data";
import { NotFoundPage } from "@/pages/NotFoundPage";
import type { TaskStatus } from "@/types";

export function TaskDetailPage() {
  const { id } = useParams();
  const { data: task } = useTask(id);
  const { data: comments } = useComments(id);
  const [status, setStatus] = useState<TaskStatus | undefined>(task?.status);

  if (!task) return <NotFoundPage />;

  const project = projectById(task.project_id);
  const assignee = userById(task.assignee_id);
  const creator = userById(task.created_by);
  const current = status ?? task.status;

  return (
    <div className="space-y-6">
      <PageHeader
        title={task.title}
        subtitle={`${task.id.toUpperCase()} · ${project?.name ?? ""}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comments &amp; activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <CommentFeed comments={comments} />
              <Separator />
              <CommentForm />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-5 pt-5">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <Select
                  value={current}
                  onValueChange={(v) => setStatus(v as TaskStatus)}
                >
                  <SelectTrigger>
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

              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <Flag className="size-4" /> Priority
                </span>
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <TaskStatusBadge status={current} />
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Assignee</span>
                {assignee && (
                  <span className="flex items-center gap-2">
                    <NameAvatar name={assignee.name} className="size-6" />
                    <span className="font-medium">{assignee.name}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reporter</span>
                <span className="font-medium">{creator?.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="size-4" /> Due
                </span>
                <span className="font-medium">
                  {task.due_date ? formatDateLong(task.due_date) : "—"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2 text-muted-foreground">
                  <FolderKanban className="size-4" /> Project
                </span>
                <span className="font-medium">{project?.name}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
