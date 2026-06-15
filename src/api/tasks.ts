import { api } from "./axios";
import type {
  Task,
  TaskStatus,
} from "../types/task";
export const getProjectTasks =
  async (
    projectId: string
  ): Promise<Task[]> => {
    const { data } =
      await api.get(
        `/projects/${projectId}/tasks`
      );

    return data;
  };

export const updateTaskStatus =
  async (
    taskId: string,
    status: TaskStatus
  ) => {
    const { data } =
      await api.patch(
        `/tasks/${taskId}`,
        {
          status,
        }
      );

    return data;
  };