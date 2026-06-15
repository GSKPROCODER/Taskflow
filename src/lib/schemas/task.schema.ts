import { z } from "zod";

export const taskSchema =
  z.object({
    title: z
      .string()
      .min(3),

    description: z
      .string()
      .min(5),

    priority: z.enum([
      "low",
      "medium",
      "high",
      "critical",
    ]),
  });

export type TaskFormData =
  z.infer<
    typeof taskSchema
  >;