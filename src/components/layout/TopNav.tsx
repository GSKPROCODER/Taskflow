import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Bell,
  Star,
  MoreHorizontal,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings,
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

  return (
    <header className="flex items-center gap-4 border-b border-border bg-card px-6 py-3.5">
      <Breadcrumb items={crumbs} />

      <div className="relative ml-auto hidden w-full max-w-sm items-center md:flex">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          placeholder="Search"
          className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2">
        <IconButton title="Favorites">
          <Star className="size-4" />
        </IconButton>

        <DropdownMenu open={bellOpen} onOpenChange={setBellOpen}>
          <DropdownMenuTrigger asChild>
            <IconButton title="Notifications" active={bellOpen}>
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
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

        <IconButton title="More">
          <MoreHorizontal className="size-4" />
        </IconButton>

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
              <ChevronDown className="size-4 text-muted-foreground" />
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
