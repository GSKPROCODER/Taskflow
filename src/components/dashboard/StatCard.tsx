import { m } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "bg-brand-muted text-primary",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  tone?: string;
}) {
  return (
    <m.div variants={staggerItem}>
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-xl",
              tone,
            )}
          >
            <Icon className="size-5" />
          </span>
          {delta && (
            <span className="text-xs font-medium text-emerald-600">
              {delta}
            </span>
          )}
        </div>
        <p className="mt-4 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </Card>
    </m.div>
  );
}
