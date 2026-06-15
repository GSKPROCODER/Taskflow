<<<<<<< HEAD
// ProjectForm (PRD §5.2). Component stub — implemented in its PRD phase.
export function ProjectForm() {
  return <div>ProjectForm</div>;
}
=======
import { useState } from "react";
import Button from "../ui/button";
import Input from "../ui/input";

interface ProjectFormProps {
  onSubmit: (
    values: {
      name: string;
      description: string;
    }
  ) => void;

  loading?: boolean;
}

export default function ProjectForm({
  onSubmit,
  loading,
}: ProjectFormProps) {
  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    onSubmit({
      name,
      description,
    });

    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Project Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <div>
        <label className="block mb-1 text-sm font-medium">
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

      <Button
        type="submit"
        loading={loading}
      >
        Create Project
      </Button>
    </form>
  );
}
>>>>>>> faiz
