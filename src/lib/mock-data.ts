import type {
  User,
  Project,
  Task,
  Comment,
  TaskStatus,
  TaskPriority,
} from "@/types";

/**
 * Deterministic mock dataset for the UI pass (no Math.random / Date.now).
 * Shapes match src/types so swapping to the real API later is mechanical.
 */

export const MOCK_NOW = new Date("2026-02-14T15:00:00Z");

export const currentUser: User = {
  id: "u-1",
  name: "Alex Morgan",
  email: "alex@shadowwings.io",
  role: "team_lead",
  created_at: "2026-01-02T09:00:00Z",
  updated_at: "2026-01-02T09:00:00Z",
};

export const users: User[] = [
  currentUser,
  {
    id: "u-2",
    name: "Priya Shah",
    email: "priya@shadowwings.io",
    role: "developer",
    created_at: "2026-01-03T09:00:00Z",
    updated_at: "2026-01-03T09:00:00Z",
  },
  {
    id: "u-3",
    name: "Marcus Lee",
    email: "marcus@shadowwings.io",
    role: "developer",
    created_at: "2026-01-03T09:00:00Z",
    updated_at: "2026-01-03T09:00:00Z",
  },
  {
    id: "u-4",
    name: "Dana White",
    email: "dana@shadowwings.io",
    role: "tester",
    created_at: "2026-01-04T09:00:00Z",
    updated_at: "2026-01-04T09:00:00Z",
  },
  {
    id: "u-5",
    name: "Sofia Rossi",
    email: "sofia@shadowwings.io",
    role: "developer",
    created_at: "2026-01-05T09:00:00Z",
    updated_at: "2026-01-05T09:00:00Z",
  },
  {
    id: "u-6",
    name: "Liam Chen",
    email: "liam@shadowwings.io",
    role: "tester",
    created_at: "2026-01-06T09:00:00Z",
    updated_at: "2026-01-06T09:00:00Z",
  },
];

export function userById(id: string | null): User | undefined {
  return id ? users.find((u) => u.id === id) : undefined;
}

export const projects: Project[] = [
  {
    id: "p-1",
    name: "Craftboard Project",
    description: "A board to keep track of design progress.",
    status: "active",
    created_by: "u-1",
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-02-10T09:00:00Z",
  },
  {
    id: "p-2",
    name: "Visionary Tasks",
    description: "Roadmap and discovery work for Q1.",
    status: "active",
    created_by: "u-1",
    created_at: "2026-01-12T09:00:00Z",
    updated_at: "2026-02-08T09:00:00Z",
  },
  {
    id: "p-3",
    name: "Demotion Project",
    description: "Internal demo environment revamp.",
    status: "active",
    created_by: "u-1",
    created_at: "2026-01-15T09:00:00Z",
    updated_at: "2026-02-01T09:00:00Z",
  },
  {
    id: "p-4",
    name: "Angular Studio",
    description: "Legacy migration to a modern stack.",
    status: "active",
    created_by: "u-1",
    created_at: "2026-01-18T09:00:00Z",
    updated_at: "2026-02-04T09:00:00Z",
  },
  {
    id: "p-5",
    name: "Cudemo Project",
    description: "Customer-facing demo polish.",
    status: "archived",
    created_by: "u-1",
    created_at: "2025-12-01T09:00:00Z",
    updated_at: "2026-01-20T09:00:00Z",
  },
];

