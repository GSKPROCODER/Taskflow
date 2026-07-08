import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  LayoutGrid,
  List as ListIcon,
  CalendarDays,
  LayoutDashboard,
  Settings,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FilterPills } from "@/components/calendar/FilterPills";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskForm } from "@/components/tasks/TaskForm";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { useProject } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/ui";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function ProjectDetailPage() {
  const { id } = useParams();
  const { data: project } = useProject(id);
  const { data: tasks = [] } = useTasks(id);
  const [tab, setTab] = useState("kanban");

  if (!project) return <NotFoundPage />;

  const pills = TASK_STATUS_ORDER.map((s) => ({
    label: STATUS_LABELS[s],
    count: tasks.filter((t) => t.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={project.name}
        subtitle={project.description ?? undefined}
        actions={
          <>
            <Button variant="outline">
              <Filter /> Filter
            </Button>
            <TaskForm projectId={id!} />
          </>
        }
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="kanban" icon={<LayoutGrid className="size-4" />}>
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" icon={<ListIcon className="size-4" />}>
            List
          </TabsTrigger>
          <TabsTrigger
            value="calendar"
            icon={<CalendarDays className="size-4" />}
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="overview"
            icon={<LayoutDashboard className="size-4" />}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger value="settings" icon={<Settings className="size-4" />}>
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="pt-5">
          <TabsContent value="kanban" className="space-y-4">
            <FilterPills pills={pills} />
            <TaskBoard tasks={tasks} />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <FilterPills pills={pills} />
            <TaskList tasks={tasks} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarWeek />
          </TabsContent>

          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <StatusBreakdown tasks={tasks} />
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">About this project</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Total tasks</dt>
                    <dd className="mt-0.5 font-medium">{tasks.length}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd className="mt-0.5 font-medium capitalize">
                      {project.status}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              Project settings (rename, archive, members) — coming with Phase 2.
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
