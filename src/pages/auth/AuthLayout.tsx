import { motion } from "framer-motion";
import { Hexagon, CheckCircle2, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const FEATURES = [
  "Role-based access control for Leads, Developers, and Testers.",
  "Customizable Kanban boards with strict QA pipelines.",
  "Real-time analytics and project health monitoring.",
  "Integrated team communication and Slack syncing.",
];

/** Rich split auth layout: premium brand panel + form (shared by Login/Signup). */
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
    <div className="grid min-h-screen lg:grid-cols-2 bg-background text-foreground">
      {/* Brand panel (Left) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-900 via-primary to-purple-900 p-10 text-white lg:flex">
        
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-purple-500/30 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/20">
              <Hexagon className="size-5" fill="currentColor" />
            </span>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>
          <div className="rounded-full bg-black/20 p-1 backdrop-blur-md border border-white/10">
            <ThemeToggle />
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 mt-12 flex-1">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-md">
            <motion.h1 variants={staggerItem} className="text-4xl font-bold leading-[1.1] tracking-tight">
              Plan your team's best work with ease.
            </motion.h1>
            <motion.p variants={staggerItem} className="mt-4 text-lg text-white/80">
              Join thousands of high-performing agile teams building better software faster.
            </motion.p>
            
            <motion.ul variants={staggerItem} className="mt-10 space-y-4">
              {FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-medium text-white/90">
                  <div className="mt-0.5 rounded-full bg-white/20 p-1">
                    <CheckCircle2 className="size-4 text-white" />
                  </div>
                  {feature}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Floating UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="absolute -right-32 top-24 w-[400px] rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <div className="h-3 w-16 rounded-full bg-white/20" />
              <div className="h-3 w-8 rounded-full bg-white/20" />
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-2 w-3/4 rounded bg-white/30" />
              <div className="h-2 w-1/2 rounded bg-white/20" />
              <div className="h-2 w-5/6 rounded bg-white/20" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-1/3 rounded-lg bg-emerald-500/40" />
              <div className="h-8 w-1/3 rounded-lg bg-blue-500/40" />
            </div>
          </motion.div>
        </div>

        {/* Footer Testimonial */}
        <div className="relative z-10 mt-12 rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
          <Quote className="absolute -top-3 -left-2 size-8 text-white/20 rotate-180" />
          <p className="text-sm font-medium leading-relaxed text-white/90">
            "TaskFlow completely transformed how our engineering team ships. The formal QA pipeline caught 40% more bugs before production."
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 font-bold shadow-inner">
                SR
              </div>
              <div>
                <p className="text-sm font-semibold">Sarah Rogers</p>
                <p className="text-xs text-white/60">VP of Engineering, InnovateInc</p>
              </div>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-4 fill-amber-400 text-amber-400" />)}
            </div>
          </div>
        </div>

      </div>

      {/* Form panel (Right) */}
      <div className="flex items-center justify-center bg-card p-6 md:p-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="w-full max-w-md xl:max-w-lg"
        >
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
          </div>
          
          <div className="rounded-2xl border border-border/50 bg-background/50 p-6 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-8">
            {children}
          </div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
