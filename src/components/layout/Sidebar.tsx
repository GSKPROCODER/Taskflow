import { NavLink } from "react-router-dom";
import {
  Home,
  FolderKanban,
  ListTodo,
  CalendarDays,
  Users,
  BarChart2,
  Bell,
  Settings,
  Hexagon,
  LogOut,
  KanbanSquare,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/ui.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItemBase =
  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";

function itemClass({ isActive }: { isActive: boolean }) {
  return cn(
    navItemBase,
    isActive
      ? "bg-brand text-white shadow-sm"
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
  );
}

export function Sidebar() {
  const { user, signOut } = useAuth();
  const { setSidebarOpen } = useUIStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <aside className="flex h-full w-full flex-col bg-sidebar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-brand text-white shadow-sm shadow-brand/20">
          <Hexagon className="size-5" fill="currentColor" />
        </div>
        <p className="truncate text-lg font-bold text-white tracking-tight">
          TaskFlow
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <Home className="size-4" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <FolderKanban className="size-4" />
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-tasks"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <ListTodo className="size-4" />
              Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/calendar"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <CalendarDays className="size-4" />
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/team"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <Users className="size-4" />
              Team
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <BarChart2 className="size-4" />
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jira-sync"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <KanbanSquare className="size-4" />
              Jira Sync
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/slack-feed"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <MessageSquare className="size-4" />
              Slack Feed
            </NavLink>
          </li>
        </ul>

        <div className="my-6 border-t border-sidebar-accent/50" />

        <ul className="space-y-1">
          <li>
            <NavLink
              to="/notifications"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <Bell className="size-4" />
              Notifications
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={itemClass}
            >
              <Settings className="size-4" />
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* User Profile Footer */}
      <div className="border-t border-sidebar-accent/50 p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-sidebar-accent group cursor-pointer">
          <Avatar className="size-8 bg-sidebar-accent text-white">
            <AvatarFallback className="bg-brand text-xs">
              {user?.name?.slice(0, 2).toUpperCase() ?? "ME"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {user?.name ?? "Guest User"}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.role?.replace("_", " ") ?? "Viewer"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sidebar-foreground/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
