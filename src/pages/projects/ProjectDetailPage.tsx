import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  LayoutGrid,
  List as ListIcon,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { formatDate } from "@/lib/format";
import { TaskOverview } from "@/components/dashboard/StatusBreakdown";
import { useProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { cn } from "@/lib/utils";

export function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project, isLoading } = useProject(id!);
  const { data: tasks = [] } = useTasks(id!);
  const [tab, setTab] = useState("tasks");
  const [statusFilter, setStatusFilter] = useState("all");

  if (isLoading)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading project...
      </div>
    );
  if (!project) return <NotFoundPage />;

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((t) => t.status === statusFilter);

  const statuses = [
    { id: "all", label: "All", count: tasks.length },
    {
      id: "todo",
      label: "Todo",
      count: tasks.filter((t) => t.status === "todo").length,
    },
    {
      id: "in_progress",
      label: "In Progress",
      count: tasks.filter((t) => t.status === "in_progress").length,
    },
    {
      id: "testing",
      label: "Testing",
      count: tasks.filter((t) => t.status === "testing").length,
    },
    {
      id: "done",
      label: "Done",
      count: tasks.filter((t) => t.status === "done").length,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        subtitle={project.description ?? undefined}
        actions={
          <>
            <TaskForm projectId={id!} />
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="tasks" icon={<LayoutGrid className="size-4" />}>
            Tasks
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            icon={<LayoutDashboard className="size-4" />}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="members" icon={<Settings className="size-4" />}>
            Members
          </TabsTrigger>
          <TabsTrigger value="files" icon={<ListIcon className="size-4" />}>
            Files
          </TabsTrigger>
          <TabsTrigger value="settings" icon={<Settings className="size-4" />}>
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="pt-5">
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {statuses.map((status) => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                    statusFilter === status.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                  )}
                >
                  {status.label}
                  <span
                    className={cn(
                      "flex h-5 items-center justify-center rounded-full px-2 text-xs",
                      statusFilter === status.id
                        ? "bg-primary-foreground/20"
                        : "bg-background",
                    )}
                  >
                    {status.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="overflow-hidden bg-card rounded-[1rem] shadow-sm shadow-slate-200/50 border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50/50 text-muted-foreground border-b border-border/60">
                    <tr>
                      <th className="px-6 py-4 font-medium">Task</th>
                      <th className="px-6 py-4 font-medium">Priority</th>
                      <th className="px-6 py-4 font-medium">Due Date</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 bg-card">
                    {filteredTasks.map((task) => (
                      <tr
                        key={task.id}
                        className="group transition-colors hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <Link
                            to={`/tasks/${task.id}`}
                            className="font-semibold text-foreground hover:text-brand transition-colors block truncate max-w-[250px]"
                          >
                            {task.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {task.due_date ? formatDate(task.due_date) : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end">
                            <TaskStatusBadge status={task.status} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTasks.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-12 text-center text-muted-foreground"
                        >
                          No tasks found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="lg:col-span-1">
                <TaskOverview tasks={tasks} />
              </div>
              <div className="rounded-[1rem] border border-border bg-card shadow-sm shadow-slate-200/50 p-6">
                <h3 className="font-semibold text-lg">About this project</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-6 text-sm">
                  <div className="p-4 rounded-lg bg-slate-50 border border-border/50">
                    <dt className="text-muted-foreground font-medium">
                      Total tasks
                    </dt>
                    <dd className="mt-1 text-2xl font-bold text-foreground">
                      {tasks.length}
                    </dd>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 border border-border/50">
                    <dt className="text-muted-foreground font-medium">
                      Status
                    </dt>
                    <dd className="mt-1 text-2xl font-bold text-foreground capitalize">
                      {project.status}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Project members — coming soon.
            </div>
          </TabsContent>

          <TabsContent value="files">
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Project files — coming soon.
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Project settings (rename, archive) — coming with Phase 2.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
