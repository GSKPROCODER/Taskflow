import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Task } from "@/types";

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: async () => {
      const { data } = await apiClient.get("/dashboard/metrics");
      return data;
    },
  });
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: async () => {
      const { data } = await apiClient.get("/dashboard/activity");
      return data;
    },
  });
}

export function useMyTasks() {
  return useQuery({
    queryKey: ["dashboard", "my-tasks"],
    queryFn: async () => {
      const { data } = await apiClient.get<Task[]>("/dashboard/my-tasks");
      return data;
    },
  });
}
