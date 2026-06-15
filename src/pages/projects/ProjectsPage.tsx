import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";

import ProjectList from "../../components/projects/ProjectList";

import { useProjects } from "../../hooks/useProjects";

export default function ProjectsPage() {
  const {
    projects,
    isLoading,
  } = useProjects();

  return (
    <AppShell>
      <PageHeader
        title="Projects"
        description="Manage all projects"
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ProjectList
          projects={projects}
        />
      )}
    </AppShell>
  );
}