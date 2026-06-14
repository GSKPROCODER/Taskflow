import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Hexagon,
  CheckCircle2,
  LayoutGrid,
  ShieldCheck,
  BarChart3,
  MessagesSquare,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

const NAV = ["Features", "Customers", "Integrations", "Pricing"];
const LOGOS = ["Edisen", "BuzzFeed", "M&C", "Bulletproof", "Deloitte", "KPMG"];
const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Unified workspace",
    body: "Projects, tasks, and comments in one place — no more scattered spreadsheets and chat threads.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    body: "Clear permissions for Team Leads, Developers, and Testers, enforced everywhere.",
  },
  {
    icon: CheckCircle2,
    title: "Structured QA",
    body: "A formal Testing → Approve / Reject pipeline so nothing ships unreviewed.",
  },
  {
    icon: BarChart3,
    title: "Real-time dashboard",
    body: "Live task metrics and project health at a glance for every stakeholder.",
  },
  {
    icon: MessagesSquare,
    title: "Contextual comments",
    body: "Discuss work where it happens, with a full activity history per task.",
  },
  {
    icon: Hexagon,
    title: "Built to scale",
    body: "Stateless, serverless architecture on Vercel + Supabase that grows with you.",
  },
];

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-card text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Hexagon className="size-4" fill="currentColor" />
            </span>
            TaskFlow
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            {NAV.map((n) => (
              <a
                key={n}
                href="#features"
                className="transition-colors hover:text-foreground"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Try for free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" /> Now in MVP —
          Shadow Wings
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight">
          Plan your team's <span className="text-primary">best work</span> with
          ease
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          A lightweight, production-grade collaborative task and project
          management platform for small agile teams.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/signup">
              Try for free <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard">View live demo</Link>
          </Button>
        </div>

        {/* Product mock */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-14 max-w-5xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        >
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
            <span className="size-3 rounded-full bg-rose-400" />
            <span className="size-3 rounded-full bg-amber-400" />
            <span className="size-3 rounded-full bg-emerald-400" />
          </div>
          <div className="grid grid-cols-4 gap-3 p-5">
            {["To-do", "In Progress", "In Review", "Completed"].map(
              (col, i) => (
                <div
                  key={col}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <p className="mb-3 text-xs font-semibold text-muted-foreground">
                    {col}
                  </p>
                  <div className="space-y-2">
                    {Array.from({ length: 3 - (i % 2) }).map((_, j) => (
                      <div
                        key={j}
                        className="rounded-lg border border-border bg-background p-2"
                      >
                        <div className="h-2 w-12 rounded bg-primary/30" />
                        <div className="mt-2 h-2 w-full rounded bg-muted" />
                        <div className="mt-1.5 h-2 w-2/3 rounded bg-muted" />
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </motion.div>
      </Section>

      {/* Logo cloud */}
      <Section className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-center text-sm text-muted-foreground">
          Loved by 4,500+ professional services teams
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {LOGOS.map((l) => (
            <span key={l} className="text-lg font-semibold tracking-tight">
              {l}
            </span>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="mx-auto max-w-6xl px-6 py-16">
        <div id="features" className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Make better planning <span className="text-primary">decisions</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Everything a small agile team needs to ship great work — without the
            enterprise bloat.
          </p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="rounded-2xl border border-border bg-background p-6"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-muted text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="mx-auto max-w-6xl px-6 py-16">
        <div className="overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="text-3xl font-semibold tracking-tight">
            Ready to plan your team's best work?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Get started in minutes. No credit card required.
          </p>
          <Button size="lg" variant="secondary" asChild className="mt-7">
            <Link to="/signup">
              Try for free <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Hexagon className="size-4 text-primary" fill="currentColor" />
            TaskFlow
          </div>
          <p>© 2026 Shadow Wings · Internal Use Only</p>
        </div>
      </footer>
    </div>
  );
}
