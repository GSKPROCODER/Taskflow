import { Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import { FilterPills } from "@/components/calendar/FilterPills";
import { useProjects } from "@/hooks/useProjects";

export function ProjectsPage() {
  const { data: projects } = useProjects();
  const active = projects.filter((p) => p.status === "active");
  const archived = projects.filter((p) => p.status === "archived");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        subtitle="All the work your team is tracking, in one place."
        actions={
          <>
            <Button variant="outline">
              <Filter /> Filter
            </Button>
            <ProjectForm />
          </>
        }
      />

      <FilterPills
        pills={[
          { label: "All projects", count: projects.length },
          { label: "Active", count: active.length },
          { label: "Archived", count: archived.length },
        ]}
      />

      <ProjectList projects={active} />

      {archived.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Archived
          </h2>
          <ProjectList projects={archived} />
        </div>
      )}
    </div>
  );
}
