// Comments data hook (PRD §9). Implemented with TanStack Query in Phase 4.
export function useComments() {
  return { data: undefined, isLoading: false } as const;
}
