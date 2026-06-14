import { NavLink } from "react-router-dom";
import {
  Home,
  FolderKanban,
  ListTodo,
  CalendarDays,
  Search,
  Bell,
  Settings,
  ShieldCheck,
  Hexagon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { projects as allProjects } from "@/lib/mock-data";

const navItemBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";

function itemClass({ isActive }: { isActive: boolean }) {
  return cn(
    navItemBase,
    isActive
      ? "bg-brand-muted text-primary"
      : "text-muted-foreground hover:bg-accent hover:text-foreground",
  );
}

export function Sidebar() {
  const { user } = useAuth();
  const featured = allProjects.filter((p) => p.status === "active").slice(0, 3);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      {/* Org header */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Hexagon className="size-5" fill="currentColor" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">TaskFlow</p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? "shadowwings.io"}
          </p>
        </div>
      </div>

      <div className="mx-5 border-t border-dashed border-border" />

      {/* Primary nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          <li>
            <NavLink to="/dashboard" className={itemClass}>
              <Home className="size-4" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" end className={itemClass}>
              <FolderKanban className="size-4" />
              Projects
            </NavLink>
            <ul className="mt-1 space-y-0.5 pl-9 text-sm">
              {featured.map((p) => (
                <li key={p.id}>
                  <NavLink
                    to={`/projects/${p.id}`}
                    className={({ isActive }) =>
                      cn(
                        "block truncate rounded-md px-2 py-1.5 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground",
                      )
                    }
                  >
                    {p.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <NavLink to="/my-tasks" className={itemClass}>
              <ListTodo className="size-4" />
              My Tasks
            </NavLink>
          </li>
          <li>
            <NavLink to="/calendar" className={itemClass}>
              <CalendarDays className="size-4" />
              Calendar
            </NavLink>
          </li>
        </ul>

        <p className="px-3 pb-2 pt-6 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Others
        </p>
        <ul className="space-y-1">
          <li>
            <NavLink to="/notifications" className={itemClass}>
              <Bell className="size-4" />
              Notification
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={itemClass}>
              <Settings className="size-4" />
              Setting
            </NavLink>
          </li>
          <li>
            <span
              className={cn(
                navItemBase,
                "cursor-default text-muted-foreground/70",
              )}
            >
              <Search className="size-4" />
              Search
            </span>
          </li>
        </ul>
      </nav>

      {/* Promo card */}
      <div className="m-4 rounded-2xl border border-border p-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
          <ShieldCheck className="size-4 text-foreground" />
        </div>
        <p className="mt-3 text-sm font-semibold leading-snug">
          Add an extra security to your account
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Add a secondary method of verification used during login.
        </p>
        <button className="mt-3 w-full rounded-lg bg-neutral-900 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800">
          Learn more
        </button>
      </div>
    </aside>
  );
}
