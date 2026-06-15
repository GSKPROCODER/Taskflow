<<<<<<< HEAD
// TaskStatusBadge (PRD §5.3). Component stub — implemented in its PRD phase.
export function TaskStatusBadge() {
  return <div>TaskStatusBadge</div>;
}
=======
import Badge from "../ui/Badge";

interface Props {
  status:
    | "todo"
    | "in_progress"
    | "testing"
    | "done";
}

export default function TaskStatusBadge({
  status,
}: Props) {
  const colorMap = {
    todo: "gray",
    in_progress: "blue",
    testing: "yellow",
    done: "green",
  } as const;

  return (
    <Badge color={colorMap[status]}>
      {status.replace("_", " ")}
    </Badge>
  );
}
>>>>>>> faiz
