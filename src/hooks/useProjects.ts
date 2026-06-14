// Projects data hook (PRD §9). Implemented with TanStack Query in Phase 2.
export function useProjects() {
  return { data: undefined, isLoading: false } as const;
}
