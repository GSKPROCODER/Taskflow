import { Badge } from "@/components/ui/badge";
import { PRIORITY_STYLES, PRIORITY_LABELS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types";

export function PriorityBadge({
  priority,
  className,
}: {
  priority: TaskPriority;
  className?: string;
}) {
  return (
    <Badge className={cn(PRIORITY_STYLES[priority], className)}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
