<<<<<<< HEAD
// Sidebar (PRD §9 layout). Component stub — implemented in its PRD phase.
export function Sidebar() {
  return <div>Sidebar</div>;
}
=======
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold">
          TaskFlow
        </h1>
      </div>

      <nav className="px-4">
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/projects"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <FolderKanban size={18} />
              Projects
            </Link>
          </li>

          <li>
            <Link
              to="/tasks"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
            >
              <CheckSquare size={18} />
              Tasks
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
>>>>>>> faiz
