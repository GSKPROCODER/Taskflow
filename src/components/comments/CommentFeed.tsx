import { m } from "framer-motion";
import { ActivityItem } from "./ActivityItem";
import { staggerContainer } from "@/lib/motion";
import type { Comment } from "@/types";

export function CommentFeed({ comments }: { comments: Comment[] }) {
  if (!comments.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No comments yet. Start the conversation below.
      </p>
    );
  }

  return (
    <m.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      {comments.map((c) => (
        <ActivityItem key={c.id} comment={c} />
      ))}
    </m.div>
  );
}
