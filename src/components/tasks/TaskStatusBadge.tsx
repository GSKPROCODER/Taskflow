import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES, STATUS_LABELS } from "@/lib/ui";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

export function TaskStatusBadge({
  status,
  className,
}: {
  status: TaskStatus;
  className?: string;
}) {
  return (
    <Badge className={cn(STATUS_STYLES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
