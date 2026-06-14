import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Rounded filter pill with an optional count and a dropdown of options
 * (the "To-do 3 ▾ / On progress 3 ▾ / In Review 2 ▾" controls in the refs).
 */
export function PillSelect({
  label,
  count,
  options,
  onSelect,
  className,
}: {
  label: string;
  count?: number;
  options?: { label: string; value: string }[];
  onSelect?: (value: string) => void;
  className?: string;
}) {
  const trigger = (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
        className,
      )}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="rounded-md bg-muted px-1.5 text-xs text-muted-foreground">
          {count}
        </span>
      )}
      <ChevronDown className="size-3.5 opacity-60" />
    </button>
  );

  if (!options?.length) return trigger;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onSelect?.(opt.value)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
