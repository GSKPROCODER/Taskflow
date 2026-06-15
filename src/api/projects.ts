import { api } from "./axios";

import type { Project } from "../types/project";

export const getProjects =
  async (): Promise<Project[]> => {
    const { data } =
      await api.get(
        "/projects"
      );

    return data;
  };

export const createProject =
  async (
    project: Partial<Project>
  ) => {
    const { data } =
      await api.post(
        "/projects",
        project
      );

    return data;
  };