import { motion } from "framer-motion";
import { Hexagon, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/motion";

const HIGHLIGHTS = [
  "Role-based workflows for Leads, Developers & Testers",
  "Structured QA: Testing → Approve / Reject",
  "Real-time dashboard of project health",
];

/** Split auth layout: brand panel + form (shared by Login/Signup). */
export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <Hexagon className="size-6" fill="currentColor" />
          <span className="text-lg font-semibold">TaskFlow</span>
        </Link>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            Plan your team's best work with ease.
          </h2>
          <ul className="mt-8 space-y-3">
            {HIGHLIGHTS.map((h) => (
              <li
                key={h}
                className="flex items-start gap-3 text-sm text-primary-foreground/90"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-primary-foreground/60">
          © 2026 Shadow Wings · Internal Use Only
        </p>
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-card/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 size-72 rounded-full bg-card/10 blur-2xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-card p-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
