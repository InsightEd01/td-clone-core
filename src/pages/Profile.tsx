import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  return (
    <MobileShell>
      <Seo title="Profile — GreenBank" description="Manage your preferences and settings." canonical={window.location.href} />
      <section className="p-4 animate-fade-in">
        <header className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback>JG</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">Jayden Green</h1>
            <p className="text-sm text-muted-foreground">jayden.green@example.com</p>
          </div>
        </header>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-medium mb-3">Notifications</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-alerts">Email alerts</Label>
                  <Switch id="email-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push notifications</Label>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <Switch id="marketing" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-medium mb-3">Security</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="two-factor">Two-factor authentication</Label>
                  <Switch id="two-factor" />
                </div>
                <Button variant="outline" className="w-full mt-2">Change password</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="text-sm font-medium mb-3">About</h2>
              <div className="text-sm text-muted-foreground">
                <p>App version: 1.0.0</p>
                <a href="#" className="story-link mt-1 inline-block">Help Center</a>
              </div>
            </CardContent>
          </Card>

          <Button variant="destructive" className="w-full">Log out</Button>
        </div>
      </section>
    </MobileShell>
  );
}

