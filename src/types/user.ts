export type UserRole =
  | "team_lead"
  | "developer"
  | "tester";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}