import type { TaskStatus, TaskPriority, ProjectStatus } from "@/types";

/**
 * Centralized UI style maps. Components import these instead of writing their
 * own per-element CSS, so status/priority/etc. stay consistent everywhere.
 * Pure Tailwind class strings — no component-specific stylesheets.
 */

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To-do",
  in_progress: "In Progress",
  testing: "In Review",
  done: "Completed",
};

/** Soft tinted badge styles per task status. */
export const STATUS_STYLES: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-blue-100 text-blue-700",
  testing: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

/** The small status dot used on kanban column headers. */
export const STATUS_DOT: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-blue-500",
  testing: "bg-amber-500",
  done: "bg-emerald-500",
};

/** Faint column background tints for the kanban board. */
export const STATUS_COLUMN_TINT: Record<TaskStatus, string> = {
  todo: "bg-slate-50",
  in_progress: "bg-blue-50/60",
  testing: "bg-amber-50/60",
  done: "bg-emerald-50/60",
};

/** Progress bar fill color per status. */
export const STATUS_BAR: Record<TaskStatus, string> = {
  todo: "bg-slate-400",
  in_progress: "bg-blue-500",
  testing: "bg-amber-500",
  done: "bg-emerald-500",
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Urgent",
};

export const PRIORITY_STYLES: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-rose-100 text-rose-700",
};

export const PROJECT_STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-emerald-100 text-emerald-700",
  archived: "bg-slate-100 text-slate-600",
};

export const TASK_STATUS_ORDER: TaskStatus[] = [
  "todo",
  "in_progress",
  "testing",
  "done",
];

/** Deterministic avatar background per name (no randomness). */
const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-fuchsia-500",
];

export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++)
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
