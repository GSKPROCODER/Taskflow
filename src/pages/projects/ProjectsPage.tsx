import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { useProjects } from "@/hooks/useProjects";
import { Search } from "lucide-react";
import type { Project } from "@/types";

export function ProjectsPage() {
  const { data: projects = [], isLoading } = useProjects();
  const active = projects.filter((p: Project) => p.status === "active");
  const archived = projects.filter((p: Project) => p.status === "archived");

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading projects...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              placeholder="Search projects..."
              className="h-10 w-full rounded-lg border border-border bg-white shadow-sm pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
            />
          </div>
          <ProjectForm />
        </div>
      </div>

      <div>
        <ProjectList projects={active} />
      </div>

      {archived.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-foreground">
            Archived Projects
          </h2>
          <ProjectList projects={archived} />
        </div>
      )}
    </div>
  );
}
