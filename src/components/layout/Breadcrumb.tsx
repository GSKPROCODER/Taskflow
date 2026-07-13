import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; to?: string };

/** Breadcrumb trail: muted parents, bold current (matches the reference topbar). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-lg font-medium">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            className="flex items-center gap-1.5"
          >
            {item.to && !last ? (
              <Link
                to={item.to}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  last
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            )}
            {!last && <span className="text-muted-foreground/50">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
