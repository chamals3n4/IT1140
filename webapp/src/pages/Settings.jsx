import { Bell, Mail, MessageSquare, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const notifications = [
  {
    title: "Email notifications",
    description: "Receive emails about your account activity.",
    icon: Mail,
  },
  {
    title: "Push notifications",
    description: "Receive push notifications about your account activity.",
    icon: Bell,
  },
  {
    title: "SMS notifications",
    description: "Receive SMS about your account activity.",
    icon: MessageSquare,
  },
];

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl space-y-8 p-8">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl" />
          <div className="relative flex flex-col items-center justify-center space-y-4 p-8 text-center">
            <Avatar className="h-29 w-28  shadow-xl">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>
                <User className="h-14 w-14" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-md font-serif">Chamal Senarathna</h1>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                Update your personal information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    className="h-10 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="h-10 text-base"
                  />
                </div>
              </div>
              <Button size="lg" className="w-full text-base">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Notifications</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose how you want to be notified
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div
                    key={notification.title}
                    className="flex items-start space-x-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <notification.icon className="mt-1 h-5 w-5 text-primary" />
                    <div className="flex-1 space-y-1">
                      <Label className="text-base font-medium">
                        {notification.title}
                      </Label>
                    </div>
                    <Switch className="mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
