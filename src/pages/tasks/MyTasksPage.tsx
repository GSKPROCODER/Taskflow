import { Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { FilterPills } from "@/components/calendar/FilterPills";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyTasks } from "@/hooks/useTasks";
import { STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/ui";

export function MyTasksPage() {
  const { user } = useAuth();
  const { data: tasks } = useMyTasks(user?.id ?? "u-1");

  const pills = TASK_STATUS_ORDER.map((s) => ({
    label: STATUS_LABELS[s],
    count: tasks.filter((t) => t.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        subtitle="Everything assigned to you across all projects."
        actions={
          <Button variant="outline">
            <Filter /> Filter
          </Button>
        }
      />
      <FilterPills pills={pills} />
      <TaskList tasks={tasks} />
    </div>
  );
}
