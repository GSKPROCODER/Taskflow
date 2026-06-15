<<<<<<< HEAD
// TaskCard (PRD §5.3). Component stub — implemented in its PRD phase.
export function TaskCard() {
  return <div>TaskCard</div>;
}
=======
import type { Task } from "../../types/task";
import TaskStatusBadge from "./TaskStatusBadge";

interface Props {
  task: Task;
}

export default function TaskCard({
  task,
}: Props) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold">
          {task.title}
        </h3>

        <TaskStatusBadge
          status={task.status}
        />
      </div>

      <p className="text-gray-500 mt-2">
        {task.description}
      </p>

      <div className="mt-4 text-sm text-gray-400">
        Priority: {task.priority}
      </div>
    </div>
  );
}
>>>>>>> faiz
