import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Activity, 
  Clock, 
  Users, 
  Filter, 
  Download, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { staggerContainer, staggerItem } from "@/lib/motion";

const EXPORTS_LOG = [
  {
    id: 1,
    name: "Q2 Deliverables Summary",
    date: "Jul 10, 2026",
    format: "PDF",
    user: "Sarah Chen",
    email: "sarah.c@taskflow.corp",
    status: "Success",
    initials: "SC"
  },
  {
    id: 2,
    name: "Engineering Capacity Report",
    date: "Jul 09, 2026",
    format: "CSV",
    user: "David Kumar",
    email: "david.k@taskflow.corp",
    status: "Success",
    initials: "DK"
  },
  {
    id: 3,
    name: "Security Audit Logs - July",
    date: "Jul 10, 2026",
    format: "PDF",
    user: "System Automated",
    email: "security@taskflow.corp",
    status: "Processing",
    initials: "SA"
  }
];

export function ReportsPage() {
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  // Simulate progress bar for export dialog
  const handleExport = () => {
    setExportProgress(0);
    setExportComplete(false);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        setExportProgress(100);
        setExportComplete(true);
        clearInterval(interval);
      } else {
        setExportProgress(currentProgress);
      }
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* HEADER & ACTION BUTTONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            System Intelligence & Performance Analytics
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time insights on operational velocity and resource utilization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 bg-card">
            <Filter className="size-4" /> Filter Parameters
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={handleExport} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-md">
                <Download className="size-4" /> Export Executive Brief (PDF/CSV)
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-5 text-purple-600" />
                  Generating Executive Brief
                </DialogTitle>
              </DialogHeader>
              <div className="py-6 space-y-6">
                {!exportComplete ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        Running automated security compile...
                      </span>
                      <span className="text-foreground">{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="h-2" />
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center space-y-3 py-4 text-center"
                  >
                    <div className="rounded-full bg-emerald-100 p-3">
                      <CheckCircle2 className="size-8 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-lg text-foreground">Export Ready</h3>
                    <p className="text-sm text-muted-foreground">Your Executive Brief has been securely compiled and downloaded.</p>
                  </motion.div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TOP PERFORMANCE METRIC ROW */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Card 1: Sprint Velocity */}
        <motion.div variants={staggerItem}>
          <Card className="p-5 flex flex-col justify-between border-border shadow-sm rounded-2xl bg-card relative overflow-hidden group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TrendingUp className="size-5" />
              </span>
              <div className="flex items-center text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="mr-1 size-3" /> 4.2%
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Sprint Velocity</p>
              <div className="flex items-end justify-between mt-1">
                <p className="text-3xl font-bold tracking-tight text-foreground">94.2%</p>
                {/* SVG Sparkline */}
                <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 25C20 25 30 15 50 15C70 15 80 5 100 5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Card 2: Integration Sync Rate */}
        <motion.div variants={staggerItem}>
          <Card className="p-5 flex flex-col justify-between border-border shadow-sm rounded-2xl bg-card hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Activity className="size-5" />
              </span>
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Integration Sync Rate</p>
              <p className="text-3xl font-bold tracking-tight text-foreground mt-1">100%</p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Jira & Slack APIs Active</p>
            </div>
          </Card>
        </motion.div>

        {/* Card 3: Average Cycle Time */}
        <motion.div variants={staggerItem}>
          <Card className="p-5 flex flex-col justify-between border-border shadow-sm rounded-2xl bg-card hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <Clock className="size-5" />
              </span>
              <div className="text-[10px] font-bold text-blue-700 bg-blue-100 uppercase tracking-wider px-2.5 py-1 rounded-full border border-blue-200">
                Target: <span className="font-black">&lt; 4D</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Average Cycle Time</p>
              <p className="text-3xl font-bold tracking-tight text-foreground mt-1">3.4<span className="text-lg text-muted-foreground font-semibold ml-1">Days</span></p>
            </div>
          </Card>
        </motion.div>

        {/* Card 4: Overall Resource Allocation */}
        <motion.div variants={staggerItem}>
          <Card className="p-5 flex flex-col justify-between border-border shadow-sm rounded-2xl bg-card hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="flex size-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <Users className="size-5" />
              </span>
              <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Optimized
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Overall Resource Allocation</p>
              <p className="text-3xl font-bold tracking-tight text-foreground mt-1">78%</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* CREATIVE CORE VISUAL ANALYTICS PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Task Delivery Burndown */}
        <Card className="p-6 border-border shadow-sm rounded-2xl bg-card flex flex-col">
          <div className="mb-6">
            <h3 className="font-semibold text-lg text-foreground">Task Delivery Burndown</h3>
            <p className="text-sm text-muted-foreground">Daily completion rate against sprint capacity</p>
          </div>
          <div className="flex-1 relative min-h-[200px] w-full mt-auto">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="burndownGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="hsl(var(--border))" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="hsl(var(--border))" strokeDasharray="4 4" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="hsl(var(--border))" strokeDasharray="4 4" strokeWidth="1" />
              
              {/* Ideal Burndown Line (gray dashed) */}
              <line x1="0" y1="20" x2="500" y2="180" stroke="hsl(var(--muted-foreground))" strokeDasharray="6 6" strokeWidth="2" opacity="0.4" />
              
              {/* Actual Burndown Area & Line */}
              <path d="M0,20 Q100,25 150,70 T350,140 L500,160 L500,200 L0,200 Z" fill="url(#burndownGradient)" />
              <path d="M0,20 Q100,25 150,70 T350,140 L500,160" fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            
            {/* X-Axis Labels */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs font-medium text-muted-foreground px-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>
        </Card>

        {/* Chart 2: Role-Based Contribution Matrix */}
        <Card className="p-6 border-border shadow-sm rounded-2xl bg-card flex flex-col justify-center space-y-8">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Role-Based Contribution Matrix</h3>
            <p className="text-sm text-muted-foreground">Task completion breakdown across corporate roles</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex h-12 w-full rounded-full overflow-hidden bg-muted/30 shadow-inner">
              {/* Leads */}
              <div className="bg-purple-500 h-full flex items-center justify-center transition-all duration-1000 ease-out" style={{ width: "20%" }}>
                <span className="text-white text-xs font-bold drop-shadow-sm">20%</span>
              </div>
              {/* Developers */}
              <div className="bg-blue-500 h-full flex items-center justify-center transition-all duration-1000 ease-out" style={{ width: "55%" }}>
                <span className="text-white text-xs font-bold drop-shadow-sm">55%</span>
              </div>
              {/* Testers */}
              <div className="bg-emerald-500 h-full flex items-center justify-center transition-all duration-1000 ease-out" style={{ width: "25%" }}>
                <span className="text-white text-xs font-bold drop-shadow-sm">25%</span>
              </div>
            </div>

            <div className="flex justify-center gap-8 pt-2">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-muted-foreground">Testers</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* RECENT SYSTEM EXPORTS LOG */}
      <Card className="border-border shadow-sm rounded-2xl bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h3 className="font-semibold text-lg text-foreground">Recent Executive Exports</h3>
          <p className="text-sm text-muted-foreground">Automated compliance & reporting logs</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
              <tr>
                <th className="px-6 py-4 font-semibold">Report Name</th>
                <th className="px-6 py-4 font-semibold">Date Generated</th>
                <th className="px-6 py-4 font-semibold">Format</th>
                <th className="px-6 py-4 font-semibold">Authorized User</th>
                <th className="px-6 py-4 font-semibold text-right">Export Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {EXPORTS_LOG.map((log) => (
                <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{log.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{log.date}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-secondary text-secondary-foreground border border-border">
                      {log.format === 'PDF' ? <FileText className="size-3 text-red-500" /> : <FileSpreadsheet className="size-3 text-emerald-500" />}
                      {log.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{log.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-xs">{log.user}</span>
                        <span className="text-[10px] text-muted-foreground">{log.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.status === "Success" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="size-4" /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// Simple icon for the modal header
function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
