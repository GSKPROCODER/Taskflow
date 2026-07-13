import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { users as mockTeam, tasks as mockTasks } from "@/lib/mock-data";
import type { Project, Task } from "@/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div className="w-full overflow-hidden bg-card rounded-[1rem] shadow-sm shadow-slate-200/50 border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50/50 text-muted-foreground border-b border-border/60">
            <tr>
              <th className="px-6 py-4 font-medium">Project</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Team</th>
              <th className="px-6 py-4 font-medium text-center">Tasks</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <motion.tbody
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="divide-y divide-border/60"
          >
            {projects.map((project) => {
              const taskCount = mockTasks.filter(
                (t: Task) => t.project_id === project.id,
              ).length;
              const isArchived = project.status === "archived";
              return (
                <motion.tr
                  variants={staggerItem}
                  key={project.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-semibold text-foreground hover:text-brand transition-colors"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-[250px] truncate">
                    {project.description || "No description"}
                  </td>
                  <td className="px-6 py-4">
                    <AvatarStack
                      names={mockTeam.slice(0, 3).map((u) => u.name)}
                      max={3}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-center text-muted-foreground">
                    {taskCount}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        isArchived
                          ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent shadow-none"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-transparent shadow-none"
                      }
                    >
                      {isArchived ? "Archived" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/projects/${project.id}`}>
                            View project
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit details</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          {isArchived ? "Unarchive" : "Archive project"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              );
            })}
            {projects.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No projects found.
                </td>
              </tr>
            )}
          </motion.tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-border/60 bg-card text-sm text-muted-foreground">
        <span>
          Showing 1 to {Math.min(projects.length, 5)} of {projects.length}{" "}
          projects
        </span>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="sm" className="h-8 shadow-sm">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="h-8 shadow-sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
