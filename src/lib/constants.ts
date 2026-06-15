export const APP_NAME = "TaskFlow";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api/v1";

export const TASK_STATUS = [
  "todo",
  "in_progress",
  "testing",
  "done",
] as const;

export const TASK_PRIORITY = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const USER_ROLES = [
  "team_lead",
  "developer",
  "tester",
] as const;