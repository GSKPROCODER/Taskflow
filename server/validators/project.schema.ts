import { z } from "zod";

// Project request schemas (PRD §8.2).

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
