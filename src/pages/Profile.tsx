import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  ChevronRight, 
  Shield, 
  Bell, 
  CreditCard, 
  FileText, 
  Settings, 
  HelpCircle, 
  LogOut,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Download,
  Lock,
  Smartphone,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

const customerInfo = {
  name: "Jayden Green",
  email: "jayden@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Toronto, ON M5V 3A8",
  memberSince: "March 2019",
  customerTier: "Premium",
  lastLogin: "Today at 2:34 PM"
};

const securitySettings = [
  { id: "two-factor", label: "Two-Factor Authentication", description: "Extra security for your account", enabled: true, recommended: true },
  { id: "biometric", label: "Biometric Login", description: "Use fingerprint or face ID", enabled: true, recommended: true },
  { id: "login-alerts", label: "Login Notifications", description: "Get notified of new sign-ins", enabled: true, recommended: true },
  { id: "transaction-alerts", label: "Transaction Alerts", description: "Instant notifications for transactions", enabled: true, recommended: false },
];

const notificationSettings = [
  { id: "account-alerts", label: "Account Alerts", description: "Balance and account updates", enabled: true },
  { id: "payment-reminders", label: "Payment Reminders", description: "Bill due date notifications", enabled: true },
  { id: "security-alerts", label: "Security Alerts", description: "Suspicious activity warnings", enabled: true },
  { id: "promotional", label: "Promotional Offers", description: "Special offers and rewards", enabled: false },
  { id: "market-updates", label: "Market Updates", description: "Investment and market news", enabled: false },
];

export default function Profile() {
  const [securityToggles, setSecurityToggles] = useState(
    securitySettings.reduce((acc, setting) => ({ ...acc, [setting.id]: setting.enabled }), {})
  );
  
  const [notificationToggles, setNotificationToggles] = useState(
    notificationSettings.reduce((acc, setting) => ({ ...acc, [setting.id]: setting.enabled }), {})
  );

  const handleSecurityToggle = (id: string) => {
    setSecurityToggles(prev => ({ ...prev, [id]: !prev[id] }));
    toast({ title: "Security Setting Updated", description: "Your security preferences have been saved." });
  };

  const handleNotificationToggle = (id: string) => {
    setNotificationToggles(prev => ({ ...prev, [id]: !prev[id] }));
    toast({ title: "Notification Setting Updated", description: "Your notification preferences have been saved." });
  };

  return (
    <MobileShell>
      <Seo title="Profile — GreenBank" description="Manage your preferences and settings." canonical={window.location.href} />
      
      {/* Header */}
      <section className="relative px-4 pt-6 pb-4 bg-gradient-to-b from-emerald-700 to-emerald-900 text-primary-foreground animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Profile & Settings</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => toast({ title: "Settings", description: "Advanced settings coming soon" })}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white/20">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-lg font-semibold bg-emerald-600 text-white">JG</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-white">{customerInfo.name}</h2>
              <p className="text-sm text-emerald-100">{customerInfo.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/30">
                  <Star className="h-3 w-3 mr-1" />
                  {customerInfo.customerTier}
                </Badge>
                <span className="text-xs text-emerald-200">Member since {customerInfo.memberSince}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-4 space-y-4 -mt-2">
        {/* Personal Information */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone Number</p>
                  <p className="text-xs text-muted-foreground">{customerInfo.phone}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-xs text-muted-foreground">{customerInfo.email}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Mailing Address</p>
                  <p className="text-xs text-muted-foreground">{customerInfo.address}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securitySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    {setting.enabled ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                        {setting.label}
                      </Label>
                      {setting.recommended && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border-emerald-200">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                  </div>
                </div>
                <Switch
                  id={setting.id}
                  checked={securityToggles[setting.id]}
                  onCheckedChange={() => handleSecurityToggle(setting.id)}
                />
              </div>
            ))}
            
            <div className="pt-2 border-t">
              <Button variant="outline" className="w-full" onClick={() => toast({ title: "Change Password", description: "Password change form coming soon" })}>
                <Lock className="h-4 w-4 mr-2" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-emerald-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor={setting.id} className="text-sm font-medium cursor-pointer">
                    {setting.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-0.5">{setting.description}</p>
                </div>
                <Switch
                  id={setting.id}
                  checked={notificationToggles[setting.id]}
                  onCheckedChange={() => handleNotificationToggle(setting.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Services */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Account Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "Account Statements", icon: FileText, description: "Download monthly statements" },
              { label: "Tax Documents", icon: Download, description: "1099s and tax forms" },
              { label: "Card Management", icon: CreditCard, description: "Manage debit and credit cards" },
              { label: "Direct Deposit", icon: Smartphone, description: "Set up direct deposit" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => toast({ title: item.label, description: "Feature coming soon" })}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Support & Legal */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-emerald-600" />
              Support & Legal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { label: "Help Center", description: "FAQs and support articles" },
              { label: "Contact Support", description: "Chat, call, or email us" },
              { label: "Privacy Policy", description: "How we protect your data" },
              { label: "Terms of Service", description: "Account terms and conditions" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                onClick={() => toast({ title: item.label, description: "Opening support page..." })}
              >
                <div className="text-left">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">GreenBank Mobile</p>
              <p className="text-xs text-muted-foreground">Version 2.1.4 • Last login: {customerInfo.lastLogin}</p>
              <p className="text-xs text-muted-foreground">© 2025 GreenBank. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="destructive" 
          className="w-full"
          onClick={() => toast({ title: "Logged Out", description: "You have been securely logged out." })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </Button>
      </section>
    </MobileShell>
  );
}

