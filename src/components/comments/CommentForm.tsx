// Removed unused useState import
import { SendHorizontal, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/useComments";
import {
  createCommentSchema,
  type CreateCommentInput,
} from "../../../server/validators/comment.schema";

/** Add-comment composer. */
export function CommentForm({ taskId }: { taskId: string }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { content: "" },
  });

  const content = watch("content");
  const createComment = useCreateComment(taskId);

  const onSubmit = (values: CreateCommentInput) => {
    createComment.mutate(values, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-2 relative"
    >
      <Textarea
        placeholder="Write a comment…"
        className={
          errors.content
            ? "border-destructive focus-visible:ring-destructive min-h-[72px]"
            : "min-h-[72px]"
        }
        {...register("content")}
      />
      {errors.content && (
        <p className="flex items-center gap-1 text-[13px] font-medium text-destructive mt-1">
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive/10">
            !
          </span>
          {errors.content.message}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!content?.trim() || createComment.isPending}
        >
          {createComment.isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <SendHorizontal />
          )}
          Comment
        </Button>
      </div>
    </form>
  );
}
