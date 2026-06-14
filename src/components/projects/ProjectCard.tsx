import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FolderKanban, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarStack } from "@/components/ui/avatar-stack";
import { staggerItem, hoverLift } from "@/lib/motion";
import { PROJECT_STATUS_STYLES } from "@/lib/ui";
import { cn } from "@/lib/utils";
import { tasksByProject, userById } from "@/lib/mock-data";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const tasks = tasksByProject(project.id);
  const done = tasks.filter((t) => t.status === "done").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const owner = userById(project.created_by);
  const people = [
    owner?.name ?? "Owner",
    "Priya Shah",
    "Marcus Lee",
    "Dana White",
  ];

  return (
    <motion.button
      type="button"
      variants={staggerItem}
      {...hoverLift}
      onClick={() => navigate(`/projects/${project.id}`)}
      className="flex w-full flex-col rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-brand-muted text-primary">
          <FolderKanban className="size-5" />
        </div>
        <MoreHorizontal className="size-4 text-muted-foreground" />
      </div>

      <h3 className="mt-4 font-semibold">{project.name}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3.5" />
            {done}/{tasks.length} done
          </span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <AvatarStack names={people} max={4} />
        <Badge
          className={cn(PROJECT_STATUS_STYLES[project.status], "capitalize")}
        >
          {project.status}
        </Badge>
      </div>
    </motion.button>
  );
}
