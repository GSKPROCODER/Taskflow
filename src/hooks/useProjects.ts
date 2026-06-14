import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { projects as mockProjects, projectById } from "@/lib/mock-data";
import type { Project } from "@/types";

/**
 * Projects data (PRD §8.2). Queries Supabase; falls back to demo data when the
 * table is empty or RLS-blocked (until policies + seed are applied). Once your
 * project has rows the live data takes over automatically.
 */
async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });
  if (error || !data || data.length === 0) return mockProjects;
  return data as Project[];
}

export function useProjects() {
  const q = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  return { data: q.data ?? mockProjects, isLoading: q.isLoading } as const;
}

export function useProject(id: string | undefined) {
  const { data } = useProjects();
  return {
    data: id ? (data.find((p) => p.id === id) ?? projectById(id)) : undefined,
    isLoading: false,
  } as const;
}
