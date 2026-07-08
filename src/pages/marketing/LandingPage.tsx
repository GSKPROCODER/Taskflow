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
    <div className="min-h-screen bg-sidebar text-sidebar-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-sidebar-accent/50 bg-sidebar/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Hexagon className="size-4" fill="currentColor" />
            </span>
            <span className="text-lg tracking-tight">TaskFlow</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
            {NAV.map((n) => (
              <a
                key={n}
                href="#features"
                className="transition-colors hover:text-white"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-sidebar-accent" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" asChild>
              <Link to="/signup">Try for free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <Section className="mx-auto max-w-6xl px-6 pb-16 pt-24 text-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
          </span>
          Now in MVP — Shadow Wings
        </motion.span>
        
        <h1 className="mx-auto mt-8 max-w-4xl text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
          Plan your team's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">best work</span> with ease
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed">
          A lightweight, production-grade collaborative task and project
          management platform designed exclusively for high-performing agile teams.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-primary/90 text-white text-base shadow-xl shadow-primary/30" asChild>
            <Link to="/signup">
              Get Started Free <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 border-sidebar-accent bg-sidebar-accent/50 text-white hover:bg-sidebar-accent hover:text-white" asChild>
            <Link to="/dashboard">View Live Demo</Link>
          </Button>
        </div>

        {/* Product mock */}
        <motion.div
          variants={fadeUp}
          className="mx-auto mt-20 max-w-5xl overflow-hidden rounded-2xl border border-sidebar-accent bg-[#0F172A] shadow-2xl ring-1 ring-white/10"
        >
          <div className="flex items-center gap-2 border-b border-sidebar-accent bg-sidebar px-4 py-3">
            <span className="size-3 rounded-full bg-rose-500/90" />
            <span className="size-3 rounded-full bg-amber-500/90" />
            <span className="size-3 rounded-full bg-emerald-500/90" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-gradient-to-b from-[#0F172A] to-sidebar">
            {["To-do", "In Progress", "In Review", "Completed"].map(
              (col, i) => (
                <div
                  key={col}
                  className="rounded-xl border border-sidebar-accent bg-sidebar/50 p-4"
                >
                  <p className="mb-4 text-sm font-semibold text-slate-300">
                    {col}
                  </p>
                  <div className="space-y-3">
                    {Array.from({ length: 3 - (i % 2) }).map((_, j) => (
                      <div
                        key={j}
                        className="rounded-lg border border-sidebar-accent bg-[#0B1121] p-3 shadow-sm"
                      >
                        <div className="h-2 w-16 rounded bg-primary/40" />
                        <div className="mt-3 h-2 w-full rounded bg-slate-700" />
                        <div className="mt-2 h-2 w-2/3 rounded bg-slate-700" />
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
      <Section className="mx-auto max-w-6xl px-6 py-12 border-y border-sidebar-accent/50 bg-sidebar/30">
        <p className="text-center text-sm font-medium text-slate-400">
          TRUSTED BY INNOVATIVE TEAMS WORLDWIDE
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {LOGOS.map((l) => (
            <span key={l} className="text-xl font-bold tracking-tighter text-white">
              {l}
            </span>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section className="mx-auto max-w-6xl px-6 py-24">
        <div id="features" className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Make better planning <span className="text-primary">decisions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
            Everything a small agile team needs to ship great work — without the
            enterprise bloat and complexity.
          </p>
        </div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="group relative rounded-2xl border border-sidebar-accent bg-sidebar/50 p-8 transition-all hover:bg-sidebar-accent/50 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <f.icon className="size-6" />
              </span>
              <h3 className="relative mt-6 text-xl font-semibold text-white">{f.title}</h3>
              <p className="relative mt-3 leading-relaxed text-slate-400">{f.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-700 px-8 py-20 text-center text-white shadow-2xl">
          <div className="absolute -left-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-20 -bottom-20 size-64 rounded-full bg-black/10 blur-3xl" />
          
          <h2 className="relative text-4xl font-bold tracking-tight">
            Ready to plan your team's best work?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/90 font-medium">
            Join thousands of teams already using TaskFlow. Get started in minutes. No credit card required.
          </p>
          <Button size="lg" className="relative mt-10 h-14 bg-white text-primary hover:bg-slate-50 px-8 text-base font-semibold shadow-xl" asChild>
            <Link to="/signup">
              Start Building Now <ArrowRight className="ml-2 size-5" />
            </Link>
          </Button>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-sidebar-accent/50 bg-[#070A14]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-12 text-sm text-slate-500 sm:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <span className="flex size-7 items-center justify-center rounded bg-primary text-white">
              <Hexagon className="size-4" fill="currentColor" />
            </span>
            TaskFlow
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
          <p>© 2026 Shadow Wings · Internal Use Only</p>
        </div>
      </footer>
    </div>
  );
}
