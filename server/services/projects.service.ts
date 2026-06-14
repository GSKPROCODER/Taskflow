import { NotImplementedError } from "../lib/errors";

// Project business logic (PRD §5.2). Implemented in Phase 2.

export async function list(): Promise<never> {
  throw new NotImplementedError();
}

export async function create(): Promise<never> {
  throw new NotImplementedError();
}

export async function update(): Promise<never> {
  throw new NotImplementedError();
}

export async function archive(): Promise<never> {
  throw new NotImplementedError();
}
