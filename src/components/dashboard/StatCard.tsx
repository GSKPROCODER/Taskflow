import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "bg-brand/10 text-brand",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  delta?: string;
  tone?: string;
}) {
  return (
    <motion.div variants={staggerItem}>
      <Card className="group p-5 shadow-sm shadow-slate-200/50 border-border bg-card rounded-[1rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                tone,
              )}
            >
              <Icon className="size-5" />
            </span>
            {delta && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {delta}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground mt-1">{value}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
