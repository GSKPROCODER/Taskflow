<<<<<<< HEAD
// TaskForm (PRD §5.3). Component stub — implemented in its PRD phase.
export function TaskForm() {
  return <div>TaskForm</div>;
}
=======
import { useState } from "react";

import Button from "../ui/button";
import Input from "../ui/input";

interface Props {
  onSubmit: (values: {
    title: string;
    description: string;
    priority: string;
  }) => void;

  loading?: boolean;
}

export default function TaskForm({
  onSubmit,
  loading = false,
}: Props) {
  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [priority, setPriority] =
    useState("medium");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
      priority,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <div>
        <label className="block mb-2">
          Description
        </label>

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-3"
          rows={4}
        />
      </div>

      <select
        value={priority}
        onChange={(e) =>
          setPriority(
            e.target.value
          )
        }
        className="w-full border rounded-lg p-3"
      >
        <option value="low">
          Low
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="high">
          High
        </option>

        <option value="critical">
          Critical
        </option>
      </select>

      <Button
        type="submit"
        loading={loading}
      >
        Create Task
      </Button>
    </form>
  );
}
>>>>>>> faiz
