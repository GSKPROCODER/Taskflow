import { useParams } from "react-router-dom";

import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";

import TaskList from "../../components/tasks/TaskList";

import { useTasks } from "../../hooks/useTasks";

export default function ProjectDetailPage() {
  const { id } = useParams();

  const {
    tasks,
    isLoading,
  } = useTasks(id || "");

  return (
    <AppShell>
      <PageHeader
        title="Project Details"
        description="Tasks inside project"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </AppShell>
  );
}