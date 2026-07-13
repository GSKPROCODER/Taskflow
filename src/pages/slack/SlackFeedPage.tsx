import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Hash, MessageSquare } from "lucide-react";

const MOCK_MESSAGES = [
  {
    id: 1,
    sender: "Sarah Chen",
    time: "10:23 AM",
    avatar: "SC",
    text: "Deployment to production successful! All systems are nominal.",
  },
  {
    id: 2,
    sender: "Alex Mercer",
    time: "11:05 AM",
    avatar: "AM",
    text: "New bug ticket TF-104 synced to Jira. Can someone take a look?",
  },
  {
    id: 3,
    sender: "TaskFlow Bot",
    time: "11:42 AM",
    avatar: "TF",
    text: "Project milestone 'Q3 Planning' has been marked as completed by David.",
    isBot: true,
  },
  {
    id: 4,
    sender: "David Kumar",
    time: "1:15 PM",
    avatar: "DK",
    text: "Reviewing the PR for the new auth flow now, should be merged shortly.",
  },
];

export function SlackFeedPage() {
  return (
    <div className="flex h-full flex-col space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Slack Workspace
          </h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
            </span>
            Connected Channel: <Hash className="size-3.5 inline" />
            project-updates
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-md">
          <MessageSquare className="mr-2 size-4" />
          Send Notification
        </Button>
      </div>

      {/* ACTIVITY STREAM */}
      <Card className="flex flex-1 flex-col overflow-hidden border-border bg-card shadow-sm">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {MOCK_MESSAGES.map((msg) => (
            <div key={msg.id} className="flex gap-4 group">
              <Avatar
                className={`size-10 shrink-0 ${msg.isBot ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                <AvatarFallback
                  className={msg.isBot ? "bg-primary/10 font-bold" : ""}
                >
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-foreground">
                    {msg.sender}
                  </span>
                  {msg.isBot && (
                    <span className="text-[10px] uppercase font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                      Bot
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK INPUT BAR */}
        <div className="border-t border-border bg-muted/20 p-4">
          <div className="relative flex items-center">
            <Input
              placeholder="Type a quick message to #project-updates..."
              className="pr-12 bg-background border-muted"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
