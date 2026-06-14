import { cn } from "@/lib/utils";
import { avatarColor, initials } from "@/lib/ui";

/** Overlapping avatar stack (the "People" cell in the reference list view). */
export function AvatarStack({
  names,
  max = 4,
  className,
}: {
  names: string[];
  max?: number;
  className?: string;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;

  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex -space-x-2">
        {shown.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className={cn(
              "flex size-7 items-center justify-center rounded-full text-[10px] font-medium text-white ring-2 ring-card",
              avatarColor(name),
            )}
            title={name}
          >
            {initials(name)}
          </div>
        ))}
      </div>
      {extra > 0 && (
        <span className="ml-2 text-xs text-muted-foreground">+{extra}</span>
      )}
    </div>
  );
}
