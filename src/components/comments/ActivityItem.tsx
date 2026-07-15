import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { relativeTime } from "@/lib/format";
import { staggerItem } from "@/lib/motion";
import type { Comment } from "@/types";

/** One row in the comment/activity feed — comment bubble or system log line. */
export function ActivityItem({ comment }: { comment: Comment }) {
  const when = relativeTime(comment.created_at, new Date());
  // Show ID as a fallback since no /users API yet
  const authorName = comment.user_id.slice(0, 8);

  if (comment.type === "system_log") {
    return (
      <motion.div
        variants={staggerItem}
        className="flex items-center gap-2 py-1.5 pl-1 text-xs text-muted-foreground"
      >
        <Activity className="size-3.5" />
        <span>{comment.content}</span>
        <span className="text-muted-foreground/60">· {when}</span>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerItem} className="flex gap-3">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white",
          avatarColor(authorName),
        )}
      >
        {initials(authorName)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{authorName}</span>
          <span className="text-xs text-muted-foreground">{when}</span>
        </div>
        <p className="mt-1 rounded-xl rounded-tl-sm bg-muted px-3 py-2 text-sm">
          {comment.content}
        </p>
      </div>
    </motion.div>
  );
}
