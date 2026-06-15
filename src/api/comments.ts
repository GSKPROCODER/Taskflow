import { api } from "./axios";
import type { Project } from "../types/project";

export const getComments =
  async (
    taskId: string
  ): Promise<Comment[]> => {
    const { data } =
      await api.get(
        `/tasks/${taskId}/comments`
      );

    return data;
  };

export const createComment =
  async (
    taskId: string,
    content: string
  ) => {
    const { data } =
      await api.post(
        `/tasks/${taskId}/comments`,
        {
          content,
        }
      );

    return data;
  };