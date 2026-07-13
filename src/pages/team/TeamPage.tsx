import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  Activity,
  ShieldCheck,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/StatCard";
import { staggerContainer } from "@/lib/motion";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MOCK_ROSTER = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.c@taskflow.corp",
    dept: "Engineering",
    rank: "Dev-II",
    allocation: 85,
    initials: "SC",
  },
  {
    id: 2,
    name: "David Kumar",
    email: "david.k@taskflow.corp",
    dept: "Product",
    rank: "Team Lead",
    allocation: 100,
    initials: "DK",
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    email: "elena.r@taskflow.corp",
    dept: "Quality Assurance",
    rank: "QA-I",
    allocation: 30,
    initials: "ER",
  },
  {
    id: 4,
    name: "Michael Chang",
    email: "michael.c@taskflow.corp",
    dept: "Engineering",
    rank: "Dev-III",
    allocation: 95,
    initials: "MC",
  },
];

export function TeamPage() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Global Directory & Resource Allocation
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
              + Provision Corporate Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Provision Corporate Account</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Corporate Email</Label>
                <Input id="email" placeholder="name@taskflow.corp" />
              </div>
              <div className="grid gap-2">
                <Label>Department / Cost Center</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eng">Engineering</SelectItem>
                    <SelectItem value="product">Product Management</SelectItem>
                    <SelectItem value="qa">Quality Assurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Base System Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Team Lead</SelectItem>
                    <SelectItem value="dev">Developer</SelectItem>
                    <SelectItem value="tester">Tester</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Submit Provisioning Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Corporate KPI Summary Row */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          label="Total Headcount"
          value="142"
          icon={Users}
          tone="bg-blue-100 text-blue-600"
        />
        <StatCard
          label="Active Allocations"
          value="118"
          icon={Briefcase}
          tone="bg-purple-100 text-purple-600"
        />
        <StatCard
          label="Bench Strength %"
          value="17%"
          icon={Activity}
          tone="bg-orange-100 text-orange-600"
        />
        <StatCard
          label="Security Clearance Logs"
          value="99.9%"
          icon={ShieldCheck}
          tone="bg-emerald-100 text-emerald-600"
        />
      </motion.div>

      {/* Advanced Filtering Bar */}
      <div className="flex gap-4 items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or department..."
            className="pl-9 bg-background"
          />
        </div>
        <div className="w-[250px]">
          <Select defaultValue="all">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Department Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="eng">Engineering</SelectItem>
              <SelectItem value="product">Product Management</SelectItem>
              <SelectItem value="qa">Quality Assurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Roster Grid Component */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {MOCK_ROSTER.map((member) => (
          <Card
            key={member.id}
            className="p-5 flex flex-col gap-4 border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                    Revoke Access
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="size-12 border-2 border-background shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-background bg-emerald-500"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground truncate">
                  {member.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {member.email}
                </span>
              </div>
            </div>

            <div>
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                {member.dept} / {member.rank}
              </span>
            </div>

            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">
                  Resource Utilization
                </span>
                <span
                  className={
                    member.allocation >= 80 ? "text-primary" : "text-amber-500"
                  }
                >
                  {member.allocation >= 80
                    ? `${member.allocation}% Allocated`
                    : `${100 - member.allocation}% Bench`}
                </span>
              </div>
              <Progress value={member.allocation} className="h-2" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
