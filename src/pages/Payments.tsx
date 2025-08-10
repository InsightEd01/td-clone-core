import MobileShell from "@/components/MobileShell";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Send, 
  Repeat, 
  Receipt, 
  Camera, 
  Users, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Zap,
  Shield,
  TrendingUp
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const quickActions = [
  { 
    label: "Send Money", 
    icon: Send, 
    to: "/payments/send", 
    description: "To friends & family",
    color: "bg-blue-500"
  },
  { 
    label: "Transfer", 
    icon: Repeat, 
    to: "/payments/transfer", 
    description: "Between accounts",
    color: "bg-emerald-500"
  },
  { 
    label: "Pay Bills", 
    icon: Receipt, 
    to: "/payments/bills", 
    description: "Utilities & services",
    color: "bg-purple-500"
  },
  { 
    label: "Deposit", 
    icon: Camera, 
    to: "/payments/deposit", 
    description: "Mobile check deposit",
    color: "bg-orange-500"
  },
];

const recentPayments = [];

const scheduledPayments = [];

const paymentServices = [
  {
    title: "Digital Payments",
    items: [
      { label: "Apple Pay", icon: Smartphone, description: "Contactless payments", badge: "Active" },
      { label: "Google Pay", icon: Smartphone, description: "Mobile wallet", badge: "Setup" },
      { label: "PayPal", icon: Globe, description: "Online payments", badge: "Connected" },
      { label: "Zelle", icon: Zap, description: "Instant transfers", badge: "Active" },
    ]
  },
  {
    title: "International",
    items: [
      { label: "Wire Transfer", icon: Globe, description: "International transfers", badge: null },
      { label: "Foreign Exchange", icon: TrendingUp, description: "Currency exchange", badge: null },
      { label: "Travel Money", icon: CreditCard, description: "Travel cards & cash", badge: null },
    ]
  },
  {
    title: "Business Services",
    items: [
      { label: "Payroll Services", icon: Users, description: "Employee payments", badge: null },
      { label: "Merchant Services", icon: CreditCard, description: "Accept card payments", badge: null },
      { label: "Business Loans", icon: DollarSign, description: "Financing solutions", badge: null },
    ]
  }
];

export default function Payments() {
  return (
    <MobileShell>
      <Seo title="Payments — GreenBank" description="Send, transfer, pay bills, and deposit checks." canonical={window.location.href} />
      
      {/* Header */}
      <section className="relative px-4 pt-6 pb-4 bg-gradient-to-b from-emerald-700 to-emerald-900 text-primary-foreground animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold">Payments & Transfers</h1>
            <p className="text-sm text-emerald-100">Send, receive, and manage payments</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={() => toast({ title: "Payment History", description: "View all transactions" })}
          >
            <Clock className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map(({ label, icon: Icon, to, description, color }) => (
            <NavLink key={label} to={to} className="block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{label}</h3>
                    <p className="text-xs text-emerald-100 truncate">{description}</p>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>

      <section className="px-4 py-4 space-y-4 -mt-2">
        {/* Recent Payments */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No recent payments</p>
              <p className="text-xs mt-1">Your payment history will appear here</p>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Payments */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-600" />
                Scheduled Payments
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary">
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-center text-muted-foreground">
              <p className="text-sm">No scheduled payments</p>
              <p className="text-xs mt-1">Set up recurring payments for bills and transfers</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Services */}
        {paymentServices.map((section) => (
          <Card key={section.title} className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                    onClick={() => toast({ title: item.label, description: "Feature coming soon" })}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{item.label}</p>
                          {item.badge && (
                            <Badge 
                              variant={item.badge === 'Active' ? 'default' : 'outline'}
                              className="text-xs px-1.5 py-0.5"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Security Notice */}
        <Card className="border-0 shadow-md bg-emerald-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm text-emerald-800">Secure Payments</h3>
                <p className="text-xs text-emerald-700 mt-1">
                  All payments are protected with bank-level encryption and fraud monitoring. 
                  Your money and personal information are always secure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </MobileShell>
  );
}
