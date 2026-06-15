import { Project } from "../../types/project";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <h3 className="text-lg font-semibold">
        {project.name}
      </h3>

      <p className="text-gray-500 mt-2">
        {project.description}
      </p>

      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded text-xs ${
            project.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {project.status}
        </span>
      </div>
    </div>
  );
}