import { motion } from "framer-motion";
import {
  ListTodo,
  Loader2,
  CircleDot,
  CheckCircle2,
  Filter,
  Folder,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { TaskOverview } from "@/components/dashboard/StatusBreakdown";
import { PriorityBreakdown } from "@/components/dashboard/PriorityBreakdown";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { MyTasksWidget } from "@/components/dashboard/MyTasksWidget";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { staggerContainer } from "@/lib/motion";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardMetrics, useMyTasks } from "@/hooks/useDashboard";

export function DashboardPage() {
  const { user } = useAuth();
  const { data: metrics } = useDashboardMetrics();
  const { data: myTasks = [] } = useMyTasks();

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Real implementation would refetch metrics/tasks based on filter
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`}
        subtitle="Here's what's happening across your projects today."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="size-4" /> Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Timeframe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                {activeFilter === "all" ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <span className="mr-2 size-4" />
                )}
                All Time
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilterChange("this-week")}>
                {activeFilter === "this-week" ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <span className="mr-2 size-4" />
                )}
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleFilterChange("this-month")}
              >
                {activeFilter === "this-month" ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <span className="mr-2 size-4" />
                )}
                This Month
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Project Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleFilterChange("active")}>
                {activeFilter === "active" ? (
                  <Check className="mr-2 size-4" />
                ) : (
                  <span className="mr-2 size-4" />
                )}
                Active Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
