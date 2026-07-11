import { useState } from "react";
import { Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskList } from "@/components/tasks/TaskList";
import { FilterPills, type FilterDef } from "@/components/calendar/FilterPills";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyTasks } from "@/hooks/useTasks";
// Removed unused imports

export function MyTasksPage() {
  const { user } = useAuth();
  const { data: tasks } = useMyTasks(user?.id ?? "u-1");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !t.title.toLowerCase().includes(q) &&
        !t.description?.toLowerCase().includes(q) &&
        !t.id.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const filters: FilterDef[] = [
    {
      id: "status",
      label: "Status",
      value: statusFilter,
      options: [
        { label: "All Statuses", value: "all" },
        { label: "To-do", value: "todo" },
        { label: "In Progress", value: "in_progress" },
        { label: "Testing", value: "testing" },
        { label: "Done", value: "done" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      value: priorityFilter,
      options: [
        { label: "All Priorities", value: "all" },
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
        { label: "Critical", value: "critical" },
      ],
    },
  ];

  const handleFilterChange = (id: string, value: string) => {
    if (id === "status") setStatusFilter(value);
    if (id === "priority") setPriorityFilter(value);
  };

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
      <FilterPills
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <TaskList tasks={filteredTasks} />
    </div>
  );
}
