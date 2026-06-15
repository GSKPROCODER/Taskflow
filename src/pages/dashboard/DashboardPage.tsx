<<<<<<< HEAD
// DashboardPage (PRD §5.5, §9). Implementation lands in Phase 4.
export function DashboardPage() {
  return <div>Dashboard</div>;
}
=======
import AppShell from "../../components/layout/AppShell";
import PageHeader from "../../components/layout/PageHeader";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Overview of projects and tasks"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Total Projects</h3>
          <p className="text-3xl font-bold">
            12
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Open Tasks</h3>
          <p className="text-3xl font-bold">
            38
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3>Completed</h3>
          <p className="text-3xl font-bold">
            21
          </p>
        </div>
      </div>
    </AppShell>
  );
}
>>>>>>> faiz
