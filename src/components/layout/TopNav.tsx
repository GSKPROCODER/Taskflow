import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { NotificationsPanel } from "./NotificationsPanel";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useUIStore } from "@/store/ui.store";
import { projectById, taskById } from "@/lib/mock-data";

function useCrumbs(): Crumb[] {
  const { pathname } = useLocation();
  const params = useParams();
  const seg = pathname.split("/").filter(Boolean);
  if (!seg.length) return [{ label: "Dashboard" }];

  const first = seg[0];
  switch (first) {
    case "dashboard":
      return [{ label: "Dashboard" }];
    case "projects": {
      if (params.id) {
        const p = projectById(params.id);
        return [
          { label: "Projects", to: "/projects" },
          { label: p?.name ?? "Project" },
        ];
      }
      return [{ label: "Projects" }];
    }
    case "tasks": {
      const t = params.id ? taskById(params.id) : undefined;
      return [
        { label: "Tasks", to: "/my-tasks" },
        { label: t?.title ?? "Task" },
      ];
    }
    case "my-tasks":
      return [{ label: "Dashboard", to: "/dashboard" }, { label: "My Tasks" }];
    case "calendar":
      return [{ label: "Dashboard", to: "/dashboard" }, { label: "Calendar" }];
    case "notifications":
      return [{ label: "Notifications" }];
    case "settings":
      return [{ label: "Settings" }];
    default:
      return [{ label: first![0]!.toUpperCase() + first!.slice(1) }];
  }
}

function IconButton({
  children,
  active,
  ...props
}: React.ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      className={cn(
        "relative flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        active && "text-primary",
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TopBar() {
  const crumbs = useCrumbs();
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [bellOpen, setBellOpen] = useState(false);
  const navigate = useNavigate();
  const { toggleSidebar, theme, toggleTheme } = useUIStore();

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-card px-6 py-3.5">
      <IconButton title="Toggle Sidebar" onClick={toggleSidebar}>
        <Menu className="size-4" />
      </IconButton>
      <Breadcrumb items={crumbs} />

      <div className="relative ml-auto hidden w-full max-w-sm items-center md:flex">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          placeholder="Search anything..."
          className="h-9 w-full rounded-lg border-0 bg-secondary pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const q = e.currentTarget.value.trim().toLowerCase();
              if (!q) return;
              
              if (q.includes("calendar")) navigate("/calendar");
              else if (q.includes("project")) navigate("/projects");
              else if (q.includes("team")) navigate("/team");
              else if (q.includes("report")) navigate("/reports");
              else if (q.includes("task")) navigate("/my-tasks");
              else if (q.includes("setting")) navigate("/settings");
              else if (q.includes("dash")) navigate("/dashboard");
              
              e.currentTarget.value = "";
              e.currentTarget.blur();
            }
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        <IconButton title="Toggle Theme" onClick={toggleTheme}>
          {theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </IconButton>

        <DropdownMenu open={bellOpen} onOpenChange={setBellOpen}>
          <DropdownMenuTrigger asChild>
            <IconButton title="Notifications" active={bellOpen}>
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-0 bg-transparent p-0 shadow-none"
          >
            <AnimatePresence>
              {bellOpen && <NotificationsPanel />}
            </AnimatePresence>
          </DropdownMenuContent>
        </DropdownMenu>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-accent">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-medium text-white",
                  avatarColor(user?.name ?? "U"),
                )}
              >
                {initials(user?.name ?? "U")}
              </span>
              <div className="hidden flex-col items-start text-left md:flex">
                <span className="text-sm font-semibold leading-tight text-foreground">{user?.name ?? "User"}</span>
                <span className="text-[11px] font-medium leading-tight text-muted-foreground capitalize">
                  {user?.role?.replace("_", " ") ?? "Developer"}
                </span>
              </div>
              <ChevronDown className="ml-1 size-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => navigate("/settings")}>
              <UserIcon /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate("/settings")}>
              <Settings /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                signOut();
                navigate("/login");
              }}
            >
              <LogOut /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