export function projectById(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

const TASK_TITLES = [
  "Employee detail page",
  "Dashboard analytics widget",
  "Mobile onboarding flow",
  "Settings & preferences",
  "Notification center",
  "Billing integration",
  "Search & filters",
  "Role-based access control",
  "Activity timeline",
  "Export to CSV",
  "Dark mode pass",
  "Empty & error states",
];

const STATUSES: TaskStatus[] = ["todo", "in_progress", "testing", "done"];
const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

function buildTasks(): Task[] {
  const out: Task[] = [];
  let n = 1;
  for (const project of projects) {
    for (let i = 0; i < 9; i++) {
      const status = STATUSES[i % STATUSES.length]!;
      const priority = PRIORITIES[(i + project.id.length) % PRIORITIES.length]!;
      const assignee = users[(i % (users.length - 1)) + 1]!;
      const day = 4 + ((i * 3) % 24);
      out.push({
        id: `t-${n}`,
        title: TASK_TITLES[(i + n) % TASK_TITLES.length]!,
        description:
          "Create a page where there is information about employees and their progress.",
        status,
        priority,
        project_id: project.id,
        assignee_id: assignee.id,
        created_by: "u-1",
        due_date: `2026-02-${String(day).padStart(2, "0")}`,
        created_at: "2026-01-20T09:00:00Z",
        updated_at: "2026-02-10T09:00:00Z",
      });
      n++;
    }
  }
  return out;
}

export const tasks: Task[] = buildTasks();

export function tasksByProject(projectId: string): Task[] {
  return tasks.filter((t) => t.project_id === projectId);
}

export function taskById(id: string): Task | undefined {
  return tasks.find((t) => t.id === id);
}

export function tasksForUser(userId: string): Task[] {
  return tasks.filter((t) => t.assignee_id === userId);
}

/** Rough completion percentage per status, for progress bars. */
export function taskProgress(status: TaskStatus): number {
  return { todo: 10, in_progress: 50, testing: 80, done: 100 }[status];
}

export const comments: Comment[] = [
  {
    id: "c-1",
    task_id: "t-1",
    user_id: "u-2",
    content: "Started on the layout, pushing a draft shortly.",
    type: "comment",
    created_at: "2026-02-11T10:00:00Z",
  },
  {
    id: "c-2",
    task_id: "t-1",
    user_id: "u-1",
    content: "Status changed to In Progress by @priya",
    type: "system_log",
    created_at: "2026-02-11T10:05:00Z",
  },
  {
    id: "c-3",
    task_id: "t-1",
    user_id: "u-4",
    content: "Looks good — minor spacing nits in the header.",
    type: "comment",
    created_at: "2026-02-12T14:20:00Z",
  },
  {
    id: "c-4",
    task_id: "t-1",
    user_id: "u-1",
    content: "Status changed to In Review by @priya",
    type: "system_log",
    created_at: "2026-02-12T15:00:00Z",
  },
];

export function commentsByTask(taskId: string): Comment[] {
  return comments.filter((c) => c.task_id === taskId);
}

export type AppNotification = {
  id: string;
  actor: string;
  action: string;
  target: string;
  created_at: string;
  unread: boolean;
  kind: "update" | "document" | "invite";
};

export const notifications: AppNotification[] = [
  {
    id: "n-1",
    actor: "Adison Ekstrom",
    action: "changed the delivery date of",
    target: "Craftboard Project to 24 Feb 2026",
    created_at: "2026-02-14T13:00:00Z",
    unread: true,
    kind: "update",
  },
  {
    id: "n-2",
    actor: "James Donin",
    action: "sent a document on",
    target: "Visionary Tasks",
    created_at: "2026-02-14T13:00:00Z",
    unread: true,
    kind: "document",
  },
  {
    id: "n-3",
    actor: "Cristofer Levin",
    action: "is requesting access to",
    target: "Angular Studio",
    created_at: "2026-02-14T12:30:00Z",
    unread: true,
    kind: "invite",
  },
  {
    id: "n-4",
    actor: "Dana White",
    action: "approved a task in",
    target: "Demotion Project",
    created_at: "2026-02-14T09:30:00Z",
    unread: false,
    kind: "update",
  },
  {
    id: "n-5",
    actor: "Sofia Rossi",
    action: "commented on",
    target: "Employee detail page",
    created_at: "2026-02-13T17:10:00Z",
    unread: false,
    kind: "document",
  },
];

export type CalendarEvent = {
  id: string;
  title: string;
  day: number; // 0=Sun ... 6=Sat
  startHour: number; // 7..18
  tone: "blue" | "violet" | "amber" | "emerald";
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: "e-1",
    title: "Client Presentation prep",
    day: 1,
    startHour: 8,
    tone: "blue",
  },
  {
    id: "e-2",
    title: "Client Meeting Planning",
    day: 1,
    startHour: 9,
    tone: "blue",
  },
  {
    id: "e-3",
    title: "Meetup with UI8 team",
    day: 1,
    startHour: 10,
    tone: "blue",
  },
  {
    id: "e-4",
    title: "Collaboration with dev team",
    day: 2,
    startHour: 9,
    tone: "blue",
  },
  { id: "e-5", title: "Design revisions", day: 2, startHour: 12, tone: "blue" },
  {
    id: "e-6",
    title: "Client Feedback Meeting",
    day: 3,
    startHour: 9,
    tone: "blue",
  },
  {
    id: "e-7",
    title: "New project Kickoff",
    day: 3,
    startHour: 11,
    tone: "violet",
  },
  {
    id: "e-8",
    title: "Meetup with Gojek team",
    day: 3,
    startHour: 13,
    tone: "amber",
  },
  {
    id: "e-9",
    title: "Design team Stand-up",
    day: 4,
    startHour: 10,
    tone: "violet",
  },
  {
    id: "e-10",
    title: "Final Touch on Client Project",
    day: 5,
    startHour: 13,
    tone: "violet",
  },
  {
    id: "e-11",
    title: "Meetup with Adobe team",
    day: 5,
    startHour: 9,
    tone: "blue",
  },
  {
    id: "e-12",
    title: "Industry Webinar / Workshop",
    day: 5,
    startHour: 12,
    tone: "blue",
  },
];
