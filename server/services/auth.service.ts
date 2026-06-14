import { NotImplementedError } from "../lib/errors";

// Auth business logic (PRD §5.1). Implemented in Phase 1.

export async function signup(): Promise<never> {
  throw new NotImplementedError();
}

export async function login(): Promise<never> {
  throw new NotImplementedError();
}

export async function logout(): Promise<never> {
  throw new NotImplementedError();
}

export async function getCurrentUser(): Promise<never> {
  throw new NotImplementedError();
}
