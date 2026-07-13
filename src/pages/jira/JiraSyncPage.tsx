import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { avatarColor } from "@/lib/ui";

type Issue = {
  id: string;
  summary: string;
  priority: "High" | "Medium" | "Low";
  status: "todo" | "in_progress" | "done";
  assignee: string;
};

const MOCK_ISSUES: Issue[] = [
  {
    id: "TF-104",
    summary: "Fix auth token expiration bug",
    priority: "High",
    status: "todo",
    assignee: "Marcus Lee",
  },
  {
    id: "TF-107",
    summary: "Refactor dashboard card layouts",
    priority: "Medium",
    status: "todo",
    assignee: "Sofia Rossi",
  },
  {
    id: "TF-112",
    summary: "Implement Kanban drag-and-drop",
    priority: "High",
    status: "in_progress",
    assignee: "Alex Chen",
  },
  {
    id: "TF-115",
    summary: "Update user avatar initials logic",
    priority: "Low",
    status: "done",
    assignee: "Marcus Lee",
  },
];

function PriorityMarker({ priority }: { priority: string }) {
  let colorClass = "bg-emerald-500";
  if (priority === "High") colorClass = "bg-red-500";
  if (priority === "Medium") colorClass = "bg-orange-500";

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", colorClass)} />
      <span className="text-xs font-medium text-muted-foreground">
        {priority}
      </span>
    </div>
  );
}

function JiraCard({ issue }: { issue: Issue }) {
  const initials = issue.assignee
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Card className="group p-4 shadow-sm shadow-slate-200/50 border-border bg-card rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand/30 cursor-grab active:cursor-grabbing">
      <div className="flex flex-col space-y-3">
        <p className="text-sm font-medium text-foreground leading-snug">
          {issue.summary}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-brand hover:underline cursor-pointer">
              {issue.id}
            </span>
            <PriorityMarker priority={issue.priority} />
          </div>

          <Avatar className="size-6 bg-secondary text-white border-none shadow-sm">
            <AvatarFallback
              className={cn("text-[10px]", avatarColor(issue.assignee))}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </Card>
  );
}

export function JiraSyncPage() {
  const [issues] = useState<Issue[]>(MOCK_ISSUES);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Jira Board
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Project: TaskFlow Core Engine (TF)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-card text-foreground border-border hover:bg-secondary shadow-sm"
          >
            Sync Status
          </Button>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90 shadow-sm shadow-brand/20">
            + Create Jira Issue
          </Button>
        </div>
      </div>

      {/* Kanban Workflow Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-0 pb-4">
        {/* TO DO Column */}
        <div className="flex flex-col h-full bg-secondary/30 rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              To Do
            </h3>
            <span className="flex size-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
              {issues.filter((i) => i.status === "todo").length}
            </span>
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto pr-1 pb-2">
            {issues
              .filter((i) => i.status === "todo")
              .map((issue) => (
                <JiraCard key={issue.id} issue={issue} />
              ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="flex flex-col h-full bg-secondary/30 rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-blue-500 uppercase tracking-wider">
              In Progress
            </h3>
            <span className="flex size-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-[11px] font-medium text-blue-600 dark:text-blue-400">
              {issues.filter((i) => i.status === "in_progress").length}
            </span>
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto pr-1 pb-2">
            {issues
              .filter((i) => i.status === "in_progress")
              .map((issue) => (
                <JiraCard key={issue.id} issue={issue} />
              ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="flex flex-col h-full bg-secondary/30 rounded-2xl p-4 border border-border/50">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-wider">
              Done
            </h3>
            <span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {issues.filter((i) => i.status === "done").length}
            </span>
          </div>
          <div className="flex flex-col space-y-3 overflow-y-auto pr-1 pb-2">
            {issues
              .filter((i) => i.status === "done")
              .map((issue) => (
                <JiraCard key={issue.id} issue={issue} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
