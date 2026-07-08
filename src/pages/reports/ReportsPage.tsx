import { PageHeader } from "@/components/layout/PageHeader";

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="Insights on your team's velocity and task distribution"
      />
      <div className="rounded-[1rem] border border-border bg-white shadow-sm shadow-slate-200/50 p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Advanced reporting, velocity charts, and burndown metrics will be available in the next release.
        </p>
      </div>
    </div>
  );
}
