<<<<<<< HEAD
// TaskList (PRD §5.3). Component stub — implemented in its PRD phase.
export function TaskList() {
  return <div>TaskList</div>;
}
=======
import { Task } from "../../types/task";
import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
}

export default function TaskList({
  tasks,
}: Props) {
  if (!tasks.length) {
    return (
      <div className="text-center py-10">
        No Tasks Found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
        />
      ))}
    </div>
  );
}
>>>>>>> faiz
