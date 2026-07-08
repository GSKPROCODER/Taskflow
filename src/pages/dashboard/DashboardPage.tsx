import { motion } from "framer-motion";
import {
  ListTodo,
  Loader2,
  CircleDot,
  CheckCircle2,
  Filter,
  Folder,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskOverview } from "@/components/dashboard/StatusBreakdown";
import { PriorityBreakdown } from "@/components/dashboard/PriorityBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MyTasksWidget } from "@/components/dashboard/MyTasksWidget";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardMetrics, useMyTasks } from "@/hooks/useDashboard";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: metrics } = useDashboardMetrics();
  const { data: myTasks = [] } = useMyTasks();

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
        className="grid grid-cols-2 gap-4 lg:grid-cols-5"
      >
        <StatCard 
          label="Total Projects" 
          value={metrics?.totalProjects ?? 0} 
          icon={Folder} 
          tone="bg-blue-100 text-blue-600" 
          delta="↑ 2 this month" 
        />
        <StatCard 
          label="Total Tasks" 
          value={metrics?.totalTasks ?? 0} 
          icon={ListTodo} 
          tone="bg-purple-100 text-purple-600" 
          delta="↑ 16 this week" 
        />
        <StatCard
          label="In Progress"
          value={metrics?.inProgress ?? 0}
          icon={Loader2}
          tone="bg-orange-100 text-orange-600"
          delta="↑ 5 this week"
        />
        <StatCard
          label="Testing"
          value={metrics?.testing ?? 0}
          icon={CircleDot}
          tone="bg-rose-100 text-rose-600"
          delta="↑ 2 this week"
        />
        <StatCard
          label="Completed"
          value={metrics?.done ?? 0}
          icon={CheckCircle2}
          tone="bg-emerald-100 text-emerald-600"
          delta="↑ 20 this week"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TaskOverview metrics={metrics} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MyTasksWidget tasks={myTasks} />
        </div>
        <div className="lg:col-span-1">
          <PriorityBreakdown metrics={metrics} />
        </div>
      </div>
    </div>
  );
}
