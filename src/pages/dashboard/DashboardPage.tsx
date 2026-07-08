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
import { StatusBreakdown } from "@/components/dashboard/StatusBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MyTasksWidget } from "@/components/dashboard/MyTasksWidget";
import { Button } from "@/components/ui/button";
import { staggerContainer } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { tasksForUser, tasks as mockTasks } from "@/lib/mock-data";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: projects = [] } = useProjects();
  const tasks = mockTasks; // Use mock data for dashboard tasks until API is ready
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
        className="grid grid-cols-2 gap-4 lg:grid-cols-5"
      >
        <StatCard 
          label="Total Projects" 
          value={projects.length} 
          icon={Folder} 
          tone="bg-blue-100 text-blue-700" 
          delta="+ 2 this month" 
        />
        <StatCard 
          label="Total Tasks" 
          value={tasks.length} 
          icon={ListTodo} 
          tone="bg-purple-100 text-purple-700" 
          delta="+ 16 this week" 
        />
        <StatCard
          label="In Progress"
          value={count("in_progress")}
          icon={Loader2}
          tone="bg-orange-100 text-orange-700"
          delta="+ 5 this week"
        />
        <StatCard
          label="Testing"
          value={count("testing")}
          icon={CircleDot}
          tone="bg-rose-100 text-rose-700"
          delta="+ 2 this week"
        />
        <StatCard
          label="Completed"
          value={count("done")}
          icon={CheckCircle2}
          tone="bg-emerald-100 text-emerald-700"
          delta="+ 20 this week"
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
