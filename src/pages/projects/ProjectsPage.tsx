<<<<<<< HEAD
// ProjectsPage (PRD §5.2, §9). Implementation lands in Phase 2.
export function ProjectsPage() {
  return <div>Projects</div>;
}
=======
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
>>>>>>> faiz
