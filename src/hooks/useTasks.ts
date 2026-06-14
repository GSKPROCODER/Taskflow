// Tasks data hook (PRD §9). Implemented with TanStack Query in Phase 3.
export function useTasks() {
  return { data: undefined, isLoading: false } as const;
}
