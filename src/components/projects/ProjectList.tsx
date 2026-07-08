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
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/40">
          <tr>
            <th className="px-4 py-3 font-medium text-muted-foreground">Project</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Description</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Team</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Tasks</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-3 font-medium text-muted-foreground">Action</th>
          </tr>
        </thead>
        <motion.tbody
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="divide-y divide-border"
        >
          {projects.map((project) => {
            const taskCount = mockTasks.filter((t: Task) => t.project_id === project.id).length;
            const isArchived = project.status === "archived";
            return (
              <motion.tr variants={staggerItem} key={project.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/projects/${project.id}`} className="font-semibold text-foreground hover:underline">
                    {project.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                  {project.description || "No description"}
                </td>
                <td className="px-4 py-3">
                  <AvatarStack names={mockTeam.slice(0, 3).map(u => u.name)} max={3} />
                </td>
                <td className="px-4 py-3 font-medium">
                  {taskCount}
                </td>
                <td className="px-4 py-3">
                  <Badge className={isArchived ? "bg-secondary text-secondary-foreground" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent"}>
                    {isArchived ? "Archived" : "Active"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/projects/${project.id}`}>View project</Link>
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
        </motion.tbody>
      </table>
    </div>
  );
}
