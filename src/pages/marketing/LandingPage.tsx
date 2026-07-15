import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Hexagon,
  LayoutDashboard,
  Users,
  Shield,
  BarChart3,
  ArrowRight,
  Star,
  Zap,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useAuthStore } from "@/store/auth.store";
import { Navigate } from "react-router-dom";

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: "Smart Dashboards",
    description:
      "Real-time project health metrics with priority breakdowns and status tracking at a glance.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description:
      "Dedicated flows for Team Leads, Developers, and Testers with strict permission gates.",
  },
  {
    icon: GitBranch,
    title: "QA Pipeline",
    description:
      "Structured testing workflow with approve/reject cycles. Tasks flow through todo → in_progress → testing → done.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Built-in commenting, activity logs, and team management for seamless coordination.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description:
      "Track velocity, completion rates, and team workload with rich visualizations.",
  },
  {
    icon: MessageSquare,
    title: "Activity Feed",
    description:
      "Every status change and comment logged automatically. Full audit trail for compliance.",
  },
];

const STATS = [
  { value: "40%", label: "Fewer bugs in production" },
  { value: "2.5x", label: "Faster sprint delivery" },
  { value: "99.9%", label: "Uptime guarantee" },
  { value: "500+", label: "Teams onboarded" },
];

/**
 * Marketing landing page — public root route.
 * Redirects authenticated users to /dashboard.
 */
export function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.status === "authed");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm transition-transform group-hover:scale-105">
              <Hexagon className="size-5" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-sm shadow-md shadow-primary/20">
                Get started
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-[600px] rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-purple-500/8 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 size-[300px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm">
                <Zap className="size-3.5" />
                Built for agile teams
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="mt-8 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Ship better software,{" "}
              <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                faster together
              </span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              TaskFlow gives your team structured pipelines, role-based
              workflows, and real-time analytics — so every sprint lands on
              time, every time.
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <Link to="/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base shadow-xl shadow-primary/25"
                >
                  Start for free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 px-8 text-base"
                >
                  Sign in to your workspace
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Dashboard mockup card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
            className="mx-auto mt-20 max-w-5xl"
          >
            <div className="relative rounded-2xl border border-border/50 bg-card/60 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl">
              {/* Window chrome */}
              <div className="flex items-center gap-2 rounded-t-xl bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-400/80" />
                  <div className="size-3 rounded-full bg-yellow-400/80" />
                  <div className="size-3 rounded-full bg-green-400/80" />
                </div>
                <div className="mx-auto h-6 w-64 rounded-md bg-background/60 border border-border/40" />
              </div>
              {/* Content area */}
              <div className="grid grid-cols-12 gap-3 p-4">
                {/* Sidebar mock */}
                <div className="col-span-3 space-y-3 rounded-xl bg-muted/30 p-3">
                  <div className="h-4 w-20 rounded bg-primary/20" />
                  <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-3 rounded ${i === 1 ? "w-full bg-primary/30" : "w-3/4 bg-muted-foreground/10"}`}
                      />
                    ))}
                  </div>
                </div>
                {/* Main content mock */}
                <div className="col-span-9 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-32 rounded bg-foreground/10" />
                    <div className="h-8 w-24 rounded-lg bg-primary/20" />
                  </div>
                  {/* Stat cards */}
                  <div className="grid grid-cols-4 gap-3">
                    {["emerald", "blue", "amber", "purple"].map((color) => (
                      <div
                        key={color}
                        className="rounded-lg border border-border/30 bg-background/50 p-3"
                      >
                        <div
                          className={`h-2 w-10 rounded bg-${color}-500/30`}
                        />
                        <div className="mt-2 h-5 w-12 rounded bg-foreground/15" />
                        <div className="mt-1 h-2 w-16 rounded bg-muted-foreground/10" />
                      </div>
                    ))}
                  </div>
                  {/* Kanban columns mock */}
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {["Todo", "In Progress", "Testing", "Done"].map(
                      (col, ci) => (
                        <div
                          key={col}
                          className="rounded-lg border border-border/30 bg-muted/20 p-2"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="h-3 w-14 rounded bg-foreground/10" />
                            <div className="flex size-5 items-center justify-center rounded-full bg-muted-foreground/10 text-[10px] text-muted-foreground">
                              {3 - ci > 0 ? 3 - ci : 1}
                            </div>
                          </div>
                          {Array.from({ length: Math.max(1, 3 - ci) }).map(
                            (_, j) => (
                              <div
                                key={j}
                                className="mb-2 rounded-md border border-border/20 bg-background/60 p-2"
                              >
                                <div className="h-2 w-full rounded bg-foreground/8" />
                                <div className="mt-1.5 h-2 w-2/3 rounded bg-muted-foreground/8" />
                              </div>
                            ),
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={staggerItem}
                className="text-center"
              >
                <p className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your team needs
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Purpose-built for agile software teams that take quality
              seriously.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Social proof ── */}
      <section className="border-t border-border/40 bg-muted/10 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by engineering teams
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See why hundreds of teams chose TaskFlow over legacy tools.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                name: "Sarah Rogers",
                initials: "SR",
                role: "VP of Engineering, InnovateInc",
                quote:
                  "TaskFlow completely transformed how our engineering team ships. The formal QA pipeline caught 40% more bugs before production.",
                gradient: "from-pink-500 to-orange-400",
              },
              {
                name: "Marcus Chen",
                initials: "MC",
                role: "Tech Lead, DevStack",
                quote:
                  "The role-based workflows mean our developers focus on coding while testers have a dedicated approval flow. It just works.",
                gradient: "from-blue-500 to-cyan-400",
              },
              {
                name: "Priya Sharma",
                initials: "PS",
                role: "CTO, LaunchPad",
                quote:
                  "We moved from 3 different tools to just TaskFlow. The dashboard analytics alone saved us hours of status meetings.",
                gradient: "from-emerald-500 to-teal-400",
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={staggerItem}
                className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
              >
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="size-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div
                    className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.gradient} text-sm font-bold text-white shadow-inner`}
                  >
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to streamline your workflow?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Create your free workspace in seconds. No credit card required.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base shadow-xl shadow-primary/25"
                >
                  Get started for free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Hexagon className="size-4" fill="currentColor" />
            </span>
            <span className="text-sm font-semibold">TaskFlow</span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
