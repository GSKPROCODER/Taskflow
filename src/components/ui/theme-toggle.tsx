import { Moon, Sun } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-16 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-card shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
    >
      <span className="sr-only">Toggle theme</span>
      <div
        className={`absolute left-1 top-1 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform duration-300 ease-in-out ${theme === "dark" ? "translate-x-7" : "translate-x-0"}`}
      >
        {theme === "dark" ? (
          <Moon className="size-4" />
        ) : (
          <Sun className="size-4" />
        )}
      </div>
      <div className="flex w-full justify-between px-2 text-muted-foreground">
        <Sun className="size-3.5 opacity-50" />
        <Moon className="size-3.5 opacity-50" />
      </div>
    </button>
  );
}
