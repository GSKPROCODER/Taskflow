import { motion } from "framer-motion";
import {
  ListTodo,
  Loader2,
  CircleDot,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MyTasksWidget } from "@/components/dashboard/MyTasksWidget";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { tasksForUser } from "@/lib/mock-data";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: tasks } = useTasks();
  const myTasks = tasksForUser(user?.id ?? "u-1");

  const count = (s: string) => tasks.filter((t) => t.status === s).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`}
        subtitle="Here's what's happening across your projects today."
        actions={
          <Button variant="outline">
            <Filter /> Filter
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard label="Total tasks" value={tasks.length} icon={ListTodo} />
        <StatCard
          label="In progress"
          value={count("in_progress")}
          icon={Loader2}
          tone="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="In review"
          value={count("testing")}
          icon={CircleDot}
          tone="bg-amber-100 text-amber-700"
        />
        <StatCard
          label="Completed"
          value={count("done")}
          icon={CheckCircle2}
          tone="bg-emerald-100 text-emerald-700"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyTasksWidget tasks={myTasks} />
        </div>
        <StatusBreakdown tasks={tasks} />
      </div>

      <RecentActivity />
    </div>
  );
}
