import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { NameAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";

export function SettingsPage() {
  const { user } = useAuth();
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile and preferences."
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <NameAvatar
              name={user?.name ?? "U"}
              className="size-14 text-base"
            />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm capitalize text-muted-foreground">
                {user?.role?.replace("_", " ")}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={user?.name} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Two-factor authentication</p>
            <p className="text-sm text-muted-foreground">
              Add a secondary method of verification used during login.
            </p>
          </div>
          <Button 
            variant={is2FAEnabled ? "default" : "outline"}
            className={is2FAEnabled ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}
            onClick={() => setIs2FAEnabled(!is2FAEnabled)}
          >
            {is2FAEnabled ? "Enabled ✓" : "Enable"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
