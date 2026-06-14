import { z } from "zod";

// Comment request schemas (PRD §8.4).

export const createCommentSchema = z.object({
  content: z.string().min(1),
});

export const updateCommentSchema = createCommentSchema;

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
