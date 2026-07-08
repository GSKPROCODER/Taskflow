import { PageHeader } from "@/components/layout/PageHeader";

export function TeamPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Directory"
        subtitle="Manage your team members and roles"
      />
      <div className="rounded-[1rem] border border-border bg-white shadow-sm shadow-slate-200/50 p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          The team directory and user management features will be available in the next release.
        </p>
      </div>
    </div>
  );
}
